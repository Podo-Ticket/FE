import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import TicketCarousel from '../../components/slide/TicketCarousel.tsx'
import TopNav from '../../components/nav/TopNav.tsx';
//import EvaluationModal from '../../components/Modal/EvaluationModal';
//import PlusInfoModal from '../../components/Modal/PlusInfoModal';
//import CompleteTicketingModal from '../../components/Modal/CompleteTicketingModal';

import poster from '../../assets/images/poster.jpeg';
import infoIcon from '../../assets/images/info_icon.png';

import { DateUtil } from '../../utils/DateUtil'
import { fetchTickets } from "../../api/user/TicketApi";

interface Ticket {
    id: string;
    title: string;
    location: string;
    dateTime: string;
    seat: string;
    image: string;
}

const Ticket = () => {
    const popupRef = useRef(null);

    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 티켓 인덱스
    const [isPlusInfoModalOpen, setIsPlusInfoModalOpen] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isSurveied, setIsSurveied] = useState(false);
    const [isCompleteTicketingModalOpen, setIsCompleteTicketingModalOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false); // fade-out 상태 추가

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

        // 컴포넌트가 마운트될 때 모달 열기
        setIsCompleteTicketingModalOpen(true); // 모달 열기
    }, []); // 컴포넌트 마운트 시 한 번 호출

    const closeModal = () => {
        setIsEvaluationModalOpen(false); // 모달 닫기 함수
        togglePopup();
    };

    const closePlusInfoModal = () => {
        setIsPlusInfoModalOpen(false); // 공연장 정보 모달 닫기
    };

    const closeCompleteTicketingModal = () => {
        setIsCompleteTicketingModalOpen(false); // 모달 닫기
        setIsEvaluationModalOpen(true); // 평가 모달 열기
    };

    // 현재 티켓이 존재하는지 확인
    const currentTicket = tickets[currentIndex];

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        if (!isPopupVisible) {
            // 말풍선이 열릴 때 3초 후 닫히도록 설정
            setTimeout(() => {
                setIsFadingOut(true); // fade-out 효과 시작
                setTimeout(() => {
                    setIsPopupVisible(false);
                    setIsFadingOut(false); // 상태 초기화
                }, 500); // fade-out이 끝난 후 상태 초기화
            }, 3000); // 3000ms = 3초
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const righter = {
        icon: infoIcon,
        iconWidth: 26,
        iconHeight: 26,
        text: "티켓 정보",
        clickFunc: () => setIsPlusInfoModalOpen(true)
    }

    const handleActiveIndexChange = (index: number) => {
        console.log("현재 Active Index:", index);
        setCurrentIndex(index); // 부모 컴포넌트에서 active index 업데이트
    };

    return (
        <ViewContainer>
            <TopNav lefter={null} center={righter} righter={righter} />

            <TicketCarouselContainer>
                <TicketIndex>
                    <CurrentTicketIndex>{currentIndex + 1}</CurrentTicketIndex>
                    <DummyComponent>/</DummyComponent>
                    <DummyComponent>{tickets.length}</DummyComponent>
                </TicketIndex>
                <TicketCarousel ticketCount={tickets.length} onActiveIndexChange={handleActiveIndexChange} />
            </TicketCarouselContainer>

            {currentTicket && ( // currentTicket이 존재할 때만 정보 표시
                <CurrentTicketInfo>
                    <CurrentTicketDetail>
                        <Title>{currentTicket.title}</Title>
                        <Description>{currentTicket.dateTime}</Description>
                        <Description>{currentTicket.location}</Description>
                    </CurrentTicketDetail>
                    <CurrentTicketSeat>
                        <SeatLabel>좌석</SeatLabel>
                        <SeatDetail className="ticketing-seat-num">
                            {currentTicket.seat.replace(/([^\d]*)(\d)/, '$1')} {/* 첫 번째 숫자 제거 */}
                        </SeatDetail>
                    </CurrentTicketSeat>
                </CurrentTicketInfo>
            )}

        </ViewContainer>
    );
};

export default Ticket;

const ViewContainer = styled.div`

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

const CurrentTicketInfo = styled.div`
display: flex;
flex-direction : column;
justify-content: center;
align-items: center;

gap: 20px;

`;

const CurrentTicketDetail = styled.div`
display: flex;
flex-direction : column;
justify-content: center;
align-items: center;
`;

const Title = styled.div.attrs({ className: 'Podo-Ticket-Headline-H2' })`
padding-bottom: 10px;

color: var(--grey-7);
`;

const Description = styled.div.attrs({ className: 'Podo-Ticket-Body-B4' })`
color: var(--grey-6);
`;

const CurrentTicketSeat = styled.div`
display: flex;
justify-content: center;
align-items: center;

border-radius: 20px;
border: 1px solid var(--purple-7);
background: var(--lightpurple-2);

gap: 5px;
padding: 6px 19px;

color: var(--purple-4);
`;

const SeatLabel = styled.span.attrs({ className: 'Podo-Ticket-Body-B3' })`

`;

const SeatDetail = styled.span.attrs({ className: 'Podo-Ticket-Headline-H3' })`

`;

const DummyComponent = styled.span``;