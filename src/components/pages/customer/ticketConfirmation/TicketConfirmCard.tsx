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
        <PosterContainer>
          <Poster src={poster} alt="공연 포스터" />
        </PosterContainer>

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

  @media (max-resolution: 2dppx) {
    border-radius: 15px;
    gap: 30px;
    padding: 34.5px 37.5px;
  }
  @media (min-resolution: 3dppx) {
    border-radius: 10px;
    gap: 20px;
    padding: 23px 25px;
  }
`;

const CardTitle = styled.span.attrs({ className: "Podo-Ticket-Headline-H4" })`
  color: var(--ect-black);
`;

const CardContent = styled.div`
  display: flex;

  gap: 12px;

  @media (max-resolution: 2dppx) {
    gap: 18px;
  }
  @media (min-resolution: 3dppx) {
    gap: 12px;
  }
`;

const PosterContainer = styled.div`
  width: 114px;
  border-radius: 10px;
  box-shadow: 0px 0px 9px 6px rgba(0, 0, 0, 0.03);

  margin-bottom: 7px;

  @media (max-resolution: 2dppx) {
    width: 171px;
    border-radius: 15px;
    margin-bottom: 10.5px;
  }
  @media (min-resolution: 3dppx) {
    width: 114px;
    border-radius: 10px;
    margin-bottom: 7px;
  }
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
  @media (max-resolution: 2dppx) {
    gap: 15px;
  }
  @media (min-resolution: 3dppx) {
    gap: 10px;
  }
`;

const Title = styled.span.attrs({ className: "Podo-Ticket-Headline-H5" })`
  color: var(--ect-black);
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
