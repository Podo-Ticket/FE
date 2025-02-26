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

interface FetchOnsiteUserListResponse {
    total: number; // 총 사용자 수
    approvalCnt: number; // 수락 완료 사용자 수
    users: UserWithApproval[]; // 승인 여부와 사용자 정보를 포함한 리스트
}

export interface UserWithApproval {
    approve: boolean; // 승인 여부
    user: User; // 사용자 정보
}

export interface User {
    id: number; // 사용자 ID
    name: string; // 사용자 이름
    phone_number: string; // 연락처
    head_count: number; // 좌석 수
}

// 사용자 리스트 가져오기
export const fetchOnsiteUserList = async (scheduleId: number): Promise<FetchOnsiteUserListResponse> => {
    try {
        const response = await api.get<FetchOnsiteUserListResponse>("/reservation/admin", {
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

// 승인 요청/거절 API
export const approveOnsite = async (userIds: number[], scheduleId: number, check: boolean): Promise<{ accept: boolean; error?: string }> => {
    try {
        const response = await api.patch('/reservation/approve', { userIds, scheduleId, check }, {
            withCredentials: true, // 세션 쿠키 포함
        });
        console.log("approveOnsite result: ", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data.error) {
            throw new Error(error.response.data.error); // 서버에서 반환한 에러 메시지
        } else {
            throw new Error('API 호출 중 오류가 발생했습니다.'); // 일반적인 에러 메시지
        }
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