import React from "react";
import styled from "styled-components";

import goFrontIcon from "../../assets/images/lightgrey_right_arrow.png";

interface SmallMoreBtnProps {
  content: string; // 버튼 안 내용
  onClick: () => void; // 온 클릭 함수
  isAvailable: boolean; // 버튼 동작 여부
  isUnderlined?: boolean; // 글자 밑줄 여부
}

const SmallMoreBtn: React.FC<SmallMoreBtnProps> = ({
  content,
  onClick,
  isAvailable,
  isUnderlined = false,
}) => {
  return (
    <SmallMoreBtnContainer
      className={isUnderlined ? "Podo-Ticket-Body-B10" : "Podo-Ticket-Body-B7"}
      onClick={onClick}
      disabled={!isAvailable}
    >
      <>{content}</>
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
