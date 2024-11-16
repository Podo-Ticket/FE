import React, { createContext, useContext, useState } from 'react';

// BookingContext 생성
const BookingContext = createContext();

// Provider 컴포넌트
export const BookingProvider = ({ children }) => {
  const [bookingInfo, setBookingInfo] = useState(null);

  return (
    <BookingContext.Provider value={{ bookingInfo, setBookingInfo }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook
export const useBooking = () => {
  return useContext(BookingContext);
};