import React, { useState } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import { useCallback } from 'react';
import useSocket from '../hooks/useSocket';

function Chat() {
  const [messages, setMessages] = useState([]);
  const { ws, isConnected, sendMessage } = useSocket('123');
  
  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) => {
      if (isConnected) {
        newMessages.forEach((message) => {
          const messageData = {
            room_id: 1,
            user_id: 'qwer',
            star_id: 102,
            message: message.text,
          };
          sendMessage(messageData);
      });
    }
  
      let appendedMessages = GiftedChat.append(previousMessages, newMessages).sort((a, b) => b.createdAt - a.createdAt);
  
      // 마지막으로 시간을 표시한 메시지의 시간을 추적합니다.
      let lastShownTimestamp = null;
  
      // 메시지들을 역순으로 순회하면서 showTime을 결정합니다.
      const updatedMessages = appendedMessages.map((msg) => {
        const createdAt = moment(msg.createdAt);
        let showTime = true;
  
        // 이전에 시간이 표시된 메시지가 있고, 같은 분에 속하며, 같은 사용자의 메시지라면 시간을 숨깁니다.
        if (lastShownTimestamp && createdAt.isSame(lastShownTimestamp, 'minute') && createdAt.isSame(lastShownTimestamp, 'day') && msg.user._id === appendedMessages[0].user._id) {
          showTime = false;
        } else {
          // 새로운 메시지의 시간을 표시해야 하므로, lastShownTimestamp를 현재 메시지의 시간으로 업데이트합니다.
          lastShownTimestamp = msg.createdAt;
        }
  
        return { ...msg, showTime };
      });
  
      // 배열을 다시 최신 메시지부터 오래된 메시지 순으로 정렬합니다.
      return updatedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
  }, [isConnected, sendMessage]);
  
  // Bubble 커스터마이징 함수
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#3D9F88', // 오른쪽(나의 메시지) 버블의 배경색
          },
          left: {
            backgroundColor: '#92C3D2', // 왼쪽(상대방의 메시지) 버블의 배경색
          },
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
  };

  const renderTime = (props) => {
    const { currentMessage } = props;
  
    if (!currentMessage.showTime) {
      // showTime 속성이 false라면 시간을 표시하지 않습니다.
      return null;
    }
  
    // showTime 속성이 true라면 시간을 표시합니다.
    return (
      <Time {...props} />
    );
  };
  
  return (
    <ImageBackground style={styles.wrapper} source={require('../assets/img/background.png')}>
      <StatusBar style='light' />
      <View style={styles.logo}>
        <Image source={require('../assets/img/title.png')} style={styles.topImage} />
      </View>
      <View>

      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{ _id: 1 }}
        renderTime={renderTime}
        renderBubble={renderBubble}
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
