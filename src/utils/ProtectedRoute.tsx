import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyAdminSession } from "../api/admin/AdminAuthApi";
import NoticeModal from "../components/modal/NoticeModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // 세션 확인 중 로딩 상태
  const [isSessionValid, setIsSessionValid] = useState(false); // 세션 유효성 상태
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await verifyAdminSession(); // 세션 확인 API 호출
        setIsSessionValid(response.session); // 세션 유효성 설정
      } catch (error) {
        console.error("세션 확인 중 오류 발생:", error);
        setIsSessionValid(false); // 세션이 유효하지 않음으로 설정
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <div></div>; // 로딩 상태 표시
  }

  if (!isSessionValid) {
    return <Navigate to="/adminAuth" replace />; // 세션이 만료된 경우 리디렉션
  }

  return <>
    {showNoticeModal && (
      <NoticeModal
        showNoticeModal={true}
        title="인증코드를 다시 입력해주세요!"
        description="세션이 만료되었습니다."
        onAcceptFunc={() => setShowNoticeModal(false)}
        buttonContent="확인"
      />
    )}
    {isSessionValid && children}</>; // 세션이 유효한 경우 자식 컴포넌트 렌더링
};

export default ProtectedRoute;