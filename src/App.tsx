import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { AnimatePresence } from 'framer-motion';

import PageWrapper from './styles/animation/PageWrapper.tsx';
import PWABadge from './PWABadge.tsx'

import Splash from './pages/Splash.tsx';

import UserHome from './pages/user/UserHome.tsx';
import OnSiteReserve from './pages/user/OnSiteReserve.tsx';
import SelectSeats from './pages/user/SelectSeats.tsx';
import TicketConfirmation from './pages/user/TicketConfirmation.tsx';
import TicketScreen from './pages/user/Ticket.tsx';
import SurveyLink from './pages/user/SurveyLink.tsx';

import AdminAuth from './pages/admin/AdminAuth.tsx'
import AdminHome from './pages/admin/AdminHome.tsx'
import ManageLockingSeats from './pages/admin/ManageLockingSeats.tsx';
import RealtimeSeats from './pages/admin/RealtimeSeats.tsx'
import ReservedManange from './pages/admin/ReservedManage.tsx'
import ReservedAdd from './pages/admin/ReservedAdd.tsx'
import OnsiteManage from './pages/admin/OnsiteManage.tsx'
import AdminSetting from './pages/admin/AdminSetting.tsx'

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
       background-color: var(--black-20); 
        font-family: Pretendard;
        height: 100%;
    }
`;

function App() {
  const location = useLocation();

  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('hasVisited');
  });

  useEffect(() => {
    if (!showSplash) return;
    localStorage.setItem('hasVisited', 'true');
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, [showSplash]);

  const handleSplashFinish = () => setShowSplash(false); // Splash 종료 핸들러

  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />; // Splash 화면 렌더링
  }

  return (
    <>
      <GlobalStyle />

      <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<UserHome />} />
            <Route path="/reserve" element={<OnSiteReserve />} />
            <Route path="/select" element={ <PageWrapper slideDirection="right"> <SelectSeats /> </PageWrapper> }/>
            <Route path="/confirm" element={ <PageWrapper slideDirection="left"> <TicketConfirmation /> </PageWrapper> } />
            <Route path="/ticket" element={<TicketScreen />} />

            <Route path="/adminAuth" element={<AdminAuth/>} />

            <Route path="/home" element={<AdminHome/>} />
            <Route path="/home/realtime" element={<RealtimeSeats/>} />
            <Route path="/home/manage" element={<ManageLockingSeats/>} />

            <Route path="/reserved" element={<ReservedManange/>} />
            <Route path="/reservedAdd" element={<ReservedAdd/>} />
            <Route path="/onsite" element={<OnsiteManage/>} />
            <Route path="/setting" element={<AdminSetting/>} />

            <Route path="/survey" element={<SurveyLink/>} />

          </Routes>
      </AnimatePresence>

      <PWABadge />
    </>
  )
}

export default App