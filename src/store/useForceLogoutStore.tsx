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
    set({ isOpen: true, message: msg || "동시 접속이 확인되었습니다." });
  },
  closeModal: () => set({ isOpen: false, message: "" }),
}));