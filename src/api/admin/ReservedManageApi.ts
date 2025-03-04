import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: apiUrl, // Use environment variables
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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
export const fetchReservedUserList = async (
  scheduleId: string
): Promise<FetchUserListResponse> => {
  try {
    const response = await api.get<FetchUserListResponse>("/user/list", {
      params: { scheduleId }, // Query 파라미터 전달
    });
    return response.data; // 전체 응답 데이터 반환
  } catch (error: any) {
    console.error("Error fetching user list:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch user list");
  }
};

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

export interface ReservationRequest {
  name: string;
  phoneNumber: string;
  headCount: number;
  scheduleId: number;
}

interface ReservationResponse {
  success: boolean;
  error?: string;
}

// 예매 추가
export const addReservation = async (
  reservationData: ReservationRequest
): Promise<ReservationResponse> => {
  try {
    const response = await api.post<ReservationResponse>(
      "/user/admin",
      reservationData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error reserving ticket:", error);
    throw new Error(error.response?.data?.error || "Failed to reserve ticket");
  }
};

export interface ReservationInfo {
  name: string;
  phone_number: string;
  head_count: number;
  schedule_id: number;
  state: true;
  schedule: {
    date_time: string;
  };
  error?: string;
}

// 현장 예매 정보 가져오기
export const fetchReservationInfo = async (
  scheduleId: number,
  userId: bigint
): Promise<ReservationInfo> => {
  try {
    const response = await api.get<ReservationInfo>("/user/info", {
      params: { scheduleId, userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching reservation info:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch reservation info"
    );
  }
};

export interface ReservationDelete {
  success: boolean;
  error?: string;
}

export const deleteReservation = async (
  userId: bigint
): Promise<ReservationDelete> => {
  try {
    const response = await api.delete<ReservationDelete>("/user/delete", {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching reservation delete:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch reservation delete"
    );
  }
};

export interface EditRequest {
  userId: bigint;
  name: string;
  phoneNumber: string;
  headCount: number;
  scheduleId: number;
}

interface EditResponse {
  success: boolean;
  error?: string;
}

export const editReservation = async (
  editData: EditRequest
): Promise<EditResponse> => {
  try {
    const response = await api.patch<EditResponse>("/user/update", editData);

    return response.data;
  } catch (error: any) {
    console.error("Error EditReservation:", error);
    throw new Error(error.response?.data?.error || "Failed to reserve ticket");
  }

};
