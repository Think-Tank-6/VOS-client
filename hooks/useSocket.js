import { useState, useEffect } from 'react';
import { WS_URL } from '@env';

const useSocket = (starID, externalOnMessageReceived) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(`${WS_URL}/chat/${starID}`);
    setWs(websocket);

    websocket.onopen = () => {
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      // 서버로부터 메시지를 받으면 onMessageReceived 콜백을 호출합니다.
      const message = JSON.parse(event.data);
      externalOnMessageReceived(message);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error occurred:', error);
      setIsConnected(false);
  };
  
  websocket.onclose = (event) => {
      setIsConnected(false);
  };

  return () => {
      websocket.close();
  };
  }, [starID, externalOnMessageReceived]);

  const sendMessage = (messageContent) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
          const message = { content: messageContent };
          ws.send(JSON.stringify(message));
      } else {
          console.error('WebSocket is not open');
      }
  };

  return { ws, isConnected, sendMessage };
};

export default useSocket;
