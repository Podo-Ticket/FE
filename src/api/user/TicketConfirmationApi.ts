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

interface TicketInfo {
  title: string;
  date: string;
  poster: string;
  location: string;
  seats: string[];
}

// 티켓 정보 가져오기 API
export const fetchTicketingInfo = async (selectedSeats: string[]): Promise<TicketInfo> => {
  try {
    const response = await api.get('/seat/ticketing');
    const playInfo = response.data.play[0];

    return {
      title: playInfo.play.title,
      date: playInfo.date_time,
      poster: playInfo.play.poster,
      location: "광운대학교 새빛관 대강의실",
      seats: selectedSeats,
    };
  } catch (error) {
    console.error('Error fetching ticketing info:', error);
    throw new Error('티켓 정보를 가져오는 데 실패했습니다.');
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