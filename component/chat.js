import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useSocket from '../hooks/useSocket';
import { API_URL } from '@env';

function Chat({ route }) {
  const [messages, setMessages] = useState([]);
  const { star_id } = route.params; // Extract star_id from navigation parameters
  const [starId, setStarId] = useState(star_id); // Use the passed star_id

  // Fetch initial chat messages
  const fetchChatInfo = async () => {
    try {
      // Fetch existing messages for the star
      const messagesResponse = await fetch(`${API_URL}/chat/${star_id}/messages`);
      const messagesData = await messagesResponse.json();
      setMessages(messagesData.map(m => ({
        _id: new Date(m.created_at).getTime(), // 고유 식별자
        text: m.content.content, // 메시지 텍스트
        createdAt: new Date(m.created_at),
        user: {
          _id: m.sender === 'user' ? "user" : "assistant", // 사용자 식별자
        },
      })));
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };
  
    // 서버로부터 메시지를 받았을 때 호출될 함수
  const onMessageReceived = useCallback((newMessage) => {
    // 새 메시지를 기존 메시지 목록에 추가
    setMessages(prevMessages => [...prevMessages, {
      _id: new Date().getTime(), // 새 메시지에 대한 임시 고유 식별자
      text: newMessage.content, // 메시지 텍스트
      createdAt: new Date(), // 현재 시각
      user: {
        _id: newMessage.sender === 'user' ? "user" : "assistant", // 메시지 보낸 사람 식별
      }
    }]);
  }, []);

  useEffect(() => {
    fetchChatInfo();
  }, [starId]);

  const { isConnected, sendMessage } = useSocket(starId, onMessageReceived);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    newMessages.forEach(message => {
      const messageData = message.text
      if (isConnected) {
        sendMessage(messageData);
      } else {
        console.error("WebSocket is not connected");
      }
    });
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

  return (
    <ImageBackground style={styles.wrapper} source={require('../assets/img/background.png')}>
      <StatusBar style='light' />
      <View style={styles.logo}>
        <Image source={require('../assets/img/title.png')} style={styles.topImage} />
      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{ _id: "user" }}
        renderBubble={renderBubble}
        renderTime={renderTime}
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
