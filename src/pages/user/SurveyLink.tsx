import { useState } from "react";
import styled from "styled-components";

import SurveyModal from "../../components/modal/SurveyModal.tsx";

import ownerIcon from "../../assets/images/admin/podo_logo.png";
import customerIcon from "../../assets/images/admin/riveract_logo.png";

import { clickAnimation } from "../../styles/animation/DefaultAnimation.ts";

const SurveyLink = () => {
  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(false);

  return (
    <ViewContainer>
      <SurveyTitle className="Podo-Ticket-Headline-H3">
        평가를 원하는 항목을 선택해주세요!
      </SurveyTitle>

      <SurveyOrganizationContainer>
        <SurveyOrganization
          onClick={() => {
            setShowSurveyModal(true);
          }}
        >
          <OrganizationIcon
            src={ownerIcon}
            style={{ width: "51px", height: "66px" }}
          />
          <OrganizationTitle>포도티켓 서비스 평가</OrganizationTitle>
          <OrganizationSubtitle>
            포도티켓 서비스에 대한 의견을 남겨주세요!
          </OrganizationSubtitle>
        </SurveyOrganization>

        <SurveyOrganization
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSfz9Gfmr3TNwwIdEHPWFox_J34qBFmPBBGkKAoM8wvEvwuQPg/viewform",
              "_blank"
            )
          }
        >
          <OrganizationIcon
            src={customerIcon}
            style={{ width: "66px", height: "66px" }}
          />
          <OrganizationTitle>리버액트(LIBERACT) 공연 설문</OrganizationTitle>
          <OrganizationSubtitle>
            리버액트 공연과 공연장에 대한 의견을 남겨주세요!
          </OrganizationSubtitle>
        </SurveyOrganization>
      </SurveyOrganizationContainer>

      <SurveyModal
        showSurveyModal={showSurveyModal}
        onAcceptFunc={() => {
          setShowSurveyModal(false);
        }}
      />
    </ViewContainer>
  );
};

export default SurveyLink;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  width: 100%;
  height: 100vh;

  gap: 45px;
`;

const SurveyTitle = styled.div`
  color: var(--grey-7);
`;

const OrganizationIcon = styled.img`
  margin-bottom: 23px;
`;

const SurveyOrganizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;

  gap: 20px;
`;

const SurveyOrganization = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 85%;
  border-radius: 10px;
  border: 1px solid var(--purple-8);
  background: var(--lightpurple-2);

  padding: 31px 0;

  &:active {
    animation: ${clickAnimation} 0.2s ease-in-out; /* 애니메이션 적용 */
  }
`;

const OrganizationTitle = styled.div.attrs({
  className: "Podo-Ticket-Headline-H2",
})`
  color: var(--grey-7);
`;

const OrganizationSubtitle = styled.div.attrs({
  className: "Podo-Ticket-Body-B5",
})`
  color: var(--grey-6);
`;
