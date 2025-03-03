import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import TicketCarousel from '../../components/slide/TicketCarousel.tsx'
import TopNav from '../../components/nav/TopNav.tsx';
import TheaterInfoModal from '../../components/modal/TheaterInfoModal.tsx'
import FinishTicketingModal from '../../components/modal/NoticeModal.tsx';

import infoIcon from '../../assets/images/info_icon.png';

import { fetchTickets } from "../../api/user/TicketApi";
import { fadeIn, fadeOut } from '../../styles/animation/DefaultAnimation.ts'

interface Ticket {
    id: string;
    title: string;
    location: string;
    dateTime: string;
    seat: string;
    runningTime: number;
    image: string;
}

const Ticket = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 티켓 인덱스

    const [isSurveied, setIsSurveied] = useState(false);
    const [isFinshTicketingModalOpen, setIsFinishTicketingModalOpen] = useState(false);

    const [isTheaterInfoModalOpen, setIsTheaterInfoModalOpen] = useState(false);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupClosing, setIsPopupClosing] = useState(false); // fade-out 상태 추가

    // 티켓 정보 가져오기
    useEffect(() => {
        const loadTickets = async () => {
            try {
                const { tickets, isSurveyed } = await fetchTickets(); // 분리된 API 호출 함수 사용
                setTickets(tickets); // 티켓 상태 업데이트
                setIsSurveied(isSurveyed); // 설문 여부 상태 업데이트
                console.log(tickets);
            } catch (error) {
                console.error("Error loading tickets:", error);
            }
        };
        loadTickets(); // 티켓 데이터 가져오기
        setIsFinishTicketingModalOpen(true); // 모달 열기
    }, []);

    // 현재 티켓이 존재하는지 확인
    const currentTicket = tickets[currentIndex];

    const closeTheaterInfoModal = () => { setIsTheaterInfoModalOpen(false); };

    const closeFinishTicketingModal = () => {
        setIsFinishTicketingModalOpen(false); // Finish Ticketing Modal 닫기
        togglePopup()
    };

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        if (!isPopupVisible) {
            // 말풍선이 열릴 때 3초 후 닫히도록 설정
            setTimeout(() => {
                setIsPopupClosing(true); // fade-out 효과 시작
                setTimeout(() => {
                    setIsPopupVisible(false);
                    setIsPopupClosing(false); // 상태 초기화
                }, 350); // fade-out이 끝난 후 상태 초기화
            }, 3000); // 3000ms = 3초
        }
    };

    const righter = {
        icon: infoIcon,
        iconWidth: 26,
        iconHeight: 26,
        text: "티켓 정보",
        clickFunc: () => setIsTheaterInfoModalOpen(true)
    }

    const handleActiveIndexChange = (index: number) => {
        console.log("현재 Active Index:", index);
        setCurrentIndex(index); // 부모 컴포넌트에서 active index 업데이트
    };

    return (
        <ViewContainer>
            <TopNavContainer>
                <TopNav lefter={null} center={righter} righter={righter} />
                {isPopupVisible && (
                    <SpeechBubble isClosing={isPopupClosing}>
                        <div>길을 못 찾겠다면?</div>
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
                />
            </TicketCarouselContainer>

            <TheaterInfoModal
                showTheaterInfoModal={isTheaterInfoModalOpen}
                onAcceptFunc={closeTheaterInfoModal}
            />

            <FinishTicketingModal
                showNoticeModal={isFinshTicketingModalOpen}
                imgStatus="success"
                title="발권 완료"
                description="바로 입장해주시면 됩니다!"
                onAcceptFunc={closeFinishTicketingModal}
            />

        </ViewContainer>
    );
};

export default Ticket;

const ViewContainer = styled.div`

`;

const TopNavContainer = styled.div`
position: relative;
`;

const SpeechBubble = styled.div.attrs({ className: 'Podo-Ticket-Body-B7' }) <{ isClosing: boolean }>`
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

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s ease-in-out;

  &::after {
    content: '';
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
flex-direction : column;

gap: 25px;
margin-bottom: 30px;
`;

const TicketIndex = styled.div.attrs({ className: 'Podo-Ticket-Headline-H4' })`
display: flex;
justify-content: center;
align-items: center;

gap: 3px;

color: var(--grey-5);
`;

const CurrentTicketIndex = styled.span.attrs({ className: 'Podo-Ticket-Headline-H2' })`
color: var(--purple-4);
`;

const DummyComponent = styled.span``;