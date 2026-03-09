# 정적 export 배포 블로커 정리

## 변경 일자
2026-03-09

## 변경 요약
- 동적 `[workId]` 라우트를 제거하고, 쿼리 기반 정적 `/typing` 라우트로 전환했다.
- Next.js 설정을 `output: 'export'`로 바꿔 실제 정적 export가 가능하도록 맞췄다.
- Firebase Hosting 설정도 Next 정적 export 방식에 맞게 `cleanUrls` 기준으로 수정했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/next.config.ts`: `output: 'export'` 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/route.ts`: 정적 typing URL 생성/파싱 유틸 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/route.test.ts`: typing 경로 유틸 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingRoutePage.tsx`: 쿼리 기반 공용 typing 진입점 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/typing/page.tsx`: 기본 정적 typing 페이지 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/[locale]/typing/page.tsx`: locale 정적 typing 페이지 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/library/LibraryPage.tsx`: 공개 작품 링크를 쿼리 기반 typing 경로로 변경
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/my-works/MyWorksPage.tsx`: 내 작품 링크를 쿼리 기반 typing 경로로 변경
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/firebase.json`: app target에 `cleanUrls` 추가

## 상세 내용
- 기존 `/typing/[workId]`, `/typing/my/[workId]` 같은 동적 경로는 정적 export에서 빌드 타임에 work id 목록이 없어서 직접적인 배포 블로커였다.
- 이 문제를 `/typing?workId=...&kind=my` 방식으로 바꿔 해결했다.
- `npm run build` 결과에서 실제 `Exporting (3/3)`까지 확인했고, `/typing`과 `/:locale/typing`이 정적 경로로 출력되는 것을 확인했다.
- Firebase Hosting은 SPA rewrite 대신 `cleanUrls: true` 기준으로 수정했다. 그래야 Next export 산출물을 경로별로 그대로 서빙할 수 있다.
