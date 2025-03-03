import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const slideUp = keyframes`
  from {
    transform: translateY(10%); /* 아래에서 시작 */
    opacity: 0; /* 투명하게 시작 */
  }
  to {
    transform: translateY(0); /* 원래 위치로 이동 */
    opacity: 1; /* 완전히 보이도록 */
  }
`;

export const clickAnimation = keyframes`
  0% {
    transform: scale(1); /* 원래 크기 */
    filter: brightness(1); /* 원래 밝기 */
  }
  50% {
    transform: scale(0.98); /* 살짝 축소 */
    filter: brightness(0.95); /* 어두운 색상 */
  }
  100% {
    transform: scale(1); /* 원래 크기로 복귀 */
    filter: brightness(1); /* 원래 밝기로 복귀 */
  }
`;