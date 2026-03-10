# 띄어쓰기 입력 차단 수정

## 변경 일자
2026-03-10

## 변경 요약
- 타이핑 컨테이너가 `Space` 키를 가로채면서 입력이 막히던 문제를 수정했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`

## 상세 내용
- 컨테이너 `onKeyDown`은 이제 자기 자신이 포커스를 받을 때의 `Enter`만 처리한다.
- textarea 내부에서 발생하는 `Space` 키 이벤트는 더 이상 막지 않는다.
- 수정 후 `npm test`, `npm run build`, `hosting:app` 재배포까지 완료했다.
