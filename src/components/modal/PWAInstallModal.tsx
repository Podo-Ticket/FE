import React, { useEffect, useState } from 'react';
import DefaultModal from './DefaultModal.tsx';

// beforeinstallprompt 이벤트 타입 정의
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    prompt(): Promise<void>;
}

interface PWAInstallModalProps {
    showModal: boolean; // 모달 표시 여부를 제어
    onClose: () => void; // 모달 닫기 콜백 함수
}

const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ showModal, onClose }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault(); // 기본 동작 방지
            setDeferredPrompt(e); // 이벤트 저장
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleAcceptFunc = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt(); // 설치 프롬프트 표시

        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA가 성공적으로 설치되었습니다.');
        } else {
            console.log('PWA 설치가 취소되었습니다.');
        }

        setDeferredPrompt(null); // 초기화
        onClose(); // 모달 닫기
    };

    const handleUnacceptFunc = () => onClose();

    return (
        <DefaultModal
            showDefaultModal={showModal}
            title="앱 설치"
            description="* iOS는 추후 업데이트 예정입니다 *"
            onAcceptFunc={handleAcceptFunc}
            onUnacceptFunc={handleUnacceptFunc}
        />
    );
};

export default PWAInstallModal;