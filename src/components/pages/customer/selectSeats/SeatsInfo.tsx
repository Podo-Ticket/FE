import React from "react";
import styled from "styled-components";

import availableSeat from "@assets/images/purple_rectangle.png";
import selectedSeat from "@assets/images/lightgrey_rectangle.png";
import disabledSeat from "@assets/images/xed_grey_block.png";
import { SELECT_SEATS } from "@/constants/text/UIText";

interface SeatsInfoInfoProps {}

const SeatsInfo: React.FC<SeatsInfoInfoProps> = ({}) => {
  const language = localStorage.getItem("language");
  // const isSmallWidthDevice = useMediaQuery({ maxDeviceWidth: 350 });

  return (
    <SeatsInfoContainer>
      <SeatsInfoItem className="Podo-Ticket-Body-B11">
        <SeatsImage src={selectedSeat} />
        <SeatsDescription>
          {language === "english"
            ? SELECT_SEATS.english.availableSeat
            : SELECT_SEATS.korean.availableSeat}
        </SeatsDescription>
      </SeatsInfoItem>

      <SeatsInfoItem className="Podo-Ticket-Body-B11">
        <SeatsImage src={availableSeat} />
        <SeatsDescription>
          {language === "english"
            ? SELECT_SEATS.english.selectedSeat
            : SELECT_SEATS.korean.selectedSeat}
        </SeatsDescription>
      </SeatsInfoItem>

      <SeatsInfoItem className="Podo-Ticket-Body-B11">
        <SeatsImage src={disabledSeat} />
        <SeatsDescription>
          {language === "english"
            ? SELECT_SEATS.english.UnavailableSeat
            : SELECT_SEATS.korean.UnavailableSeat}
        </SeatsDescription>
      </SeatsInfoItem>
    </SeatsInfoContainer>
  );
};

export default SeatsInfo;

const SeatsInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--grey-3);
  background: var(--ect-white);
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.02);

  padding: 16px 20px;
  @media screen and (max-width: 367px) {
    padding: 16px 5px;
  }
  @media screen and(min-width:367px) and(max-width:406px) {
    padding: 16px 20px;
  }
  @media screen and (min-width: 406px) {
    padding: 16px 40px;
  }

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const SeatsInfoItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 8px;
`;

const SeatsImage = styled.img`
  width: 14px;
  height: 14px;
`;

const SeatsDescription = styled.span`
  color: var(--grey-7);
`;
