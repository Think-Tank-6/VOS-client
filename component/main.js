import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity,SafeAreaView } from 'react-native';

function Main({ navigation }) {
    const onAddPress = () => {
      navigation.navigate('Login');
    };

    return (
      <ImageBackground source={require('../assets/img/main.png')} style={styles.wrapper} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topImageContainer}>
            <Image source={require('../assets/img/title.png')} style={styles.centerImage}/>
            </View>

            <TouchableOpacity 
                style={styles.addButtonContainer} 
                onPress={onAddPress}
            >
                <Text style={styles.addText}>로그인</Text> 
            </TouchableOpacity>
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
    topImageContainer: {
        flex: 1, // 부모 View를 flex container로 만듭니다.
        justifyContent: 'center', // 자식 요소를 세로 축의 가운데로 정렬합니다.
        alignItems: 'center', // 자식 요소를 가로 축의 가운데로 정렬합니다.
    },
    centerImage: {
        width: '80%', // 이미지의 가로 크기를 조정합니다.
        height: '30%', // 이미지의 세로 크기를 조정합니다. 원하는 비율로 조정하세요.
        resizeMode: 'contain', // 이미지가 View에 맞춰서 비율을 유지하며 표시됩니다.
    },
    addButtonContainer: {
        position: 'absolute', // 요소를 절대 위치로 설정
        right: 0, // 오른쪽 끝에서부터의 거리
        top: 0, // 상단에서부터의 거리
        padding: 16, // 내부 여백
    },
    addText: {
        fontSize: 20, // 텍스트 크기 조정 (로그인 텍스트에 맞게 조정 필요)
        color: '#FFF', // 텍스트 색상
        // alignItems와 justifyContent는 여기서 필요하지 않습니다.
        marginTop: 30,
    },
    
});

export default Main;