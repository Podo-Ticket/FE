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

socket.on('forceLogout', (data: any) => {
  console.log('📩 forceLogout 수신:', data);

  alert(data.message || '다른 기기에서 로그인되어 자동 로그아웃됩니다.');

  // 서버에 로그아웃 요청 (선택사항)
  fetch('/logout', {
      method: 'POST',
      credentials: 'include',
  }).finally(() => {
      window.location.href = '/'; // 로그인 페이지로 이동
  });
});

export default socket;