import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import TicketCarousel from "@components/pages/customer/tickets/TicketCarousel.tsx";
import TopNav from "@components/layout/headers/TopNav.tsx";
import TheaterInfoModal from "@components/common/modals/TheaterInfoModal.tsx";
import FinishTicketingModal from "@components/common/modals/NoticeModal.tsx";
import NoTicketsModal from "@components/common/modals/NoticeModal.tsx";
import CancelTicketBtn from "@components/common/buttons/SmallMoreBtn.tsx";
import GoSurveyModal from "@/components/common/modals/DefaultModal.tsx";
import CancelTicketModal from "@/components/common/modals/DefaultModal.tsx";

import surveyIcon from "../../assets/icons/ic_clipboard.svg";
import infoIcon from "../../assets/icons/ic_info.svg";

import { fetchTickets, deleteTickets } from "../../api/user/TicketApi.ts";
import { fadeIn, fadeOut } from "../../styles/animation/DefaultAnimation.ts";
import { ITicket } from "../../types/models/ticket.ts";
import { TICKET, SERVICE_FEEDBACK_MESSAGES } from "@/constants/text/UIText.ts";

const Ticket = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem("language");

  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOnSite, setIsOnSite] = useState(false);
  const [, setIsSurveied] = useState(false);

  const [isFinshTicketingModalOpen, setIsFinishTicketingModalOpen] =
    useState(false);
  const [isNoTicketsModalOpen, setIsNoTicketsModalOpen] = useState(false);
  const [isCancelTicketModalOpen, setIsCancelTicketModalOpen] = useState(false);
  const [isGoSurveyModalOpen, setIsGoSurveyModalOpen] = useState(false);
  const [isTheaterInfoModalOpen, setIsTheaterInfoModalOpen] = useState(false);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);

  // 티켓 정보 가져오기 API
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const { tickets, isSurveyed, isOnSite } = await fetchTickets();
        if (!tickets || tickets.length === 0) {
          setIsNoTicketsModalOpen(true);
          return;
        }
        setTickets(tickets);
        setIsSurveied(isSurveyed);
        setIsOnSite(isOnSite);
      } catch (error) {
      } finally {
        setIsFinishTicketingModalOpen(true);
      }
    };
    loadTickets();
  }, []);

  const noTicketsAccepetd = () => {
    setIsNoTicketsModalOpen(false);
    navigate("/");
  };

  const cancelTicket = async () => {
    try {
      await deleteTickets();
      navigate("/");
    } catch (error) {}
  };

  // 티켓에서 뒤로가기를 누를 경우 '/'으로 리다이렉트
  useEffect(() => {
    const handlePopState = () => {
      navigate("/");
    };

    // 뒤로가기 이벤트 리스너 추가
    window.addEventListener("popstate", handlePopState);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // 현재 티켓이 존재하는지 확인
  const currentTicket: any = tickets[currentIndex];

  const closeTheaterInfoModal = () => {
    setIsTheaterInfoModalOpen(false);
  };

  const closeFinishTicketingModal = () => {
    setIsFinishTicketingModalOpen(false); 
    togglePopup();
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    if (!isPopupVisible) {
      setTimeout(() => {
        setIsPopupClosing(true);
        setTimeout(() => {
          setIsPopupVisible(false);
          setIsPopupClosing(false);
        }, 350);
      }, 3000);
    }
  };

  const navTitle =
    language === "english" ? TICKET.english.pageTitle : TICKET.korean.pageTitle;

  const lefter = {
    icon: surveyIcon,
    iconWidth: 26,
    iconHeight: 26,
    text: navTitle,
    clickFunc: () => setIsGoSurveyModalOpen(true),
  };

  const righter = {
    icon: infoIcon,
    iconWidth: 26,
    iconHeight: 26,
    text: navTitle,
    clickFunc: () => setIsTheaterInfoModalOpen(true),
  };

  const handleActiveIndexChange = (index: number) => setCurrentIndex(index);
  return (
    <ViewContainer>
      <TopNavContainer>
        <TopNav lefter={lefter} center={righter} righter={righter} />
        {isPopupVisible && (
          <SpeechBubble isClosing={isPopupClosing}>
            <div>
              {language === "english"
                ? TICKET.english.popupMessage
                : TICKET.korean.popupMessage}
            </div>
          </SpeechBubble>
        )}
      </TopNavContainer>

      <TicketCarouselContainer>
        <TicketIndex>
          <CurrentTicketIndex>{currentIndex + 1}</CurrentTicketIndex>
          <DummyComponent>/</DummyComponent>
          <DummyComponent>{tickets.length}</DummyComponent>
        </TicketIndex>
        <TicketCarousel
          ticketCount={tickets.length}
          onActiveIndexChange={handleActiveIndexChange}
          currentTicketInfo={currentTicket}
          isOnSite={isOnSite}
        />

        <CancelTicketBtn
          onClick={() => setIsCancelTicketModalOpen(true)}
          isAvailable={true}
          className="Podo-Ticket-Headline-H5"
        >
          {language === "english"
            ? TICKET.english.ticketCancellation
            : TICKET.korean.ticketCancellation}
        </CancelTicketBtn>
      </TicketCarouselContainer>

      <TheaterInfoModal
        showTheaterInfoModal={isTheaterInfoModalOpen}
        onAcceptFunc={closeTheaterInfoModal}
      />

      <FinishTicketingModal
        showNoticeModal={isFinshTicketingModalOpen}
        imgStatus="success"
        title={
          language === "english"
            ? TICKET.english.issuedModalTitle
            : TICKET.korean.issuedModalTitle
        }
        description={
          language === "english"
            ? TICKET.english.issuedModalSubtitle
            : TICKET.korean.issuedModalSubtitle
        }
        buttonContent={
          language === "english"
            ? TICKET.english.issuedModalAccept
            : TICKET.korean.issuedModalAccept
        }
        onAcceptFunc={closeFinishTicketingModal}
      />

      <NoTicketsModal
        showNoticeModal={isNoTicketsModalOpen}
        imgStatus="danger"
        title={
          language === "english"
            ? TICKET.english.noTicketsModalTitle
            : TICKET.korean.noTicketsModalTitle
        }
        description={
          language === "english"
            ? TICKET.english.noTicketsModalSubtitle
            : TICKET.korean.noTicketsModalSubtitle
        }
        buttonContent={
          language === "english"
            ? TICKET.english.noTicketsModalAccept
            : TICKET.korean.noTicketsModalAccept
        }
        onAcceptFunc={noTicketsAccepetd}
      />

      <GoSurveyModal
        showDefaultModal={isGoSurveyModalOpen}
        title={
          language === "english"
            ? SERVICE_FEEDBACK_MESSAGES.english.title
            : SERVICE_FEEDBACK_MESSAGES.korean.title
        }
        description={
          language === "english"
            ? SERVICE_FEEDBACK_MESSAGES.english.description
            : SERVICE_FEEDBACK_MESSAGES.korean.description
        }
        onAcceptFunc={() => navigate("/survey")}
        onUnacceptFunc={() => setIsGoSurveyModalOpen(false)}
      />

      <CancelTicketModal
        showDefaultModal={isCancelTicketModalOpen}
        title={
          language === "english"
            ? TICKET.english.cancelTicketConfirmation
            : TICKET.korean.cancelTicketConfirmation
        }
        description={
          language === "english"
            ? TICKET.english.issuedSeatsCancelNotice
            : TICKET.korean.issuedSeatsCancelNotice
        }
        onAcceptFunc={cancelTicket}
        onUnacceptFunc={() => setIsCancelTicketModalOpen(false)}
      />
    </ViewContainer>
  );
};

export default Ticket;

const ViewContainer = styled.div``;

const TopNavContainer = styled.div`
  position: relative;
`;

const SpeechBubble = styled.div.attrs({ className: "Podo-Ticket-Body-B7" })<{
  isClosing: boolean;
}>`
  position: absolute;
  top: 85%;
  left: 82%;
  transform: translateX(-50%);

  width: 105px;
  background: var(--purple-4);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  padding: 10px 0;
  padding-left: 10px;
  padding-right: 0px;

  text-align: left;
  color: var(--ect-white);

  z-index: 1000;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s
    ease-in-out;

  &::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 75%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent var(--purple-4) transparent;
  }
`;

const TicketCarouselContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 25px;
  margin-bottom: 30px;
`;

const TicketIndex = styled.div.attrs({ className: "Podo-Ticket-Headline-H4" })`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 3px;

  color: var(--grey-5);
`;

const CurrentTicketIndex = styled.span.attrs({
  className: "Podo-Ticket-Headline-H2",
})`
  color: var(--purple-4);
`;

const DummyComponent = styled.span``;
