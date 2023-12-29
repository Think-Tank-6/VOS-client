import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
  Switch
} from 'react-native';


function Join({ navigation }) {
  const [user_id, setuser_Id] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [policy_aggrement_flag, setPolicy_aggrement_flag] = useState(false);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 다릅니다.');
      return; // 비밀번호가 다를 경우, 여기서 함수를 종료합니다.
    }

    if (!policy_aggrement_flag) {
      Alert.alert('약관 동의 필요', '회원가입을 위해 약관에 동의해주세요.');
      return;
    }

    setPasswordError('');

    try {
      const response = await fetch('http://192.168.0.96:8000/auth/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          password,
          name,
          phone,
          policy_aggrement_flag,
        }),
      });
    

      console.log('After fetch:', response);

      if (response.ok) {
        // 회원가입 성공 시
        Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
        navigation.navigate('Login');
      } else {
        const jsonResponse = await response.json(); // 서버로부터의 응답을 JSON으로 변환
        if (jsonResponse.detail === "Member already exists") {
          Alert.alert("회원가입 오류", "이미 존재하는 사용자 ID입니다.");
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
    <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
      <View style={styles.topImageContainer}>
          <Image source={require('../assets/img/title.png')} style={styles.centerImage}/>
      </View>
      <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={user_id}
            onChangeText={setuser_Id}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {/* 인증 로직 */}}
          >
            <Text>인증</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        
        <Text style={styles.label}>비밀번호확인</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true} // 비밀번호 숨김 처리
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        {/* 체크박스와 동의 텍스트 */}
        <View style={styles.checkboxContainer}>
            <Switch
              value={policy_aggrement_flag}
              onValueChange={setPolicy_aggrement_flag}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={policy_aggrement_flag ? "#f5dd4b" : "#f4f3f4"}
            />
            <Text style={styles.checkboxText}>[필수] 약관에 동의합니다.</Text>
          </View>

        <Button title="회원가입" onPress={handleSubmit} 
          disabled={!policy_aggrement_flag}  // policy_aggrement_flag가 false일 경우 버튼 비활성화
        />
      </View>
      </ScrollView>
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
      color : 'white'
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
      color : 'white'
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

export default Join;