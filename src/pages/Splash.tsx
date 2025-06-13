import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
// import { Player } from '@lottiefiles/react-lottie-player';

import logo from '../assets/images/splash.png';
// import animationData from '../styles/animation/splashAnimation.json';
import {fadeIn} from '../styles/animation/DefaultAnimation.ts';

const Splash: React.FC<{onFinish: () => void}> = ({onFinish}) => {
  // const [showPlayer, setShowPlayer] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(logoTimer);
    };
  }, [onFinish]);

  return (
    <SplashContainer>
      {/* {showPlayer && (
                <AnimatedPlayer
                    autoplay
                    loop
                    src={animationData}
                />
            )} */}
      {showLogo && <AnimatedLogo src={logo} alt='로고' />}
    </SplashContainer>
  );
};

export default Splash;

const SplashContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  width: 100%;
  height: 100svh;
  background: var(--lightpurple-2);
`;

// const AnimatedPlayer = styled(Player)`
//   width: 350px;
//   height: 350px;
//
//   animation: ${fadeIn} 1s ease-in-out, ${fadeOut} 1s ease-in-out 1s; /* FadeIn 후 FadeOut */
// `;

const AnimatedLogo = styled.img`
  position: absolute;

  top: calc(50% - 20px);
  left: calc(50% - 75px);

  width: 150px;
  height: auto;

  z-index: 5;

  animation: ${fadeIn} 1s ease-in-out; /* FadeIn */
`;
