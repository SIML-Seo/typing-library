# 타이핑 설정 패널 추가

## 변경 일자
2026-03-06

## 변경 요약
- 타이핑 화면에 설정 패널을 추가해 폰트 크기, 테마, 구두점·대문자 판정, 오타 표시 방식을 조절할 수 있게 했다.
- 구두점·대문자 판정 옵션에 맞춰 문자 비교 로직을 확장하고 테스트로 고정했다.
- 설정값 타입을 명확히 제한하고, 결과/드래프트 스냅샷에도 같은 설정 구조를 유지하도록 정리했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: 설정 패널 UI와 실시간 반영 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/text.ts`: 판정 옵션 기반 문자 비교 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/text.test.ts`: 판정 옵션 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/shared-typing.ts`: 설정 패널 번역 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/types.ts`: 테마/폰트/오타 표시 방식 타입 확장
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/app-settings-repository.ts`: 기본 설정 타입을 명시적으로 고정

## 상세 내용
- 폰트 크기는 `sm / md / lg`, 테마는 `paper / dark`, 오타 표시는 `빨간 글자 / 빨간 밑줄`로 제공한다.
- 구두점·대문자 판정이 꺼지면 공백/줄바꿈은 그대로 엄격하게 유지하고, 구두점과 대문자 차이만 무시한다.
- 설정 변경은 즉시 UI에 반영되고, IndexedDB의 앱 설정에도 저장된다.
- 검증은 `npm test`와 `npm run build`까지 통과했다.
