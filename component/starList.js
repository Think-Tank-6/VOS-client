import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Generate from './generate';

function StarList({ navigation }) {
    const [stars, setStars] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal의 표시 상태를 관리하는 상태 변수를 추가합니다.
    
    // Access Token (인증이 필요한 경우 사용)
    // 실제 앱에서는 로그인 후 받은 token을 사용해야 합니다.
    
    const navigateToChat = (roomId) => {
        navigation.navigate('Chat', { roomId });
    };

    useEffect(() => {
        const accessToken = getAccessTokenFromHeader();
        fetchStars(accessToken);
    }, [])

    const fetchStars = async () => {
        try {
            const response = await fetch(`${API_URL}/stars`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // 토큰을 헤더에 추가
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            const starsWithMessages = await Promise.all(json.stars.map(async (star) => {
                const lastMessage = await fetchLastMessage(star.id);
                return { ...star, lastMessage };
            }));
            setStars(starsWithMessages);
        } catch (error) {
            console.error(`Error fetching stars: ${error.message}`);
        }
    };

    const fetchLastMessage = async (starId) => {
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
    
            const json = await response.json();
            return json.message || "메시지가 없습니다.";
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
        // 별이 없을 때 '채팅을 추가하세요'를 중앙에 표시
        if (stars.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <TouchableOpacity style={styles.addButtonContainerEmpty} onPress={handleOpenModal}>
                        <Image source={require('../assets/plus.png')} style={styles.plusImage} />
                        <Text style={styles.addText}>채팅을 추가하세요</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            // 별이 있을 때 별 목록과 '채팅을 추가하세요' 버튼을 위로 정렬
            return (
                <View style={styles.starsListContainer}>
                    {stars.map((star) => (
                        <TouchableOpacity key={star.id}  onPress={() => navigateToChat(star.id)} style={styles.starItem}>
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
      <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper}>
        <StatusBar style='light' />
        <View style={styles.logo}>
            <Image source={require('../assets/img/title.png')} style={styles.topImage}/>
        </View>
        {renderStars()}
        <TouchableOpacity style={styles.settingsButton}>
            <Image source={require('../assets/img/cog.png')} style={styles.settingsImage}/>
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
        width: 40, // 이미지 너비
        height: 40, // 이미지 높이
        // 추가적인 스타일링이 필요한 경우 여기에 추가
    },
    addText: {
        color: 'white',
        marginTop: 15,
        fontSize: 16,
    },
    settingsImage: { // 설정 버튼 이미지를 위한 새로운 스타일
        width: 30, // 적절한 크기로 조정
        height: 30, // 적절한 크기로 조정
    },
    centeredModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    // `Generate` 컴포넌트의 스타일을 여기에 추가할 수 있습니다.
    generateContainer: {
        width: '80%', // 모달의 너비
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
        marginTop: 50, // 로고의 상단 여백을 조정
        marginBottom: 20, // 로고 아래에 컨텐츠가 배치되도록 여백을 추가
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 별이 없을 때 '채팅을 추가하세요' 버튼 스타일
    addButtonContainerEmpty: {
        flex: 1,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center', // 세로 방향으로 중앙에 오도록 설정
        alignItems: 'center', // 가로 방향으로 중앙에 오도록 설정
        paddingTop: 60 + 20, // 로고의 높이 + 로고 아래의 여백
    },
    // 별 목록과 '채팅을 추가하세요' 버튼을 포함하는 컨테이너 스타일
    starsListContainer: {
        width: '100%', // 전체 너비를 사용합니다.
        paddingTop: 20, // 로고 아래에 공간을 추가합니다.
    },
    // 각 별 목록 아이템 스타일
    starItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    // 별 이미지 스타일
    starImage: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 10,
    },
    // 별 정보를 담는 컨테이너 스타일
    starInfoContainer: {
        flex: 1, // 남은 공간을 모두 사용합니다.
    },
    // 별 이름 스타일
    starName: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    // 별 마지막 메시지 스타일
    starMessage: {
        fontSize: 16,
        color: '#9C9C9C',
    },
    // '채팅을 추가하세요' 버튼 스타일
    addButton: {
        padding: 20,
        alignItems: 'center',
    },
    // 설정 버튼 스타일
    settingsButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default StarList;