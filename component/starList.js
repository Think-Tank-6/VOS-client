import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function StarList({ navigation }) {
    const onAddPress = () => {
      navigation.navigate('Generate');
    };

    const [stars, setStars] = useState([]);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                let response = await fetch('http://localhost:8000/stars');
                let json = await response.json();
                setStars(json.stars);
              } catch (error) {
                console.error('별을 가져오는 중 오류 발생:', error);
              }
        };

        fetchStars();
    })

    return (
      <ImageBackground source={require('../assets/img/background.png')} style={styles.wrapper}>
        <StatusBar style='light' />
        <View style={styles.logo}>
          <Image source={require('../assets/img/title.png')} style={styles.topImage}/>
        </View>

        {/* '+' 버튼과 '채팅을 추가하세요' 텍스트 */}
        <TouchableOpacity 
            style={styles.addButtonContainer} 
            onPress={onAddPress}
        >
            <Text style={styles.plus}>+</Text>
            <Text style={styles.addText}>채팅을 추가하세요</Text> 
        </TouchableOpacity>

        {/* 설정 버튼 - 이 부분은 현재 사용되지 않음 */}
        {/* 추후 필요에 따라 onSettingsPress 함수 추가 및 연결 가능 */}
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        marginTop: 30,
    },
    topImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
    },
    addButtonContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: 'center',
        justifyContent: 'center',
    },
    plus: {
        fontSize: 72, // '+' 크기 조정
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: {
        color: 'white',
        marginTop: 20,
        fontSize: 16,
    },
    settingsButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    settingsImage: { // 설정 버튼 이미지를 위한 새로운 스타일
        width: 30, // 적절한 크기로 조정
        height: 30, // 적절한 크기로 조정
    },
    textContainer: {
        position: 'absolute', // 내부 텍스트를 위한 절대 위치
        top: '30%', // 상단으로부터의 위치를 조정
        alignItems: 'center',
        justifyContent: 'center',
    },
    listBack: {
        width: '50%', // 화면 너비의 90%를 차지하도록 설정
        height: '50%', // 화면 높이의 50%를 차지하도록 설정
        resizeMode: 'contain', // 이미지 비율을 유지하면서 적절히 맞도록 설정
        alignSelf: 'center', // 컴포넌트를 가로축에서 중앙에 배치
    },

    
});

export default StarList;