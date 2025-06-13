import {create} from 'zustand';
import {FORCE_LOGOUT_MODAL} from '@/constants/text/UIText.ts';

interface ForceLogoutStateProps {
  isOpen: boolean;
  message: string;
  openModal: (msg?: string) => void;
  closeModal: () => void;
}

export const useForceLogoutStore = create<ForceLogoutStateProps>(set => ({
  isOpen: false,
  message: '',
  openModal: msg => {
    const language = localStorage.getItem('language');
    set({
      isOpen: true,
      message:
        msg || language === 'english'
          ? FORCE_LOGOUT_MODAL.english.title
          : FORCE_LOGOUT_MODAL.korean.title,
    });
  },
  closeModal: () => set({isOpen: false, message: ''}),
}));
