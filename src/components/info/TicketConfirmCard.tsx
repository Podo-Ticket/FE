import React from 'react'
import styled from 'styled-components'

interface TicketConfirmCardProps {
    poster: string;
    title: string;
    dateTime: string;
    location: string;
    seats: string[];
}

const chunkArray = (array: string[], size: number): string[][] => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const TicketConfirmCard: React.FC<TicketConfirmCardProps> = ({ poster, title, dateTime, location, seats }) => {
    const seatGroups = chunkArray(seats, 4);

    return (
        <TicketConfirmCardContainer>
            <CardTitle>발권 정보 요약</CardTitle>

            <CardContent>
                <PosterContainer>
                    <Poster src={poster} alt="공연 포스터" />
                </PosterContainer>

                <Details>
                    <Title>{title}</Title>
                    <DetailsRow>
                        <Label>시간</Label>
                        <Text>{dateTime}</Text>
                    </DetailsRow>
                    <DetailsRow>
                        <Label>장소</Label>
                        <Text>{location}</Text>
                    </DetailsRow>
                    {seatGroups.map((group, index) => (
                        <DetailsRow key={index}>
                            {index === 0 && <Label>좌석</Label>}
                            {index !== 0 && <div style={{ width: '37.5px' }}></div>}
                            <Text>{group.join(", ")}</Text>
                        </DetailsRow>
                    ))}
                </Details>

            </CardContent>
        </TicketConfirmCardContainer>
    )
}

export default TicketConfirmCard

const TicketConfirmCardContainer = styled.div`
display: flex;
justify-content: center;
flex-direction: column;

border-radius: 10px;
background: var(--grey-2);

gap: 20px;
padding: 23px 25px;

user-select: none; /* 텍스트 선택 방지 */
-webkit-user-select: none; /* Safari에서 드래그 방지 */
-moz-user-select: none; /* Firefox에서 드래그 방지 */
-ms-user-select: none;
`;

const CardTitle = styled.span.attrs({ className: 'Podo-Ticket-Headline-H4' })`
    color: var(--ect-black);
`;

const CardContent = styled.div`
    display: flex;

    gap: 12px;
`;

const PosterContainer = styled.div`
    width: 114px;
    border-radius: 10px;
    box-shadow: 0px 0px 9px 6px rgba(0, 0, 0, 0.03);

    margin-bottom: 7px;
`;

const Poster = styled.img`
    width: 100%;
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;

    gap: 10px;
`;

const Title = styled.span.attrs({ className: 'Podo-Ticket-Headline-H5' })`
color: var(--ect-black);
`;

const DetailsRow = styled.div`
display: flex;
align-items: center;

gap: 8px;

color: var(--grey-7);
`;

const Label = styled.span.attrs({ className: 'Podo-Ticket-Body-B9' })`

border-radius: 30px;
border: 1px solid var(--grey-3);
background: var(--ect-white);

padding: 0 8px;

color: var(--grey-6);
`;

const Text = styled.span.attrs({ className: 'Podo-Ticket-Body-B7' })`
color: var(--grey-7);
`;