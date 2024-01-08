import React from 'react';
import { View, StyleSheet, ImageBackground, Image, SafeAreaView,Text } from 'react-native';

function Ground({ }) {

  
    return (
      <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Image source={require('../assets/img/title.png')} style={styles.titleImage}/>
            
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
  titleImage: {
    width: '80%', // 이미지의 가로 크기를 조정합니다.
    height: '30%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
    resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
    marginTop: 20, // 이미지의 상단 간격을 조정합니다.
  },
});

export default Ground;
