import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {verifyAdminSession} from '../api/admin/AdminAuthApi';

import NoticeModal from '@components/common/modals/NoticeModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState(true); // 세션 확인 중 로딩 상태
  const [isSessionValid, setIsSessionValid] = useState(false); // 세션 유효성 상태
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [redirect, setRedirect] = useState(false); // 확인 후 리다이렉트 여부
  const [firstCheckDone, setFirstCheckDone] = useState(false); //  첫 체크 이후 모달 띄움

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await verifyAdminSession(); // 세션 확인 API 호출
        setIsSessionValid(response.session); // 세션 유효성 설정
        if (!response.session && firstCheckDone) {
          setShowNoticeModal(true); // 세션 만료 시 모달 띄움
        }
      } catch (error) {
        setIsSessionValid(false); // 세션이 유효하지 않음으로 설정
        if (firstCheckDone) {
          setShowNoticeModal(true);
        }
      } finally {
        setIsLoading(false); // 로딩 완료'
        setFirstCheckDone(true); // 첫 체크 완료 표시
      }
    };

    checkSession();
  }, [firstCheckDone]);

  if (isLoading) return <div />;

  if (redirect) {
    return <Navigate to='/adminAuth' replace />;
  }

  if (!isSessionValid) {
    return (
      <>
        {showNoticeModal && (
          <NoticeModal
            showNoticeModal={true}
            title='인증코드를 다시 입력해주세요!'
            description='세션이 만료되었습니다.'
            onAcceptFunc={() => {
              setShowNoticeModal(false);
              setRedirect(true); // 모달 닫은 뒤 리다이렉트
            }}
            buttonContent='확인'
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
