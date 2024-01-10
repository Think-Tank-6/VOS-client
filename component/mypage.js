import React from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView,Text } from 'react-native';
import { API_URL } from '@env';

// async function fetchUserInfo() {
//     try {
//       const response = await fetch(`${API_URL}/users/`);
//       const json = await response.json();
//       return json;
//     } catch (error) {
//       console.error(error);
//     }
//   }

function MyPage({ navigation }) {
    // 사용자 정보를 상태로 관리합니다.
    // const [userInfo, setUserInfo] = useState({
    //   email: '',
    //   name: '',
    //   dateOfBirth: '',
    //   phone: '',
    //   credits: '',
    // });

    const onPwupdatePress = () => {
        navigation.navigate('pwupdate');
    };  
  
    // useEffect(() => {
    //   // 컴포넌트가 마운트될 때 사용자 정보를 불러옵니다.
    //   fetchUserInfo().then(data => {
    //     setUserInfo(data); // 가져온 데이터로 상태를 업데이트합니다.
    //   });
    // }, []);
  
    return (
      <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* 타이틀 이미지 */}
            <Image source={require('../assets/img/title.png')} style={styles.titleImage}/>
            
            {/* 사용자 정보 텍스트 */}
            {/* <Text style={styles.infoText}>이메일: {userInfo.email}</Text>
            <Text style={styles.infoText}>이름: {userInfo.name}</Text>
            <Text style={styles.infoText}>생년월일: {userInfo.dateOfBirth}</Text>
            <Text style={styles.infoText}>전화번호: {userInfo.phone}</Text>
            <Text style={styles.infoText}>크레딧: {userInfo.credits}</Text> */}
            <Text style={styles.infoText}>이메일: </Text>
            <Text style={styles.infoText}>이름: </Text>
            <Text style={styles.infoText}>생년월일: </Text>
            <Text style={styles.infoText}>전화번호: </Text>
            <Text style={styles.infoText}>크레딧: </Text>
            
            {/* 별 보기 버튼 */}
            <TouchableOpacity 
                style={styles.addButtonContainer} 
                onPress={onPwupdatePress}
            >
                <Text style={styles.addPwupdate}>비밀번호 변경</Text> 
            </TouchableOpacity>
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

export default MyPage;
