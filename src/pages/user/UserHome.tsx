import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate, createSearchParams } from "react-router-dom";

import MediumBtn from "../../components/button/MediumBtn.tsx";
import MoreDetailBtn from "../../components/button/SmallMoreBtn.tsx";
import MoreBtn from "../../components/button/SmallMoreBtn.tsx";
import ReserveWayModal from "../../components/modal/ChoiceModal.tsx";
import AuthModal from "../../components/auth/PhoneAuthModal.tsx";
import Loading from "../../components/loading/Loading.tsx";
import Success from "../../components/loading/Success.tsx";
import TopNav from "../../components/nav/TopNav.tsx";

import poster from "../../assets/images/posters/24th_SeoulNationalUniv_Riveract_poster.jpg"; // 해당 공연에 맞는 상수값 적용 필요
import homeTicket from "../../assets/images/home_ticket.png";
import goBackIcon from "../../assets/images/left_arrow.png";

import { fetchPlayInfo } from "../../api/user/UserHomeApi";
import { slideUp } from "../../styles/animation/DefaultAnimation.ts";
import {
  BASE_PERFORMANCE_INFO,
  DETAILED_PERFORMANCE_INFO,
} from "../../constants/text/playInfo/24th_seoulnationalUniv_riveract.ts"; // 해당 공연에 맞는 상수값 적용 필요
import { DateUtil, getClosestDateTime } from "../../utils/DateUtil";
import { toggleModal } from "../../utils/ModalUtil.ts";
import { fadeIn, fadeOut } from "../../styles/animation/DefaultAnimation.ts";
import { useNavigateTo } from "../../utils/NavigateUtil.ts";

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  const navigateTo = useNavigateTo();

  // const handleMoveOnsiteReserve = () => {
  //   const params = { manage: isLocking ? "lock" : "unlock" };
  //   navigate({
  //     pathname: "/home/manage",
  //     search: `?${createSearchParams(params)}`, // Query Parameters 추가
  //   });
  // };

  const [playInfo, setPlayInfo] = useState(null);
  const [scheduleId, setScheduleId] = useState<number | 0>(0);
  const [performanceSession, setPerformanceSession] = useState<string | "">("");

  const [modals, setModals] = useState<{ [key: string]: boolean }>({
    authModal: false,
    reserveWayModal: false,
    loading: false,
    success: false,
  });

  // 애니메이션 모달 선언 부
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null); // 팝업 요소를 참조하는 ref

  // 현재 공연 정보 반영
  useEffect(() => {
    const loadPlayInfo = async () => {
      try {
        const playId = 2; // 추후에 다이나믹하게 변경
        const data = await fetchPlayInfo(playId);

        console.log("제발좀: ", data);

        // 가장 가까운 스케줄의 date_time 계산
        const closestDateTime = getClosestDateTime(data.schedule);

        // 가장 가까운 스케줄의 id 찾기
        const closestSchedule = data.schedule.find(
          (schedule) => schedule.date_time === closestDateTime
        );

        if (closestSchedule) {
          setScheduleId(closestSchedule.id); // 가장 가까운 스케줄의 id 설정
          localStorage.setItem("scheduleId", closestSchedule.id); // 로컬스토리지에 저장
        }

        setPlayInfo(data.play);
        setPerformanceSession(getClosestDateTime(data.schedule));
      } catch (error) {
        console.error("Failed to load play info:", error);
      }
    };

    loadPlayInfo();
  }, []);

  // Navigation Bar 내용
  const lefter = {
    icon: goBackIcon,
    iconWidth: 13,
    iconHeight: 20,
    text: "상세 정보",
    clickFunc: () => toggleFlip(),
  };

  // 카드 flip 상태 관리
  const toggleFlip = () => setIsFlipped(!isFlipped);
  const togglePopup = () => {
    if (isPopupVisible) {
      setIsPopupClosing(true); // Trigger fade-out animation
      setTimeout(() => {
        setIsPopupVisible(false); // Hide popup after animation ends
        setIsPopupClosing(false); // Reset closing state
      }, 250); // Match the duration of the fade-out animation
    } else {
      setIsPopupVisible(true); // Show popup immediately
      setIsPopupClosing(false); // Ensure it's not in closing state
    }
  };

  // 팝업 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupClosing(true);
        setTimeout(() => {
          setIsPopupVisible(false);
          setIsPopupClosing(false);
        }, 250);
      }
    };

    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  // 휴대폰 번호 인증 성공 처리
  const handleAuthModalAccept = () => {
    toggleModal("success", true, setModals);
    setTimeout(() => {
      toggleModal("success", false, setModals);
      navigateTo("/select");
    }, 1000);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 이벤트 전파 방지
  };

  return (
    <MainContainer backgroundImage={poster}>
      <MainTitle className="Podo-Ticket-Headline-H3">
        공연 입장을 도와드릴게요!
      </MainTitle>

      <PosterDetailsContainer>
        <Card isFlipped={isFlipped}>
          {/* Front Side */}
          <CardFront>
            <CardBackgroundImage src={homeTicket} alt="배경 이미지" />

            <TicketHeaderContainer>
              <Poster src={poster} alt="공연 포스터" />
              <ImageOverlay />
              <ShowDetails>
                {playInfo && (
                  <>
                    <ShowDetailsTitle className="Podo-Ticket-Headline-H1">
                      {playInfo.title}
                    </ShowDetailsTitle>
                    <ShowDetailsSubtitle className="Podo-Ticket-Body-B5">
                      {DateUtil.formatDate(performanceSession)}
                    </ShowDetailsSubtitle>
                  </>
                )}
              </ShowDetails>
            </TicketHeaderContainer>

            <DetailContainer>
              {BASE_PERFORMANCE_INFO.map((item, index) => (
                <FrontCardInfoItem key={index}>
                  <InfoCategory className="Podo-Ticket-Body-B9">
                    {item.category}
                  </InfoCategory>
                  <InfoContent className="Podo-Ticket-Body-B7">
                    {Array.isArray(item.content) ? (
                      <>
                        {/* Show only the first 4 items */}
                        {item.content
                          .slice(0, 4)
                          .map((contentItem, contentIndex, arr) => (
                            <span key={contentIndex}>
                              {contentItem}
                              {contentIndex !== arr.length - 1 && ", "}
                            </span>
                          ))}
                        {/* Show "More" button if content has more than 4 items */}
                        {item.content.length > 4 && (
                          <div style={{ position: "relative" }}>
                            <MoreBtn
                              content="더보기" // 버튼 안 내용
                              isAvailable={true} // 버튼 동작 여부
                              onClick={togglePopup}
                              isUnderlined={true}
                            />
                            {isPopupVisible && (
                              <SpeechBubble
                                ref={popupRef}
                                isClosing={isPopupClosing}
                              >
                                <div>박도현, 박세웅, 오지우, 윤가은</div>
                                <div>이윤하</div>
                              </SpeechBubble>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      item.content
                    )}
                  </InfoContent>
                </FrontCardInfoItem>
              ))}
              <MoreDetailBtnContainer>
                <MoreDetailBtn
                  content="자세히 보기"
                  onClick={() => toggleFlip()}
                  isAvailable={true}
                />
              </MoreDetailBtnContainer>
            </DetailContainer>

            <DetailBtnContainer>
              <GetTicketBtn
                content="티켓 발권"
                onClick={() => toggleModal("reserveWayModal", true, setModals)}
                isAvailable={true}
              />
            </DetailBtnContainer>
          </CardFront>

          {/* Back Side */}
          <CardBack>
            <CardBackgroundImage src={homeTicket} alt="배경 이미지" />
            <NavBar
              lefter={lefter}
              center={lefter}
              righter={null}
              customStyles={{
                borderRadius: "20px 20px 0px 0px",
                background: "transparent",
                height: "60px",
              }}
              font="Podo-Ticket-Headline-H5"
            />

            <BackDetailContainer onScroll={handleScroll}>
              {DETAILED_PERFORMANCE_INFO.map((item, index) => (
                <FrontCardInfoItem key={index}>
                  <InfoCategory className="Podo-Ticket-Body-B9">
                    {item.category}
                  </InfoCategory>
                  <BackInfoContent className="Podo-Ticket-Body-B7">
                    {Array.isArray(item.content)
                      ? item.content.map((name, nameIndex, arr) => (

                          <span key={nameIndex}>
                            {name}
                            {(nameIndex + 1) % 5 === 0 &&
                            nameIndex !== item.content.length - 1 ? (
                              <br />
                            ) : nameIndex !== arr.length - 1 ? (
                              ", "
                            ) : (
                              ""
                            )}
                          </span>
                        ))

                      : item.content}
                  </BackInfoContent>
                </FrontCardInfoItem>
              ))}
            </BackDetailContainer>
          </CardBack>
        </Card>
      </PosterDetailsContainer>

      <ReserveWayModal
        showChoiceModal={modals.reserveWayModal}
        closeChoiceModal={() =>
          toggleModal("reserveWayModal", false, setModals)
        }
        onFirstItemClick={() => toggleModal("authModal", true, setModals)}
        onSecondItemClick={() => navigateTo("/reserve")}
      />

      <AuthModal
        showPhoneModal={modals.authModal}
        scheduleId={scheduleId}
        onAcceptFunc={handleAuthModalAccept}
        onUnacceptFunc={() => toggleModal("authModal", false, setModals)}
      />

      <Loading showLoading={modals.loading} />
      <Success showSuccess={modals.success} />
    </MainContainer>
  );
};

export default UserHome;

const MainContainer = styled.div<{ backgroundImage: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100%;
  padding: 0px 30px;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-gradient-1);
  }
`;

const MainTitle = styled.h1`
  padding: 30px 0;
  padding-top: 40px;

  z-index: 1;

  color: var(--ect-white);
`;

const PosterDetailsContainer = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 20px 20px 0px 0px;

  z-index: 1;
  perspective: 1000px;

  animation: ${slideUp} 0.5s ease-out;
`;

const Card = styled.div<{ isFlipped?: boolean }>`
  position: relative;

  width: 100%;
  height: 100%;

  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;

  ${({ isFlipped }) =>
    isFlipped &&
    `
    transform: rotateY(180deg);
  `}
`;

const CardFront = styled.div`
  position: absolute;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  backface-visibility: hidden;

  z-index: 2;
  transform: rotateY(0deg);
  transform-style: preserve-3d;
`;

const CardBackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 110%;
  border-radius: 20px 20px 0px 0px;

  z-index: 2;
`;

const TicketHeaderContainer = styled.div`
  position: relative;

  overflow: hidden;
  z-index: 2;
`;

const Poster = styled.img`
  width: 100%;
  height: 150px;

  border-radius: 20px 20px 0px 0px;
  object-fit: cover;
  object-position: center;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 5px);

  width: 100%;
  border-radius: 20px 20px 0px 0px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ShowDetails = styled.div`
  position: absolute;
  top: calc(60%);
  left: calc(50%);
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--ect-white);
`;

const ShowDetailsTitle = styled.div`
  white-space: nowrap; // 줄 바꿈 방지
  text-align: center;
`;

const ShowDetailsSubtitle = styled.div`
  white-space: nowrap; // 줄 바꿈 방지
  text-align: center;
`;

const DetailContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  padding-left: 36px;
  padding-top: 35px;
  padding-right: 0px;
  gap: 13px;

  z-index: 2;
`;

const FrontCardInfoItem = styled.div`
  display: flex;
  align-items: center;

  gap: 16px;
`;

const InfoCategory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 59px;
  border-radius: 30px;
  border: 1px solid var(--purple-9);
  background: var(--ect-white);

  color: var(--grey-6);
`;

const InfoContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--grey-7);
`;

const BackInfoContent = styled.div`
  color: var(--grey-7);
