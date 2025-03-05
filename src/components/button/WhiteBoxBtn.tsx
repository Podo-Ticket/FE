//어드민 홈 좌석 잠금/해제 버튼
import React from "react";
import styled from "styled-components";
import greyRightArrow from "../../assets/images/admin/grey_right_arrow.png";

interface WhiteBoxBtnProps {
  iconSrc: string;
  title: string;
  description: string;
  onClick: () => void;
}

const WhiteBoxBtn: React.FC<WhiteBoxBtnProps> = ({
  iconSrc,
  title,
  description,
  onClick,
}) => {
  return (
    <ButtonContainer onClick={onClick}>
      <ButtonTitle>
        <LeftContent>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              boxShadow: "0px 5px 6px rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon src={iconSrc} alt="아이콘" />
          </div>

          <Title className="Podo-Ticket/Headline/H5">{title}</Title>
        </LeftContent>
        <img
          src={greyRightArrow}
          alt="화살표"
          style={{ width: "7px", height: "12px" }}
        ></img>
      </ButtonTitle>
      <Description>{description}</Description>
    </ButtonContainer>
  );
};

export default WhiteBoxBtn;

const ButtonContainer = styled.button`
  display: flex;
  flex-direction: column;
  width: 162px;
  height: 87px;
  border-radius: 10px;
  background: var(--ect-white, #fff);
  box-shadow: -1px 9px 20px 0px rgba(0, 0, 0, 0.08);
  padding: 15px 14px;
  border: none;
  text-align: left;
  gap: 9px;
`;

const ButtonTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const LeftContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const Icon = styled.img`
  width: 14px;
  height: 14px;
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.06);
  border-radius: 50%; /* 원형 유지 */
`;
const Title = styled.h5`
  color: var(--grey-grey7, #3c3c3c);
`;
const Description = styled.p`
  color: var(--grey-grey-6, #777);
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
