import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: apiUrl, // Use environment variables
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 어드민 인증 코드 확인 API
export const verifyAdminCode = async (adminCode: string): Promise<{ success: boolean }> => {
  try {
      const response = await api.get(`/admin`, {
          withCredentials: true, // 세션 쿠키 포함
          headers: {
              'Content-Type': 'application/json',
          },
          params: {
              code: adminCode,
          },
      });

      return response.data; // 성공 시 응답 데이터 반환
  } catch (error: any) {
      if (error.response && error.response.data.error) {
          throw new Error(error.response.data.error); // 서버에서 반환한 에러 메시지
      } else {
          throw new Error('API 호출 중 오류가 발생했습니다.'); // 일반적인 에러 메시지
      }
  }
};
