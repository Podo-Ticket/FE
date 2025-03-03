import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import {
  fetchAdminEnter,
  PerformanceInfo,
  verifyAdminCode,
} from "../../api/admin/AdminAuthApi.ts";

import FooterNav from "../../components/nav/FooterNav.tsx";
import SeatLockButton from "../../components/button/WhiteBoxBtn.tsx";

import podoLogo from "../../assets/images/admin/mainLogo.png";
import rightArror from "../../assets/images/admin/white_right-arrow.png";
import lockIcon from "../../assets/images/admin/lock_icon.png";
import unlockIcon from "../../assets/images/admin/unlock_icon.png";
import greyRightArrow from "../../assets/images/admin/grey_right_arrow.png";
import character from "../../assets/images/admin/character.png";
import character_100 from "../../assets/images/admin/100_character.png";

const AdminHome = () => {
  const [performance, setPerformance] = useState<PerformanceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 홈 화면 진입 시에
  useEffect(() => {
    localStorage.setItem("currentScheduleId", "5"); // 홈 화면에서 로컬스토리지에 스케쥴 아이디 저장

    const loadPerformanceData = async () => {
      try {
        console.log("🔄 관리자 세션 생성 시작...");
        await verifyAdminCode("kwdc"); // ✅ 세션 생성 (먼저 실행)
        console.log("🔄 어드민 메인 데이터 가져오기...");
        const data = await fetchAdminEnter();
        setPerformance(data.info);
        console.log(data);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생", error);
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  }, []);

  // 공연시작시간 계산
  const getMinutesUntilShowtime = (dateTime: string): number => {
    const now = new Date(); // 현재 시간
    const showTime = new Date(dateTime); // 공연 시작 시간

    const diffMs = showTime.getTime() - now.getTime(); // 밀리초 단위 차이
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // 분 단위 변환

    return diffMinutes;
  };

  if (!performance) {
    return null;
  }
  const minutesLeft = getMinutesUntilShowtime(performance.date_time);
  const issuedTickets = performance.available_seats - performance.free_seats; // 발권된 티켓 수 };
  const issuingProgress = Math.round(
    (issuedTickets / performance.available_seats) * 100
  ); // 진행률 (%)

  return (
    <ViewContainer>
      <AppTitle>
        <img src={podoLogo} style={{ width: "18px" }} />
        <MainName>포도티켓</MainName>
      </AppTitle>

      <MainContainer>
        <TextContainer>
          {performance === null ? (
            <p
              className="Podo-Ticket/Body/B1"
              style={{
                color: "var(--grey-grey7, #3C3C3C)",
              }}
            >
              예정된 공연이 없어요!
              <br />
              새로운 공연을 등록하세요!
            </p>
          ) : (
            <>
              <MainText className="Podo-Ticket/Body/B1">
                다음 공연 시작까지
                <br />
                <div>
                  <Highlight className="Podo-Ticket-Headline-H2">
                    {minutesLeft}분
                  </Highlight>{" "}
                  남았어요!
                </div>
              </MainText>
            </>
          )}

          <LiveSeatButton
            onClick={() => {
              navigate("realtime");
            }}
          >
            <p className="Podo-Ticket/Headline/H5">실시간 좌석 현황</p>
            <img
              style={{ width: "7px", height: "12px" }}
              src={rightArror}
              alt="화살표 아이콘"
            />
          </LiveSeatButton>
        </TextContainer>
        <CharacterImg src={character} alt=""></CharacterImg>
      </MainContainer>

      <MenuContainer>
        <LockButtonDiv>
          <SeatLockButton
            iconSrc={lockIcon}
            title="좌석 잠금"
            description="이용 제한이 필요한 좌석을 빠르게 관리해보세요!"
            onClick={() => {
              navigate("lock");
            }}
          />
          <SeatLockButton
            iconSrc={unlockIcon}
            title="좌석 잠금 해제"
            description="좌석 이용을 다시 활성화할 수 있어요!"
            onClick={() => {
              navigate("lock");
            }}
          />
        </LockButtonDiv>

        {/* 발권진행률 */}
        <TicketingStatusDiv>
          <TopMenu>
            <TicketingStatusTitle>
              {issuingProgress === 100 ? (
                <span
                  className="Podo-Ticket/Headline/H5"
                  style={{ color: "var(--grey-grey7, #3C3C3C)" }}
                >
                  발권이 모두 완료되었어요!
                </span>
              ) : (
                <>
                  <Highlight className="Podo-Ticket-Headline-H3">
                    {performance?.free_seats}건
                  </Highlight>
                  의 미발권이 남았어요!
                </>
              )}
            </TicketingStatusTitle>
            <div style={{ position: "relative" }}>
              {issuingProgress === 100 && (
                <img
                  src={character_100}
                  alt="100% 완료 캐릭터"
                  style={{
                    position: "absolute",
                    right: "20px", // 오른쪽 정렬
                    top: "-45px", // BarContainer 위로 올리기

                    height: "60px",
                    zIndex: 10, // 바보다 위로 배치
                  }}
                />
              )}
              <BarContainer>
                <BarFill progress={issuingProgress} />
                <Circle position={issuingProgress} />
              </BarContainer>
            </div>
            <TicketingPercent>
              <p
                className="Podo-Ticket/Body/B11"
                style={{
                  color: "var(--grey-grey-6, #777)",
                  fontSize: "10px",
                  fontWeight: "500",
                }}
              >
                발권진행률
              </p>
              <span
                className="Podo-Ticket/Headline/H6"
                style={{
                  color: "var(--purple-purple-4-main, #6A39C0)",
                  textAlign: "right",
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {issuingProgress}%
              </span>
            </TicketingPercent>
          </TopMenu>
          <BottomMenu
            onClick={() => {
              navigate("/reserved");
            }}
          >
            <span
              className="Podo-Ticket/Headline/H6"
              style={{
                color: "var(--grey-grey7, #3C3C3C)",
                marginRight: "10px",
              }}
            >
              발권 명단 관리
            </span>
            <img
              src={greyRightArrow}
              alt=">"
              style={{ width: "7px", height: "12px", marginRight: "15px" }}
            />
          </BottomMenu>
        </TicketingStatusDiv>
      </MenuContainer>
      <FooterNav />
    </ViewContainer>
  );
};

export default AdminHome;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100vw; /* 전체 너비 */
  height: 100vh; /* 전체 높이 */
  background: #f5f4ff; /* 배경색 적용 */
`;

const AppTitle = styled.div`
  display: flex;
  gap: 6px;
  align-items: center; // 세로 배열 가운데 정렬
  margin-left: 25px;
  margin-top: 15px;
`;
const MainName = styled.h1`
  color: #6a39c0;
  font-family: "S-Core Dream";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const MainContainer = styled.div`
  display: flex;
  align-items: center; // 세로 배열 가운데 정렬
  justify-content: space-between;
  width: 100%;
  padding-left: 30px;

  //   border: 1px solid var(--grey-grey7, #3c3c3c);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MainText = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
  color: var(--grey-grey7, #3c3c3c);
`;
const Highlight = styled.span`
  color: var(--Main, #6a39c0);
`;

const CharacterImg = styled.img`
  height: 215px;
  //   border: 1px solid var(--grey-grey7, #3c3c3c);
`;

const LiveSeatButton = styled.button`
  display: inline-flex;
  width: auto; /* 버튼 크기가 내용에 맞게 조정됨 */
  border-radius: 50px;
  padding: 7px 17px;
  justify-content: center;
  align-items: center;
  gap: 9px;
  background: var(--purple-purple-4-main, #6a39c0);
  border: none;

  color: var(--ect-white, #fff);
  text-align: center;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 25px;
  gap: 20px;
`;
const LockButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 19px;
`;

const TicketingStatusDiv = styled.div`
  width: 343px;
  height: 155px;
  flex-shrink: 0;
  border-radius: 10px;

  box-shadow: -1px 9px 20px 0px rgba(0, 0, 0, 0.08);
`;

const TopMenu = styled.div`
  background: var(--ect-white, #fff);
  border-radius: 16px 16px 0 0;
  padding-top: 17px;
  padding-bottom: 15px;
`;

const TicketingStatusTitle = styled.p`
  margin-left: 18px;
`;
const BarContainer = styled.div`
  position: relative;
  width: 306px;
  height: 19px;
  border-radius: 13px;
  background: var(--grey-grey-2, #f2f2f2);
  margin: 18px 15px 0 16px;
`;

const BarFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 19px;
  background: linear-gradient(90deg, #f5f4ff 0%, #dfcdff 100%);
  border-radius: 13px; /* 모서리 둥글게 */

  transition: width 0.3s ease; /* 애니메이션 효과 */
`;

const Circle = styled.div<{ position: number }>`
  position: absolute;
  left: ${({ position }) => `calc(${position}% - 10px)`};
  transform: translateY(-50%); /* 세로 중앙 정렬 */
  top: 50%;
  width: 23px;
  height: 23px;
  transition: all 0.3s ease; /* 애니메이션 효과 */

  background-color: var(--ect-white, #fff);
  border-radius: 50%; /* 원형 유지 */
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.15);
`;

const TicketingPercent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 18px;
  margin-right: 10px;
  margin-top: 8px;
`;

const BottomMenu = styled.div`
  text-align: right;
  margin-top: 8px;
`;
