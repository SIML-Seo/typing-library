'use client'; // 클라이언트 컴포넌트로 표시

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { I18nProviderClient } from '@/locales/client'; // client.ts에서 가져오기
import type { AppLocale } from '@/locales/config';

const AppLocaleContext = createContext<AppLocale>('ko');

interface Props {
  locale: AppLocale; // 로케일 prop 받기
  children: ReactNode;
}

// 이 컴포넌트는 children을 I18nProviderClient로 감쌉니다.
export default function I18nClientProvider({ locale, children }: Props) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <AppLocaleContext.Provider value={locale}>
      <I18nProviderClient locale={locale}>
        {children}
      </I18nProviderClient>
    </AppLocaleContext.Provider>
  );
}

export function useAppLocale() {
  return useContext(AppLocaleContext);
}
