import React, { useEffect, useState, useCallback } from "react";
import { BackHandler, Dimensions, View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Generate from './generate';
import { API_URL } from '@env';
import getAccessTokenFromHeader from '../hooks/getAccessTokenFromHeader';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



function StarList({ navigation }) {
    const [stars, setStars] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal의 표시 상태를 관리하는 상태 변수를 추가합니다.
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingStar, setEditingStar] = useState(null);
    const [accessToken, setAccessToken] = useState('');

    
    const navigateToChat = (star_id) => {
        navigation.navigate('Chat', { star_id });
    };
    const navigateToMypage = () => {
        navigation.navigate('setting'); // 'Mypage'는 설정 페이지로 이동하는 라우트 이름입니다.
    };

    useFocusEffect(
        useCallback(() => {
            const fetchAccessTokenAndStars = async () => {
                const accessToken = await getAccessTokenFromHeader();
                if (accessToken) {
                    fetchStars(accessToken);
                    setAccessToken(accessToken)
                } else {
                    navigation.navigate('Main');
                }
            };
            fetchAccessTokenAndStars();
        }, [])
    );
    
    useEffect(() => {
       // 뒤로 가기 버튼을 눌렀을 때 호출될 함수 정의
       const backAction = () => {
        Alert.alert("앱 종료", "앱을 종료하시겠습니까?", [
            {
                text: "취소",
                onPress: () => null,
                style: "cancel"
            },
            { text: "확인", onPress: () => BackHandler.exitApp() }
        ]);
        return true; // 이벤트를 여기서 처리했음을 나타냅니다.
    };
    
    // 이벤트 리스너 등록
    BackHandler.addEventListener('hardwareBackPress', backAction);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
}, []);

    const fetchStars = async (accessToken) => {
        try {
            const response = await fetch(`${API_URL}/stars`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            
            const starsWithAdditionalData = await Promise.all(json.stars.map(async (star) => {
                const lastMessage = await fetchLastMessage(star.star_id, accessToken);
                const localUri = `${FileSystem.cacheDirectory}${star.star_id}.jpg`;
                const fileInfo = await FileSystem.getInfoAsync(localUri);
                if (!star.image) {
                    star.image = 'https://voice-of-the-star.s3.ap-northeast-2.amazonaws.com/casey-horner-RmoWqDCqN2E-unsplash.jpg'
                } else {
                    if(!fileInfo.exists) {
                        await FileSystem.downloadAsync(star.image, localUri);
                    }
                }
                return { ...star, lastMessage, localImage: localUri };
            }));
    
            setStars(starsWithAdditionalData);
    
        } catch (error) {
            console.error(`Error fetching stars: ${error.message}`);
        }
    };
    
    function EditStarModal({ visible, star, onClose, onSave }) {
        // 초기 상태를 star 객체의 속성으로 설정합니다.
        const [name, setName] = useState(star ? star.star_name : '');
        const [image, setImage] = useState(star && star.image ? star.image : '');
        
        if (!star) {
            return null;
        }
        
        const handleSave = () => {
            onSave({ ...star, star_name: name, image: image });
            onClose();
        };

        // 모달 닫을 때 이미지 상태 초기화
        const handleClose = () => {
            setImage(star ? star.image : '');
            onClose();
        };

        const selectImage = async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          
            if (permissionResult.granted === false) {
              alert("사진 앨범에 대한 접근 권한이 필요합니다.");
              return;
            }
          
            const pickerResult = await ImagePicker.launchImageLibraryAsync();
            if (pickerResult.canceled) {
              return;
            }
          
            if (pickerResult.assets && pickerResult.assets.length > 0) {
                const selectedImage = pickerResult.assets[0];
                setImage(selectedImage.uri); // 새 이미지 상태를 업데이트
            }
        };
        
        return (
            <Modal
                visible={visible}
                onRequestClose={handleClose}
                transparent={true}
                style={styles.modal}
            >
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>별 정보 수정</Text>
                        <View style={styles.editImg}>
                            {image ? (
                                <Image key={image} source={{ uri: image }} style={styles.starImage} />
                            ) : (
                                <Image source={{ uri: star.image }} style={styles.starImage} />
                            )}
                            <TouchableOpacity onPress={selectImage} style={styles.selectImage}>
                                <Text style={styles.selectText}>파일 업로드</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.name}>이름</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="이름"
                            value={name}
                            onChangeText={setName}
                            />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>저장</Text>
                        </TouchableOpacity>
                        <Text style={styles.delete} onPress={() => deleteStar(star.star_id, accessToken)}>삭제하기</Text>
                    </View>
                </View>
            </Modal>
        );
        
    };

    const savemodule = (updatedStar) => {
        handleSaveStar(updatedStar, accessToken);
        uploadImageAndUpdateStar(updatedStar, accessToken);
    }
    
    const handleSaveStar = async (updatedStar, accessToken) => {
        try {
            const response = await fetch(`${API_URL}/stars/${updatedStar.star_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    star_name: updatedStar.star_name,
                })
            });
    
            if (!response.ok) {
                throw new Error('업데이트 실패');
            }
    
            // 서버로부터 응답받은 업데이트된 데이터를 저장합니다.
            const updatedStarData = await response.json();
            
            // 로컬 상태 업데이트
            setStars(stars.map(star => star.star_id === updatedStar.star_id ? updatedStarData : star));
        } catch (error) {
            console.error('별 정보 업데이트 오류:', error);
        }
    };

    const uploadImageAndUpdateStar = async (updatedStar, accessToken) => {
        try {
            // URL에서 이미지를 다운로드합니다.
            const imageResponse = await fetch(updatedStar.image);
            const blob = await imageResponse.blob();
    
            // Blob을 Base64 문자열로 변환합니다.
            const reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // Base64 인코딩 부분만 추출
    
                // 로컬 파일 시스템에 이미지를 저장합니다.
                const localUri = FileSystem.documentDirectory + updatedStar.star_id + '.jpg';
                await FileSystem.writeAsStringAsync(localUri, base64data, { encoding: FileSystem.EncodingType.Base64 });
    
                // FormData 객체 생성 및 파일 추가
                const formData = new FormData();
                formData.append('file', {
                    uri: localUri,
                    type: 'image/jpeg', // 이미지 타입에 맞게 설정
                    name: updatedStar.star_id + '.jpg'
                });
    
                // 이미지 업로드 API 요청
                const response = await fetch(`${API_URL}/stars/${updatedStar.star_id}/uploadImage`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error('이미지 업로드 실패');
                }
    
                // 업로드된 이미지를 포함한 별의 정보를 가져옴
                const updatedStarData = await response.json();
    
                // 로컬 상태 업데이트
                setStars(stars.map(star => star.star_id === updatedStar.star_id ? updatedStarData : star));
            };
        } catch (error) {
            console.error('이미지 업로드 및 별 정보 업데이트 오류:', error);
        }
    };

    const deleteStar = (starId, accessToken) => {
        Alert.alert(
            "별 삭제", 
            "이 별을 정말 삭제하시겠습니까?", 
            [{
                text: "취소",
                onPress: () => console.log("삭제 취소됨"),
                style: "cancel"
            },
            {
                text: "삭제",
                onPress: () => {
                    performDelete(starId, accessToken);
                }
            }],
            { cancelable: false }
        );
    };

    const performDelete = async (starId, accessToken) => {
        try {
            const response = await fetch(`${API_URL}/stars/${starId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
    
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
    
            // 별 삭제 후 리스트 업데이트
            setStars(stars.filter(star => star.star_id !== starId));

            // 모달 닫기
            setEditModalVisible(false);
        } catch (error) {
            console.error(`Error deleting star ${starId}: ${error.message}`);
            Alert.alert("삭제 실패", "별을 삭제하는 데 문제가 발생했습니다.");
        }
    }

    const fetchLastMessage = async (starId, accessToken) => {
        try {
            const response = await fetch(`${API_URL}/stars/${starId}/last`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const lastMessageData = await response.json();
            if (lastMessageData && lastMessageData.content) {
                return lastMessageData.content;
            } else {
                return "메시지가 없습니다."; // 서버 응답에 content가 없는 경우
            }
        } catch (error) {
            console.error(`Error fetching last message for star ${starId}: ${error.message}`);
            return "메시지를 가져올 수 없습니다.";
        }
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        fetchStars(accessToken);
    };

    const renderStars = () => {
        if (stars.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <TouchableOpacity style={styles.addButtonContainerEmpty} onPress={handleOpenModal}>
                        <Image source={require('../assets/img/plus.png')} style={styles.plusImage} />
                        <Text style={styles.addText}>채팅을 추가하세요</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.starsListContainer}>
                    <EditStarModal
                        key={editingStar ? editingStar.star_id : 'new-star'}
                        visible={editModalVisible}
                        star={editingStar}
                        onClose={() => {
                            setEditModalVisible(false);
                            fetchStars(accessToken);
                        }}
                        onSave={savemodule}
                    />
                    {stars.map((star, index) => (
                        <TouchableOpacity 
                            key={star.star_id || index} 
                            onPress={() => navigateToChat(star.star_id)}
                            onLongPress={() => {
                                setEditingStar(star);
                                setEditModalVisible(true);
                            }}
                            style={styles.starItem}
                        >
                            <Image source={{ uri: star.image }} style={styles.starImage} />
                            <View style={styles.starInfoContainer}>
                                <Text style={styles.starName}>{star.star_name}</Text>
                                <Text style={styles.starMessage}>{star.lastMessage}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
                        <Text style={styles.addButtonText}>채팅을 추가하세요</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    return (
        <>
            <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper}>
            
                <StatusBar style='light' />
                <View style={styles.logo}>
                    <Image source={require('../assets/img/title.png')} style={styles.topImage} />
                </View>
                {renderStars()}
                <TouchableOpacity style={styles.settingsButton} onPress={navigateToMypage}>
                    <Image source={require('../assets/img/cog.png')} style={styles.settingsImage} />
                </TouchableOpacity>
            </ImageBackground>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
                
            >
                <View style={styles.centeredModalView}>
                    {modalVisible && <Generate closeModal={handleCloseModal} />}
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
   
      topImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
    },
    plusImage: {
        width: 40,
        height: 40,
    },
    addText: {
        color: 'white',
        marginTop: 15,
        fontSize: 16,
    },
    settingsImage: {
        width: 30,
        height: 30,
    },
    centeredModalView: {
        flex: 1,
        backgroundColor:'#2A2826',
    },
    generateContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusIcon: {
        width: 24,
        height: 24,
    },
    addButtonText: {
        fontSize: 16,
        color: 'white',
        marginTop: 8,
    },
    wrapper: {
        flex: 1,
    },
    logo: {
        marginTop: 50,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonContainerEmpty: {
        flex: 1,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60 + 20,
    },
    starsListContainer: {
        width: '100%',
        paddingTop: 20,
    },
    starItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    starImage: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 10,
    },
    starInfoContainer: {
        flex: 1,
    },
    starName: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    starMessage: {
        fontSize: 16,
        color: '#9C9C9C',
    },
    addButton: {
        padding: 20,
        alignItems: 'center',
    },
    settingsButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#2A2826',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        textAlign: 'center',
        color: 'white', 
    },
    input: {
        borderWidth: 1, 
        borderColor: '#ddd',
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 10, 
        fontSize: 16,
        color: '#DBDBDB',
    },
    saveButton: {
        backgroundColor: 'rgba(61,159,136,0.5)', 
        padding: 10, 
        borderRadius: 5, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
    editImg: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },
    selectImage: {
        width: 70,
        height: 30,
        backgroundColor: 'rgba(61,159,136,0.5)', // 배경 색상 적용
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 15,
        marginTop: 5,
    },
    nowstarImage: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    selectText: {
        color: 'white', // 텍스트 색상
    },
    name: {
        color: 'white', // 텍스트 색상
        marginBottom: 5,
    },
    delete: {
        color: 'white',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: -10,
    },
});

export default StarList;