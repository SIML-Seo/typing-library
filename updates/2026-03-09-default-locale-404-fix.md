# 기본 경로 404 렌더링 문제 수정

## 변경 일자
2026-03-09

## 변경 요약
- 기본 경로(`/`, `/library` 등)에서 `next-international`의 `useCurrentLocale()`가 `undefined` locale로 떨어지며 404 fallback을 심는 문제를 수정했다.
- 앱 전용 locale context를 사용하도록 바꿔 기본 경로와 locale 경로 모두 안정적으로 렌더링되게 했다.
- 앱을 다시 빌드/배포해 실제 Firebase Hosting 반영까지 마쳤다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/components/I18nClientProvider.tsx`: app locale context 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/components/LocaleSwitcher.tsx`: `useAppLocale()` 사용으로 전환
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/landing/LandingPage.tsx`: `useAppLocale()` 사용
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/library/LibraryPage.tsx`: `useAppLocale()` 사용
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/my-works/MyWorksPage.tsx`: `useAppLocale()` 사용
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/results/ResultsPage.tsx`: `useAppLocale()` 사용
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: `useAppLocale()` 사용
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingRoutePage.tsx`: `useAppLocale()` 사용

## 상세 내용
- 원인은 기본 경로에 locale 세그먼트가 없는데도 `useCurrentLocale()`가 이를 강제 해석하면서 `notFound()` fallback이 export HTML에 심긴 것이었다.
- 수정 후 `out/index.html`과 `out/library.html`에 실제 콘텐츠 본문이 렌더링되는 것을 확인했다.
- 앱 재배포도 완료했다: `https://typing-library.web.app`
