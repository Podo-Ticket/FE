import React, { useState } from 'react';

import SeatMap from '../../assets/images/seat_map.png'
import VenueMap from '../../assets/images/venue_map.png'
import '../../styles/user/PlusInfoModal.css'

const PlusInfoModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('1'); // 기본 활성화된 탭

    if (!isOpen) return null;

    const renderContent = () => {
        switch (activeTab) {
            case '1':
                return <div className="seat-description">
                    <img src={SeatMap} className="seat-description-map"/>
                </div>; // 좌석 안내 컴포넌트
            case '2':
                return (
                    <div className="venue-map-description">
                        <img src={VenueMap} alt="공연장 지도" className="venue-map" />
                    </div>
                ); // 공연장 지도 컴포넌트
            case '3':
                return <div className="performance-description">
                    <br />
                    1. 촬영 금지: 공연 중에는 촬영이 금지되어 있습니다. 모든 공연이 종료된 후에 커튼콜 촬영이 가능합니다.
                    <br />
                    <br />
                    2. 휴대폰 사용: 공연 중에는 휴대폰을 꺼주시기 바랍니다. 비행기 모드로 설정하거나 전원을 종료해 주세요.
                    <br />
                    <br />
                    3. 편안한 관람: 등받이에 기대어 편안하게 관람해 주시기 바랍니다. 하지만 다른 관객의 시야를 방해하지 않도록 주의해 주세요.
                    <br />
                    <br />
                    4. 음식물 금지: 공연장 내에서는 음식물을 섭취할 수 없습니다. 공연에 집중해 주시기 바랍니다.
                    <br />
                    <br />
                    5. 러닝타임 공지: 공연의 러닝타임이 공지되며, 퇴장 시에는 재입실이 불가하니 미리 참고해 주세요.
                    <br />
                    <br />
                    이 사항들을 준수하여 모두가 즐거운 공연을 관람할 수 있도록 협조해 주시기 바랍니다.
                </div>; // 공연 유의사항 컴포넌트
            default:
                return null;
        }
    };


    return (
        <div className="modal-overlay-plus-info">
            <div className="modal-content-plus-info">
                <h3>공연장 정보</h3>

                <div className="plus-info-nav">
                    <button onClick={() => setActiveTab('1')} className={activeTab === '1' ? 'active' : ''}>좌석 안내</button>
                    <button onClick={() => setActiveTab('2')} className={activeTab === '2' ? 'active' : ''}>공연장 지도</button>
                    <button onClick={() => setActiveTab('3')} className={activeTab === '3' ? 'active' : ''}>공연 유의사항</button>
                </div>

                {renderContent()}

                <button className="modal-plus-info-close-button" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default PlusInfoModal;