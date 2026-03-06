# 결정 요약

작성일: 2026-03-06  
상태: 확정된 MVP 기준

이 문서는 현재까지 합의된 제품/기술/운영 결정을 한 곳에 모아둔 요약본이다.  
세부 근거와 변경 이력은 각 ADR과 상세 문서를 따른다.

## 1) 제품 경험

- 서비스 핵심은 “작품 선택 → 문장을 그대로 타이핑하는 필사 경험”이다
- 필사 단위는 **문단(=페이지/Chunk)** 이다
- 타이핑 UI는 고스트 텍스트 위에 입력이 덮어씌워지는 오버레이 방식이다
- 오타가 나도 입력은 계속 가능하며, 오타 위치는 즉시 빨간색으로 표시한다
- 문단이 끝나면 해당 문단의 오타 요약 리포트를 보여준다
- 공백/줄바꿈은 원문과 완전히 일치해야 한다
- 구두점/대문자도 판정하며 기본값은 **ON** 이다
- Backspace 수정은 허용하며, 수정 완료된 오타는 집계에서 제외한다
- 커서는 임의 이동 없이 현재 진행 위치에서만 입력한다
- 설정 패널(폰트/테마, 구두점·대문자 판정, 오타 표시 방식)은 MVP에 포함한다
- 필사 중 진행 상태는 자동 저장되며, 재방문 시 “이어하기”를 제공한다

관련 ADR
- `adr/0001-typing-error-policy.md`
- `adr/0002-chunk-is-paragraph.md`
- `adr/0006-typing-ui-ghost-overlay.md`
- `adr/0012-autosave-active-typing-session.md`

## 2) 입력 정책

- 필사 화면에서는 한글 IME 조합 입력과 일반 키보드 입력만 허용한다
- 필사 화면에서는 붙여넣기, 드래그앤드롭, 스크립트/매크로성 다문자 삽입을 차단한다
- 내 작품 업로드 화면에서는 `.txt` 파일 업로드와 텍스트 붙여넣기를 모두 허용한다

관련 문서
- `requirements.md`
- `ux-flows.md`

## 3) 콘텐츠와 저장

- 공개 작품은 저작권 만료 작품만 취급한다
- 공개 작품은 앱과 분리된 `works origin`에서 정적 파일로 제공한다
- 작품 원문/인덱스는 별도 `works repo`로 관리하고, 앱 레포에는 `works/` git submodule로 연결한다
- 사용자 결과, 내 작품, 진행 중 세션 드래프트는 모두 로컬 저장(`IndexedDB` 중심)이다
- 로그인/회원가입은 MVP에 포함하지 않는다
- 게스트도 공개 작품 필사와 내 작품 업로드를 모두 사용할 수 있다

관련 ADR
- `adr/0003-user-content-local-only.md`
- `adr/0008-public-works-separate-origin.md`
- `adr/0009-works-repo-as-git-submodule.md`
- `adr/0010-no-login-guest-my-works.md`

## 4) 배포와 운영

- MVP는 **정적 사이트**로만 배포한다
- AWS(Amplify/Cognito/AppSync/S3) 등 종량 과금형 인프라는 MVP에서 사용하지 않는다
- SEO는 랜딩 페이지만 대상으로 하며, SSR 없이 정적 생성으로 처리한다
- 호스팅 1순위는 `Firebase Hosting (Spark, Hosting만)` 이다
- 결제수단 연결 또는 유료 플랜 전환이 필요해지는 순간 Firebase는 제외하고 백업 호스트로 전환한다
- Functions/Firestore/Storage 등 서버 기능은 사용하지 않는다
- 무료 서브도메인으로 먼저 운영한다

관련 ADR
- `adr/0004-zero-cost-operation.md`
- `adr/0007-hosting-firebase-hosting-only.md`

## 5) 지표와 분석

- 성공 지표는 **DAU** 이다
- DAU는 GA4에서 일별 `typing_start` 유니크 사용자 수로 정의한다
- `typing_start`는 한 세션에서 한 번만 전송하며, 이어하기 복원 시 재전송하지 않는다
- 필사 원문/사용자 입력 텍스트는 분석 도구로 전송하지 않는다

관련 ADR
- `adr/0005-analytics-ga4.md`
- `adr/0011-ga4-event-schema.md`

## 6) 구현 전환 전략

- 새 레포를 만들지 않고, 현재 레포 안에서 MVP 구현 영역을 분리한다
- 기존 AWS 프로토타입은 당분간 레거시로 보존하되, 새 MVP 구현의 의존 경로로는 사용하지 않는다
- 목표는 “문서/운영 준비는 현재 레포에 누적 + 실제 MVP 구현도 같은 레포에서 단계적으로 전환”이다

관련 ADR
- `adr/0013-same-repo-separate-mvp-implementation.md`
