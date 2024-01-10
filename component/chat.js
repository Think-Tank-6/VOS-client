import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useSocket from '../hooks/useSocket';
import { API_URL } from '@env';

function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { roomID } = route.params; // Assuming roomID is passed as a route parameter
  const [clientID, setClientID] = useState('YourClientID'); // Set this to the actual clientID
  const [starId, setStarId] = useState('YourStarID'); // Set this to the actual starId

  // Fetch initial chat messages
  const fetchChatInfo = async () => {
    try {
      // Fetch existing messages for the room
      const messagesResponse = await fetch(`${API_URL}/chat/${roomID}/messages`);
      const messagesData = await messagesResponse.json();
      setMessages(messagesData.map(m => ({ ...m, createdAt: new Date(m.createdAt) })));
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };

  useEffect(() => {
    fetchChatInfo();
  }, [roomID]);

  const { isConnected, sendMessage } = useSocket(clientID, starId);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    newMessages.forEach(message => {
      const messageData = {
        room_id: roomID,
        user_id: clientID,
        star_id: starId,
        content: message.text,
      };
      if (isConnected) {
        sendMessage(messageData);
      } else {
        console.error("WebSocket is not connected");
      }
    });
  }, [isConnected, sendMessage, roomID, clientID, starId]);

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
        user={{ _id: clientID }}
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
