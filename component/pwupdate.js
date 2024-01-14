import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert, SafeAreaView } from 'react-native';
import { API_URL } from '@env';

function Pwupdate({ route, navigation }) {
    const token = route.params?.token;
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (newPassword !== newPasswordCheck) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/mypage/modify-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: password,
                    new_password: newPassword, 
                }),
            });
    
            const json = await response.json(); // 한 번만 호출
            if (response.ok) {
                Alert.alert("성공",
                "비밀번호가 변경되었습니다.",
                [{ text: "OK", onPress: () => navigation.navigate('Login') }]
                );
                navigation.goBack();
            } else {
                setError(json.message || '비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            setError('네트워크 오류가 발생했습니다.');
            console.error('비밀번호 변경 요청 에러:', error);
        }
    };

    return (
        <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>현재 비밀번호</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry // 비밀번호를 숨김 처리
                    />
                    <Text style={styles.label}>변경할 비밀번호</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry // 비밀번호를 숨김 처리
                    />
                    <Text style={styles.label}>변경할 비밀번호 확인</Text>
                    <TextInput
                        style={styles.input}
                        value={newPasswordCheck}
                        onChangeText={setNewPasswordCheck}
                        secureTextEntry // 비밀번호를 숨김 처리
                    />
                    {/* 에러 메시지 표시 */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <Button title="변경 완료" onPress={handleSubmit} />
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
    container: {
      justifyContent: 'flex-start',
      padding: 20,
    },
    titleImageImage: {
      width: '100%', // 이미지의 가로 크기를 조정합니다.
      height: '100%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
      resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
      marginTop: 20,
    },
    formContainer: { // 중앙 정렬을 위한 새로운 스타일
      flex: 2, // flex 값을 조정하여 화면에 맞게 크기를 조절할 수 있습니다.
      width: '80%', // 이 부분은 부모 뷰의 가로 크기의 80%를 차지하게 합니다.
      alignSelf: 'center', // 부모 뷰의 중앙에 위치하게 합니다.
      justifyContent: 'center',
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
    errorText: {
      color: 'red',
      marginBottom: 10,
  },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    button: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      marginLeft: 10, // TextInput과의 간격
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    checkboxText: {
      marginLeft: 8,
      color: 'white',
    },
});


export default Pwupdate;
