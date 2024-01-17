import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView, Alert,BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

function Login({ navigation }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const clearToken = async () => {
            await AsyncStorage.removeItem('accessToken');
        };

        clearToken();

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
        flex: 1,

        alignItems: 'center',
    },
    centerImage: {
        width: '80%',
        height: '30%',
        resizeMode: 'contain',
        marginTop: 20,
    },
    formContainer: {
        flex: 2,
        width: '80%',
        alignSelf: 'center',
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
        color : 'white'
    },
    input: {
       height: 40,
       backgroundColor:'#d9d9d97a',
       marginBottom: 10,
       padding: 10,
       borderRadius: 7,
       color : 'white',
     },
     addButtonContainer: {
       height: 50,
       backgroundColor: '#007AF7', 
       justifyContent: 'center', 
       alignItems: 'center', 
       marginVertical:5,
       borderRadius: 15,

    },
    addLogin: {
       fontSize: 16,
       color: '#FFFFFF', 
       fontWeight: 'bold', 
    },
    addMember: {
        fontSize: 16, 
        color: '#FFFFFF',
        fontWeight: 'bold', 
     },
     addButtonContainerPW: {
        justifyContent: 'flex-end', 
        alignItems: 'right', 
        marginTop: 20, 
        marginBottom: 5,
        
     },
     addText: {
        justifyContent: 'flex-end',
        color : 'white'
     },
     kakaoButtonContainer: {
        height: 50,
        backgroundColor: '#FEE500',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 20,
    },
    kakaoButtonText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    
});

export default Login;