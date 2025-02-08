import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import GetTicketBtn from '../../components/button/LargeBtn';

import poster from '../../assets/images/poster.jpeg';
import confirmIcon from '../../assets/images/confirm_icon.png';
import backIcon from '../../assets/images/left_arrow.png'

import { fetchTicketingInfo, handleTicketIssuance } from '../../api/user/TicketConfirmationApi';

const TicketConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [ticketInfo, setTicketInfo] = useState(null);


    const selectedSeats = location.state ? location.state.selectedSeats : []; // 선택한 좌석

    // 티켓 정보 가져오기
    useEffect(() => {
        const loadTicketingInfo = async () => {
            try {
                const info = await fetchTicketingInfo(selectedSeats);
                setTicketInfo(info);
            } catch (error) {
                console.error(error.message);
            }
        };

        loadTicketingInfo();
    },[]);

    // 티켓 발권 처리
    const handleIssuance = async () => {
        try {
            const success = await handleTicketIssuance(selectedSeats);

            if (success) {
                setTimeout(() => navigate('/ticket'), 1000); // 성공 시 티켓 페이지로 이동
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleBack = () => {
        navigate("/select", { state: { from: "/confirm" } });
      };

    return (
        <Container>
            {/* Header */}
            <Header>
                <BackIcon src={backIcon} onClick={handleBack} />
            </Header>

            {/* Main Content */}
            <Content>
                <Icon src={confirmIcon} alt="확인 아이콘" />
                <Title className='Podo-Ticket-Headline-H2'>선택한 좌석으로</Title>
                <Title className='Podo-Ticket-Headline-H2'>티켓 발권 해드릴까요?</Title>
                <Warning className='Podo-Ticket-Body-B6'>발권 이후 좌석 변경은 불가합니다.</Warning>

                <Divider />

                {/* Ticket Information Card */}
                <InfoCard>
                    <CardTitle className='Podo-Ticket-Headline-H4'>발권 정보 요약</CardTitle>
                    <CardContent>
                        <PosterContainer>
                            {ticketInfo && <Poster src={poster} alt="공연 포스터" />}
                        </PosterContainer>

                        <Details>
                            {ticketInfo && (
                                <>
                                    <ShowTitle>{ticketInfo.title}</ShowTitle>
                                    <DetailsRow>
                                        <Label>시간</Label>
                                        <Text>{ticketInfo.date}</Text>
                                    </DetailsRow>
                                    <DetailsRow>
                                        <Label>장소</Label>
                                        <Text>{ticketInfo.location}</Text>
                                    </DetailsRow>
                                    <DetailsRow>
                                        <Label>좌석</Label>
                                        <Text>{selectedSeats.join(', ')}</Text>
                                    </DetailsRow>
                                </>
                            )}
                        </Details>
                    </CardContent>
                </InfoCard>

                {/* Button */}
                <GetTicketBtn
                    content="티켓 빌권"
                    onClick={handleIssuance}
                    isAvailable={true}
                />

            </Content>
        </Container>
    );
};

export default TicketConfirmation;

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
    margin-left: 37px;
`;

const BackIcon = styled.img`
width: 13px;
height: 20px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0 15px;

    align-items: center;
`;

const Icon = styled.img`
    width: 57px;
    height: 55px;
    margin-bottom: 20px;
`;

const Title = styled.span`
    margin-bottom: 10px;

    color: var(--charcoal-black);
    text-align: center;
`;

const Warning = styled.span`
    margin-bottom: 30px;

    color: var(--red-1);
`;

const Divider = styled.div`
    width: 120%;
    height: 12px;

    margin-bottom: 30px;
    background-color: var(--grey-2);
`;

const InfoCard = styled.div`
    width: 100%;
    background: var(--grey-2);
    border-radius: 10px;
    
    padding: 23px;  
    margin-bottom: 30px;
`;

const CardTitle = styled.h2`
    color: var(--ect-black, #000);
`;

const CardContent = styled.div`
    display: flex;
`;

const PosterContainer = styled.div`
    width: 114px;
`;

const Poster = styled.img`
    width: 100%;
`;

const Details = styled.div`
    display: flex;
`;

const ShowTitle = styled.span``;

const DetailsRow = styled.div``;

const Label = styled.span``;

const Text = styled.span``;

const Button = styled.button``;

