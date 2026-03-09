# 문서 목록 (Typing Library)

이 폴더는 `typing-library` 프로젝트의 제품/설계/운영 문서를 모아둡니다.

## 빠른 링크

- `decisions.md`: 현재까지 확정된 제품/기술/운영 결정 요약
- `current-state.md`: 프로토타입 현황 스냅샷(무엇이 구현/미구현인지, 리스크/갭 정리)
- `prd.md`: PRD (목표/범위/지표/제약/핵심 플로우)
- `requirements.md`: 요구사항/수용기준 (유저 스토리 + MVP 스펙)
- `ux-flows.md`: UX 플로우/화면 목록 (타이핑 규칙 포함)
- `data-model.md`: 데이터 모델/권한 규칙 (Work/TypingResult, Storage 연계)
- `auth.md`: 인증/보안 설계 (MVP: 정적/무인증, 레거시: NextAuth/Cognito 메모)
- `architecture.md`: 아키텍처/모듈 경계 (MVP: 정적/로컬, 레거시: AWS 프로토타입)
- `state-management.md`: 새 MVP 상태관리 원칙 (`IndexedDB` 우선, `zustand`는 UI 상태 한정)
- `engineering-guidelines.md`: 방어코딩 경계, fallback 규칙, 내부 로직 단순화 원칙
- `code-review-checklist.md`: PR 리뷰용 과한 방어코딩 / silent failure 체크리스트
- `works-repo-guide.md`: 공개 작품 저장소 구조/메타데이터/배포 운영 가이드
- `user-todo.md`: 사용자만 직접 해야 하는 외부 작업 체크리스트
- `mvp-implementation-plan.md`: 현재 레포 안에서 MVP 구현을 분리하는 실제 전환 계획
- `examples/works-repo/`: works 저장소 초기 구조 샘플
- `examples/firebase-hosting/`: Firebase Hosting `app`/`works` 타겟 샘플 설정
- `env.md`: 환경변수/시크릿 매핑 (MVP: GA4/Ads 옵션, 레거시 변수 포함)
- `local-dev.md`: 로컬 개발/디버깅 가이드 (MVP 목표 흐름 + 레거시 프로토타입 메모)
- `deploy.md`: 배포/운영 체크리스트 (환경/시크릿/키 만료/비용 가드레일)
- `testing.md`: 테스트 전략/E2E 시나리오 (핵심 플로우, 타이핑 엔진)
- `adr/`: 아키텍처 결정 기록(ADR)
- `benchmarks.md`: 레퍼런스/벤치마크 정리 (Typelit, typing.works)

## 현재 기준 먼저 볼 문서

1. `decisions.md`
2. `prd.md`
3. `requirements.md`
4. `architecture.md`
5. `deploy.md`

## 현재 확정된 핵심 결정

- MVP는 **정적 사이트 + 운영비 0원 보장** 원칙으로 간다
- 호스팅 1순위는 `Firebase Hosting (Spark, Hosting만)`이며, 카드/유료 플랜 요구 시 즉시 대체 호스트로 전환한다
- SEO는 랜딩 페이지만 대상으로 하고, 앱 기능 화면은 검색 색인 대상에서 제외한다
- 공개 작품은 앱과 분리된 `works origin`에서 제공하고, `works/` git submodule로 연결한다
- 게스트 필사/내 작품 업로드/결과 저장을 모두 허용하며, 사용자 데이터는 전부 로컬(`IndexedDB` 중심) 저장이다
- 필사 단위는 문단이고, 오타는 진행을 막지 않고 즉시 빨간색으로 표시한다
- 필사 화면에서는 붙여넣기/드래그앤드롭/자동 다문자 입력을 막고, 내 작품 업로드 화면에서는 `.txt` 업로드와 텍스트 붙여넣기를 허용한다
- 새 레포를 만들지 않고, 현재 레포 안에서 MVP 구현 영역을 분리해 단계적으로 전환한다
