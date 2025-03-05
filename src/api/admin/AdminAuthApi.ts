import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: apiUrl, // Use environment variables
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 세션 쿠키 포함
});

// 어드민 인증 코드 확인 API
export const verifyAdminCode = async (adminCode: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.get(`/admin`, {
      params: {
        code: adminCode,
      },
    });

    return response.data; // 성공 시 응답 데이터 반환
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      throw new Error(error.response.data.error); // 서버에서 반환한 에러 메시지
    } else {
      throw new Error("API 호출 중 오류가 발생했습니다."); // 일반적인 에러 메시지
    }
  }
};

export interface PerformanceInfo {
  id: number;
  date_time: string;
  user: number;
  booked: number;
}

// 다음 공연이 여부에 따른 구분
export interface AdminEnterResponse {
  info: PerformanceInfo[] | null;
}

// 어드민 메인화면 API
export const fetchAdminEnter = async (): Promise<AdminEnterResponse> => {
  try {
    const response = await api.get<AdminEnterResponse>(`/admin/main`);

    return response.data; // 성공 시 응답 데이터 반환
  } catch (error: any) {
    console.error("🚨 서버 내부 오류 발생:", error);
    if (error.response && error.response.data.error) {
      throw new Error(error.response.data.error); // 서버에서 반환한 에러 메시지
    } else {
      throw new Error("어드민 메인 API 호출 중 오류가 발생했습니다."); // 일반적인 에러 메시지
    }
  }
};

// 어드민 세션 인증 가능 유무 확인 API
export const verifyAdminSession = async (): Promise<{ session: boolean }> => {
  try {
    const response = await api.get(`/admin/check`);

    return response.data; // 성공 시 응답 데이터 반환
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      throw new Error(error.response.data); // 서버에서 반환한 에러 메시지
    } else {
      throw new Error("API 호출 중 오류가 발생했습니다."); // 일반적인 에러 메시지
    }
  }
};