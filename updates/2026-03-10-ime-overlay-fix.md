# IME 겹침과 빈 상태 표시 수정

## 변경 일자
2026-03-10

## 변경 요약
- 타이핑 시작 전 `아직 입력한 글자가 없다` 오버레이 문구를 제거했다.
- 입력용 textarea 위치를 실제 본문 영역과 맞춰 IME 조합 텍스트가 겹쳐 보이는 문제를 줄였다.
- 다문자 입력 차단 로직에서 IME/띄어쓰기 흐름을 깨던 조건을 제거했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`

## 상세 내용
- textarea를 패널 전체가 아니라 실제 본문 텍스트 영역 안으로 옮겼다.
- textarea에 동일한 타이포그래피를 적용해 IME 조합 위치와 시각적 텍스트 위치를 맞췄다.
- 붙여넣기/드래그앤드롭은 계속 막되, IME 확정 입력과 공백 입력은 막지 않도록 처리했다.
