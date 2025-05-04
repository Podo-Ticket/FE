import React from "react";
import styled from "styled-components";

interface ReservationCheckLabelProps {
  isActive: boolean;
  labelText: string;
}

const ReservationCheckLabel: React.FC<ReservationCheckLabelProps> = ({
  isActive,
  labelText,
}) => {
  return (
    <Label className="Podo-Ticket-Headline-H6" $isActive={isActive}>
      {labelText && <span>{labelText}</span>}
    </Label>
  );
};

export default ReservationCheckLabel;

const Label = styled.div<{ $isActive: boolean }>`
  padding: 5px 3.3vw;
  border-radius: 30px;
  background-color: ${({ $isActive }) =>
    $isActive
      ? " var(--Podo-Ticket-chip-light-purple02, #F5F4FF);"
      : "var(--ect-white, #FFF);"};
  border: 1px solid
    ${({ $isActive }) => ($isActive ? "var(--purple-7)" : "var(--grey-4)")};

        color : ${({ $isActive }) =>
          $isActive ? "var(--purple-4)" : "var(--grey-5)"};};
`;
