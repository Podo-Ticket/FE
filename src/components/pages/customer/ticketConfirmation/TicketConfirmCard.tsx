import React from "react";
import styled from "styled-components";

import { TICKET_CONFIRMATION } from "@/constants/text/UIText";

interface TicketConfirmCardProps {
  poster: string;
  title: string;
  en_title: string;
  en_location: string;
  dateTime: string;
  location: string;
  seats: string[] | string;
}

const TicketConfirmCard: React.FC<TicketConfirmCardProps> = ({
  poster,
  title,
  en_title,
  dateTime,
  location,
  en_location,
  seats,
}) => {
  const language = localStorage.getItem("language");

  return (
    <TicketConfirmCardContainer>
      <CardTitle>
        {language === "english"
          ? TICKET_CONFIRMATION.english.summaryTitle
          : TICKET_CONFIRMATION.korean.summaryTitle}
      </CardTitle>

      <CardContent>
        <Poster src={poster} alt="공연 포스터" />

        <Details>
          <Title> {language === "english" ? en_title : title}</Title>
          <DetailsRow>
            <Label>
              {" "}
              {language === "english"
                ? TICKET_CONFIRMATION.english.firstCategory
                : TICKET_CONFIRMATION.korean.firstCategory}
            </Label>
            <Time>{dateTime}</Time>
          </DetailsRow>
          <DetailsRow>
            <Label>
              {" "}
              {language === "english"
                ? TICKET_CONFIRMATION.english.secondCategory
                : TICKET_CONFIRMATION.korean.secondCategory}
            </Label>
            <Text> {language === "english" ? en_location : location}</Text>
          </DetailsRow>
          <DetailsRow>
            <Label>
              {" "}
              {language === "english"
                ? TICKET_CONFIRMATION.english.thirdCategory
                : TICKET_CONFIRMATION.korean.thirdCategory}
            </Label>
            <Text>{seats}</Text>
          </DetailsRow>
        </Details>
      </CardContent>
    </TicketConfirmCardContainer>
  );
};

export default TicketConfirmCard;

const TicketConfirmCardContainer = styled.div`
  display: flex;

  flex-direction: column;

  border-radius: 10px;
  background: var(--grey-2);

  gap: 7.81%;

  width: 89.8%;
  height: 62.9%;
  min-height: 256px;
  justify-content: center;

  padding: 0 7%;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const CardTitle = styled.span.attrs({ className: "Podo-Ticket-Headline-H4" })`
  color: var(--ect-black);
`;

const CardContent = styled.div`
  display: flex;

  max-height: 157px;
  width: 100%;
  gap: 4%;
`;

const Poster = styled.img`
  height: 100%;
  width: auto;
  border-radius: 10px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;

  gap: 7%;
`;

const Title = styled.span.attrs({ className: "Podo-Ticket-Headline-H5" })`
  color: var(--ect-black);
  margin-left: 3px;
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  color: var(--grey-7);
  @media (max-resolution: 2dppx) {
    gap: 12px;
  }
  @media (min-resolution: 3dppx) {
    gap: 8px;
  }
`;

const Label = styled.span.attrs({ className: "Podo-Ticket-Body-B9" })`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  border: 1px solid var(--grey-3);
  background: var(--ect-white);

  width: 13.23vw;

  color: var(--grey-6);
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;

const Time = styled.span.attrs({ className: "Podo-Ticket-Body-B7" })`
  color: var(--grey-7);
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;
const Text = styled.span.attrs({ className: "Podo-Ticket-Body-B7" })`
  color: var(--grey-7);
`;
