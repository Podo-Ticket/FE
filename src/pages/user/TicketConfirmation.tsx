import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import GetTicketBtn from "@components/common/buttons/LargeBtn";
import TicketConfirmCard from "@components/pages/customer/ticketConfirmation/TicketConfirmCard";
import Loading from "@components/common/loadings/Loading";
import Success from "@components/common/loadings/Success";
import NoticeModal from "@components/common/modals/NoticeModal";
import NoSuchCustomerModal from "@components/common/modals/NoticeModal.tsx";

import poster from "@/assets/images/posters/2025_Spring_KwangwoonUniv_poster.png";

import confirmIcon from "../../assets/images/confirm_icon.png";
import backIcon from "../../assets/images/left_arrow.png";

import { DateUtil } from "../../utils/DateUtil";
import { TICKET_CONFIRMATION } from "@/constants/text/UIText";
import {
  fetchTicketingInfo,
  handleTicketIssuance,
  TicketInfo,
  cancelSeatSelection,
} from "../../api/user/TicketConfirmationApi";
import { Language } from "../../constants/text/Language.ts";

const TicketConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language =
    localStorage.getItem("language") === "english"
      ? Language.English
      : Language.Korean;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [ticketInfo, setTicketInfo] = useState<TicketInfo>();

  const selectedSeats = location.state ? location.state.selectedSeats : [];

  const [showTimeOutModal, setShowTimeOutModal] = useState<boolean>(false);
  const [showNoSuchCustomerModal, setShowNoSuchCustomerModal] =
    useState<boolean>(false);

  // 티켓 정보 가져오기
  useEffect(() => {
    const loadTicketingInfo = async () => {
      try {
        const info = await fetchTicketingInfo();
        setTicketInfo(info);

        // setTicketTitle(
        //   language === Language.English ? info.title : info.en_title
        // );
        localStorage.setItem("isForceLogout", "false");
      } catch (error: any) {}
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
    if (localStorage.getItem("isForceLogout") === "true") return;

    try {
      const success = await cancelSeatSelection(); // API 호출
      if (success) {
        navigate("/select", { state: { from: "/confirm" } }); // 성공 시 선택 페이지로 이동
      } else {
      }
    } catch (error: any) {}
  };

  // 티켓 발권 처리
  const handleIssuance = async () => {
    setIsLoading(true);
    await delay(500);

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
      if (error.message == "예매 내역 확인 불가")
        setShowNoSuchCustomerModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeOutModal(true); // 3분 후 모달을 띄움
    }, 3 * 60 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Container>
      <Header>
        <BackIcon src={backIcon} onClick={handleBack} />
      </Header>

      <TopContent>
        <Icon src={confirmIcon} alt="확인 아이콘" />
        <Title className="Podo-Ticket-Headline-H2">
          {language === "english"
            ? TICKET_CONFIRMATION.english.doubleCheckIssue
            : TICKET_CONFIRMATION.korean.doubleCheckIssue}
        </Title>
        <div style={{ height: "30px" }} />
      </TopContent>

      <Divider />

      <BottomContent>
        {ticketInfo && (
          <TicketConfirmCard
            title={ticketInfo.title}
            en_title={ticketInfo.en_title}
            en_location={ticketInfo.en_location}
            poster={poster}
            dateTime={DateUtil.formatDate(ticketInfo.date, language)}
            location={ticketInfo.location}
            seats={ticketInfo.seats}
          />
        )}

        <ButtonContainer>
          <GetTicketBtn
            content={
              language === "english"
                ? TICKET_CONFIRMATION.english.pickupBtn
                : TICKET_CONFIRMATION.korean.pickupBtn
            }
            onClick={handleIssuance}
            isAvailable={true}
          />
        </ButtonContainer>
      </BottomContent>

      <NoticeModal
        showNoticeModal={showTimeOutModal}
        title={
          language === "english"
            ? TICKET_CONFIRMATION.english.TimeoutModalTitle
            : TICKET_CONFIRMATION.korean.TimeoutModalTitle
        }
        description={
          language === "english"
            ? TICKET_CONFIRMATION.english.TimeoutModalSubitle
            : TICKET_CONFIRMATION.korean.TimeoutModalSubitle
        }
        buttonContent={
          language === "english"
            ? TICKET_CONFIRMATION.english.TimeoutModalAccept
            : TICKET_CONFIRMATION.korean.TimeoutModalAccept
        }
        onAcceptFunc={() => {
          setShowTimeOutModal(false);
          navigate("/select");
        }}
      />

      <NoSuchCustomerModal
        showNoticeModal={showNoSuchCustomerModal}
        imgStatus="danger"
        title={
          language === "english"
            ? TICKET_CONFIRMATION.english.NoSuchCustomerModalTitle
            : TICKET_CONFIRMATION.korean.NoSuchCustomerModalTitle
        }
        description={
          language === "english"
            ? TICKET_CONFIRMATION.english.NoSuchCustomerModalSubitle
            : TICKET_CONFIRMATION.korean.NoSuchCustomerModalSubitle
        }
        buttonContent={
          language === "english"
            ? TICKET_CONFIRMATION.english.NoSuchCustomerModalAccpet
            : TICKET_CONFIRMATION.korean.NoSuchCustomerModalAccpet
        }
        onAcceptFunc={() => {
          setShowNoSuchCustomerModal(false);
          navigate("/");
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
  margin-left: 37px;

  @media (max-resolution: 2dppx) {
    margin-top: 30px;
    margin-left: 55.5px;
  }
  @media (min-resolution: 3dppx) {
    margin-top: 20px;
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

  width: 100%;
  margin-top: 30px;

  @media (max-resolution: 2dppx) {
    margin-top: 45px;
  }
  @media (min-resolution: 3dppx) {
    margin-top: 30px;
  }
`;
