import React, { useState } from "react";
import styled from "styled-components";

import PulseLoader from "react-spinners/PulseLoader";
import waitReserve from "../../assets/images/wait_reserve_icon.png";

interface LoadingModalProps {
  showLoading: boolean;
  isOnSiteReserve?: boolean;
}

const Loading: React.FC<LoadingModalProps> = ({
  showLoading,
  isOnSiteReserve = false,
}) => {
  const [color] = useState<string>("#6A39C0");

  if (!showLoading) return null;

  return (
    <>
      <ModalOverlay>
        {isOnSiteReserve ? (
          <ModalContentReserve>
            <img
              src={waitReserve}
              alt="대기 아이콘"
              className="modal-content-load-icon"
            />
            <p className="Podo-Ticket-Headline-H3">예매 수락 대기 중</p>
            <span className="Podo-Ticket-Body-B5">
              관리자가 내역을 확인 중입니다.
            </span>
            <PulseLoader
              color={color}
              size={13}
              loading={showLoading}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </ModalContentReserve>
        ) : (
          <ModalContentLoad>
            <PulseLoader
              color={color}
              size={21}
              loading={showLoading}
              aria-label="Loading Spinner"
              data-testid="loader"
              style={{ position: "absolute" }}
            />
          </ModalContentLoad>
        )}
      </ModalOverlay>
    </>
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
  z-index: 1000;
`;

const ModalContentLoad = styled.div`
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
    border-radius: 15px;
  }
  @media (min-resolution: 3dppx) {
    width: 140px;
    height: 140px;
    border-radius: 10px;
  }
`;

const ModalContentReserve = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: var(--ect-white);
  border-radius: 10px;

  padding: 30px 35px;
  padding-bottom: 5px;

  @media (max-resolution: 2dppx) {
    border-radius: 15px;
    padding: 45px 52.5px;
    padding-bottom: 7.5px;
  }
  @media (min-resolution: 3dppx) {
    border-radius: 10px;
    padding: 30px 35px;
    padding-bottom: 5px;
  }

  img {
    width: 50px; /* 아이콘 크기 설정 */
    height: auto;
    margin-bottom: 20px;
    @media (max-resolution: 2dppx) {
      width: 75px; /* 아이콘 크기 설정 */
      margin-bottom: 30px;
    }
    @media (min-resolution: 3dppx) {
      width: 50px; /* 아이콘 크기 설정 */
      margin-bottom: 20px;
    }
  }

  p {
    margin-bottom: 5px;

    color: var(--grey-7);
    @media (max-resolution: 2dppx) {
      margin-bottom: 7.5px;
    }
    @media (min-resolution: 3dppx) {
      margin-bottom: 5px;
    }
  }

  span {
    margin-bottom: 30px;

    color: var(--grey-5);
    @media (max-resolution: 2dppx) {
      margin-bottom: 45px;
    }
    @media (min-resolution: 3dppx) {
      margin-bottom: 30px;
    }
  }
`;
