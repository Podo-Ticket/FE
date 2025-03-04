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

// 현재 해당 공연 GET Api
export const fetchPlayInfo = async (playId: number) => {
  try {
    const response = await api.get(`/`, { params: { playId } });

    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching play info:', error);
    throw error;
  }
};

// 핸드폰 번호 체크 Api
export const checkPhoneNumber = async (phoneNumber: string, scheduleId: number) => {
  try {
    const response = await api.get(`/user/check`, {
      params: { phoneNumber, scheduleId },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error checking phone number:', error);
    throw error;
  }
};