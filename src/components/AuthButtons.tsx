'use client'; // 클라이언트 컴포넌트

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore'; // Zustand 스토어 가져오기
import { useI18n } from '@/locales/client'; // useI18n 훅 가져오기

export default function AuthButtons() {
  // NextAuth의 세션 상태 및 로딩 상태 가져오기
  const { data: session, status } = useSession();
  // Zustand 스토어의 세션 설정 함수 및 로딩 상태 가져오기
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const isLoading = useAuthStore((state) => state.isLoading);
  const t = useI18n(); // i18n 훅 사용

  // NextAuth 세션 상태가 변경될 때마다 Zustand 스토어 업데이트
  useEffect(() => {
    setSession(session); // Zustand 스토어에 현재 세션 정보 저장
    setIsLoading(status === 'loading'); // NextAuth 로딩 상태를 Zustand에 반영
  }, [session, status, setSession, setIsLoading]);

  // 로그아웃 처리 함수
  const handleSignOut = async () => {
    // 1. NextAuth.js 로컬 세션 먼저 정리 (리디렉션 없이)
    await signOut({ redirect: false });

    // 2. Cognito 로그아웃 URL 생성 (기존 로직)
    const clientId = process.env.NEXT_PUBLIC_AUTH_COGNITO_CLIENT_ID;
    const logoutUri = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
    const region = process.env.NEXT_PUBLIC_AWS_REGION;
    const domainPrefix = process.env.NEXT_PUBLIC_COGNITO_DOMAIN_PREFIX;

    if (!clientId || !logoutUri || !region || !domainPrefix) {
      console.error('Cognito 로그아웃에 필요한 환경 변수가 설정되지 않았습니다.');
      // 환경 변수 없으면 여기서 종료 (이미 로컬 로그아웃은 시도됨)
      // 필요시 사용자에게 오류 메시지 표시
      window.location.href = '/'; // 기본 페이지로 이동
      return;
    }

    const cognitoLogoutUrl = `https://${domainPrefix}.auth.${region}.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri,
    )}`;

    // 3. Cognito 로그아웃 URL로 리디렉션
    window.location.href = cognitoLogoutUrl;
  };

  // 로딩 중일 때 표시할 내용 (선택 사항)
  if (isLoading) {
    return <div className="text-sm text-gray-500">{t('auth.loading')}</div>; // '로딩중...'
  }

  // 로그인 상태일 때
  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">
          {/* 변수 사용 예시 */}
          {t('auth.welcome', { name: session.user?.email || '사용자' })}
        </span>
        {/* 로그아웃 버튼 */}
        <button
          onClick={handleSignOut} // 수정된 로그아웃 핸들러 호출
          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
        >
          {t('auth.logout')} {/* '로그아웃' */}
        </button>
      </div>
    );
  }

  // 로그아웃 상태일 때
  return (
    <div className="flex items-center space-x-2">
      {/* 로그인 버튼 */}
      <button
        onClick={() => signIn('cognito')} // Cognito 로그인 함수 호출
        className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
      >
        {t('auth.login')} {/* '로그인' */}
      </button>
      {/* TODO: 회원가입 버튼/링크 추가 (Cognito Hosted UI 사용 또는 커스텀 페이지 구현) */}
      {/* <button className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600">회원가입</button> */}
    </div>
  );
}
