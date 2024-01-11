import React from 'react';
import { View } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, API_URL } from '@env';

const KakaoLogin = ({ navigation }) => {
    // 웹뷰에서 로그인 진행 상황을 추적하는 함수
    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        if (!url) return;

        // 인증 코드 추출
        if (url.includes('code=')) {
            const code = url.split('code=')[1];
            // 토큰 요청 함수 호출
            requestToken(code);
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
        }
    };
    
    const handleLoginResponse = async (response) => {
        const userId = response.userId;
        try {
            navigation.navigate('StarList');
        } catch (error) {
            console.error('Error saving user id', error);
        }
    };

    // 서버로 토큰 전송
    const sendTokenToServer = async (accessToken) => {
        try {
            let response = await fetch(`${API_URL}/users/kakao-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
            });
    
            if (response.ok) {
                let jsonResponse = await response.json();
                // console.log("Server Response:", jsonResponse); // 서버 응답 로그
                handleLoginResponse(jsonResponse); // 응답 처리 함수 호출
            } else {
                console.error('Login Failed:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
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