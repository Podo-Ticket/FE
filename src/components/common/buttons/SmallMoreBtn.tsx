import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styled from "styled-components";
import goFrontIcon from "@assets/images/lightgrey_right_arrow.png";

interface SmallMoreBtnProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  isAvailable: boolean; 
  isUnderlined?: boolean;
}

const SmallMoreBtn: React.FC<SmallMoreBtnProps> = ({
  children,
  isAvailable,
  isUnderlined = false,
  className = "",
  ...props
}) => {

  const UnderlinedFont = isUnderlined ? "Podo-Ticket-Body-B10" : ""

  return (
    <SmallMoreBtnContainer
      className={`${UnderlinedFont} ${className}`}
      disabled={!isAvailable}
      {...props}
    >
      <>{children}</>
      {isUnderlined ? undefined : (
        <Icon src={goFrontIcon} alt="Go Front Icon" />
      )}
    </SmallMoreBtnContainer>
  );
};

export default SmallMoreBtn;

const SmallMoreBtnContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: transparent;

  gap: 3px;

  color: var(--grey-6);
  text-align: center;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const Icon = styled.img`
  width: 8px;
  height: 16px;
`;
