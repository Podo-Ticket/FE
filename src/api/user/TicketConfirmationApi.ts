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

interface Seat {
  row: string;
  number: string;
  schedule_id: number;
}

interface Play {
  date_time: string;
  play: {
    title: string;
    poster: string;
    location: string;
  };
}

interface TicketingApiResponse {
  play: Play[];
  seats: Seat[];
}

export interface TicketInfo {
  title: string;
  date: string;
  poster: string;
  location: string;
  seats: string;
}

// 좌석 선택 중인 티켓 정보 가져오기 API
export const fetchTicketingInfo = async (): Promise<TicketInfo> => {
  try {
    const response = await api.get<TicketingApiResponse>('/seat/ticketing');
    console.log("response in ticketing api: ", response);

    const playInfo = response.data.play[0];
    const seats = response.data.seats.map((seat) => `${seat.row}${seat.number}`).join(", ");

    return {
      title: playInfo.play.title,
      date: playInfo.date_time,
      poster: playInfo.play.poster,
      location: playInfo.play.location,
      seats,
    };
  } catch (error) {
    console.error('Error fetching ticketing info:', error);
    throw new Error('티켓 정보를 가져오는 데 실패했습니다.');
  }
};

// 좌석 선택 취소 API
export const cancelSeatSelection = async (): Promise<boolean> => {
  try {
    const response = await api.delete(`/seat/back`);

    return response.data.success; // 성공 여부 반환
  } catch (error) {
    console.error('Error cancelling seat selection:', error);
    throw new Error('발권 신청을 취소하는 데 실패했습니다.');
  }
};

// 티켓 발권 API
export const handleTicketIssuance = async (selectedSeats: string[]): Promise<boolean> => {
  try {
    const response = await api.patch('/seat/ticketing', { seats: selectedSeats });

    if (response.data.success) {
      return true; // 발권 성공
    } else {
      throw new Error('티켓 발권에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error issuing ticket:', error);
    throw new Error('티켓 발권에 실패했습니다.');
  }
};