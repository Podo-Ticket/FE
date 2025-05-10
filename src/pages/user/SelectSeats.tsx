import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import TopNav from "@components/layout/headers/TopNav";
import SelectSeatsInfo from "@components/pages/customer/selectSeats/SeatsInfo";
import LargeBtn from "@components/common/buttons/LargeBtn";
import ErrorModal from "@components/common/errors/DefaultErrorModal";
import NoSuchCustomerModal from "@components/common/modals/NoticeModal.tsx";

import { SELECT_FAIL } from "../../constants/text/ErrorMessage";
import refreshIcon from "../../assets/images/refresh2_icon.png";

import { fetchSeats, checkSeats } from "../../api/user/SelectSeatsApi";
import { useLanguage } from "../../hooks/useLanguage";
import { SELECT_SEATS } from "../../constants/text/UIText.ts";

import SeongbukVillageTheaterSeatMap from "@components/pages/customer/selectSeats/UserSeatMap_SeongbukVillageTheater.tsx";
// import RiveractSeatMap from "@components/pages/customer/selectSeats/UserSeatMap_Riveract.tsx";
// import KwangwoonSeatMap from '@components/pages/customer/selectSeats/UserSeatMap_Kwangwoon';

function SelectSeats() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const currentScheduleId = Number(localStorage.getItem("scheduleId")) || 0;

  const [selectedSeats, setSelectedSeats] = useState<any>([]);
  const [isAlreadySelectedModalOpen, setIsAlreadySelectedModalOpen] =
    useState(false);
  const [showNoSuchCustomerModal, setShowNoSuchCustomerModal] =
    useState<boolean>(false);
  const [headCount, setHeadCount] = useState(0); // headCount

  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
  const triggerRefresh = () => {
    setIsRefreshed((prev) => !prev);
    setSelectedSeats([]);
  };

  // 예매 인원 수 확인 Api
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
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleBack = async () => {
    navigate("/"); // 성공 시 선택 페이지로 이동
  };

  const handleTicketCheck = async () => {
    if (!currentScheduleId) return;

    try {
      const response = await checkSeats(currentScheduleId, selectedSeats);

      if (response.success) {
        navigate("/confirm", { state: { selectedSeats } });
      } else {
        setIsAlreadySelectedModalOpen(true);
      }
    } catch (error: any) {
      if (error.message == "예매 내역 확인 불가") {
        setShowNoSuchCustomerModal(true);
      } else {
        console.log(error.message);
      }
    }
  };

  const buttonText = `${
    language === "english"
      ? SELECT_SEATS.english.NextBtn
      : SELECT_SEATS.korean.NextBtn
  } ${selectedSeats.length} / ${headCount}`;

  const SmallWidthDevice = () => {
    const isSmallWidthDevice = useMediaQuery({ maxDeviceWidth: 370 });
    return isSmallWidthDevice
      ? "좌석 선택"
      : `${
          language === "english"
            ? SELECT_SEATS.english.pageTitle
            : SELECT_SEATS.korean.pageTitle
        }`;
  };

  const righter = {
    icon: refreshIcon,
    iconWidth: 17,
    iconHeight: 17,
    text: SmallWidthDevice(),
    clickFunc: triggerRefresh,
  };

  return (
    <SelectSeatsContainer>
      <TopNav
        lefter={undefined}
        center={righter}
        righter={righter}
        isGrey={true}
      />

      <SelectSeatsContentContainer>
        <SelectSeatsInfo />

        <SeatMapContainer>
          <SeongbukVillageTheaterSeatMap
            isRealTime={false}
            isRefreshed={isRefreshed}
            scheduleId={5}
            headCount={headCount}
            disabled={false}
            currentSelectedSeats={selectedSeats}
            setCurrentSelectedSeats={setSelectedSeats}
            showErrorModal={setIsAlreadySelectedModalOpen}
          />
        </SeatMapContainer>

        <LargeBtn
          content={buttonText}
          onClick={handleTicketCheck}
          isAvailable={!(selectedSeats.length < Number(headCount))}
        />
      </SelectSeatsContentContainer>

      <NoSuchCustomerModal
        showNoticeModal={showNoSuchCustomerModal}
        imgStatus="danger"
        title={
          language === "english"
            ? SELECT_SEATS.english.NoSuchCustomerModalTitle
            : SELECT_SEATS.korean.NoSuchCustomerModalTitle
        }
        description={
          language === "english"
            ? SELECT_SEATS.english.NoSuchCustomerModalSubitle
            : SELECT_SEATS.korean.NoSuchCustomerModalSubitle
        }
        buttonContent={
          language === "english"
            ? SELECT_SEATS.english.NoSuchCustomerModalAccpet
            : SELECT_SEATS.korean.NoSuchCustomerModalAccpet
        }
        onAcceptFunc={() => {
          setShowNoSuchCustomerModal(false);
          navigate("/");
        }}
      />

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
  align-items: center;

  height: calc(100svh);
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
