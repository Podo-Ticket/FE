import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
  transports: ['websocket'], // WebSocket 전용으로 설정
  reconnection: true,
});

socket.on('connect', () => {
  console.log('Socket.IO connection established');
});

socket.on('disconnect', () => {
  console.log('Socket.IO connection closed');
});

socket.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

export default socket;