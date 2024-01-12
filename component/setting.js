import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Setting({ navigation }) {
    const [selectedTab, setSelectedTab] = useState('MyPage');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // accessToken 상태 추가

    useEffect(() => {
      // 로그인한 사용자의 아이디와 토큰을 가져오는 함수
      const getLoggedInUserInfo = async () => {
          try {
              const token = await AsyncStorage.getItem('accessToken');
              if (token) {
                  setAccessToken(token); // 토큰 상태 업데이트
                  console.log('저장된 토큰:', token); // 콘솔에 토큰 출력
              }
          } catch (error) {
              console.error('Error fetching user info', error);
          }
      };
  
      getLoggedInUserInfo();
  }, []);

    const navigateToTab = (tabName) => {
      navigation.navigate(tabName, { token: accessToken });
    };

    return (
        <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Image source={require('../assets/img/title.png')} style={styles.titleImage}/>
                    <Text style={styles.userIdText}>로그인한 사용자: {loggedInUserId}</Text>
                    <Text style={styles.userIdText}>토큰: {accessToken ? '저장됨' : '저장되지 않음'}</Text>
                    
                    {/* Tab Navigation */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={styles.tab} onPress={() => navigateToTab('mypage')}>
                            <Text style={styles.tabText}>마이페이지</Text>
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