import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Player } from '@lottiefiles/react-lottie-player'; // Lottie Player import

import logo from '../assets/images/splash.png';
import animationData from '../styles/animation/splashAnimation.json'; // Lottie JSON 파일
import { fadeIn, fadeOut } from '../styles/animation/DefaultAnimation.ts'

const Splash: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [showPlayer, setShowPlayer] = useState(true); // Player 표시 여부
    const [showLogo, setShowLogo] = useState(false); // Logo 표시 여부

    useEffect(() => {
        // 2.5초 후 Player를 숨기고 Logo를 표시
        const playerTimer = setTimeout(() => {
            setShowPlayer(false);
            setShowLogo(true);
        }, 1800);

        // 5초 후 Splash 화면 종료
        const logoTimer = setTimeout(() => {
            onFinish();
        }, 3500);

        return () => {
            clearTimeout(playerTimer);
            clearTimeout(logoTimer);
        };
    }, [onFinish]);

    return (
        <SplashContainer>
            {showPlayer && (
                <AnimatedPlayer
                    autoplay
                    loop
                    src={animationData}
                />
            )}
            {showLogo && <AnimatedLogo src={logo} alt="로고" />}
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
  height: 100vh;
  background: var(--lightpurple-2);
`;

const AnimatedPlayer = styled(Player)`
  width: 350px;
  height: 350px;

  animation: ${fadeIn} 1s ease-in-out, ${fadeOut} 1s ease-in-out 1s; /* FadeIn 후 FadeOut */
`;

const AnimatedLogo = styled.img`
  position: absolute;
  
  top: calc(50% - 20px);
  left: calc(50% - 75px);

  width: 150px;
  height: auto;

  z-index: 5;

  animation: ${fadeIn} 1s ease-in-out; /* FadeIn */
`;
