'use client'; // 클라이언트 컴포넌트로 표시

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// 이 컴포넌트는 children을 SessionProvider로 감쌉니다.
export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
