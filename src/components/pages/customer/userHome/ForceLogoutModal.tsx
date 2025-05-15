import { useState } from "react";
import socket from "../../../../api/socket";
import styled from "styled-components";
import { useForceLogoutStore } from "../../../../store/useForceLogoutStore";
import {
  fadeIn,
  fadeOut,
} from "../../../../styles/animation/DefaultAnimation.ts";
import SmallBtn from "@components/common/buttons/SmallBtn";
import { FORCE_LOGOUT_MODAL } from "@/constants/text/UIText.ts";

const ForceLogoutModal = () => {
  const { isOpen, message, closeModal } = useForceLogoutStore();
  const language = localStorage.getItem("language");
  const [isClosing] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      socket.disconnect();
      window.location.href = "/";
      closeModal();
    });
  };

  return (
    <ModalOverlay>
      <ModalContent isClosing={isClosing}>
        <Title className="Podo-Ticket-Headline-H2">{message}</Title>
        <Subtitle className="Podo-Ticket-Body-B5">
          {language === "english"
            ? FORCE_LOGOUT_MODAL.english.description
            : FORCE_LOGOUT_MODAL.korean.description}
        </Subtitle>
        <SmallBtn
          content={
            language === "english"
              ? FORCE_LOGOUT_MODAL.english.button
              : FORCE_LOGOUT_MODAL.korean.button
          }
          onClick={handleLogout}
          isAvailable={true}
          isGray={true}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default ForceLogoutModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div<{ isClosing: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 90%;
  background-color: var(--ect-white);
  border-radius: 10px;

  gap: 5px;
  padding: 25px;

  text-align: center;

  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.4s
    ease-in-out;
`;

const Title = styled.div`
  color: var(--grey-7);
`;

const Subtitle = styled.div`
  margin-bottom: 11px;
  color: var(--grey-5);
`;
