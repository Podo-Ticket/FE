import React, { useEffect, useState } from "react";
import styled from "styled-components";

import profileDo from "@assets/images/profile_do.png";

const NotFoundPage: React.FC = ({}) => {
  return (
    <ViewContainer>
      <CenterContainer>
        <DoImage src={profileDo} />
        <Title className="Podo-Ticket-Headline-H3">페이지를 찾을 수 없습니다.</Title>
        <Subtitle className="Podo-Ticket-Body-B5">잠시 후에 다시 시도해주세요.</Subtitle>
      </CenterContainer>
    </ViewContainer>
  );
};

export default NotFoundPage;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100svh;
  background: var(--ect-white);

  padding: 0 62px;
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-bottom: 47px;
`;

const DoImage = styled.img`
  width: 100%;
  height: auto;

  margin-bottom: 25px;
`;

const Title = styled.div`
  color: var(--grey-7);
  margin-bottom: 5px;
`;

const Subtitle = styled.div`
  color: var(--grey-5);
`;