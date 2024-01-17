import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, Image, TouchableOpacity,BackHandler, } from 'react-native';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';

function Member({ route, navigation }) {
  const token = route.params?.token;


  // 상태 변수 선언
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    name: '',
    phone: '',
    birth: '',
    credit: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    async function fetchAndSetUserInfo() {
      try {
        const response = await fetch(`${API_URL}/mypage`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();
        setUserInfo(json);
      } catch (error) {
        console.error('사용자 정보 가져오기 에러:', error);
      }
    }

    if (token) {
      fetchAndSetUserInfo();
    }
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    // 두 로직의 클린업(청소) 함수를 반환
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };

  }, [token,navigation]);

  // 이미지 선택 함수
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage({ uri: result.uri });
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      type: 'image/jpeg', // 또는 파일에 따라 'image/png' 등
      name: 'profile.jpg', // 임의의 파일명
    });

    try {
      const response = await fetch(`${API_URL}/mypage/modify-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // 필요한 토큰
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('서버에서 이미지 업로드 실패');
      }

      const json = await response.json();
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.photoWrap}>

        <View style={styles.photo}>
          <Image
            source={profileImage || require('../assets/img/image.png')}
          />
        </View>
        <View style={styles.photoBtn}>

        <TouchableOpacity onPress={selectImage}>
          <Text style={styles.buttonText}>파일 선택</Text>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.contentsWrap}>

          <View style={styles.headerWrap}>
            <Text style={styles.HeaderText}>이메일:</Text>
            <Text style={styles.HeaderText}>이름:</Text>
            <Text style={styles.HeaderText}>전화번호:</Text>
            <Text style={styles.HeaderText}>생년월일:</Text>
            <Text style={styles.HeaderText}>크레딧:</Text>
          </View>
          <View style={styles.TextWrap}>
              <Text style={styles.infoText}>{userInfo.user_id}</Text>
              <Text style={styles.infoText}>{userInfo.name}</Text>
              <Text style={styles.infoText}>{userInfo.phone}</Text>
              <Text style={styles.infoText}>{userInfo.birth}</Text>
              <Text style={styles.infoText}>{userInfo.credit}</Text>
          </View>
        </View>


      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  photoBtn:{
    borderRadius:5,
    backgroundColor:'#d9d9d97a',
    marginTop:10,
    padding:7

  },
  photo:{
    borderRadius:10,
    backgroundColor:'#d9d9d97a'
  },
  photoWrap:{
    display: 'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:50
  },
  headerWrap:{
   justifyContent:'space-around'
    
  },
  HeaderText: {
    color: 'white',
    fontSize: 16,
  },
  TextWrap: {
    justifyContent:'space-around',
    width:'60%',

  },
  infoText: {
    color: 'white',
    fontSize: 16,
   
  },
  contentsWrap: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    height:'45%',
    width:'80%',
  },
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  container: {
    display:'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height:'85%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 60,
  },
 
  addButtonContainer: {
    height: 50, 
    backgroundColor: '#007AFF',
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 25, 
    marginTop: 10, 
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    
   
  },
  titleImage: {
    width: '80%', 
    height: '30%',
    resizeMode: 'contain',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

});

export default Member;
