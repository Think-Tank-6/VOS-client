import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, SafeAreaView, Text, TouchableOpacity,BackHandler, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Setting({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('MyPage');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // accessToken 상태 추가

  useEffect(() => {
    const getLoggedInUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
          console.log('저장된 토큰:', token);
        }
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    getLoggedInUserInfo();

    const backAction = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    // 두 로직의 클린업(청소) 함수를 반환
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };

  }, [navigation]);

  const navigateToTab = (tabName) => {
    navigation.navigate(tabName, { token: accessToken });
  };

  const handleLogout = async () =>{
    try{
      await AsyncStorage.removeItem('accessToken');
      console.log('로그아웃 성공 : 토큰 삭제');
      navigation.navigate('Login');
    }catch(error){
      console.error('로그아웃 에러',error);
    }
  };

  return (
    <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={require('../assets/img/title.png')} style={styles.titleImage} />

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tab} onPress={() => navigateToTab('mypage')}>
              <Text style={styles.tabText}>마이페이지</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tab} onPress={() => navigateToTab('')}>
              <Text style={styles.tabText}> 결제관리</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tab} onPress={() => navigateToTab('')}>
              <Text style={styles.tabText}>채팅 설정</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tab} onPress={handleLogout}>
              <Text style={styles.tabText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 50,
  },
  titleImage: {
    width: '80%',
    height: '30%',
    resizeMode: 'contain',
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'transparent',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userIdText: {
    color: 'white', // 텍스트 색상
    fontSize: 16, // 텍스트 크기
    marginVertical: 10, // 상하 여백
  },
});

export default Setting;