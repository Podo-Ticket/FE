import React from "react";
import styled from "styled-components";

import availableSeatImage from "@assets/images/admin/lightgrey_block.png";
import reservedSeatImage from "@assets/images/xed_grey_block.png";
import lockImage from "@assets/images/admin/purple_lock.png";

interface AdminSeatInfoProps {
  isRealTime: boolean;
  remainingSeatsCount: number;
}

const AdminSeatInfo: React.FC<AdminSeatInfoProps> = ({
  isRealTime,
  remainingSeatsCount,
}) => {

  return (
    <SeatInfoContainer isRealTime={isRealTime}>
      <SeatCategoryContainer>
        <SeatCategory>
          <SeatImage src={availableSeatImage} />
          <SeatDescription>발권 가능</SeatDescription>
        </SeatCategory>

        <SeatCategory>
          <SeatImage src={reservedSeatImage} />
          <SeatDescription>발권 완료</SeatDescription>
        </SeatCategory>

        <SeatCategory>
          <SeatImage src={lockImage} />
          <SeatDescription>잠금 좌석</SeatDescription>
        </SeatCategory>
      </SeatCategoryContainer>

      <RemainingSeat>여석 {remainingSeatsCount}석</RemainingSeat>
    </SeatInfoContainer>
  );
};

export default AdminSeatInfo;

const SeatInfoContainer = styled.div<{ isRealTime: boolean }>`
  position: absolute;
  top: 90%;

  display: flex;
  flex-direction: row;

  width: 100%;
  padding: 0 30px;

  @media screen and (max-width: 385px) {
    padding: 0 5px;
  }
  @media screen and (min-width: 385px) and (max-width: 450px) {
    padding: 0 15px;
  }
  @media screen and (min-width: 450px) {
    padding: 0 30px;
  }
`;

const SeatCategoryContainer = styled.div`
  display: flex;
  flex-grow: 1;

  gap: 12px;
`;

const SeatCategory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 5px;
`;

const SeatImage = styled.img`
  width: 14px;
  height: 14px;
`;

const SeatDescription = styled.div.attrs({ className: "Podo-Ticket-Body-B11" })`
  color: var(--grey-7);
`;

const RemainingSeat = styled.div.attrs({ className: "Podo-Ticket-Body-B9" })`
  border-radius: 20px;
  border: 1px solid var(--purple-7);
  background: var(--lightpurple-2);

  padding: 0 10px;

  color: var(--purple-4);
`;
