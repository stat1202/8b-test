import create from 'zustand';
import { SectionType } from '@/components/user/types';

// 상태 타입 정의
type MyPageState = {
  isProfileSetup: boolean; //프로필 수정
  isPasswordCheck: boolean; //비밀번호 확인
  isUserAccountdit: boolean; //개인정보 수정
  isWithdrawal: boolean; //회원탈퇴
  selectedSection: SectionType; //회원탈퇴 성공 여부
  openModal: (
    modalName: keyof Omit<MyPageState, 'selectedSection'>,
  ) => void;
  closeModal: (
    modalName: keyof Omit<MyPageState, 'selectedSection'>,
  ) => void;
  setSelectedSection: (section: SectionType) => void; //사이드바 탭
  setIsWithdrawal: () => void; //탈퇴 성공 모달
  closeAllModals: () => void; //전체 모달창 닫기
};

// Zustand 스토어 생성
const myPageStore = create<MyPageState>((set) => ({
  isProfileSetup: false,
  isPasswordCheck: false,
  isUserAccountdit: false,
  isWithdrawal: false,
  selectedSection: 'profile',

  openModal: (modalName) => set({ [modalName]: true }),
  closeAllModals: () =>
    set({
      isProfileSetup: false,
      isPasswordCheck: false,
      isUserAccountdit: false,
    }),
  closeModal: (modalName) => set({ [modalName]: false }),
  setSelectedSection: (section) => set({ selectedSection: section }),
  setIsWithdrawal: () => set({ isWithdrawal: true }),
}));

export default myPageStore;