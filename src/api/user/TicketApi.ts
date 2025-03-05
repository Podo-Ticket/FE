import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

import { DateUtil } from "../../utils/DateUtil";

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: apiUrl, // Use environment variables
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 티켓 정보 가져오기 API
export const fetchTickets = async () => {
  try {
    const response = await api.get("/ticket/info");

    console.log("response : ", response);

    // 티켓 데이터를 포맷팅하여 반환
    const formattedTickets = response.data.seats.map((seat: any) => ({
      id: `${seat.row}${seat.number}`, // 각 티켓의 ID 생성
      title: seat.schedule.play.title,
      location: seat.schedule.play.location, // 고정된 공연장 이름
      dateTime: DateUtil.formatDate(seat.schedule.date_time), // 날짜 형식 변환
      seat: `${seat.row} ${seat.number}`, // 좌석 정보
      runningTime: seat.schedule.play.running_time,
      image: "https://via.placeholder.com/150", // 포스터 이미지 (임시 URL)
    }));

    const isOnSite = response.data.onSite;

    return {
      tickets: formattedTickets,
      isSurveyed: response.data.isSurvey, // 설문 여부 반환
      isOnSite,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("티켓 정보를 가져오는 데 실패했습니다.");
  }
};

// 평가 데이터를 서버에 전송 API
export const submitEvaluation = async (rating: number): Promise<boolean> => {
  try {
    const response = await api.post(`/survey/question1`, { answer: rating });

    return response.data.success;
  } catch (error: any) {
    console.error("Error submitting evaluation:", error);
    throw error.response?.data?.error || "예기치 않은 오류가 발생했습니다.";
  }
};

// 추천 의향 데이터를 서버에 전송 API
export const submitRecommand = async (rating: number): Promise<boolean> => {
  try {
    const response = await api.post(`/survey/question2`, { answer: rating });

    return response.data.success;
  } catch (error: any) {
    console.error("Error submitting evaluation:", error);
    throw error.response?.data?.error || "예기치 않은 오류가 발생했습니다.";
  }
};
