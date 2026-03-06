import { create } from 'zustand';
import type { Session } from 'next-auth'; // next-auth에서 Session 타입 가져오기

interface AuthState {
  session: Session | null; // 사용자 세션 객체 또는 null
  setSession: (session: Session | null) => void; // 세션 업데이트 액션
  isLoading: boolean; // 초기에 세션 로딩 중인지 여부 추적
  setIsLoading: (loading: boolean) => void; // 로딩 상태 직접 제어 액션
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null, // 초기 상태: 세션 없음
  isLoading: true, // 로딩 상태로 시작
  setSession: (session) => set({ session, isLoading: false }), // 세션 업데이트하고 로딩 상태 false로 설정
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
