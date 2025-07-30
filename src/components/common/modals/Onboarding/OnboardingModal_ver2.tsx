import {useState, useEffect} from 'react';
import styled from 'styled-components';
import OnboardingModalLayout from '../Onboarding/OnboardingModalLayout';
import OnboardingMenu from '../Onboarding/OnboardingMenu';
import OnboardingContents from '../Onboarding/OnboardingContents';
import Onboarding_realtimeSeat_1 from '@assets/images/admin/onboarding/onboarding_realtimeSeat_1.png';
import Onboarding_realtimeSeat_2 from '@assets/images/admin/onboarding/onboarding_realtimeSeat_2.png';
import Onboarding_realtimeSeat_3 from '@assets/images/admin/onboarding/onboarding_realtimeSeat_3.png';
import Onboarding_unlockSeat_1 from '@assets/images/admin/onboarding/onboarding_unlockSeat_1.png';
import Onboarding_unlockSeat_2 from '@assets/images/admin/onboarding/onboarding_unlockSeat_2.png';
import Onboarding_reservationList from '@assets/images/admin/onboarding/onboarding_reservationList_1.png';
import Onboarding_onsiteRequest from '@assets/images/admin/onboarding/onboarding_onsiteRequest_1.png';
interface OnboardingModalProps {
  onClose: () => void;
  title?: string;
  subTitle?: string;
  isPage?: boolean;
  isOpen: boolean;
}

const Highlight = styled.span`
  color: var(--purple-4);
  font-weight: bold;
`;

const Title = styled.p`
  text-align: center;
  color: var(--grey-6);
`;

const CONTENT_MAP: Record<
  string,
  {
    steps: {
      title: React.ReactNode;
      image: string;
      nextTitle?: React.ReactNode;
      imgStyle?: React.CSSProperties;
      overlayImage?: string; // 새롭게 추가: 위에 겹쳐질 이미지 경로
      overlayImgStyle?: React.CSSProperties; // 새롭게 추가: 겹쳐질 이미지의 스타일
    }[];
  }
> = {
  '실시간 좌석 현황': {
    steps: [
      {
        title: (
          <Title className='Podo-Ticket-Body-B3'>
            본 공연의 <Highlight>좌석 배치도</Highlight>와<br />{' '}
            <Highlight>실시간 좌석 현황</Highlight>을 확인할 수 있어요!
          </Title>
        ),
        image: Onboarding_realtimeSeat_1,
        imgStyle: {
          width: '97%',
          aspectRatio: '295 / 212',
          borderRadius: '9px',
          boxShadow: ' 0 10px 15px 5px rgba(0, 0, 0, 0.1)',
        },
      },
      {
        title: (
          <Title className='Podo-Ticket-Body-B3'>
            발권 완료된 좌석을 눌러서 <br />
            <Highlight>예매자 정보를 확인</Highlight>해 보세요!
          </Title>
        ),
        image: Onboarding_realtimeSeat_2,
        imgStyle: {
          width: '97%',
          aspectRatio: '295 / 212',
          borderRadius: '9px',
          boxShadow: ' 0 10px 15px 5px rgba(0, 0, 0, 0.1)',
        },
        overlayImage: Onboarding_realtimeSeat_3, // Onboarding_realtimeSeat_3 추가
        overlayImgStyle: {
          position: 'absolute',
          width: '100%',
          aspectRatio: '311 / 85',
          top: '7%',
          left: '0',

          objectFit: 'contain', // 이미지가 잘리지 않도록
        },
      },
    ],
  },

  '좌석 잠금/해제': {
    steps: [
      {
        title: (
          <Title className='Podo-Ticket-Body-B3'>
            이용 제한이 필요할 땐<br />
            <Highlight>좌석 잠금 </Highlight>으로 관리할 수 있어요!
          </Title>
        ),
        image: Onboarding_unlockSeat_1,
        imgStyle: {
          width: '100%',
          aspectRatio: '310 / 181',
          borderRadius: '9px',
          boxShadow: ' 0 10px 15px 5px rgba(0, 0, 0, 0.1)',
        },
      },
      {
        title: (
          <Title className='Podo-Ticket-Body-B3'>
            좌석 이용을 활성화할 땐
            <br />
            <Highlight>좌석 잠금 해제 </Highlight>로 관리해요!
          </Title>
        ),
        image: Onboarding_unlockSeat_2,
        imgStyle: {
          width: '100%',
          aspectRatio: '310 / 181',
          borderRadius: '9px',
          boxShadow: ' 0 10px 15px 5px rgba(0, 0, 0, 0.1)',
        },
      },
    ],
  },
  '예매 명단 관리': {
    steps: [
      {
        title: (
          <Title className='Podo-Ticket-Body-B3'>
            필터를 활용해서&nbsp;
            <Highlight>
              미 발권자와 <br />
              발권 완료자
            </Highlight>
            를 쉽게 확인할 수 있어요!
          </Title>
        ),
        image: Onboarding_reservationList,
        imgStyle: {
          width: '100%',
          aspectRatio: '310 / 192',
          borderRadius: '9px',
          boxShadow: ' 0 10px 15px 5px rgba(0, 0, 0, 0.1)',
        },
      },
    ],
  },
  '현장 예약 요청': {
    steps: [
      {
        title: (
          <Title className='Podo-Ticket-Body-B3'>
            현장 예매자의 정보를 확인하고 <br />
            예매 요청을 <Highlight>수락 / 거절</Highlight>할 수 있어요!
          </Title>
        ),
        image: Onboarding_onsiteRequest,
        imgStyle: {
          width: '100%',
          aspectRatio: '310 / 192',
          borderRadius: '9px',
          boxShadow: ' 0 10px 15px 5px rgba(0, 0, 0, 0.1)',
        },
      },
    ],
  },
};
const OnboardingModal_ver2: React.FC<OnboardingModalProps> = ({
  onClose,
  isOpen = false,
  isPage,
}) => {
  const [menu, setMenu] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  useEffect(() => {
    if (!isOpen) {
      setMenu('');
      setCurrentPageIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMenuContent = CONTENT_MAP[menu];
  const totalPages = currentMenuContent ? currentMenuContent.steps.length : 0;
  const currentPage = currentPageIndex + 1;

  return (
    <OnboardingModalLayout
      onClose={onClose}
      isPage={menu ? true : isPage}
      currentPage={currentPage}
      totalPage={totalPages}
    >
      {menu ? (
        <OnboardingContents
          setMenu={setMenu}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          currentMenuContent={currentMenuContent}
        />
      ) : (
        <OnboardingMenu setMenu={setMenu} />
      )}
    </OnboardingModalLayout>
  );
};

export default OnboardingModal_ver2;
