import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert, SafeAreaView,BackHandler, } from 'react-native';
import { API_URL } from '@env';

function Delete({ route, navigation }) {
    const token = route.params?.token;
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // 사용자 확인
        Alert.alert(
            "회원 탈퇴",
            "정말로 탈퇴하시겠습니까?",
            [
                { text: "아니오", style: "cancel" },
                { text: "예", onPress: () => deleteUserAccount() }
            ]
        );
    };

    useEffect(() => {
        const backAction = () => {
          navigation.goBack(); // 이전 화면으로 돌아가기
          return true; // 이벤트 처리 완료
        };
      
        BackHandler.addEventListener('hardwareBackPress', backAction);
      
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
      }, [navigation]);

    const deleteUserAccount = async () => {
        try {
            const response = await fetch(`${API_URL}/mypage/modify-delete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: password,
                    user_status: '2', // 변경할 상태값
                }),
            });

            if (response.ok) {
              Alert.alert(
                "회원 탈퇴 성공", 
                "계정이 성공적으로 삭제되었습니다.",
                [{ text: "OK", onPress: () => navigation.navigate('Login') }] // 배열 형태로 변경
            );
                
            } else {
              const json = await response.json();
              if(response.status === 401){
                  // 비밀번호 불일치 시 특정 메시지를 표시
                  Alert.alert("오류", "현재 비밀번호가 다릅니다.");
              }else{
                  // 그 외의 오류 메시지를 표시
                  setError(json.message || '회원 탈퇴에 실패했습니다.');
              }
          }
        } catch (error) {
            setError('네트워크 오류가 발생했습니다.');
            console.error('회원 탈퇴 요청 에러:', error);
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
                    {/* 에러 메시지 표시 */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <View style={styles.deleteBtn}>
                      <Button title="회원탈퇴" color={'white'} onPress={handleSubmit} />
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  deleteBtn:{
    backgroundColor:'rgb(61,159,136)',
    borderRadius:5,
    padding:5,
    marginTop:10
  },
 
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
      marginVertical: 5,
      color : 'white'
    },
    input: {
        height: 45,
        backgroundColor:'#d9d9d97a',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        color : 'white',
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
});


export default Delete;
