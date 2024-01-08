import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Generate from './generate';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StarList({ navigation }) {
    const [stars, setStars] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const userId = await getLoggedInUserId();
                console.log(userId);
                if (userId) {
                    setLoggedInUserId(userId);
                    
                    // 사용자의 아이디를 이용하여 서버에서 해당 사용자와 관련된 데이터를 가져옵니다.
                    let response = await fetch(`http://192.168.0.96:8000/users/stars?userId=${userId}`);
                    let json = await response.json();
                    setStars(json.stars);
                }
            } catch (error) {
                console.error('Error fetching stars:', error);
            }
        };

        fetchStars();
    }, []);

    const getLoggedInUserId = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            console.log("Fetched user ID: ", userId); // 디버그 출력
            return userId;
        } catch (error) {
            console.error('Error fetching user id', error);
            return null;
        }
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    
    const navigateToSettings = () =>{
        navigation.navigate('setting');
    };

    return (
        <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper}>
            <StatusBar style='light' />
            <View style={styles.logo}>
                <Image source={require('../assets/img/title.png')} style={styles.topImage}/>
            </View>
            <View style={styles.textContainer}>
                <Text style={{ color: 'white' }}>로그인한 사용자: {loggedInUserId}</Text>
            </View>
            <TouchableOpacity style={styles.addButtonContainer} onPress={handleOpenModal}>
                <Text style={styles.plus}>+</Text>
                <Text style={styles.addText}>채팅을 추가하세요</Text>
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
            <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
                <Image source={require('../assets/img/cog.png')} style={styles.settingsImage}/>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        marginTop: 30,
    },
    topImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
    },
    addButtonContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: 'center',
        justifyContent: 'center',
    },
    plus: {
        fontSize: 72, // '+' 크기 조정
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: {
        color: 'white',
        marginTop: 20,
        fontSize: 16,
    },
    settingsButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    settingsImage: { // 설정 버튼 이미지를 위한 새로운 스타일
        width: 30, // 적절한 크기로 조정
        height: 30, // 적절한 크기로 조정
    },
    textContainer: {
        position: 'absolute', // 내부 텍스트를 위한 절대 위치
        top: '30%', // 상단으로부터의 위치를 조정
        alignItems: 'center',
        justifyContent: 'center',
    },

    listBack: {
        width: '50%', // 화면 너비의 90%를 차지하도록 설정
        height: '50%', // 화면 높이의 50%를 차지하도록 설정
        resizeMode: 'contain', // 이미지 비율을 유지하면서 적절히 맞도록 설정
        alignSelf: 'center', // 컴포넌트를 가로축에서 중앙에 배치
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
    settingsButton: {
        position: 'absolute',
        right: 10,
        bottom: 10, // Adjust the position as needed
    },
    settingsImage: {
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
    },
});

export default StarList;