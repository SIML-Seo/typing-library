# 로컬 개발 / 디버깅 가이드

버전: v0.1 (Draft)  
작성일: 2026-03-05

## 0) 전제

- Node.js가 필요하다(권장: Node 20 LTS).
- MVP는 **정적 + AWS 미사용**으로 전환 중이다.
  - 목표 상태에서는 `amplify_outputs.json` 없이도 로컬 실행이 가능해야 한다.
  - 다만 현재 레포에는 AWS 기반 프로토타입 코드가 남아있을 수 있어, 프로토타입을 실행하려면 outputs가 필요할 수 있다(레거시 섹션 참고).

## 1) 설치

```bash
npm install
```

## 2) MVP 로컬 실행(목표)

- 공개 작품은 works origin(작품 전용 정적 호스팅)에서 로드한다.
  - 예: `{worksBaseUrl}/works/index.json`, `{worksBaseUrl}/works/{id}.txt`
- works repo는 `works/` git submodule로 관리될 수 있다(작품 업데이트/배포용).
- GA4는 `NEXT_PUBLIC_GA4_MEASUREMENT_ID`가 있을 때만 로드한다(`/docs/env.md` 참고).

환경변수(선택)
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (로컬에서는 비워도 됨)
- `NEXT_PUBLIC_WORKS_BASE_URL` (works origin, 비워두면 fallback 정책은 구현에서 결정)

개발 서버 실행

```bash
npm run dev
```

접속
- http://localhost:3000

### 2.1 (선택) works submodule 초기화

works 호스팅에 올릴 작품 파일을 로컬에서 수정/검증해야 한다면 submodule을 초기화한다.
작품 디렉터리 구조와 메타데이터 규칙은 `/docs/works-repo-guide.md`를 따른다.

```bash
git submodule update --init --recursive
```

## 3) 로컬 스모크 테스트(MVP)

### 3.1 필사 플로우

- 작품 목록 → 작품 선택 → 필사 화면 진입
- 일부러 오타 입력 → 즉시 빨간색 표시
- 입력 중 새로고침 → 이어하기 노출/복원
- 문단(=페이지) 완료 → 문단 오타 리포트
- 완료 → 결과 요약/저장(IndexedDB)

## 4) 레거시(프로토타입) 로컬 실행

현재 레포에 AWS(Amplify) 기반 프로토타입이 남아있다면, 아래가 필요할 수 있다.
- 프로젝트 루트에 `amplify_outputs.json` 파일
- NextAuth/Cognito 관련 환경변수(`/docs/env.md`의 레거시 섹션)

## 5) 디버깅 체크리스트(공통)

- (MVP) 공개 작품 정적 인덱스/원문 fetch 404 여부
- (MVP) IndexedDB 저장/조회 여부(결과/내 작품/진행 중 드래프트)
- (공통) 토큰/시크릿/콘텐츠를 콘솔/로그로 출력하지 않는지