`;

const MoreDetailBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding-right: 36px;
  margin-top: 26px;
`;

const DetailBtnContainer = styled.div`
  position: absolute;

  bottom: 30px; /* 하단에서 30px 위로 위치 */
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  z-index: 2;
`;

const GetTicketBtn = styled(MediumBtn)``;

const CardBack = styled.div`
  position: absolute; // 위치 고정
  width: 100%;
  height: 100%;

  transform-style: preserve-3d;
  transform: rotateY(180deg);

  overflow: hidden;
`;

const NavBar = styled(TopNav)``;

const BackDetailContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 2;

  height: calc(100% - 300px);

  width: 100%; /* 전체 뷰포트 너비에서 70px 빼기 */
  padding: 20px 36px; // 좌우 패딩 추가

  overflow-y: auto;
  overscroll-behavior: contain; // iOS 및 기타 브라우저 스크롤 동작 제어

  -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 */
  gap: 13px;
`;

// const BackDetailContainer = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: column;

//   max-height: 326px; /* 최소 높이 설정 */
//   height: auto;

//   overflow-y: auto;
//   border: 2px solid blue; /* 확인용 */
//   pointer-events: auto; /* 마우스 스크롤 가능하도록 설정 */
//   -webkit-overflow-scrolling: touch;

//   // padding-left: 36px;
//   // padding-top: 10px;
//   // padding-right: 0px;
//   gap: 13px;
// `;

const SpeechBubble = styled.div.attrs({ className: "Podo-Ticket-Body-B7" }) <{
  isClosing: boolean;
}>`
  position: absolute;
  top: 150%;
  left: -8%;
  transform: translateX(-50%);

  width: 168px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  padding: 10px 0;
  padding-left: 10px;
  padding-right: 0px;

  text-align: left;
  color: var(--grey-6);

  z-index: 10;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.3s
    ease-in-out;

  &::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 75%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent white transparent;
  }
`;
