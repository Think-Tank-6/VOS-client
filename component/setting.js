import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Setting({ navigation }) {
    const [selectedTab, setSelectedTab] = useState('MyPage');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    useEffect(() => {
        // 로그인한 사용자의 아이디를 가져오는 함수
        const getLoggedInUserId = async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
              setLoggedInUserId(userId); // 아이디 상태 업데이트
            }
          } catch (error) {
            console.error('Error fetching user id', error);
          }
        };
    
        getLoggedInUserId();
      }, []);

      const navigateToTab = (tabName) => {
        setSelectedTab(tabName);
        navigation.navigate(tabName); // 실제 네비게이션을 구현할 때는 이 코드를 활성화합니다.
      };

  return (
    <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={require('../assets/img/title.png')} style={styles.titleImage}/>
          <Text style={styles.userIdText}>로그인한 사용자: {loggedInUserId}</Text>
          
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