# 내 작품 업로드와 로컬 필사 진입 추가

## 변경 일자
2026-03-06

## 변경 요약
- `.txt` 업로드와 텍스트 붙여넣기로 로컬 원고를 저장하는 `my-works` 화면을 추가했다.
- 공개 작품과 별도로 `내 작품` 전용 타이핑 라우트를 연결해 같은 필사 엔진을 재사용하도록 만들었다.
- 제목 추론, 본문 정규화, 드래프트/결과의 `workKind` 처리 로직을 테스트로 먼저 고정했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/my-works/record.ts`: 내 작품 레코드 생성/정규화 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/my-works/record.test.ts`: 내 작품 로직 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/my-works/MyWorksPage.tsx`: 업로드/목록/삭제/필사 시작 화면 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/my-works/page.tsx`: 기본 한국어 내 작품 라우트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/[locale]/my-works/page.tsx`: 다국어 내 작품 라우트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/typing/my/[workId]/page.tsx`: 내 작품 전용 타이핑 라우트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/[locale]/typing/my/[workId]/page.tsx`: 다국어 내 작품 타이핑 라우트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: `public`/`my` 공용 세션 처리로 확장
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/shared-my-works.ts`: 내 작품 공용 번역 추가

## 상세 내용
- 폼에서 제목을 비우면 파일명 또는 본문 첫 줄에서 기본 제목을 유도한다.
- 저장된 내 작품은 IndexedDB에만 남고, 삭제와 즉시 필사 시작이 가능하다.
- 드래프트 ID와 결과 레코드가 `public`/`my`를 구분하도록 세션 로직을 확장했다.
- 라이브러리와 결과 화면에서 `내 작품` 화면으로 바로 이동할 수 있다.
- 검증은 `npm test`와 `npm run build`까지 통과했다.
