import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useSocket from '../hooks/useSocket';
import { API_URL } from '@env';
import getAccessTokenFromHeader from '../hooks/getAccessTokenFromHeader';

function Chat({ route }) {
  const [messages, setMessages] = useState([]);
  const { star_id } = route.params; // Extract star_id from navigation parameters
  const [starId, setStarId] = useState(star_id); // Use the passed star_id
  const [starImg, setStarImg] = useState(star_id); // Use the passed star_id

  // Fetch initial chat messages
  const fetchChatInfo = async () => {
    try {
      const messagesResponse = await fetch(`${API_URL}/chat/${star_id}/messages`);
      const messagesData = await messagesResponse.json();
      const formattedMessages = messagesData.map(m => ({
        _id: m._id || new Date(m.created_at).getTime(),
        text: typeof m.content === 'object' ? m.content.text : m.content, // 'content'가 객체면 'text' 필드 사용
        createdAt: new Date(m.created_at),
        user: {
          _id: m.sender === 'user' ? "user" : "assistant",
        },
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };
  
  // 서버로부터 메시지를 받았을 때 호출될 함수
  const onMessageReceived = useCallback((newMessage) => {
    console.log('New message received:', newMessage); // Add log for debugging
  
    // 메시지 데이터가 올바른 형식인지 검증하고 변환
    const formattedMessage = {
      _id: newMessage._id || Math.round(Math.random() * 1000000), // 랜덤한 ID 생성 또는 백엔드에서 받은 _id 사용
      text: newMessage.content,
      createdAt: new Date(),
      user: {
        _id: newMessage.sender === 'user' ? 'user' : 'assistant',// 'user'는 1, 'assistant'는 2로 가정
        name: newMessage.sender === 'user' ? 'User' : 'Assistant',
      },
    };
  
    setMessages(previousMessages => GiftedChat.append(previousMessages, formattedMessage));
  }, []);
  
  useEffect(() => {
    const fetchAccessTokenAndStars = async () => {
        const accessToken = await getAccessTokenFromHeader();
        if (accessToken) {
            fetchStars(accessToken);
        } else {
            console.log('No access token found');
            navigation.navigate('Login');
        }
    };

    fetchAccessTokenAndStars();
    fetchChatInfo();
  }, [starId]);

  const fetchStars = async (accessToken) => {
      try {
          const response = await fetch(`${API_URL}/stars`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
              }
          });
          const json = await response.json();
          const matchedStar = json.stars.find((s) => s.star_id === starId); if (matchedStar) { 
            setStarImg(matchedStar.image);
          }
      } catch (error) {
          console.error(`Error fetching stars: ${error.message}`);
      }
  };

  const { isConnected, sendMessage, receiveMessage } = useSocket(starId, onMessageReceived);

  const onSend = useCallback((newMessages = []) => {
    newMessages.forEach(message => {
      console.log('Sending message:', message); // Add log for debugging
      const messageData = message.text; // Ensure the format matches the backend expectation
      if (isConnected) {
        sendMessage(messageData);
      } else {
        console.error("WebSocket is not connected");
      }
    });
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, [isConnected, sendMessage]);


  // Render functions for customizing the chat bubbles and timestamps
  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#3D9F88' },
        left: { backgroundColor: '#92C3D2' },
      }}
      textStyle={{
        right: { color: '#333' },
        left: { color: '#333' },
      }}
      timeTextStyle={{
        right: { color: '#333' },
        left: { color: '#333' },
      }}
    />
  );

  const renderTime = props => (
    <Time {...props} />
  );

  const renderAvatar = (props) => (
    props.currentMessage.user._id === 'assistant' ? (
        <Image
            source={{ uri: starImg || 'https://voice-of-the-star.s3.ap-northeast-2.amazonaws.com/casey-horner-RmoWqDCqN2E-unsplash.jpg' }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
        />
    ) : null
  )

  return (
    <ImageBackground style={styles.wrapper} source={require('../assets/img/background.png')}>
      <StatusBar style='light' />
      <View style={styles.logo}>
        <Image source={require('../assets/img/title.png')} style={styles.topImage} />
      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{ _id: 'user' || 'assistant'}}
        renderBubble={renderBubble}
        renderTime={renderTime}
        renderAvatar={renderAvatar}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  logo: {
    // 로고 스타일
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginTop: 30,
  },
  topImage: {
    // 상단 이미지 스타일
    width: 200,
    height: 50,
    resizeMode: 'contain',
  },
});


export default Chat;
