import React, { useState } from 'react';
import { View } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, API_URL } from '@env';

const KakaoLogin = ({ navigation }) => {
    const [tokenRequested, setTokenRequested] = useState(false);

    // 웹뷰에서 로그인 진행 상황을 추적하는 함수
    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        if (!url) return;

        // 인증 코드 추출
        const codeMatch = url.match(/[?&]code=([^&]+)/);
        if (codeMatch) {
            const code = codeMatch[1];
            // 중복 요청 방지
            if (!tokenRequested) {
                requestToken(code);
                setTokenRequested(true);
            }
        }
    };

    // 카카오 토큰 요청 함수
    const requestToken = async (code) => {
        try {
            const tokenRequestParams = {
                grant_type: 'authorization_code',
                client_id: KAKAO_CLIENT_ID,
                redirect_uri: KAKAO_REDIRECT_URI,
                code,
            };

            console.log('Requesting token with params:', tokenRequestParams);

            const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
                params: tokenRequestParams,
            });

            const accessToken = response.data.access_token;
            console.log('Received accessToken:', accessToken);
            sendTokenToServer(accessToken);
        } catch (error) {
            console.error('Error requesting token:', error.response ? error.response.data : error);
            setTokenRequested(false); // 에러 발생 시 상태 리셋
        }
    };

    // 서버로 토큰 전송 및 로그인 응답 처리
    const sendTokenToServer = async (accessToken) => {
        try {
            const response = await fetch(`${API_URL}/users/kakao-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log("Server Response:", jsonResponse);
                handleLoginResponse(jsonResponse);
            } else {
                console.error('Login Failed:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    // 로그인 후 처리
    const handleLoginResponse = async (response) => {
        const accessToken = response.access_token;
        try {
            if (accessToken) {
                await AsyncStorage.setItem('accessToken', accessToken);
                navigation.navigate('StarList');
            } else {
                console.error('No access token received');
            }
        } catch (error) {
            console.error('Error saving access token', error);
        }
    };
    
    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}` }}
                onNavigationStateChange={handleWebViewNavigationStateChange}
                javaScriptEnabled={true}
            />
        </View>
    );
};

export default KakaoLogin;
