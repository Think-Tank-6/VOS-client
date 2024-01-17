import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert, SafeAreaView,BackHandler, } from 'react-native';
import { API_URL } from '@env';

function Pwupdate({ route, navigation }) {
    const token = route.params?.token;
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    const [error, setError] = useState('');



    useEffect(() => {
        const backAction = () => {
            navigation.goBack(); // 이전 화면으로 돌아가기
            return true; // 이벤트 처리 완료
        };

        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [navigation]);

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
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain', 
        marginTop: 20,
    },
    formContainer: { 
        flex: 2, 
        width: '80%', 
        alignSelf: 'center', 
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        color: 'white'
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        color: 'white',
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
        marginLeft: 10,
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
