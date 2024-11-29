import React, { useState } from 'react';

import '../../styles/user/LoadingModal.css'
import PulseLoader from "react-spinners/PulseLoader";
import waitReserve from "../../assets/images/wait_reserve_icon.png";

const LoadingModal = ({ isOpen, isOnSiteReserve }) => {
  let [color, setColor] = useState("#6A39C0");

  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay-load">

      {isOnSiteReserve &&
        <>
          <div className="modal-content-load-reserve">
            <img src={waitReserve} className="modal-content-load-icon" />
            <p>예매 수락 대기 중</p>
            <span>관리자가 내역을 확인 중입니다.</span>
            <PulseLoader
              color={color}
              size={13}
              loading={isOpen}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </>
      }
      {!isOnSiteReserve &&
        <>
          <div className="modal-content-load">
            <PulseLoader
              color={color}
              size={21}
              loading={isOpen}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </>
      }
    </div>

  );
};

export default LoadingModal;