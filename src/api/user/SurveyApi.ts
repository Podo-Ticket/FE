import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // 환경 변수에서 API URL 가져오기

const api = axios.create({
    baseURL: apiUrl, // 기본 URL 설정
    timeout: 10000, // 요청 타임아웃 설정
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키 포함
});

// API 요청 함수들 정의
export const submitSurveyAnswer = async (answer: number): Promise<{ success: boolean }> => {
    try {
        const response = await api.post('/survey/question1', { answer });
        return response.data; // 성공 응답 반환
    } catch (error: any) {
        console.error('API 요청 중 오류 발생:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'API 요청 실패');
    }
};