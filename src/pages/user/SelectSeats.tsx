import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// import SeatMap from '../../components/SeatMap';
import ErrorModal from '../../components/error/DefaultErrorModal';
import TopNav from '../../components/nav/TopNav';
import SelectSeatsInfo from '../../components/info/SelectSeatsInfo';

import { SELECT_FAIL } from '../../constants/text/ErrorMessage';
import refreshIcon from '../../assets/images/refresh2_icon.png'
import LargeBtn from '../../components/button/LargeBtn';

import { fetchSeats, checkSeats } from '../../api/user/SelectSeatsApi';

function SelectSeats() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentScheduleId, setCurrentScheduleIdState] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] = useState(false);
  const [headCount, setHeadCount] = useState(0); // headCount 상태 추가

  // 현재 공연 세션 정보 설정
  useEffect(() => {
    setCurrentScheduleIdState(1); // 스케줄 ID 설정
  }, []);

  // 해당 공연 좌석 정보 호출
  useEffect(() => {
    if (currentScheduleId) {
      const loadSeats = async () => {
        try {
          const data = await fetchSeats(currentScheduleId);
          setHeadCount(data.headCount); // 응답 데이터에서 headCount 설정
        } catch (error) {
          console.error(error.message);
        }
      };

      loadSeats();
    }
  }, [currentScheduleId]);

  // 좌석 확인 및 발권 요청 함수
  const handleTicketCheck = async () => {
    if (!currentScheduleId) return;

    try {
      const response = await checkSeats(currentScheduleId, selectedSeats);

      if (response.success) {
        navigate('/confirm', { state: { selectedSeats } }); // 선택한 좌석과 함께 확인 페이지로 이동
      } else {
        setIsAlreadySelectedModalOpen(true); // 이미 선택된 좌석일 경우 모달 표시
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // 좌석 선택란 새로고침
  const handleRefresh = () => window.location.reload();
  // 다음 화면 이동 함수
  const handleNext = () => navigate("/confirm", { state: { from: "/select" } });
  // 발권 버튼 텍스트
  const buttonText = `선택 완료 ${selectedSeats.length} / ${headCount}`;

  const righter = {
    icon: refreshIcon,
    iconWidth: 17, // 아이콘 너비 (px 단위)
    iconHeight: 17, // 아이콘 높이 (px 단위)
    text: "좌석을 선택해주세요",
    clickFunc: handleRefresh
  }

  return (
    <SelectSeatsContainer>
      <TopNav lefter={null} center={righter} righter={righter} isGrey={true} />

      <SelectSeatsContentContainer>

        <SelectSeatsInfo />

        <SeatMapContainer>
          <div style={{ height: 364, border: '1px solid black' }}></div>
        </SeatMapContainer>

        <LargeBtn
          content={buttonText}
          onClick={handleNext}
          isAvailable={selectedSeats.length < parseInt(headCount)}
        />

      </SelectSeatsContentContainer>

      <ErrorModal
        showDefaultErrorModal={isAlreadySelectedModalOpen}
        errorMessage={SELECT_FAIL}
        onAcceptFunc={() => setIsAlreadySelectedModalOpen(false)}
      />

    </SelectSeatsContainer>
  );
};

export default SelectSeats;

const SelectSeatsContainer = styled.div`

`;

const SelectSeatsContentContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

gap: 15px;
padding: 0 20px;
`;

const SeatMapContainer = styled.div`
display: flex;
`;