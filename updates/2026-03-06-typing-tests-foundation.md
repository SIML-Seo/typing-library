# 타이핑 유닛 테스트 기반 추가

## 변경 일자
2026-03-06

## 변경 요약
- 순수 로직부터 테스트를 고정할 수 있도록 기본 테스트 스크립트를 추가했다.
- 타이핑 텍스트 처리와 세션 계산 로직에 대한 첫 유닛 테스트를 작성했다.
- 테스트 문서에 현재 실행 기반과 목표 스택을 구분해 기록했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/package.json`: 테스트 실행 스크립트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/text.test.ts`: 문단 분절/오타 계산 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/session.test.ts`: 세션 지표/결과 레코드 계산 테스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/testing.md`: 현재 테스트 실행 기반 메모 추가

## 상세 내용
- 지금까지는 요구사항과 화면 구조를 고정하는 단계라 엄격한 TDD로 진행하지 않았다.
- 이제부터는 순수 함수와 저장 로직부터 먼저 테스트로 잠그고, 그 위에 UI를 얹는 방식으로 전환한다.
- 현재 워크스페이스에는 `node_modules`가 없어 `npm test`는 실패했고, 실패 원인은 `tsx` 미설치 상태다.
- 다음 단계는 의존성 설치 후 테스트를 실제 통과시키고, 결과 히스토리 화면도 같은 방식으로 테스트 우선으로 붙이는 것이다.
