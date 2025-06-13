import {useState, useEffect} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import {createGlobalStyle} from 'styled-components';
import socket from './api/socket';

import ProtectedRoute from './utils/ProtectedRoute.tsx';

import {AnimatePresence} from 'framer-motion';
import {useForceLogoutStore} from './store/useForceLogoutStore';

import PageWrapper from './styles/animation/PageWrapper.tsx';
import ScrollLockWrapper from './components/layout/wrappers/ScrollLockWrapper.tsx';
import PWABadge from './PWABadge.tsx';

import Splash from './pages/Splash.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

import UserHome from './pages/user/UserHome.tsx';
import IssueTicket from './pages/user/IssueTicket.tsx';
import OnSiteReserve from './pages/user/OnSiteReserve.tsx';
import SelectSeats from './pages/user/SelectSeats.tsx';
import TicketConfirmation from './pages/user/TicketConfirmation.tsx';
import TicketScreen from './pages/user/Ticket.tsx';
import SurveyLink from './pages/user/SurveyLink.tsx';

import AdminAuth from './pages/admin/AdminAuth.tsx';
import AdminHome from './pages/admin/AdminHome.tsx';
import ManageLockingSeats from './pages/admin/ManageLockingSeats.tsx';
import RealtimeSeats from './pages/admin/RealtimeSeats.tsx';
import ReservedManange from './pages/admin/ReservedManage.tsx';
import ReservedAdd from './pages/admin/ReservedAdd.tsx';
import ReservedEdit from './pages/admin/ReservedEdit.tsx';
import ReservedCheck from './pages/admin/ReservedCheck.tsx';
import OnsiteManage from './pages/admin/OnsiteManage.tsx';
import AdminSetting from './pages/admin/AdminSetting.tsx';

import OnboardingModal from './components/common/modals/OnboardingModal.tsx';
import ForceLogoutModal from './components/pages/customer/userHome/ForceLogoutModal.tsx';

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        touch-action: manipulation;
    }

    body {
       
        font-family: Pretendard;
        height: 100%;
    }
`;

function App() {
  const location = useLocation();
  const {openModal} = useForceLogoutStore();

  useEffect(() => {
    const handleForceLogout = (data: {message?: string}) => {
      openModal(data.message);
      if (window.location.pathname == '/confirm') {
        localStorage.setItem('isForceLogout', 'true');
      }
    };

    socket.on('forceLogout', handleForceLogout);

    return () => {
      socket.off('forceLogout', handleForceLogout);
    };
  }, [openModal]);

  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [isDontShowAgainChecked, setIsDontShowAgainChecked] = useState<boolean>(false);

  const getPageType = (pathname: string): number | null => {
    switch (pathname) {
      case '/home':
        return 0;
      case '/onsite':
        return 1;
      case '/home/realtime':
        return 2;
      case '/reserved':
        return 3;
      default:
        return null;
    }
  };

  const pageType = getPageType(location.pathname);

  const getLocalStorageKey = (pageType: number | null): string | null => {
    if (pageType === null) return null;

    switch (pageType) {
      case 0:
        return 'onboarding_home';
      case 1:
        return 'onboarding_onsite';
      case 2:
        return 'onboarding_realtime';
      case 3:
        return 'onboarding_reserved';
      default:
        return null;
    }
  };

  useEffect(() => {
    if (pageType !== null) {
      const key = getLocalStorageKey(pageType);
      const isDismissed = localStorage.getItem(key || '') === 'true';

      if (!isDismissed) setShowOnboardingModal(true);
    }
  }, [pageType]);
  const handleDismissOnboarding = () => {
    const key = getLocalStorageKey(pageType);
    if (key && isDontShowAgainChecked) {
      localStorage.setItem(key, 'true');
    }
    setShowOnboardingModal(false);
    setIsDontShowAgainChecked(false);
  };
  useEffect(() => {
    if (showOnboardingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showOnboardingModal]);

  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('hasVisited');
  });
  useEffect(() => {
    if (!showSplash) return;
    localStorage.setItem('hasVisited', 'true');
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, [showSplash]);
  const handleSplashFinish = () => setShowSplash(false);
  if (showSplash) return <Splash onFinish={handleSplashFinish} />;

  return (
    <>
      <GlobalStyle />

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          {/* User Routes */}
          <Route
            path='/'
            element={
              <ScrollLockWrapper>
                <UserHome />
              </ScrollLockWrapper>
            }
          />
          <Route
            path='issue-ticket'
            element={
              <ScrollLockWrapper>
                <IssueTicket />
              </ScrollLockWrapper>
            }
          />
          <Route path='/reserve' element={<OnSiteReserve />} />
          <Route
            path='/select'
            element={
              <ScrollLockWrapper>
                <PageWrapper slideDirection='right'>
                  <SelectSeats />{' '}
                </PageWrapper>
              </ScrollLockWrapper>
            }
          />
          <Route
            path='/confirm'
            element={
              <PageWrapper slideDirection='left'>
                {' '}
                <TicketConfirmation />{' '}
              </PageWrapper>
            }
          />
          <Route
            path='/ticket'
            element={
              <ScrollLockWrapper>
                <TicketScreen />
              </ScrollLockWrapper>
            }
          />

          {/* Admin Routes */}
          <Route
            path='/adminAuth'
            element={
              <ScrollLockWrapper>
                <AdminAuth />
              </ScrollLockWrapper>
            }
          />

          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <ScrollLockWrapper>
                  <AdminHome />
                </ScrollLockWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/home/realtime'
            element={
              <ProtectedRoute>
                <ScrollLockWrapper>
                  <RealtimeSeats />
                </ScrollLockWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/home/manage'
            element={
              <ProtectedRoute>
                <ScrollLockWrapper>
                  <ManageLockingSeats />
                </ScrollLockWrapper>
              </ProtectedRoute>
            }
          />

          {/* Reserved Routes */}
          <Route
            path='/reserved'
            element={
              <ProtectedRoute>
                <ReservedManange />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reserved/add'
            element={
              <ProtectedRoute>
                <ReservedAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reserved/check'
            element={
              <ProtectedRoute>
                <ReservedCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reserved/check/edit'
            element={
              <ProtectedRoute>
                <ReservedEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path='/onsite'
            element={
              <ProtectedRoute>
                <OnsiteManage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/setting'
            element={
              <ProtectedRoute>
                <ScrollLockWrapper>
                  <AdminSetting />
                </ScrollLockWrapper>
              </ProtectedRoute>
            }
          />

          <Route path='/survey' element={<SurveyLink />} />

          <Route path='*' element={<NotFoundPage />} />
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

      <ForceLogoutModal />
      <PWABadge />
    </>
  );
}

export default App;
