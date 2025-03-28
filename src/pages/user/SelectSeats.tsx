import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import TopNav from "../../components/nav/TopNav";
import SelectSeatsInfo from "../../components/info/SeatsInfo";
import LargeBtn from "../../components/button/LargeBtn";
import ErrorModal from "../../components/error/DefaultErrorModal";

import { SELECT_FAIL } from "../../constants/text/ErrorMessage";
import refreshIcon from "../../assets/images/refresh2_icon.png";

import { fetchSeats, checkSeats } from "../../api/user/SelectSeatsApi";

/* 각 극장에 맞는 SeatMap component로 설정 필요 */
import RiveractSeatMap from "../../components/button/SeatMap/UserSeatMap_Riveract";
// import KwangwoonSeatMap from '../../components/button/SeatMap/UserSeatMap_Kwangwoon';

function SelectSeats() {
  const navigate = useNavigate();

  const currentScheduleId = Number(localStorage.getItem("scheduleId")) || 0;

  const [selectedSeats, setSelectedSeats] = useState<any>([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] =
    useState(false);
  const [headCount, setHeadCount] = useState(0); // headCount

  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
  const triggerRefresh = () => {
    setIsRefreshed((prev) => !prev);
    setSelectedSeats([]);
  }

  // 예매 인원 수 확인 Api (인원 수만 확인함)
  useEffect(() => {
    if (currentScheduleId) {
      const loadSeats = async () => {
        try {
          const data = await fetchSeats(currentScheduleId);
          setHeadCount(data.headCount);
        } catch (error: any) {
          console.error(error.message);
        }
      };

      loadSeats();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      handleBack();
    };

    // 뒤로가기 이벤트 리스너 추가
    window.addEventListener("popstate", handlePopState);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleBack = async () => {
    navigate("/"); // 성공 시 선택 페이지로 이동
  };

  // 좌석 확인 및 발권 요청 함수
  const handleTicketCheck = async () => {
    if (!currentScheduleId) return;

    try {
      const response = await checkSeats(currentScheduleId, selectedSeats);

      if (response.success) {
        navigate("/confirm", { state: { selectedSeats } }); // 선택한 좌석과 함께 확인 페이지로 이동
      } else {
        setIsAlreadySelectedModalOpen(true); // 이미 선택된 좌석일 경우 모달 표시
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // 발권 버튼 텍스트
  const buttonText = `선택 완료 ${selectedSeats.length} / ${headCount}`;

  const righter = {
    icon: refreshIcon,
    iconWidth: 17, // 아이콘 너비 (px 단위)
    iconHeight: 17, // 아이콘 높이 (px 단위)
    text: "좌석을 선택해주세요",
    clickFunc: triggerRefresh,
  };

  return (
    <SelectSeatsContainer>
      <TopNav lefter={undefined} center={righter} righter={righter} isGrey={true} />

      <SelectSeatsContentContainer>
        <SelectSeatsInfo />

        <SeatMapContainer>
          <RiveractSeatMap
            isRealTime={false}
            isRefreshed={isRefreshed}
            scheduleId={5}
            headCount={headCount}
            disabled={false}
            currentSelectedSeats={selectedSeats}
            setCurrentSelectedSeats={setSelectedSeats}
            showErrorModal={setIsAlreadySelectedModalOpen} newLockedSeats={[]} setNewLockedSeats={function (): void {
              throw new Error("Function not implemented.");
            }} newUnlockedSeats={[]} setNewUnlockedSeats={function (): void {
              throw new Error("Function not implemented.");
            }} setCurrentLockedSeatsInfo={function (): void {
              throw new Error("Function not implemented.");
            }} setIsLockAvailable={function (): void {
              throw new Error("Function not implemented.");
            }} setIsUnlockAvailable={function (): void {
              throw new Error("Function not implemented.");
            }} />
        </SeatMapContainer>

        <LargeBtn
          content={buttonText}
          onClick={handleTicketCheck}
          isAvailable={!(selectedSeats.length < Number(headCount))}
        />
      </SelectSeatsContentContainer>

      <ErrorModal
        showDefaultErrorModal={isAlreadySelectedModalOpen}
        errorMessage={SELECT_FAIL}
        onAcceptFunc={() => setIsAlreadySelectedModalOpen(false)}
        aboveButton={true}
      />
    </SelectSeatsContainer>
  );
}

export default SelectSeats;

const SelectSeatsContainer = styled.div``;

const SelectSeatsContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: var(--background-1);

  gap: 15px;
  padding: 0 20px;
`;

const SeatMapContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 60vh;

  border-radius: 10px;
  border: 1px solid var(--grey-3);
  background: var(--ect-white);
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.02);
`;
