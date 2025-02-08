import React from "react";
import styled from "styled-components";

/* lefter, center, righter 모두 인터페이스 동일
interface lefter {
    icon: string;
    iconWidth?: number; // 아이콘 너비 (px 단위)
    iconHeight?: number; // 아이콘 높이 (px 단위)
    text: string;
    clickFunc: () => void;
}
*/

const TopNav = ({ lefter, center, righter, isGrey = false, isUnderlined = false }) => {
  return (
    <NavContainer isGrey={isGrey} isUnderlined={isUnderlined}>
      <ImageContainer onClick={lefter ? lefter.clickFunc : undefined}>
        {lefter ? (
          lefter.icon ? (
            <LeftIcon
              src={lefter ? lefter.icon : undefined}
              alt="LeftIcon"
              width={lefter.iconWidth}
              height={lefter.iconHeight}
            />
          ) : lefter.text ? (
            <span>{lefter ? lefter.text : undefined}</span>
          ) : null
        ) : undefined}
      </ImageContainer>

      <CenterContent className=" Podo-Ticket-Headline-H3">
        {center ? center.text : null}
      </CenterContent>

      <ImageContainer onClick={righter ? righter.clickFunc : undefined}>
        {righter ? (
          righter.icon ? (
            <RightIcon
              src={righter ? righter.icon : undefined}
              alt="RightIcon"
              width={righter.iconWidth}
              height={righter.iconHeight}
            />
          ) : righter.text ? (
            <span>{righter ? righter.text : undefined}</span>
          ) : null
        ) : undefined}
      </ImageContainer>
    </NavContainer>
  );
};

export default TopNav;

const NavContainer = styled.nav<{ isGrey: boolean, isUnderlined: boolean }>`
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;

  position: sticky;
  top: 0;
  height: 82px;
  background: ${({ isGrey }) => isGrey ? "var(--background-1)" : "var(--ect-white)"};
  border-bottom: ${({ isUnderlined }) => isUnderlined ? "0.5px solid var(--grey-4)" : "none"};

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const CenterContent = styled.div`
  display: flex;
  justify-content: center;
  text-align: center; /* 중앙 정렬 */

  width: 210px;

  color: var(--gray-100);
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--gray-100);
  width: 80px;
  height: 40px;
`;

const LeftIcon = styled.img<{ width?: number; height?: number }>`
  width: ${({ width }) => (width ? `${width}px` : "20px")};
  height: ${({ height }) => (height ? `${height}px` : "20px")};
`;

const RightIcon = styled.img<{ width?: number; height?: number }>`
  width: ${({ width }) => (width ? `${width}px` : "20px")};
  height: ${({ height }) => (height ? `${height}px` : "20px")};
`;