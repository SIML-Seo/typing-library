# 타이핑 포커스/가시성 마무리 보정

## 변경 일자
2026-03-11

## 변경 요약
- 타이핑 화면에서 남아 있던 `클릭해서 포커스` 문구를 제거했다.
- 자동 포커스, 가시적 캐럿, 입력 텍스트 대비를 다시 조정해 실제 입력이 더 잘 보이도록 마무리했다.
- IME 조합 입력과 공백 입력이 자연스럽게 이어지도록 입력 영역 동작을 보정했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: 포커스/캐럿/입력 가시성 보정
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/shared-typing.ts`: 불필요한 포커스 안내 문구 제거

## 상세 내용
- 입력용 `textarea`는 실제 본문 영역 안에 유지하면서, 상시 자동 포커스와 깜빡이는 캐럿을 추가했다.
- 원문 고스트 텍스트는 더 옅게, 입력 텍스트는 더 밝고 진하게 보여 대비를 벌렸다.
- 클릭 안내 문구는 제거하고, 포커스 상태는 시각적 캐럿과 링으로만 드러나게 했다.
