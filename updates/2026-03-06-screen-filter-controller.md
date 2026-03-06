# 화면 필터 컨트롤 추가

## 변경 일자
2026-03-06

## 변경 요약
- 타이핑 설정 패널에 화면 필터 컨트롤을 추가했다.
- 밝기, 대비, 색조, 채도, 세피아, 그레이스케일, 반전 값을 조절하면 `backdrop-filter` 기반 오버레이로 즉시 화면에 반영된다.
- 설정 스키마와 결과/드래프트 스냅샷에 시각 필터 값도 포함되도록 타입을 확장했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/visual-filters.ts`: 시각 필터 CSS 문자열 생성 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/visual-filters.test.ts`: 화면 필터 로직 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/TypingPage.tsx`: 설정 패널에 화면 필터 슬라이더와 오버레이 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/text.ts`: 구두점·대문자 판정 옵션 기반 비교 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/types.ts`: 시각 필터 설정 타입 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/app-settings-repository.ts`: 기본 필터값과 deep merge 저장 처리 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/shared-typing.ts`: 설정 패널/필터 번역 추가

## 상세 내용
- 설정 패널은 기존 폰트/테마/판정/오타 표시 방식에 더해 화면 필터 섹션을 포함한다.
- 필터값이 기본 상태가 아니면 전체 타이핑 화면 위에 `pointer-events: none` 오버레이를 깔고 `backdrop-filter`를 적용한다.
- 구두점·대문자 판정 OFF는 공백/줄바꿈은 유지하고, 구두점/대문자 차이만 무시하도록 구현했다.
- 검증은 `npm test`와 `npm run build`까지 통과했다.
