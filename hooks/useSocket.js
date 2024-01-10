import { useState, useEffect } from 'react';

const useSocket = (clientID, roomID, onMessageReceived) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(`ws://192.168.0.69:8000/chat/${clientID}/${roomID}`);
    setWs(websocket);

    websocket.onopen = () => {
      setIsConnected(true);
      console.log('Connected to the WebSocket server');
    };

    websocket.onmessage = (event) => {
      // 서버로부터 메시지를 받으면 onMessageReceived 콜백을 호출합니다.
      const message = JSON.parse(event.data);
      onMessageReceived(message);
    };

    websocket.onerror = () => {
      console.error('WebSocket error occurred');
    };

    websocket.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      websocket.close();
    };
  }, [clientID, roomID, onMessageReceived]);

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
