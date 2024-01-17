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
  Switch,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { API_URL } from '@env';

function Join({ navigation }) {
  const [user_id, setuser_Id] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  let [phone, setPhone] = useState('');
  let [birth, setBirth] = useState('');
  const [policy_agreement_flag, setpolicy_agreement_flag] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [customDomain, setCustomDomain] = useState('');

  const handleCustomDomainSubmit = () => {
    setEmailDomain(customDomain);
    setModalVisible(false);
  };

  // 이메일 중복 체크
  const checkEmail = async () => {
    try {
      const finalEmail = `${emailPrefix}@${emailDomain}`;
      setuser_Id(finalEmail);
      const response = await fetch(`${API_URL}/users/join/email-check`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_email: user_id, // 이메일 필드의 값을 사용
        }),
      });

      const jsonResponse = await response.json(); // 응답을 JSON으로 변환
      if (jsonResponse.status === "available") {
        setIsEmailChecked(true); // 이메일이 사용 가능하면 상태 업데이트
        Alert.alert("회원가입 가능", "회원가입 가능한 이메일입니다.");
      } else if (jsonResponse.status === "unavailable") {
        setIsEmailChecked(false); // 이메일이 사용 불가능하면 상태 업데이트
        Alert.alert("중복된 이메일", "중복된 이메일입니다.");
      }
    } catch (error) {
      console.error('Error checking email:', error);
      Alert.alert("네트워크 오류", error.toString());
    }
  };
  const handleCheckEmail = () => {
    if (!emailPrefix || !emailDomain) {
      Alert.alert("경고", "아이디와 이메일 도메인을 모두 입력해주세요.");
      return;
    }

    // 이메일 접두사와 도메인이 모두 입력된 경우, 이메일 중복 체크 진행
    checkEmail();
  };


  const isSignupDisabled = !isEmailChecked || !user_id || !password || !confirmPassword || !name || !phone || !birth || !policy_agreement_flag;
  // 비밀번호 체크
  const handleSubmit = async () => {
    const finalEmail = `${emailPrefix}@${emailDomain}`;
    setuser_Id(finalEmail);
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 다릅니다.');
      return; // 비밀번호가 다를 경우, 여기서 함수를 종료합니다.
    }

    if (!policy_agreement_flag) {
      Alert.alert('약관 동의 필요', '회원가입을 위해 약관에 동의해주세요.');
      return;
    }

    birth = birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    phone = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

    setPasswordError('');


    try {
      
      const response = await fetch(`${API_URL}/users/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: finalEmail,
          password,
          name,
          phone,
          birth,
          image: "",
          policy_agreement_flag: true,
        }),
      });

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
  const selectDomain = (domain) => {
    setEmailDomain(domain);
    setModalVisible(false);
  };

  return (
    <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
      <View style={styles.topImageContainer}>
        <Image source={require('../assets/img/title.png')} style={styles.centerImage} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.label}>아이디</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.IdInput}
              value={emailPrefix}
              onChangeText={setEmailPrefix}
              placeholder="아이디 입력"
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>@</Text>
              <Text style={styles.buttonText}>
                {emailDomain ? emailDomain : '이메일 선택'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.emailBtn}
              onPress={handleCheckEmail}
            >
              <Text style={styles.emailText}>중복확인</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.centeredView}
            >
              <View style={styles.modalView}>

                <View style={styles.mailSelect}>
                  <TextInput
                    style={styles.mailInput}
                    value={customDomain}
                    onChangeText={setCustomDomain}
                    placeholder="직접 도메인 입력"
                    keyboardType="email-address"
                  />
                  <View style={styles.emailSelectBtn}>
                    <TouchableOpacity onPress={handleCustomDomainSubmit} style={styles.button}>
                      <Text style={styles.buttonText}>직접입력</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                   <TouchableOpacity onPress={() => selectDomain('naver.com')} style={styles.email} >
                      <Text style={styles.buttonText}>naver.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectDomain('daum.net')} style={styles.email}>
                      <Text style={styles.buttonText}>daum.net</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectDomain('gmail.com')} style={styles.email}>
                      <Text style={styles.buttonText}>gmail.com</Text>
                    </TouchableOpacity>
               
              </View>
            </KeyboardAvoidingView>
          </Modal>

         

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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

          <Text style={styles.label}>생년월일 (EX:YYYYMMDD) 로 입력하세요</Text>
          <TextInput
            style={styles.input}
            value={birth}
            placeholder="YYYYMMDD"
            placeholderTextColor="white"
            onChangeText={setBirth}
          />

          <View style={styles.checkboxContainer}>
            <Switch
              value={policy_agreement_flag}
              onValueChange={setpolicy_agreement_flag}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={policy_agreement_flag ? "#f5dd4b" : "#f4f3f4"}
            />
            <Text style={styles.checkboxText}>[필수] 약관에 동의합니다.</Text>
          </View>

         
          <TouchableOpacity onPress={handleSubmit} disabled={isSignupDisabled} style={styles.joinBtn}>
              <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  emailSelectBtn:{
    height:40,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonText:{
    fontSize:14,
    color:'white'
  },
  emailText:{
    color:'gray'
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
  topImageContainer: {
    alignItems: 'center', // 자식 요소를 가로 축의 가운데로 정렬합니다.
    justifyContent: 'center',
    height: 100,
    padding:20,
    marginTop:50,
  },
  centerImage: {
    width: '100%', // 이미지의 가로 크기를 조정합니다.
    height: '100%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
    resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
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
    marginVertical: 7,
    color: 'white'
  },
  IdInput:{
    flex:1.5,
    height: 40,
    backgroundColor:'#d9d9d97a',
    padding: 10,
    borderRadius: 5,
    color: 'white'

  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor:'#d9d9d97a',
    marginBottom: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    color: 'white'
  },
  mailSelect:{
    display:'flex',
    flexDirection:'row',

  },
  mailInput: {
    flex:2,
    height:40,
    backgroundColor:'#d9d9d97a',
    marginBottom: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    color: 'white'
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  inputContainer: {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent:'center'
    
  },
  button: {
    flex:1,
    height: 40,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    padding: 10,
    backgroundColor: '#d9d9d97a',
    borderRadius: 5,
    marginLeft: 10, // TextInput과의 간격
  },
  email: {
    width:'100%',
    height: 40,
    marginVertical:5,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    padding: 10,
    backgroundColor: '#d9d9d97a',
    borderRadius: 5,
  },
  emailBtn: {
    height: 40,
    display:'flex',
    justifyContent:'center',
    padding: 7,
    backgroundColor: 'white',
    borderRadius: 5,
    marginLeft: 10, // TextInput과의 간격
   
  },
  joinBtn: {
    flex:1,
    height: 40,
    marginTop:20,
    display:'flex',
    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor: 'gray',
    borderRadius: 5,
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
  selectedDomain: {
    color: 'white',
    fontSize: 16,
    marginTop: 10
  },
  selectedDomainText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '90%', // 모달의 가로 크기를 조절
    height: 300,
    backgroundColor: '#2A2826',
    borderRadius: 20,
    padding: 20, // 내부 패딩을 조절하여 내용물의 크기를 조절
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
});

export default Join;