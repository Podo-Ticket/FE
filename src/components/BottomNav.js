import React from "react";
import { useLocation, Link } from 'react-router-dom';


import '../styles/BottomNav.css'
import seatIcon from '../assets/image/seat_icon.png';
import listIcon from '../assets/image/list_icon.png';
import onSiteIcon from '../assets/image/on_site_icon.png';
import plusInfo from '../assets/image/plus_info_icon.png';
import activeSeatIcon from '../assets/image/active_seat_icon.png';
import activeListIcon from '../assets/image/active_list_icon.png';
import activeOnSiteIcon from '../assets/image/active_on_site_icon.png';
import activePlusInfo from '../assets/image/active_plus_info_icon.png';

const BottomNav = ({ showActions, onApprove, onDelete, onSeatEdit, onLockSeats, onUnlockSeats
    , isLockAvailable, isUnlockAvailable
}) => {
    const location = useLocation(); // 현재 경로를 가져옴

    return (
        <nav className="bottom-nav">

            {!showActions && !onSeatEdit && (
                <>
                    <div className={`nav-item ${location.pathname === '/seats' ? 'active' : ''}`}>
                        <Link to="/seats" className="nav-link">
                            <img src={location.pathname === '/seats' ? activeSeatIcon : seatIcon}
                                alt="seatIcon"
                                className="icon-seat" />
                            <p>실시간 좌석</p>
                        </Link>
                    </div>
                    <div className={`nav-item ${location.pathname === '/manage' ? 'active' : ''}`}>
                        <Link to="/manage" className="nav-link">
                            <img src={location.pathname === '/manage' ? activeListIcon : listIcon}
                                className="icon-list" />
                            <p>발권 명단 관리</p>
                        </Link>
                    </div>
                    <div className={`nav-item ${location.pathname === '/onsite' ? 'active' : ''}`}>
                        <Link to="/onsite" className="nav-link">
                            <img src={location.pathname === '/onsite' ? activeOnSiteIcon : onSiteIcon}
                                className="icon-list" />
                            <p>현장 예매 관리</p>
                        </Link>
                    </div>
                    <div className={`nav-item ${location.pathname === '/theater' ? 'active' : ''}`}>
                        <Link to="/theater" className="nav-link">
                            <img src={location.pathname === '/theater' ? activePlusInfo : plusInfo}
                                className="icon-info" />
                            <p>공연장 정보</p>
                        </Link>
                    </div>
                </>
            )}

            {showActions && ( // showActions가 true일 때만 버튼을 보여줌
                <>
                    <div className="nav-item">
                        <button className="nav-item-accept" onClick={onApprove}>수락</button>
                    </div>
                    <span class="nav-item-divider"></span>
                    <div className="nav-item">
                        <button className="nav-item-reject" onClick={onDelete}>거절</button>
                    </div>
                </>
            )}


            {onSeatEdit && ( // onSeatEdit가 true일 때 좌석 잠금 및 해제 버튼을 보여줌
                <>
                    <div className="nav-item">
                        <button
                            className={`nav-item-lock ${isLockAvailable ? 'lock-active' : ''}`}
                            onClick={isLockAvailable ? onLockSeats : null} // 사용 가능 여부에 따라 onClick 설정
                            disabled={!isLockAvailable} // 사용 불가능할 경우 비활성화
                        >
                            좌석 잠금
                        </button>
                    </div>
                    <span className="nav-item-divider"></span>
                    <div className="nav-item">
                        <button
                            className={`nav-item-unlock ${isUnlockAvailable ? 'unlock-active' : ''}`}
                            onClick={isUnlockAvailable ? onUnlockSeats : null} // 사용 가능 여부에 따라 onClick 설정
                            disabled={!isUnlockAvailable} // 사용 불가능할 경우 비활성화
                        >
                            좌석 해제
                        </button>
                    </div>
                </>
            )}

        </nav>
    );
};

export default BottomNav;