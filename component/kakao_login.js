import React from 'react';
import { View } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';

// 카카오 로그인을 위한 클라이언트 ID 및 리다이렉트 URI 설정
const KAKAO_CLIENT_ID = ""; // 여기에 카카오 앱의 REST API 키 입력
const KAKAO_REDIRECT_URI = ""; // 여기에 설정한 리다이렉트 URI 입력

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
            const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: KAKAO_CLIENT_ID,
                    redirect_uri: KAKAO_REDIRECT_URI,
                    code,
                },
            });

            const accessToken = response.data.access_token;
            sendTokenToServer(accessToken);0
        } catch (error) {
            console.error('Error requesting token:', error);
        }
    };

    // 서버로 토큰 전송
    const sendTokenToServer = async (accessToken) => {
        console.log('Sending Token to Server:', accessToken); // 서버로 전송되는 토큰 확인

        try {
            let response = await fetch('http://192.168.0.96:8000/users/kakao-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
            });
    
            if (response.ok) {
                let jsonResponse = await response.json();
                console.log('Server Response:', jsonResponse);  // 서버 응답 확인
                console.log('Login Success:', jsonResponse);
                // 로그인 성공 후 StarList 화면으로 이동
                navigation.navigate('StarList');
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
