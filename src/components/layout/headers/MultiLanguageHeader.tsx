import React from "react";
import styled from "styled-components";

import logoImage from "@assets/icons/ic_logo.svg";
import languageImage1 from "@assets/icons/ic_language_en.svg";
import languageImage2 from "@assets/icons/ic_language_ko.svg";
import { Language } from "../../../constants/text/Language.ts";

import { USER_HOME } from "@/constants/text/UIText.ts";
interface MultiLanguageHeaderProps {
  clickLanguage: () => void;
}

const MultiLanguageHeader: React.FC<MultiLanguageHeaderProps> = ({
  clickLanguage,
}) => {
  const language = localStorage.getItem("language") as Language;
  return (
    <HeaderContainer>
      <LeftSide>
        <LogoImage src={logoImage} />
        <LogoName className="Podo-Ticket-Headline-H4-Title">
          {language === Language.English
            ? USER_HOME.english.title
            : USER_HOME.korean.title}
        </LogoName>
      </LeftSide>

      <LanguageImage
        src={language === Language.English ? languageImage2 : languageImage1}
        onClick={clickLanguage}
      />
    </HeaderContainer>
  );
};

export default MultiLanguageHeader;

const HeaderContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;

  top: 0;

  width: 100%;

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const LeftSide = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;

  gap: 8px;
`;

const LogoImage = styled.img`
  width: 1.1875rem;
  height: 1.625rem;
`;

const LogoName = styled.div`
  color: var(--ect-white);
`;

const LanguageImage = styled.img`
  width: 2rem;
  height: 2rem;
`;
