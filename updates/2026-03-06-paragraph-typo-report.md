# 문단별 오타 상세 리포트 추가

## 변경 일자
2026-03-06

## 변경 요약
- 문단 완료 시 오타 상세 리포트 시트를 띄워서 오타 개수와 오타 구간을 다시 확인할 수 있게 했다.
- 오타 구간은 연속된 mismatch를 하나의 세그먼트로 묶고, 원문/입력값을 공백·줄바꿈이 보이도록 표시한다.
- 문단 리포트 상세 정보가 결과 저장 구조에도 포함되도록 확장했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/paragraph-report.ts`: 오타 세그먼트 계산/가시화 텍스트 유틸 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/paragraph-report.test.ts`: 문단 리포트 로직 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: 문단 종료 상세 리포트 시트 UI 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/session.ts`: mismatch segment를 결과 저장 구조에 반영
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/types.ts`: paragraph report에 mismatch segment 필드 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/shared-typing.ts`: 상세 리포트 문구 추가

## 상세 내용
- 사용자가 문단을 끝낸 뒤 `문단 리포트 보기`를 누르면 상세 시트가 열린다.
- 오타가 없으면 성공 메시지를 보여주고, 있으면 문자 위치 구간과 함께 원문/입력값을 나란히 보여준다.
- 공백은 `␠`, 줄바꿈은 `↵`, 탭은 `⇥`로 표시해 눈으로 바로 식별할 수 있게 했다.
- 검증은 `npm test`와 `npm run build`까지 통과했다.
