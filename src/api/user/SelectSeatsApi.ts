import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // 환경 변수에서 API URL 가져오기

const api = axios.create({
  baseURL: apiUrl, // 기본 URL 설정
  timeout: 10000, // 요청 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 좌석 정보 가져오기 API
export const fetchSeats = async (scheduleId: number) => {
  try {
    const response = await api.get('/seat', {
      params: { scheduleId }, // 스케줄 ID를 쿼리 파라미터로 전달
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw new Error('좌석 정보를 가져오는 데 실패했습니다.');
  }
};

// 좌석 확인 API
export const checkSeats = async (scheduleId: number, selectedSeats: string[]) => {
  try {
    const seats = selectedSeats.map((seat) => {
      const row = seat.slice(0, 2); // 좌석 ID의 첫 두 문자를 행으로 설정
      const column = parseInt(seat.slice(2)); // 나머지 부분을 숫자로 변환하여 column으로 설정

      return { row, number: column }; // 객체 형식으로 변환
    });

    const encodedSeats = encodeURIComponent(JSON.stringify(seats));

    const response = await api.get('/seat/check', {
      params: {
        scheduleId,
        seats: encodedSeats,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error checking seats:', error);
    throw new Error('좌석 확인에 실패했습니다.');
  }
};
