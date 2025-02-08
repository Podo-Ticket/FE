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
            <Route path="/select" element={ <PageWrapper slideDirection="left"> <SelectSeats /> </PageWrapper> }/>
            <Route path="/confirm" element={ <PageWrapper slideDirection="right"> <TicketConfirmation /> </PageWrapper> } />
            <Route path="/ticket" element={<TicketScreen />} />
          </Routes>
      </AnimatePresence>

      <PWABadge />
    </>
  )
}

export default App
