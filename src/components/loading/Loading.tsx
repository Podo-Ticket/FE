import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import PulseLoader from "react-spinners/PulseLoader";
import waitReserve from "../../assets/images/wait_reserve_icon.png";

import checkIcon from '../../assets/images/check_icon.png';

interface LoadingModalProps {
    showLoading: boolean;
    isOnSiteReserve?: boolean;
}

const Loading: React.FC<LoadingModalProps> = ({ showLoading, isOnSiteReserve = false }) => {
    const [color] = useState<string>("#6A39C0");
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    useEffect(() => {
        if (!showLoading) {
            setShowCompleteModal(true);
            const timeout = setTimeout(() => {
                setShowCompleteModal(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [showLoading]);

    if (!showLoading && !showCompleteModal) return null;

    return (
        <>
            <ModalOverlay>
                {isOnSiteReserve ? (
                    <ModalContentReserve>
                        <img src={waitReserve} alt="대기 아이콘" className="modal-content-load-icon" />
                        <p>예매 수락 대기 중</p>
                        <span>관리자가 내역을 확인 중입니다.</span>
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
                        />
                    </ModalContentLoad>
                )}
            </ModalOverlay>

            {/* Complete Modal */}
            {showCompleteModal && (
                <CompleteModal>
                    <CheckIcon src={checkIcon} alt="완료 아이콘" />
                </CompleteModal>
            )}
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
  z-index: 100;
`;

const ModalContentLoad = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContentReserve = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 50px; /* 아이콘 크기 설정 */
    height: auto;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333; /* 텍스트 색상 */
  }

  span {
    font-size: 14px;
    color: #777; /* 서브 텍스트 색상 */
    margin-bottom: 15px;
    text-align: center;
    line-height: 1.5;
  }
`;

const CompleteModal = styled.div`
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

  opacity: 1;
  transition: opacity 0.5s ease;

  &.closing {
    opacity: 0;
    visibility: hidden;
  }
`;

const CheckIcon = styled.img`
  width: 62px;
  height: 62px;
`;