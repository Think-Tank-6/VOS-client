import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Button,
} from 'react-native';
import { API_URL } from '@env';


function AdminJoin({ navigation }) {
  const [admin_id, setadmin_Id] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');


  const isSignupDisabled =  !admin_id || !password || !name || !phone || !birth;
// 비밀번호 체크
  const handleSubmit = async () => {

    try {
      const response = await fetch(`${API_URL}/admin/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id,
          password,
          name,
          phone,
          birth,
        }),
      });
      
      if (response.ok) {
        // 회원가입 성공 시
        Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
        navigation.navigate('login');
      } else {
        const jsonResponse = await response.json(); // 서버로부터의 응답을 JSON으로 변환
        if (jsonResponse.detail === "Member already exists") {
          Alert.alert("회원가입 오류", "이미 존재하는 관리자 ID입니다.");
        } else {
          Alert.alert("회원가입 오류", jsonResponse.detail || "회원가입에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert("네트워크 오류", error.toString());
    }
  };

  return (
      <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.label}>아이디</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={admin_id}
            onChangeText={setadmin_Id}
          />
        </View>

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>전화번호</Text>
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
          </View>

        <Text style={styles.label}>생년월일</Text>
        <TextInput
          style={styles.input}
          value={birth}
          onChangeText={setBirth}
        />
        <Button title="회원가입" onPress={handleSubmit} disabled={isSignupDisabled} />
      </View>
          
      </ScrollView>
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
    topImageContainer: {
      alignItems: 'center', // 자식 요소를 가로 축의 가운데로 정렬합니다.
      justifyContent: 'center', 
      height: 100,
    },
    centerImage: {
      width: '100%', // 이미지의 가로 크기를 조정합니다.
      height: '100%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
      resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
      marginTop: 20,
    },
    formContainer: { // 중앙 정렬을 위한 새로운 스타일
      flex: 2, // flex 값을 조정하여 화면에 맞게 크기를 조절할 수 있습니다.
      width: '80%', // 이 부분은 부모 뷰의 가로 크기의 80%를 차지하게 합니다.
      alignSelf: 'center', // 부모 뷰의 중앙에 위치하게 합니다.
    },
    scrollView: {
      flex: 1,
    },
    label: {
      fontSize: 16,
      marginTop: 10,
      color : 'black'
    },
    input: {
      flex:1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      marginRight: 10,
      padding: 10,
      borderRadius: 5,
      color : 'black'
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    button: {
      padding: 10,
      backgroundColor: 'black',
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
      color: 'black',
    },
    menuItem: {
      padding: 25,
      paddingRight: Platform.OS === 'web' ? 25 : 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ebebeb',
    },
});

export default AdminJoin;