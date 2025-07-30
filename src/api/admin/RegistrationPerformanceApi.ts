import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

interface Schedule {
  dateTime: string;
  availableSeats: number;
}

interface PostRegistrationPerformanceProps {
  title: string;
  en_title: string;
  location: string;
  en_location: string;
  poster: string;
  runningTime: number;
  price: number;
  schedules: Schedule[];
}

export const postRegistrationPerformance = async (formData: FormData) => {
  try {
    const response = await axios.post(`${apiUrl}/play/post`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // 인증 필요하면 유지
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to play post');
  }
};
