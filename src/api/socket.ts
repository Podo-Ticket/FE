import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
  transports: ["websocket"], // 필요에 따라 추가
});

socket.on('connect', () => {
  console.log('Socket.IO connection established');
});

socket.on('disconnect', () => {
  console.log('Socket.IO connection closed');
});

socket.on('error', (error: any) => {
  console.error('Socket.IO error:', error);
});

export default socket;