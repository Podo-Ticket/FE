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

interface Schedule {
    id: number;
    date_time: string;
    available_seats: number;
}

export interface ReservationRequest {
    name: string;
    phoneNumber: string;
    headCount: number;
    scheduleId: number;
}

interface ReservationResponse {
    success: boolean;
    userId?: number;
    error?: string;
}

// 공연 회차 정보 조회
export const fetchPerformanceSchedules = async (playId: number) => {
    try {
        const response = await api.get<{ schedules: Schedule[] }>('/reservation', {
            params: { playId },
            withCredentials: true
        });
        return response.data.schedules;
    } catch (error) {
        console.error('Error fetching performance schedules:', error);
        throw error;
    }
};

// 예매 신청
export const submitReservation = async (data: ReservationRequest): Promise<ReservationResponse> => {
    try {
      const response = await api.post('/reservation', data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('예매 신청 중 오류가 발생했습니다.');
      }
    }
  };

// 예매 승인 상태 확인
export const checkReservationApproval = async () => {
    try {
        const response = await api.get<{ approve: boolean }>('/reservation/check', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error checking approval:', error);
        throw error;
    }
};