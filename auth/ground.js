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
    width: '80%', 
    height: '30%',
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default Ground;
