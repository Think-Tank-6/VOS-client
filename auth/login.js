import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

function Login({ navigation }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const onLoginPress = async () => {
        const loginData = {
            user_id: userId,
            password: password,
        };

        try {
            let response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            let jsonResponse = await response.json();

            if (response.ok && jsonResponse.access_token) {
                await AsyncStorage.setItem('accessToken', jsonResponse.access_token);
                navigation.navigate('StarList');
            } else {
                if (response.status === 403) {
                    Alert.alert("로그인 실패", jsonResponse.detail || "탈퇴한 회원입니다");
                } else {
                    // 그 외의 오류 메시지를 Alert.alert를 사용하여 표시
                    Alert.alert("로그인 실패", jsonResponse.detail || '로그인에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const onMemberPress = () => {
        navigation.navigate('Join');
    };

    const onAddPress = () => {
        navigation.navigate('PasswordRecovery'); // 수정 필요: 비밀번호 찾기 화면으로의 경로
    };

    const onKakaoLoginPress = () => {
        navigation.navigate('KakaoLogin');
    };

    return (
        <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topImageContainer}>
                    <Image source={require('../assets/img/title.png')} style={styles.centerImage}/>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>이메일</Text>
                    <TextInput
                        style={styles.input}
                        value={userId}
                        onChangeText={setUserId}
                    />
                    <Text style={styles.label}>비밀번호</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true} // 비밀번호를 숨김
                    />
                    <TouchableOpacity style={styles.addButtonContainerPW} onPress={onAddPress}>
                        <Text style={styles.addText}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButtonContainer} onPress={onLoginPress}>
                        <Text style={styles.addLogin}>로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButtonContainer} onPress={onMemberPress}>
                        <Text style={styles.addMember}>회원가입</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.kakaoButtonContainer} onPress={onKakaoLoginPress}>
                        <Text style={styles.kakaoButtonText}>카카오 로그인</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    topImageContainer: {
        flex: 1, // 부모 View를 flex container로 만듭니다.

        alignItems: 'center', // 자식 요소를 가로 축의 가운데로 정렬합니다.
    },
    centerImage: {
        width: '80%', // 이미지의 가로 크기를 조정합니다.
        height: '30%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
        resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
        marginTop: 20,
    },
    formContainer: { // 중앙 정렬을 위한 새로운 스타일
        flex: 2, // flex 값을 조정하여 화면에 맞게 크기를 조절할 수 있습니다.
        width: '80%', // 이 부분은 부모 뷰의 가로 크기의 80%를 차지하게 합니다.
        alignSelf: 'center', // 부모 뷰의 중앙에 위치하게 합니다.
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        color : 'white'
    },
    input: {
       height: 40,
       borderColor: 'white',
       borderWidth: 1,
       marginBottom: 10,
       padding: 10,
       borderRadius: 5,
       color : 'white',
     },
     addButtonContainer: {
       height: 50, // 버튼의 높이
       backgroundColor: '#007AFF', // 버튼의 배경색
       justifyContent: 'center', // 버튼 내부 텍스트를 세로 방향으로 중앙에 위치
       alignItems: 'center', // 버튼 내부 텍스트를 가로 방향으로 중앙에 위치
       borderRadius: 25, // 버튼의 모서리를 둥글게
       marginTop: 10, // 위에서부터의 마진
       marginBottom: 20, // 아래에서부터의 마진
    },
    addLogin: {
       fontSize: 16, // 텍스트 크기 조정
       color: '#FFFFFF', // 텍스트 색상을 흰색으로
       fontWeight: 'bold', // 글씨를 굵게
    },
    addMember: {
        fontSize: 16, // 텍스트 크기 조정
        color: '#FFFFFF', // 텍스트 색상을 흰색으로
        fontWeight: 'bold', // 글씨를 굵게
     },
     addButtonContainerPW: {
        justifyContent: 'flex-end', // 버튼 내부 텍스트를 세로 방향으로 중앙에 위치
        alignItems: 'right', // 버튼 내부 텍스트를 가로 방향으로 중앙에 위치
        marginTop: 20, // 위에서부터의 마진
        marginBottom: 5, // 아래에서부터의 마진
        
     },
     addText: {
        justifyContent: 'flex-end',
        color : 'white'
     },
     kakaoButtonContainer: {
        height: 50, // Button height
        backgroundColor: '#FEE500', // Kakao yellow color
        justifyContent: 'center', // Vertically center the content
        alignItems: 'center', // Horizontally center the content
        borderRadius: 25, // Rounded corners
        marginTop: 10, // Margin from the top
        marginBottom: 20, // Margin from the bottom
    },
    kakaoButtonText: {
        fontSize: 16, // Text size
        color: '#000000', // Text color (black)
        fontWeight: 'bold', // Bold text
    },
    
});

export default Login;