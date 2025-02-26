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

interface FetchUserListResponse {
    total: number; // 총 사용자 수
    ticketingCnt: number; // 티켓팅 완료 사용자 수
    users: User[]; // 사용자 리스트
}

export interface User {
    id: number;
    name: string;
    phone_number: string;
    head_count: number;
    state: boolean;
}

// 사용자 리스트 가져오기
export const fetchReservedUserList = async (scheduleId: string): Promise<FetchUserListResponse> => {
    try {
        const response = await api.get<FetchUserListResponse>("/user/list", {
            params: { scheduleId }, // Query 파라미터 전달
        });
        return response.data; // 전체 응답 데이터 반환
    } catch (error: any) {
        console.error("Error fetching user list:", error);
        throw new Error(
            error.response?.data?.error || "Failed to fetch user list"
        );
    }
};

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