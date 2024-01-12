import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, FlatList, Dimensions } from 'react-native';
import { useFonts, Hurricane_400Regular } from '@expo-google-fonts/hurricane';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native';


const AdminLogin = ({ navigation }) => {
  // 상태 변수 정의
  const [user_id, setUser_Id] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 처리 함수
  const handleLogin = async () => {
    const url = 'http://192.168.0.96:8000/admin/login';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: user_id,
          password: password,
        }),
      });
  
      const jsonResponse = await response.json();
  
      if (response.status === 200) {
        // 로그인 성공
        Alert.alert("로그인 성공", "로그인이 완료되었습니다.");
        // 성공 시 Admin 페이지로 이동
        navigation.navigate('Admin');
      } else {
        // 로그인 실패
        Alert.alert("로그인 오류", jsonResponse.detail || "로그인에 실패했습니다.");
      }
    } catch (error) {
      // 네트워크 오류 처리
      Alert.alert("네트워크 오류", "네트워크 상태를 확인해 주세요.");
    }
  };

  // 로그인 폼 UI
  return (
    <View style={styles.adminPanel}>
      <View style={styles.sidebar}>
      <View style={styles.logo}> 
          {Platform.OS === 'web' ? (
              <Text style={styles.logoText}>Voice of the Star</Text>
            ) : (
              <FontAwesome5 name="star-and-crescent" size={24} color="black" margin={22} marginTop={65} />
            )}
        </View>
        {/* 로그인 폼 */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUser_Id}
            value={user_id}
            placeholder="아이디를 입력하세요"
          />
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          {/* 회원가입 이동 버튼 */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('join')}
          >
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adminPanel: {
    flexDirection: 'row',
    width: '100%',
    height:'100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 25 : 10,
    paddingTop: Platform.OS === 'web' ? 25 : 60,
  },
  sidebar: {
    width: '40%',
    alignItems: 'center',
    minHeight: 690,
    borderRadius:20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    height: 145,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
 
    boxShadow: '0px 4px 8px -4px #CCC',
  },
  menu: {
    marginTop: 10,
    textTransform: 'uppercase',
    
  },
  menuItem: {
    
    padding: 25,
    paddingRight: Platform.OS === 'web' ? 25 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  menuItemText: {
    width: 50,
    marginLeft: 10,
  },
  focusedMenuItem: {
    backgroundColor: 'black',
    
  },
  focusedMenuItemText: {
    color: 'white',
  },
  menuFlex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginLeft: 10,
    padding: Platform.OS === 'web' ? 25 : 20,
    borderRadius:20,
  },
  logoText: {
    fontFamily: 'Hurricane',
    fontSize: Platform.OS === 'web' ? 60 : 25,
    margin: Platform.OS === 'web' ? 25 : 25,
    
  },
  focusedMenuItemText: {
    color: 'white',
  },
  container: {
    // container 스타일을 사용하여 전체 레이아웃을 설정
    flexDirection: 'row',
    alignItems: 'flex-start', // 가운데 정렬을 제거하고 시작 부분에 정렬
    width: '100%',
    height: '100%',
    backgroundColor: '#fff', // 배경색을 흰색으로 설정
  },
  formContainer: {
    width: '80%', // 폼 너비 설정
    alignSelf: 'center', // 중앙 정렬
    marginTop: 20, // 상단 여백 추가
  },
label: {
    fontSize: 16,
    marginTop: 10,
    color : 'black'
},
input: {
   height: 40,
   borderColor: 'black',
   borderWidth: 1,
   marginBottom: 10,
   padding: 10,
   borderRadius: 5,
   color : 'black',
 },
 loginButton: {
  marginTop: 10,
  backgroundColor: 'black',
  padding: 10,
  borderRadius: 5,
},
loginButtonText: {
  color: 'white',
  textAlign: 'center',
},
signupButton: {
  marginTop: 5,
  backgroundColor: 'grey',
  padding: 10,
  borderRadius: 5,
},
signupButtonText: {
  color: 'white',
  textAlign: 'center',
},
});

export default AdminLogin;
