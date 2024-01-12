import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import { API_URL } from '@env';

// 사용자 정보를 불러오는 함수
async function fetchUserInfo(token) {
  try {
    console.log('사용된 토큰:', token); // 토큰 출력

    const response = await fetch(`${API_URL}/mypage`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('사용자 정보 가져오기 에러:', error);
    return {};
  }
}

// Member 컴포넌트 정의
function Member({ route, navigation }) {
  const token = route.params?.token;
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    name: '',
    phone: '',
    birth: '',
    credit: '',
  });

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      const data = await fetchUserInfo(token);
      setUserInfo(data);
    };

    if (token) {
      fetchAndSetUserInfo();
    }
  }, [token]);

  return (
    <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.infoText}>이메일: {userInfo.user_id}</Text>
        <Text style={styles.infoText}>이름: {userInfo.name}</Text>
        <Text style={styles.infoText}>전화번호: {userInfo.phone}</Text>
        <Text style={styles.infoText}>생년월일: {userInfo.birth}</Text>
        <Text style={styles.infoText}>크레딧: {userInfo.credit}</Text>
        {/* 여기에 추가적인 UI 요소나 로직을 구현할 수 있습니다 */}
      </View>
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
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 50, // 상하 간격을 추가
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 60, // 타이틀의 상단 간격을 조정
  },
  profileContainer: {
    // 여기에 프로필 이미지 스타일을 추가
  },
  infoText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5, // 텍스트 간의 상하 간격을 조정
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
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // 버튼의 배경색과 투명도 조정
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20, // 버튼의 상단 간격을 조정
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleImage: {
    width: '80%', // 이미지의 가로 크기를 조정합니다.
    height: '30%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
    resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
    marginTop: 20, // 이미지의 상단 간격을 조정합니다.
  },
});

export default Member;
