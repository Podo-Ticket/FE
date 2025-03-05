import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import ProtectedRoute from "./utils/ProtectedRoute.tsx";

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

import OnboardingModal from "./components/modal/OnboardingModal.tsx";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
<<<<<<< HEAD
=======
       
>>>>>>> eae279f (✨feat: setting pwa download)
        font-family: Pretendard;
        height: 100%;
    }
`;

function App() {
  const location = useLocation();

  // 경로에 따른 온보딩 pageType 설정
  const [showOnboardingModal, setShowOnboardingModal] =
    useState<boolean>(false);
  const [isDontShowAgainChecked, setIsDontShowAgainChecked] =
    useState<boolean>(false);

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

  // 온보딩 모달 출현시 외부 스크롤 금지
  useEffect(() => {
    if (showOnboardingModal) {
      document.body.style.overflow = "hidden"; // 스크롤 비활성화
    } else {
      document.body.style.overflow = "auto"; // 스크롤 활성화
    }

    return () => {
      document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 복구
    };
  }, [showOnboardingModal]);

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
          {/* User Routes */}
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

          {/* Admin Routes */}
          <Route path="/adminAuth" element={<AdminAuth />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/realtime"
            element={
              <ProtectedRoute>
                <RealtimeSeats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/manage"
            element={
              <ProtectedRoute>
                <ManageLockingSeats />
              </ProtectedRoute>
            }
          />

          {/* Reserved Routes */}
          <Route
            path="/reserved"
            element={
              <ProtectedRoute>
                <ReservedManange />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserved/add"
            element={
              <ProtectedRoute>
                <ReservedAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserved/check"
            element={
              <ProtectedRoute>
                <ReservedCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserved/check/edit"
            element={
              <ProtectedRoute>
                <ReservedEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onsite"
            element={
              <ProtectedRoute>
                <OnsiteManage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <AdminSetting />
              </ProtectedRoute>
            }
          />

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
