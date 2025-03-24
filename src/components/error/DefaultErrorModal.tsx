import React, { useState } from "react";
import styled from "styled-components";

import errorIcon from "../../assets/images/circle_error.png";
import successIcon from "../../assets/images/check_icon.png";

import { fadeIn, fadeOut } from "../../styles/animation/DefaultAnimation.ts";

interface DefaultErrorModalProps {
  showDefaultErrorModal: boolean;
  errorMessage: string;
  onAcceptFunc: () => void;
  isSuccess?: boolean;
  aboveButton?: boolean;
  OnTopSide?: boolean;
}

const DefaultErrorModal: React.FC<DefaultErrorModalProps> = ({
  showDefaultErrorModal,
  errorMessage,
  onAcceptFunc,
  aboveButton = false,
  isSuccess = false,
  OnTopSide = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showDefaultErrorModal && !isClosing) return null;

  const handleOverlayClick = () => {
    setIsClosing(true); // 페이드아웃 애니메이션 시작
    setTimeout(() => {
      setIsClosing(false); // 상태 초기화
      onAcceptFunc(); // 애니메이션 종료 후 닫기 함수 호출
    }, 150); // 애니메이션 시간과 동일하게 설정
  };

  return (
    <Overlay onClick={handleOverlayClick} OnTopSide={OnTopSide}>
      {OnTopSide ? undefined : <div style={{ height: "540px" }}></div>}
      <Content isClosing={isClosing} isSuccess={isSuccess}>
        {isSuccess ? (
          <ContentIcon src={successIcon} />
        ) : (
          <ContentIcon src={errorIcon} />
        )}
        <ContentText className="Podo-Ticket-Body-B6">
          {errorMessage}
        </ContentText>
      </Content>
      {aboveButton ? <div style={{ height: "130px" }}></div> : undefined}
      {OnTopSide ? <div style={{ height: "400px" }}></div> : undefined}
    </Overlay>
  );
};

export default DefaultErrorModal;

const Overlay = styled.div<{ OnTopSide: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  z-index: 10000;
`;

const Content = styled.div<{ isClosing: boolean; isSuccess: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  width: 20.44rem;
  border-radius: 10px;
  border: 1px solid var(--red-2);
  background: ${({ isSuccess }) =>
    isSuccess ? "var(--purple-40)" : "var(--red-3)"};
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.3);

  gap: 9px;
  padding: 9px 0;

  text-align: center;
  color: var(--red-1);

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.2s
    ease-in-out;

  @media (max-resolution: 2dppx) {
    width: 30.66rem;
    border-radius: 15px;
    gap: 13.5px;
    padding: 13.5px 0;
  }
  @media (min-resolution: 3dppx) {
    width: 20.44rem;
    border-radius: 10px;
    gap: 9px;
    padding: 9px 0;
  }
`;

const ContentIcon = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 14px;
  weight: 14px;

  @media (max-resolution: 2dppx) {
    width: 21px;
    weight: 21px;
  }
  @media (min-resolution: 3dppx) {
    width: 14px;
    weight: 14px;
  }
`;

const ContentText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
