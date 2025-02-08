type ModalState = { [key: string]: boolean };

// 모달 열림, 닫힘 상태 관리 함수
export const toggleModal = (
  modalName: string, // 변경하려는 모달의 이름
  showModal: boolean, // 열림/닫힘 상태
  setModals: React.Dispatch<React.SetStateAction<ModalState>> // 상태를 업데이트하는 setter 함수
) => {
  setModals((prev) => ({
    ...prev,
    [modalName]: showModal,
  }));
};
