# 다국어 라우팅과 필사 세션 흐름 추가

## 변경 일자
2026-03-06

## 변경 요약
- 기본 랜딩 구조 위에 10개 언어 라우팅과 언어 전환 UI를 추가했다.
- works origin 카탈로그와 로컬 IndexedDB 계층을 연결해 라이브러리 화면을 구현했다.
- 문단 단위 타이핑 화면에 오버레이 입력, 자동 저장, 이어하기, 결과 로컬 저장 흐름을 추가했다.
- 방어코딩/리뷰 기준 문서와 현재 상태 문서를 최신 합의에 맞게 갱신했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/app/[locale]/*`: 다국어 라우트와 메타데이터 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/library/*`: 공개 작품 카탈로그, 선택 UI, works origin 로딩 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/features/typing/*`: 문단 타이핑, 세션 저장, 결과 계산 로직 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/*`: 10개 언어 사전과 타이핑 문구 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/shared/db/*`: IndexedDB 리포지토리 초안 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/*`: 엔지니어링 가이드, 코드 리뷰 체크리스트, 현재 상태 문서 갱신

## 상세 내용
### 다국어 기반
- 기본 경로는 한국어로 유지하고 `/:locale` 형태의 다국어 경로를 추가했다.
- 랜딩과 라이브러리 화면에서 같은 언어 전환 UI를 사용할 수 있게 정리했다.

### 작품 진입 흐름
- `NEXT_PUBLIC_WORKS_BASE_URL`이 있으면 works origin의 `index.json`을 읽고, 없으면 프리뷰 카탈로그로 동작하게 만들었다.
- 선택한 작품을 `/typing/[workId]` 라우트로 연결했다.

### 필사 세션
- 오버레이 방식 입력, 즉시 오타 표시, 문단 이동 규칙을 반영했다.
- 진행 중 세션을 IndexedDB 드래프트로 저장하고, 재진입 시 이어하기/새로 시작 흐름을 추가했다.
- 작품 완료 시 결과를 로컬에 저장하고, 저장 실패 시 재시도 가능하게 처리했다.

### 문서 정리
- 과한 방어코딩을 피하기 위한 엔지니어링 원칙과 리뷰 체크리스트를 문서화했다.
- 현재 상태 문서를 실제 구현 수준에 맞게 갱신했다.
