import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function Main({ navigation }) {

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    // 토큰이 있으면 StarList 페이지로 이동
                    navigation.navigate('StarList');
                } else {
                    // 토큰이 없으면 Login 페이지로 이동
                    navigation.navigate('Login');
                }
            } catch (error) {
                console.error('토큰 확인 중 에러 발생', error);
            }
        }, 2000); // 2초 후 실행

        return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
    }, [navigation]);

    // useFocusEffect 내부의 checkToken 호출 제거 또는 조정


    return (
        <ImageBackground source={require('../assets/img/main.png')} style={styles.wrapper} resizeMode="cover">
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topImageContainer}>
                    <Image source={require('../assets/img/title.png')} style={styles.centerImage} />
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
    topImageContainer: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center', 
    },
    centerImage: {
        width: '80%', 
        height: '30%', 
        resizeMode: 'contain',
    },
    addButtonContainer: {
        position: 'absolute', 
        right: 0, 
        top: 0,
        padding: 16, 
    },
    addText: {
        fontSize: 20, 
        color: '#FFF', 
        
        marginTop: 30,
    },

});

export default Main;