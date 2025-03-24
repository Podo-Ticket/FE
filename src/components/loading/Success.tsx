import React from "react";
import styled from "styled-components";

import checkIcon from "../../assets/images/check_icon.png";

interface LoadingModalProps {
  showSuccess: boolean;
}

const Loading: React.FC<LoadingModalProps> = ({ showSuccess }) => {
  if (!showSuccess) return null;

  return (
    <ModalOverlay>
      <CompleteModal>
        <CheckIcon src={checkIcon} alt="완료 아이콘" />
      </CompleteModal>
    </ModalOverlay>
  );
};

export default Loading;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const CompleteModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 140px;
  height: 140px;
  border-radius: 10px;
  background: var(--ect-white);

  @media (max-resolution: 2dppx) {
    width: 210px;
    height: 210px;
    border-radius: 10px;
  }
  @media (min-resolution: 3dppx) {
    width: 140px;
    height: 140px;
    border-radius: 10px;
  }
`;

const CheckIcon = styled.img`
  position: absolute;

  width: 62px;
  height: 62px;

  @media (max-resolution: 2dppx) {
    width: 93px;
    height: 93px;
  }
  @media (min-resolution: 3dppx) {
    width: 62px;
    height: 62px;
  }
`;
