import { useState, useEffect } from 'react';

const useSocket = (clientID) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(`ws://192.168.0.69:8000/chat/${clientID}`);
    setWs(websocket);

    const timeout = 20000; // 20초로 설정
    
    const timer = setTimeout(() => {
      websocket.close();
      console.error('WebSocket connection timeout');
    }, timeout);

    websocket.onopen = () => {
      clearTimeout(timer);
      setIsConnected(true);
      console.log('Connected to the WebSocket server');
    };

    websocket.onerror = () => {
      clearTimeout(timer); // 에러 발생 시 타임아웃 타이머를 해제
      console.error('WebSocket error occurred');
    };

    websocket.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      websocket.close();
    };
  }, [clientID]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  };

  return { ws, isConnected, sendMessage };
};

export default useSocket;
