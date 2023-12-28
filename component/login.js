import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableOpacity,SafeAreaView } from 'react-native';

function Login({ navigation }) {
    const [user_id, setuser_Id] = useState('');
    const [password, setPassword] = useState('');

    const onLoginPress = async () => {
        const formBody = new URLSearchParams();
        formBody.append('username', user_id);
        formBody.append('password', password);

        try {
            let response = await fetch('http://192.168.0.96:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody.toString(),
            });

            let jsonResponse = await response.json();
            if (jsonResponse.success) {
                // 로그인 성공 시 'List'로 이동
                navigation.navigate('List');
            } else {
                // 로그인 실패 시 콘솔에 메시지 출력
                console.log('Login failed:', jsonResponse.message);
            }
        } catch (error) {
            // 네트워크 오류 처리
            console.error('Network error:', error);
        }
    };
    const onMemberPress = () => {
        navigation.navigate('Join');
      };
    const onAddPress = () => {
        navigation.navigate('List');
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
                    value={user_id}
                    onChangeText={setuser_Id}
                />
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity 
                    style={styles.addButtonContainerPW} 
                    onPress={onAddPress}
                >
                    <Text style={styles.addText}>비밀번호찾기</Text> 
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.addButtonContainer} 
                    onPress={onLoginPress}
                >
                    <Text style={styles.addLogin}>로그인</Text> 
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.addButtonContainer} 
                    onPress={onMemberPress}
                >
                    <Text style={styles.addMember}>회원가입</Text> 
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
    
});

export default Login;