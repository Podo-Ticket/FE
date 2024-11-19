import React, { createContext, useContext, useState } from 'react';

const ScheduleContext = createContext();

// Provider 컴포넌트
export const ScheduleProvider = ({ children }) => {
  const [scheduleId, setScheduleId] = useState(null);

  return (
    <ScheduleContext.Provider value={{ scheduleId, setScheduleId }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook
export const useSchedule = () => {
  return useContext(ScheduleContext); // useContext를 사용하여 ScheduleContext의 값을 반환
};