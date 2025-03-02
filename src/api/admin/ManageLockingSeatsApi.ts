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
    available_seats: number; // 남은 좌석 수
}

interface FetchSchedulesResponse {
    schedules: Schedule[];
}

// 공연 회차 가져오기
export const fetchSchedules = async (): Promise<Schedule[]> => {
    try {
        const response = await api.get<FetchSchedulesResponse>("/user/schedule");
        return response.data.schedules; // 공연 회차 데이터 반환
    } catch (error: any) {
        console.error("Error fetching schedules:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch schedules"
        );
    }
};

// 좌석 정보 가져오기 API
export const fetchSeats = async (scheduleId: number) => {
  try {
    const response = await api.get('/seat/realTime', {
      params: { scheduleId }, // 스케줄 ID를 쿼리 파라미터로 전달
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw new Error('좌석 정보를 가져오는 데 실패했습니다.');
  }
};

export interface Seat {
  row: string; // 좌석 행 (예: "A")
  number: number; // 좌석 열 번호 (예: 1)
}

interface LockSeatsRequest {
  scheduleId: number;
  seats: string; // encodeURIComponent으로 문자열 화 고려.
}

interface UnlockSeatsRequest {
  scheduleId: number;
  seatIds: string[];
}

// 좌석 잠금 API
export const lockSeats = async (request: LockSeatsRequest): Promise<boolean> => {
  try {
    const response = await api.post("/seat/lock", request);
    return response.data.success;
  } catch (error) {
    console.error("Error locking seats:", error);
    throw new Error("좌석 잠금에 실패했습니다.");
  }
};

// 좌석 잠금 해제 API
export const unlockSeats = async (request: UnlockSeatsRequest): Promise<boolean> => {
  try {
    const response = await api.delete("/seat/unlock", { data: request });
    return response.data.success;
  } catch (error) {
    console.error("Error unlocking seats:", error);
    throw new Error("좌석 잠금 해제에 실패했습니다.");
  }
};