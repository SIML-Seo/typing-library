# 결과 히스토리 화면 추가

## 변경 일자
2026-03-06

## 변경 요약
- 로컬 IndexedDB에 저장된 완료 세션을 조회하는 `results` 화면을 추가했다.
- 결과 정렬/필터/요약 로직을 테스트로 먼저 고정한 뒤 화면과 라우트를 연결했다.
- 활성 MVP 빌드에서 레거시 코드를 제외해 `next build`가 통과하도록 정리했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/results/history.ts`: 결과 목록 가공/필터/요약 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/results/history.test.ts`: 결과 로직 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/results/ResultsPage.tsx`: 결과 히스토리 화면 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/results/page.tsx`: 기본 한국어 결과 라우트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/[locale]/results/page.tsx`: 다국어 결과 라우트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/shared-results.ts`: 결과 화면 공용 번역 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/library/LibraryPage.tsx`: 결과 화면 진입 링크 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: 완료 후 결과 화면 이동 링크 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/tsconfig.json`, `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/eslint.config.mjs`: 레거시 영역을 활성 MVP 빌드/린트 대상에서 제외

## 상세 내용
- 결과 화면은 작품 제목, 저자, 언어 기준 검색과 `전체 / 공개 작품 / 내 작품` 필터를 지원한다.
- 공개 작품 메타데이터는 works catalog를 사용하고, 로컬 작품은 IndexedDB의 `myWorks`를 사용해 제목을 복원한다.
- 타이핑 세션 드래프트는 결과 히스토리에 섞이지 않도록 유지했다.
- 테스트는 `npm test`, 검증은 `npm run build`까지 통과했다.
