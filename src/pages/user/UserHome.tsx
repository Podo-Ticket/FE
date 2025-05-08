import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

import MediumBtn from "@components/common/buttons/MediumBtn.tsx";
import MultiLanguageHeader from "@components/layout/headers/MultiLanguageHeader.tsx";
import poster from "../../assets/images/posters/2025_Spring_KwangwoonUniv_poster.png"; // 해당 공연에 맞는 상수값 적용 필요

import { fetchPlayInfo } from "../../api/user/UserHomeApi";
import { slideUp } from "../../styles/animation/DefaultAnimation.ts";
import { DateUtil, getClosestDateTime } from "../../utils/DateUtil";
import { useNavigateTo } from "../../utils/NavigateUtil.ts";
import { USER_HOME } from "../../constants/text/UIText.ts";
import { useLanguage } from "../../hooks/useLanguage.ts";
import { Language } from "../../constants/text/Language.ts";

const UserHome: React.FC = () => {
  const navigateTo = useNavigateTo();
  const { language, setLanguage } = useLanguage();

  const [playInfo, setPlayInfo] = useState<any>(null);
  const [, setScheduleId] = useState<number | 0>(0);
  const [performanceSession, setPerformanceSession] = useState<string | "">("");

  // 애니메이션 모달 선언 부

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [, setIsPopupClosing] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null); // 팝업 요소를 참조하는 ref

  // 현재 공연 정보 반영
  useEffect(() => {
    const loadPlayInfo = async () => {
      try {
        const playId = 1; // 추후에 다이나믹하게 변경
        const data = await fetchPlayInfo(playId);
        console.log(data);
        // 가장 가까운 스케줄의 date_time 계산
        const closestDateTime = getClosestDateTime(data.schedule);

        // 가장 가까운 스케줄의 id 찾기
        const closestSchedule = data.schedule.find(
          (schedule: { date_time: string }) =>
            schedule.date_time === closestDateTime
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

    localStorage.setItem("language", Language.Korean);
    loadPlayInfo();
  }, []);

  const toggleLanguage = () => {
    const current = localStorage.getItem("language") as Language;
    const next =
      current === Language.Korean ? Language.English : Language.Korean;
    localStorage.setItem("language", next);
    setLanguage(next);
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

  return (
    <MainContainer backgroundImage={poster}>
      <MultiLanguageHeader clickLanguage={toggleLanguage} />
      <PosterDetailsContainer>
        <CardFront>
          <CardBackGround />

          <Poster src={poster} alt="공연 포스터" />

          <TicketBottomContainer>
            <ShowDetails>
              {playInfo && (
                <>
                  <ShowDetailsTitle className="Podo-Ticket-Headline-H3">
                    {language === Language.English
                      ? playInfo.en_title
                      : playInfo.title}
                  </ShowDetailsTitle>
                  <ShowDetailsSubtitle className="Podo-Ticket-Body-B5">
                    <Subtitle className="Podo-Ticket-Body-B9">
                      {language === Language.English
                        ? USER_HOME.english.time
                        : USER_HOME.korean.time}
                    </Subtitle>
                    <SubContents className="Podo-Ticket-Body-B7">
                      {" "}
                      {DateUtil.formatDate(performanceSession, language)}
                    </SubContents>
                  </ShowDetailsSubtitle>
                </>
              )}
            </ShowDetails>

            <DetailBtnContainer>
              <GetTicketBtn
                content={
                  language === Language.English
                    ? USER_HOME.english.pickupBtn
                    : USER_HOME.korean.pickupBtn
                }
                onClick={() => navigateTo("/issue-ticket")}
                isAvailable={true}
              />
            </DetailBtnContainer>
          </TicketBottomContainer>
        </CardFront>
      </PosterDetailsContainer>
    </MainContainer>
  );
};

export default UserHome;
const MainContainer = styled.div<{ backgroundImage: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100svh;
  padding: 0 8.39vw;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-gradation-main);
  }
`;

const PosterDetailsContainer = styled.div`
  width: 100%;
  height: 83.81svh;

  animation: ${slideUp} 0.5s ease-out;
`;

const CardFront = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;

  -webkit-mask-image: radial-gradient(
      circle at left 68.95%,
      transparent 15px,
      black 15px
    ),
    radial-gradient(circle at right 68.95%, transparent 15px, black 15px),
    linear-gradient(white, white);
  -webkit-mask-composite: destination-out;
  -webkit-mask-repeat: no-repeat;

  mask-image: radial-gradient(
      circle at left 68.95%,
      transparent 4.5%,
      black 4.5%
    ),
    radial-gradient(circle at right 68.95%, transparent4.5%, black 4.5%),
    linear-gradient(white, white);
  mask-composite: exclude;
  mask-repeat: no-repeat;
`;

const CardBackGround = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 20px;
`;

const Poster = styled.img`
  position: relative;
  height: 69%;
  width: auto;
  object-fit: cover;
  object-position: top;
  z-index: 0;
  border-radius: 20px 20px 0 0;
  border-bottom: 2px dashed var(--grey-grey-5, #9e9e9e);
`;

const TicketBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 31.05%;
  z-index: 1;

  justify-content: center;
  gap: 18px;
`;

const ShowDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ShowDetailsTitle = styled.div`
  white-space: nowrap; // 줄 바꿈 방지
  text-align: center;
`;

const ShowDetailsSubtitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  justify-content: center;

  white-space: nowrap; // 줄 바꿈 방지
  color: var(--grey-grey7);
`;

const Subtitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid var(--grey-grey-3, #e2e2e2);
  color: var(--grey-grey-6, #777);

  padding: 0 3.7%;
  border-radius: 30px;
`;

const SubContents = styled.span`
  color: var(--grey-7);
  display: flex;
  align-items: center;
`;

const DetailBtnContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 2;
`;

const GetTicketBtn = styled(MediumBtn)``;
