import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: apiUrl, // Use environment variables
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface Schedule {
  id: number;
  date_time: string; // 공연 날짜 및 시간
  free_seats: number; // 남은 좌석 수
}

interface FetchSchedulesResponse {
  schedules: Schedule[];
}

// 공연 회차 가져오기
export const fetchSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await api.get<FetchSchedulesResponse>('/user/schedule');
    return response.data.schedules; // 공연 회차 데이터 반환
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch schedules');
  }
};

// 좌석 정보 가져오기 API
export const fetchSeats = async (scheduleId: number) => {
  try {
    const response = await api.get('/seat/realTime', {
      params: {scheduleId},
    });
    return response.data;
  } catch (error) {
    throw new Error('좌석 정보를 가져오는 데 실패했습니다.');
  }
};

export interface Seat {
  row: string;
  number: number;
}

interface LockSeatsRequest {
  scheduleId: number[];
  seats: string;
}

// 개별 예약된 좌석 정보
export interface ReservedSeat {
  row: string;
  number: string;
  dateTime: string;
}

// 각 회차의 응답 데이터
export interface LockSeatsResponse {
  success: boolean;
  reservedList: ReservedSeat[];
}

// 전체 응답 배열 타입
export type LockSeatsResponses = LockSeatsResponse[];

// 좌석 잠금 API
export const lockSeats = async (request: LockSeatsRequest): Promise<LockSeatsResponse> => {
  try {
    const response = await api.post('/seat/lock', request);
    return response.data as LockSeatsResponse;
  } catch (error) {
    throw new Error('좌석 잠금에 실패했습니다.');
  }
};

interface UnlockSeatsRequest {
  scheduleId: number;
  seats: string;
}

interface UnlockSeatsResponse {
  success: boolean;
  error?: string;
}

// 좌석 잠금 해제 API
export const unlockSeats = async (request: UnlockSeatsRequest): Promise<UnlockSeatsResponse> => {
  try {
    const response = await api.delete('/seat/unlock', {data: request});
    return response.data;
  } catch (error) {
    throw new Error('좌석 잠금 해제에 실패했습니다.');
  }
};

export interface CheckingLockSeatsRequest {
  scheduleId: number[];
  seats: string;
}

// 좌석 예약 정보 확인 API
export const checkReservedSeats = async (
  request: CheckingLockSeatsRequest,
): Promise<LockSeatsResponse> => {
  try {
    const response = await api.post('/seat/check', request);
    return response.data as LockSeatsResponse;
  } catch (error) {
    throw new Error('예약된 좌석 확인에 실패했습니다.');
  }
};
