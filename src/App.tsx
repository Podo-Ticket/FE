import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";



import { AnimatePresence } from "framer-motion";

import PageWrapper from "./styles/animation/PageWrapper.tsx";
import PWABadge from "./PWABadge.tsx";

import Splash from "./pages/Splash.tsx";

import UserHome from "./pages/user/UserHome.tsx";
import OnSiteReserve from "./pages/user/OnSiteReserve.tsx";
import SelectSeats from "./pages/user/SelectSeats.tsx";
import TicketConfirmation from "./pages/user/TicketConfirmation.tsx";
import TicketScreen from "./pages/user/Ticket.tsx";
import SurveyLink from "./pages/user/SurveyLink.tsx";

import AdminAuth from "./pages/admin/AdminAuth.tsx";
import AdminHome from "./pages/admin/AdminHome.tsx";
import ManageLockingSeats from "./pages/admin/ManageLockingSeats.tsx";
import RealtimeSeats from "./pages/admin/RealtimeSeats.tsx";
import ReservedManange from "./pages/admin/ReservedManage.tsx";
import ReservedAdd from "./pages/admin/ReservedAdd.tsx";
import ReservedEdit from "./pages/admin/ReservedEdit.tsx";
import ReservedCheck from "./pages/admin/ReservedCheck.tsx";
import OnsiteManage from "./pages/admin/OnsiteManage.tsx";
import AdminSetting from "./pages/admin/AdminSetting.tsx";

import OnboardingModal from './components/modal/OnboardingModal.tsx';


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

  // 경로에 따른 온보딩 pageType 설정
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [isDontShowAgainChecked, setIsDontShowAgainChecked] = useState<boolean>(false);

  const getPageType = (pathname: string): number | null => {
    switch (pathname) {
      case "/home":
        return 0;
      case "/onsite":
        return 1;
      case "/home/realtime":
        return 2;
      case "/reserved":
        return 3;
      default:
        return null; // OnboardingModal을 렌더링하지 않음
    }
  };

  const pageType = getPageType(location.pathname);

  const getLocalStorageKey = (pageType: number | null): string | null => {
    if (pageType === null) return null;

    switch (pageType) {
      case 0:
        return "onboarding_home";
      case 1:
        return "onboarding_onsite";
      case 2:
        return "onboarding_realtime";
      case 3:
        return "onboarding_reserved";
      default:
        return null;
    }
  };

  useEffect(() => {
    if (pageType !== null) {
      const key = getLocalStorageKey(pageType);
      const isDismissed = localStorage.getItem(key || "") === "true";

      if (!isDismissed) {
        setShowOnboardingModal(true); // 모달 표시
      }
    }
  }, [pageType]);

  const handleDismissOnboarding = () => {
    const key = getLocalStorageKey(pageType);
    if (key && isDontShowAgainChecked) {
      localStorage.setItem(key, "true"); // 체크된 경우 로컬스토리지에 저장
    }
    setShowOnboardingModal(false); // 모달 닫기
    setIsDontShowAgainChecked(false); // 체크박스 초기화
  };

  // 스플래시 설정
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem("hasVisited");
  });

  useEffect(() => {
    if (!showSplash) return;
    localStorage.setItem("hasVisited", "true");
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
          <Route
            path="/select"
            element={
              <PageWrapper slideDirection="right">
                {" "}
                <SelectSeats />{" "}
              </PageWrapper>
            }
          />
          <Route
            path="/confirm"
            element={
              <PageWrapper slideDirection="left">
                {" "}
                <TicketConfirmation />{" "}
              </PageWrapper>
            }
          />
          <Route path="/ticket" element={<TicketScreen />} />

          <Route path="/adminAuth" element={<AdminAuth />} />

          <Route path="/home" element={<AdminHome />} />
          <Route path="/home/realtime" element={<RealtimeSeats />} />
          <Route path="/home/manage" element={<ManageLockingSeats />} />

          <Route path="/reserved" element={<ReservedManange />} />
          <Route path="/reserved/add" element={<ReservedAdd />} />
          <Route path="/reserved/check" element={<ReservedCheck />} />
          <Route path="/reserved/check/edit" element={<ReservedEdit />} />

          <Route path="/onsite" element={<OnsiteManage />} />
          <Route path="/setting" element={<AdminSetting />} />

          <Route path="/survey" element={<SurveyLink />} />
        </Routes>

      </AnimatePresence>

      {pageType !== null && (
        <OnboardingModal
          showOnboardingModal={showOnboardingModal}
          pageType={pageType}
          onDismissFunc={handleDismissOnboarding}
          isDontShowAgainChecked={isDontShowAgainChecked}
          setIsDontShowAgainChecked={setIsDontShowAgainChecked}
        />
      )}

      <PWABadge />
    </>
  );
}


export default App;

