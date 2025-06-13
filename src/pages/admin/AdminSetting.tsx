import {useState} from 'react';
import styled from 'styled-components';

import FooterNav from '@components/layout/footers/FooterNav.tsx';
import TheaterInfoModal from '@components/common/modals/TheaterInfoModal.tsx';
import TopNav from '@components/layout/headers/TopNav.tsx';
import PWAInstallModal from '@components/pages/admin/adminSetting/PWAInstallModal.tsx';

import downloadImage from '../../assets/images/admin/purple_downbox.png';
import theaterInfoImage from '../../assets/images/admin/purple_performance.png';
import versionImage from '../../assets/images/admin/purple_circled_info.png';
import contectImage from '../../assets/icons/ic_paper_airplane.svg';

const AdminSetting = () => {
  const [isTheaterInfoModalOpen, setIsTheaterInfoModalOpen] = useState(false);
  const closeTheaterInfoModal = () => {
    setIsTheaterInfoModalOpen(false);
  };

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const navItem = {
    icon: undefined,
    text: '설정',
    clickFunc: undefined,
  };

  return (
    <ViewContainer>
      <TopNav lefter={undefined} center={navItem} righter={undefined} isUnderlined={true} />

      <SettingContainer>
        <Category>
          <CategoryName>개인 설정</CategoryName>

          <CategoryItem>
            <ContentLeftContainer
              onClick={() => {
                setIsDownloadModalOpen(true);
              }}
            >
              <ContentImage src={downloadImage} style={{width: '18px', height: '19px'}} />
              <ContentName>인앱 설치</ContentName>
            </ContentLeftContainer>
            <ContentDescription></ContentDescription>
          </CategoryItem>
        </Category>

        <Category>
          <CategoryName>도움말</CategoryName>

          <CategoryItem
            onClick={() => {
              setIsTheaterInfoModalOpen(true);
            }}
          >
            <ContentLeftContainer>
              <ContentImage src={theaterInfoImage} style={{width: '24px', height: '24px'}} />
              <ContentName>공연장 정보</ContentName>
            </ContentLeftContainer>
            <ContentDescription></ContentDescription>
          </CategoryItem>
          <CategoryItem>
            <ContentLeftContainer>
              <ContentImage src={versionImage} style={{width: '22px', height: '22px'}} />
              <ContentName>버전 정보</ContentName>
              <ContentSubName>v1.3.0</ContentSubName>
            </ContentLeftContainer>
            <ContentDescription>최신 버전</ContentDescription>
          </CategoryItem>
          <CategoryItem>
            <ContentLeftContainer>
              <ContentImage src={contectImage} style={{width: '20px', height: '20px'}} />
              <ContentName>문의 메일</ContentName>
              <ContentSubName>podostore1111@gmail.com</ContentSubName>
            </ContentLeftContainer>
            <ContentDescription></ContentDescription>
          </CategoryItem>
        </Category>
      </SettingContainer>

      <PWAInstallModal
        showModal={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      <TheaterInfoModal
        showTheaterInfoModal={isTheaterInfoModalOpen}
        onAcceptFunc={closeTheaterInfoModal}
        pageMode={true}
      />

      <FooterNav />
    </ViewContainer>
  );
};

export default AdminSetting;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SettingContainer = styled.div`
  padding: 0 25px;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;

  border-top: 0.5px solid var(--grey-3);

  gap: 23px;
  padding: 25px 0;
`;

const CategoryName = styled.div.attrs({className: 'Podo-Ticket-Headline-H6'})`
  color: var(--grey-6);
`;

const CategoryItem = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background: transparent;
  border: none;
`;

const ContentLeftContainer = styled.div`
  display: flex;
  align-items: center;

  flex-grow: 1;
  gap: 20px;
`;

const ContentImage = styled.img``;

const ContentName = styled.div.attrs({className: 'Podo-Ticket-Body-B4'})`
  color: var(--grey-7);
`;

const ContentSubName = styled.div.attrs({className: 'Podo-Ticket-Body-B9'})`
  display: flex;
  align-items: center;

  color: var(--grey-6);
`;

const ContentDescription = styled.div.attrs({className: 'Podo-Ticket-Body-B6'})`
  display: flex;
  align-items: center;

  color: var(--grey-6);
`;
