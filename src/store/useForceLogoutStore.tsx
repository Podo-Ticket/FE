import { create } from "zustand";

interface ForceLogoutStateProps {
  isOpen: boolean;
  message: string;
  openModal: (msg?: string) => void;
  closeModal: () => void;
}

export const useForceLogoutStore = create<ForceLogoutStateProps>((set) => ({
  isOpen: false,
  message: "",
  openModal: (msg) => {
    set({ isOpen: true, message: msg || "다른 기기에서 로그인되었습니다." });
  },
  closeModal: () => set({ isOpen: false, message: "" }),
}));