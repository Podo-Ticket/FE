import React from 'react';
import styled from 'styled-components';

import nameImage from '@assets/images/admin/grey_person.png';
import phoneImage from '@assets/images/admin/grey_home_phone.png';
import headCountImage from '@assets/images/admin/grey_sofa.png';

interface AudienceInfoProps {
  name?: string;
  phoneNumber?: string;
  headCount?: number;
}

const AudienceInfo: React.FC<AudienceInfoProps> = ({name, phoneNumber, headCount}) => {
  return (
    <AudienceInfoContainer>
      <AudienceInfoItem>
        <AudienceInfoIcon src={nameImage} />
        <AudienceInfoCategory>예매자</AudienceInfoCategory>
        <AudienceInfoDescription>{name}</AudienceInfoDescription>
      </AudienceInfoItem>

      <AudienceInfoDivider />

      <AudienceInfoItem>
        <AudienceInfoIcon src={phoneImage} />
        <AudienceInfoCategory>연락처</AudienceInfoCategory>
        <AudienceInfoDescription>{phoneNumber}</AudienceInfoDescription>
      </AudienceInfoItem>

      <AudienceInfoDivider />

      <AudienceInfoItem>
        <AudienceInfoIcon src={headCountImage} />
        <AudienceInfoCategory>좌석 수</AudienceInfoCategory>
        <AudienceInfoDescription>{headCount}</AudienceInfoDescription>
      </AudienceInfoItem>
    </AudienceInfoContainer>
  );
};

export default AudienceInfo;

const AudienceInfoContainer = styled.div`
  position: absolute;
  top: -78px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: calc(100% + 1px);
  border-radius: 20px 20px 0px 0px;
  border: 1px solid var(--grey-3);
  border-bottom: none;
  background: var(--ect-white);

  padding: 15px 55px;

  z-index: 1000;
`;

const AudienceInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 3px;
`;

const AudienceInfoIcon = styled.img`
  width: 26px;
  height: 26px;
`;

const AudienceInfoCategory = styled.div.attrs({
  className: 'Podo-Ticket-Body-B11',
})`
  color: var(--grey-7);
`;

const AudienceInfoDescription = styled.div.attrs({
  className: 'Podo-Ticket-Body-B12',
})`
  color: var(--purple-4);
`;

const AudienceInfoDivider = styled.div`
  width: 0.5px;
  height: 65%;

  background: var(--grey-3);
`;
