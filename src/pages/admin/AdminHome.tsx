import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, createSearchParams } from "react-router-dom";

import {
  fetchAdminEnter,
  PerformanceInfo
} from "../../api/admin/AdminAuthApi.ts";

import FooterNav from "@components/layout/footers/FooterNav.tsx";
import SeatLockButton from "@components/common/buttons/WhiteBoxBtn.tsx";

import podoLogo from "../../assets/images/admin/mainLogo.png";
import rightArror from "../../assets/images/admin/white_right-arrow.png";
import lockIcon from "../../assets/images/admin/lock_icon.png";
import unlockIcon from "../../assets/images/admin/unlock_icon.png";
import greyRightArrow from "../../assets/images/admin/grey_right_arrow.png";
import character from "../../assets/images/admin/character.png";
import character_100 from "../../assets/images/admin/100_character.png";
import plus_icon from "../../assets/images/admin/tabler_plus.png";

const AdminHome = () => {
  const [performance, setPerformance] = useState<PerformanceInfo[] | null>(
    null
  );
  const [, setLoading] = useState(true);

  const navigate = useNavigate();

  // 홈 화면 진입 시에
  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
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

  const handleMoveLockingPage = (isLocking: boolean) => {
    const params = { manage: isLocking ? "lock" : "unlock" };
    navigate({
      pathname: "/home/manage",
      search: `?${createSearchParams(params)}`, // Query Parameters 추가
    });
  };

  /**
   * 현재 시간과 가장 가까운 공연을 찾는 함수
   */
  const getClosestPerformance = (
    performances: PerformanceInfo[]
  ): PerformanceInfo | null => {
    if (performances.length === 0) return null;

    const now = new Date().getTime(); // 현재 시간

    return performances.reduce((closest, current) => {
      const closestTimeDiff = Math.abs(
        new Date(closest.date_time).getTime() - now
      );
      const currentTimeDiff = Math.abs(
        new Date(current.date_time).getTime() - now
      );

      return currentTimeDiff < closestTimeDiff ? current : closest;
    });
  };

  // 가장 가까운 공연 정보 가져오기
  const nextPerformance =
    performance && Array.isArray(performance) && performance.length > 0
      ? getClosestPerformance(performance)
      : null;

  const isLastPerformance =
    performance && nextPerformance
      ? performance[performance.length - 1].id === nextPerformance.id
      : false;

  // 공연 시작까지 남은 시간 계산
  const getMinutesUntilShowtime = (
    dateTime: string,
    isLastPerformance: boolean
  ): string | null => {
    const now = new Date();
    const showTime = new Date(dateTime);

    const minutesLeft = Math.floor(
      (showTime.getTime() - now.getTime()) / (1000 * 60)
    );

    // 60분 이상일 경우 "X시간 Y분" 형식으로 변환
    if (minutesLeft >= 60) {
      const hours = Math.floor(minutesLeft / 60);
      const minutes = minutesLeft % 60;
      return `${hours}시간 ${minutes}`;
    }

    console.log(isLastPerformance);

    // 만약 마지막 공연이라면 -30분이 지나면 null 반환
    if (isLastPerformance && minutesLeft < -30) {
      return null;
    }

    return `${Math.max(0, minutesLeft)}`;
  };

  const minutesLeft = nextPerformance
    ? getMinutesUntilShowtime(nextPerformance.date_time, isLastPerformance)
    : 0;
  const issuedTickets = nextPerformance ? nextPerformance.booked : 0;
  const totalTickets = nextPerformance ? nextPerformance.user : 0;
  const issuingProgress = totalTickets
    ? Math.round((issuedTickets / totalTickets) * 100)
    : 0;

  console.log(minutesLeft);

  return (
    <ViewContainer>
      <AppTitle>
        <img src={podoLogo} style={{ width: "18px" }} />
        <MainName>포도티켓</MainName>
      </AppTitle>

      <MainContainer>
        <TextContainer>
          {performance === null || minutesLeft === null ? (
            <div
              className="Podo-Ticket-Body-B1"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                color: "var(--grey-7)",
              }}
            >
              <p>예정된 공연이 없어요!</p>
              <p> 새로운 공연을 등록하세요!</p>
            </div>
          ) : (
            <>
              <MainText className="Podo-Ticket-Body-B1">
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

          <LiveSeatButton>
            {performance === null || minutesLeft === null ? (
              <ButtonText className="Podo-Ticket-Headline-H5">
                새로운 공연 등록
                <img
                  style={{ width: "14px", height: "14px" }}
                  src={plus_icon}
                  alt="플러스 아이콘"
                />
              </ButtonText>
            ) : (
              <ButtonText
                className="Podo-Ticket-Headline-H5"
                onClick={() => {
                  navigate("realtime");
                }}
              >
                실시간 좌석 현황{" "}
                <img
                  style={{ width: "7px", height: "12px" }}
                  src={rightArror}
                  alt="화살표 아이콘"
                />
              </ButtonText>
            )}
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
              handleMoveLockingPage(true);
            }}
          />
          <SeatLockButton
            iconSrc={unlockIcon}
            title="좌석 잠금 해제"
            description="좌석 이용을 다시 활성화할 수 있어요!"
            onClick={() => {
              handleMoveLockingPage(false);
            }}
          />
        </LockButtonDiv>

        {/* 발권진행률 */}
        <TicketingStatusDiv>
          <TopMenu>
            <TicketingStatusTitle>
              {issuingProgress === 100 ? (
                <span
                  className="Podo-Ticket-Headline-H5"
                  style={{ color: "var(--grey-7)" }}
                >
                  발권이 모두 완료되었어요!
                </span>
              ) : (
                <>
                  <Highlight className="Podo-Ticket-Headline-H3">
                    {minutesLeft === null ? 0 : totalTickets - issuedTickets}건
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
                className="Podo-Ticket-Body-B11"
                style={{
                  color: "var(--grey-6)",
                  fontSize: "10px",
                  fontWeight: "500",
                }}
              >
                발권진행률
              </p>
              <span
                className="Podo-Ticket-Headline-H6"
                style={{
                  color: "var(--purple-4)",
                  textAlign: "right",
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {minutesLeft === null ? 0 : issuingProgress}%
              </span>
            </TicketingPercent>
          </TopMenu>
          <BottomMenu
            onClick={() => {
              navigate("/reserved");
            }}
          >
            <span
              className="Podo-Ticket-Headline-H6"
              style={{
                color: "var(--grey-7)",
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
  margin: 0 auto;
  width: 100vw; /* 전체 너비 */
  height: 100vh; /* 전체 높이 */
  background: #f5f4ff; /* 배경색 적용 */
`;

const AppTitle = styled.div`
  display: flex;
  max-width: calc(100vw - 50px); /* 정확하게 양쪽 25px씩 띄우기 */
  width: 100%;
  margin: 0 auto;
  align-items: center; // 세로 배열 가운데 정렬
  gap: 6px;

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
  position: relative; /* 내부 요소를 상대적으로 배치할 수 있도록 설정 */
  align-items: center; // 세로 배열 가운데 정렬
  justify-content: space-between;
  width: 100vw;
  margin: 0 auto;
  padding-left: 30px;
  height: 225px;
  // border: 1px solid var(--grey-7);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  // border: 1px solid var(--grey-7);
`;

const MainText = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
  color: var(--grey-7);
`;
const Highlight = styled.span`
  color: var(--purple-4);
`;

const CharacterImg = styled.img`
  height: 215px;
  position: absolute;
  right: 0; /* 화면 오른쪽 끝에 붙이기 */

  // border: 1px solid var(--grey-7);
`;

const LiveSeatButton = styled.button`
  border-radius: 50px;
  padding: 0px;

  justify-content: center;
  align-items: center;
  gap: 9px;
  background: var(--purple-4);
  border: none;

  width: 148px;
  height: 40px;

  color: var(--ect-white);
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 50px); /* 정확하게 양쪽 25px씩 띄우기 */
  width: 100%;
  margin: 0 auto;
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
  background: var(--ect-white);
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
  background: var(--grey-2);
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

  background-color: var(--ect-white);
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
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 8px;
  align-items: center; // 세로 배열 가운데 정렬
  justify-content: right;
  gap: 10px;
`;

const ButtonText = styled.div`
  display: flex;
  align-items: center; // 세로 배열 가운데 정렬
  justify-content: center;
  gap: 8px;
`;
