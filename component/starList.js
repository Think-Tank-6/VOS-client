import React, { useEffect, useState, useCallback } from "react";
import { BackHandler, View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Generate from './generate';
import { API_URL } from '@env';
import getAccessTokenFromHeader from '../hooks/getAccessTokenFromHeader';
import * as FileSystem from 'expo-file-system';

function StarList({ navigation }) {
    const [stars, setStars] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal의 표시 상태를 관리하는 상태 변수를 추가합니다.

    // Access Token (인증이 필요한 경우 사용)
    // 실제 앱에서는 로그인 후 받은 token을 사용해야 합니다.

    const navigateToChat = (star_id) => {
        navigation.navigate('Chat', { star_id });
    };
    const navigateToMypage = () => {
        navigation.navigate('setting'); // 'Mypage'는 설정 페이지로 이동하는 라우트 이름입니다.
    };

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

    const fetchLastMessage = async (starId, accessToken) => {
        console.log(starId)
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
                    {stars.map((star, index) => (
                        <TouchableOpacity key={star.star_id || index} onPress={() => navigateToChat(star.star_id)} style={styles.starItem}>
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

    useFocusEffect(
        useCallback(() => {
            const fetchAccessTokenAndStars = async () => {
                const accessToken = await getAccessTokenFromHeader();
                if (accessToken) {
                    fetchStars(accessToken);
                } else {
                    console.log('No access token found');
                    navigation.navigate('Main');
                }
            };
            fetchAccessTokenAndStars();
        }, [])
    );

    return (
        <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper}>
            <StatusBar style='light' />
            <View style={styles.logo}>
                <Image source={require('../assets/img/title.png')} style={styles.topImage} />
            </View>
            {renderStars()}
            <TouchableOpacity style={styles.settingsButton} onPress={navigateToMypage}>
                <Image source={require('../assets/img/cog.png')} style={styles.settingsImage} />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.centeredModalView}>
                    <Generate closeModal={handleCloseModal} />
                </View>
            </Modal>
        </ImageBackground>
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
});

export default StarList;