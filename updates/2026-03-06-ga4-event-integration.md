# GA4 이벤트 연결 추가

## 변경 일자
2026-03-06

## 변경 요약
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`가 있을 때만 GA4 스크립트를 로드하도록 연결했다.
- `typing_start`, `typing_paragraph_complete`, `typing_complete`, `my_work_upload` 이벤트 전송 로직을 추가했다.
- 드래프트에 `typingSessionId`와 `hasSentTypingStart`를 포함시켜 이어하기 복원 시 `typing_start` 중복 전송을 막았다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/analytics/ga4.ts`: GA4 이벤트 파라미터 생성/전송 유틸 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/analytics/ga4.test.ts`: 이벤트 파라미터 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/analytics/Ga4Scripts.tsx`: GA4 스크립트 로드 컴포넌트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/layout.tsx`: GA4 스크립트 주입
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: 타이핑 시작/문단 완료/작품 완료 이벤트 연결
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/my-works/MyWorksPage.tsx`: 내 작품 저장 성공 시 업로드 이벤트 연결
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/types.ts`: 드래프트에 세션 id/전송 여부 필드 추가

## 상세 내용
- 공개 작품일 때만 `public_work_id`와 `work_language`를 보내고, 내 작품은 `work_kind=my`만 전송한다.
- `typing_start`는 첫 입력 시점에만 전송하고, 드래프트에 상태를 저장해 이어하기 복원 시 재전송되지 않게 했다.
- `my_work_upload`는 텍스트 길이와 업로드 소스(`file`/`paste`)만 보내고, 파일명과 본문 텍스트는 보내지 않는다.
- 검증은 `npm test`와 `npm run build`까지 통과했다.
