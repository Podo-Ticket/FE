import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import GetTicketBtn from "../../components/button/LargeBtn";
import TicketConfirmCard from "../../components/info/TicketConfirmCard";
import Loading from "../../components/loading/Loading";
import Success from "../../components/loading/Success";
import NoticeModal from "../../components/modal/NoticeModal";

import poster from "../../assets/images/posters/24th_SeoulNationalUniv_Riveract_poster.jpg";
import confirmIcon from "../../assets/images/confirm_icon.png";
import backIcon from "../../assets/images/left_arrow.png";

import { DateUtil } from "../../utils/DateUtil";
import {
  fetchTicketingInfo,
  handleTicketIssuance,
  TicketInfo,
  cancelSeatSelection,
} from "../../api/user/TicketConfirmationApi";

const TicketConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [ticketInfo, setTicketInfo] = useState<TicketInfo>();
  const selectedSeats = location.state ? location.state.selectedSeats : []; // 선택한 좌석

  const [showTimeOutModal, setShowTimeOutModal] = useState<boolean>(false); // 모달 표시 여부

  // 티켓 정보 가져오기
  useEffect(() => {
    const loadTicketingInfo = async () => {
      try {
        const info = await fetchTicketingInfo();
        setTicketInfo(info);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    loadTicketingInfo();
  }, []);

  // 브라우저 뒤로가기를 눌렀을 때 top navigation bar 뒤로가기와 같은 처리
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

  // 창 닫기를 눌렀을 때 top navigation bar 뒤로가기와 같은 처리
  useEffect(() => {
    const handlePopState = () => {
      handleBack();
    };

    // 뒤로가기 이벤트 리스너 추가
    window.addEventListener("beforeunload", handlePopState);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("beforeunload", handlePopState);
    };
  }, [navigate]);

  // 뒤로가기 처리
  const handleBack = async () => {
    try {
      const success = await cancelSeatSelection(); // API 호출
      if (success) {
        navigate("/select", { state: { from: "/confirm" } }); // 성공 시 선택 페이지로 이동
      } else {
        console.log("이미 발권 신청이 완료되었습니다."); // 실패 메시지 설정
      }
    } catch (error: any) {
      console.error(error.message);
      console.log("발권 신청을 취소하는 데 실패했습니다."); // 오류 메시지 설정
    }
  };

  // 티켓 발권 처리
  const handleIssuance = async () => {
    setIsLoading(true);
    await delay(500); // 로딩 애니메이션 시간

    try {
      const success = await handleTicketIssuance(selectedSeats);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigate("/ticket");
        }, 1000);
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 타이머를 3분으로 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeOutModal(true); // 3분 후 모달을 띄움
    }, 3 * 60 * 1000); // 3분 (3 * 60 * 1000ms)

    return () => {
      clearTimeout(timer); // 타이머 정리
    };
  }, []);

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackIcon src={backIcon} onClick={handleBack} />
      </Header>

      {/* Main Content */}
      <TopContent>
        <Icon src={confirmIcon} alt="확인 아이콘" />
        <Title className="Podo-Ticket-Headline-H2">선택한 좌석으로</Title>
        <Title className="Podo-Ticket-Headline-H2">티켓 발권 해드릴까요?</Title>
        <Warning className="Podo-Ticket-Body-B6">
          발권 이후 좌석 변경은 불가합니다.
        </Warning>
      </TopContent>

      <Divider />

      <BottomContent>
        {ticketInfo && (
          <TicketConfirmCard
            title={ticketInfo.title}
            poster={poster}
            dateTime={DateUtil.formatDate(ticketInfo.date)}
            location={ticketInfo.location}
            seats={selectedSeats}
          />
        )}

        <ButtonContainer>
          <GetTicketBtn
            content="티켓 발권"
            onClick={handleIssuance}
            isAvailable={true}
          />
        </ButtonContainer>
      </BottomContent>

      <NoticeModal
        showNoticeModal={showTimeOutModal}
        title="티켓 발권 시간이 만료되었습니다."
        description="원하는 좌석을 다시 선택해주세요."
        buttonContent="확인"
        onAcceptFunc={() => {
          setShowTimeOutModal(false);
          navigate("/select");
        }}
      />

      <Loading showLoading={isLoading} />
      <Success showSuccess={isSuccess} />
    </Container>
  );
};

export default TicketConfirmation;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-left: 37px;

  @media (max-resolution: 2dppx) {
    margin-top: 60px;
    margin-left: 55.5px;
  }
  @media (min-resolution: 3dppx) {
    margin-top: 40px;
    margin-left: 37px;
  }
`;

const BackIcon = styled.img`
  width: 13px;
  height: 20px;

  @media (max-resolution: 2dppx) {
    width: 19.5 px;
    height: 30px;
  }
  @media (min-resolution: 3dppx) {
    width: 13px;
    height: 20px;
  }
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 15px;

  align-items: center;

  @media (max-resolution: 2dppx) {
    padding: 0 22.5px;
  }
  @media (min-resolution: 3dppx) {
    padding: 0 15px;
  }
`;

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 15px;

  align-items: center;

  @media (max-resolution: 2dppx) {
    padding: 0 22.5px;
  }
  @media (min-resolution: 3dppx) {
    padding: 0 15px;
  }
`;

const Icon = styled.img`
  width: 57px;
  height: 55px;
  margin-bottom: 20px;

  @media (max-resolution: 2dppx) {
    width: 85.5px;
    height: 82.5px;
    margin-bottom: 30px;
  }
  @media (min-resolution: 3dppx) {
    width: 57px;
    height: 55px;
    margin-bottom: 20px;
  }
`;

const Title = styled.span`
  margin-bottom: 10px;

  color: var(--charcoal-black);
  text-align: center;

  @media (max-resolution: 2dppx) {
    margin-bottom: 15px;
  }
  @media (min-resolution: 3dppx) {
    margin-bottom: 10px;
  }
`;

const Warning = styled.span`
  margin-bottom: 30px;

  color: var(--red-1);

  @media (max-resolution: 2dppx) {
    margin-bottom: 45px;
  }
  @media (min-resolution: 3dppx) {
    margin-bottom: 10px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 12px;

  margin-bottom: 30px;
  background-color: var(--grey-2);

  @media (max-resolution: 2dppx) {
    height: 18px;
    margin-bottom: 45px;
  }
  @media (min-resolution: 3dppx) {
    height: 12px;
    margin-bottom: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 30px;

  @media (max-resolution: 2dppx) {
    margin-top: 45px;
  }
  @media (min-resolution: 3dppx) {
    margin-top: 30px;
  }
`;
