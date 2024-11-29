import React, { useState, useEffect } from 'react';

import SeatMap from '../../assets/images/seat_map.png'
import VenueMap from '../../assets/images/venue_map.png'
import BottomNav from '../../components/BottomNav';

import '../../styles/admin/TheaterInfo.css'

function TheaterInfo() {
    const [activeTab, setActiveTab] = useState('1'); // 기본 활성화된 탭
    const [sliderPosition, setSliderPosition] = useState(0); // 슬라이더 위치

    const renderContent = () => {
        switch (activeTab) {
            case '1':
                return <div className="theater-info-seat-description">
                    <img src={SeatMap} className="theater-info-seat-description-map" />
                </div>; // 좌석 안내 컴포넌트
            case '2':
                return (
                    <div className="theater-info-venue-map-description">
                        <img src={VenueMap} alt="공연장 지도" className="theater-info-venue-map" />
                    </div>
                ); // 공연장 지도 컴포넌트
            case '3':
                return <div className="theater-info-performance-description">
                    광운극회 가을 단막극을 보러오신 여러분들께 잠시 안내말씀 드리겠습니다
                    <br />
                    <br />
                    1. 이 공연은 정시에 시작하며 지연 입장은 어렵습니다. 공연 시작 전까지 미리 지정된 자석에 착석하여 앉아있어주시면 감사하겠습니다.
                    <br />
                    <br />
                    2. 공연 중 모든 종류의 촬영 및 녹음이 제한되어있습니다. 촬영은 극이 모두 끝난 후 커튼콜부터 촬영이 가능합니다.
                    <br />
                    <br />
                    3. 공연 중 작은 움직임이나 대화 소리도 주변 관객분들에게 영향을 줄 수 있습니다. 정숙한 관람 부탁드립니다.
                    <br />
                    <br />
                    4. 마지막으로 본 공연의 러닝타임은 약 80분입니다. 공연이 시작된 이후  퇴장하시면 재입장이 제한되는 점 주의 부탁드립니다
                    <br />
                    <br />
                    공연을 찾아주신 관객 여러분들 모두 즐거운 관람되시길 바랍니다 감사합니다
                    <br />
                    <br />
                </div>; // 공연 유의사항 컴포넌트
            default:
                return null;
        }
    };

    useEffect(() => {
        // 슬라이더의 위치를 설정
        setSliderPosition((parseInt(activeTab) - 1) * 100); // 각 버튼의 너비에 따라 계산
    }, [activeTab]);

    return (
        <div className="theater-info-container">

            <h3 className="theater-info-title">공연장 정보</h3>

            <div className="theater-info-nav">
                <div className="slider" style={{ transform: `translateX(${sliderPosition}%)` }} />
                <button onClick={() => setActiveTab('1')} className={activeTab === '1' ? 'active' : ''}>좌석 안내</button>
                <button onClick={() => setActiveTab('2')} className={activeTab === '2' ? 'active' : ''}>공연장 지도</button>
                <button onClick={() => setActiveTab('3')} className={activeTab === '3' ? 'active' : ''}>공연 유의사항</button>
            </div>

            {renderContent()}


            <BottomNav />
        </div>
    );
};

export default TheaterInfo;