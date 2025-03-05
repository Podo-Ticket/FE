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
export const fetchAdminSeats = async (scheduleId: number) => {
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

// 해당하는 좌석의 관객정보 가져오기
export const fetchSeatAudience = async (scheduleId: number, seatId: string) => {
    try {
      const response = await api.get("/seat/audience", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          scheduleId,
          seatId,
        },
      });
  
      return response.data; // API 응답 데이터 반환
    } catch (error: any) {
      console.error("Error fetching seat audience:", error);
      throw new Error("좌석 정보를 가져오는 데 실패했습니다.");
    }
  };