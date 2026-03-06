# MVP 구현 전환 계획

버전: v0.1 (Draft)
작성일: 2026-03-06

## 0) 목적

이 문서는 **현재 레포를 유지한 채**, 새 MVP 구현을 어떤 구조로 분리할지 정리한다.
핵심 원칙은 아래 3가지다.

- 새 MVP는 기존 AWS 프로토타입에 기대지 않고 별도 구조로 구현한다
- 기존 프로토타입은 일정 기간 레거시로 보존하되, 새 기능은 그 위에 덧붙이지 않는다
- 구현 단계마다 “무엇이 새 MVP이고 무엇이 레거시인지” 디렉터리 경계로 명확히 드러나야 한다

관련 문서
- `architecture.md`
- `current-state.md`
- `adr/0013-same-repo-separate-mvp-implementation.md`

## 1) 현재 구조 진단

현재 핵심 상태
- `src/app/page.tsx`는 기본 Next 템플릿이다
- `src/app/layout.tsx`는 `AuthProvider`, `AmplifyCredentialsManager`, `AuthButtons`에 묶여 있다
- `src/app/admin/*`는 AWS/AppSync 기반 관리자 UI다
- `src/components/*`와 `src/store/*`는 현재 인증/Amplify/관리자 흐름 중심이다

이 상태에서 바로 기능을 추가하면 생기는 문제
- 새 MVP가 레거시 인증/Amplify 의존을 끌어오게 된다
- 루트 레이아웃이 AWS 전제 코드에 묶여 있어 정적 MVP 진입점이 흐려진다
- 작품/필사/결과 도메인보다 “기존 관리자/인증” 구조가 상위 개념처럼 남는다

## 2) 목표 폴더 구조(초안)

```text
src/
├─ app/
│  ├─ (marketing)/
│  │  └─ page.tsx
│  ├─ (app)/
│  │  ├─ library/
│  │  │  └─ page.tsx
│  │  ├─ typing/
│  │  │  └─ [workId]/
│  │  │     └─ page.tsx
│  │  ├─ results/
│  │  │  └─ page.tsx
│  │  ├─ my-works/
│  │  │  └─ page.tsx
│  │  └─ settings/
│  │     └─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ favicon.ico
├─ features/
│  ├─ landing/
│  ├─ library/
│  ├─ typing/
│  ├─ results/
│  ├─ my-works/
│  ├─ settings/
│  └─ analytics/
├─ shared/
│  ├─ components/
│  ├─ db/
│  ├─ lib/
│  ├─ hooks/
│  ├─ store/
│  ├─ styles/
│  └─ types/
├─ legacy/
│  ├─ auth/
│  ├─ admin/
│  ├─ amplify/
│  └─ stores/
└─ locales/
```

설명
- `src/app`: Next App Router의 화면 진입점만 둔다
- `src/features/*`: 작품/필사/결과 같은 MVP 도메인 로직을 둔다
- `src/shared/db/*`: IndexedDB 스키마/레코드 타입/공통 DB 레이어를 둔다
- `src/shared/store/*`: `zustand` 기반 UI 전역 상태를 둔다
- `src/shared/*`: 여러 기능이 공통으로 쓰는 UI/유틸/타입을 둔다
- `src/legacy/*`: 기존 AWS 프로토타입 코드를 임시 격리한다

## 3) 현재 파일 매핑 제안

### 3.1 유지 또는 재사용 가능

- `src/app/globals.css`
- `src/locales/*`
  다만 현재는 `ko` 하드코딩이므로, 새 MVP에서 실제로 쓸 최소 범위만 유지한다

### 3.2 레거시로 이동 대상

- `src/app/admin/*` → `src/legacy/admin/*`
- `src/components/AuthButtons.tsx` → `src/legacy/auth/AuthButtons.tsx`
- `src/components/AuthProvider.tsx` → `src/legacy/auth/AuthProvider.tsx`
- `src/components/AmplifyCredentialsManager.tsx` → `src/legacy/amplify/AmplifyCredentialsManager.tsx`
- `src/auth.config.ts` → `src/legacy/auth/auth.config.ts`
- `src/amplify-client.ts` → `src/legacy/amplify/amplify-client.ts`
- `src/store/authStore.ts` → `src/legacy/stores/authStore.ts`
- `src/store/worksStore.ts` → 검토 후 `legacy` 이동 또는 폐기

### 3.3 새 MVP로 대체 대상

- `src/app/page.tsx` → 랜딩 페이지로 재작성
- `src/app/layout.tsx` → 정적 MVP 기준 레이아웃으로 단순화
- `src/components/I18nClientProvider.tsx` → 유지 여부 검토 후 `shared` 이동 가능

## 4) 1차 리팩터링 순서

### Phase 1. 루트 진입점 정리

목표
- 루트 레이아웃에서 AWS/Auth 의존을 끊고, 새 MVP가 정적 환경에서 뜰 수 있게 만든다

작업
- `src/app/layout.tsx`에서 `AuthProvider`, `AmplifyCredentialsManager`, `AuthButtons` 제거
- MVP 헤더/메타데이터/기본 레이아웃만 남긴다
- 기존 인증 버튼/관리자 이동은 새 MVP 진입 경로에서 숨긴다

완료 기준
- 루트 페이지가 AWS 환경 없이 렌더링된다
- `amplify_outputs.json`이 없어도 MVP 화면 진입이 깨지지 않는다

### Phase 2. 레거시 격리

목표
- 기존 프로토타입과 새 MVP 코드 경계를 명확히 만든다

작업
- `src/app/admin/*`를 `src/legacy/admin/*`로 이동하거나, 최소한 신규 MVP 흐름에서 분리한다
- 기존 인증/Amplify 관련 컴포넌트를 `src/legacy/*` 아래로 이동한다
- 임시로 필요한 import alias를 맞춘다

완료 기준
- 새 MVP 라우트가 `legacy` 코드를 import 하지 않는다
- 레거시 코드는 “보존 영역”으로 분리되어 목적이 명확하다

### Phase 3. 공개 작품/로컬 저장 기반 마련

목표
- 새 MVP가 works origin과 IndexedDB만으로 동작할 수 있게 만든다

작업
- `src/features/library`에 works 인덱스 로더 추가
- `src/features/my-works`와 `src/features/results`에 로컬 저장 추상화 추가
- `src/shared/lib`에 fetch/IndexedDB 공통 유틸 추가

완료 기준
- 공개 작품 목록 로드 가능
- 내 작품/결과/드래프트 로컬 저장 구조가 준비됨

### Phase 4. 필사 엔진 구현

목표
- 핵심 MVP 가치인 필사 화면을 붙인다

작업
- 문단 분절
- 오버레이 렌더링
- 오타 판정/표시
- 자동 저장/이어하기
- 문단 리포트/결과 계산

완료 기준
- 작품 선택 → 필사 → 결과 저장까지 최소 플로우가 연결됨

### Phase 5. 레거시 제거

목표
- MVP 핵심 플로우가 안정화된 뒤, AWS 전제 코드를 정리한다

작업
- 사용하지 않는 `legacy` 코드 제거
- `amplify/`와 관련 env 문서 정리
- 불필요한 패키지 제거

완료 기준
- MVP 실행에 AWS/NextAuth/Amplify 의존이 남지 않는다

## 5) 구현 시작 시 첫 수정 후보

가장 먼저 손대기 좋은 파일
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/I18nClientProvider.tsx`

가장 먼저 만들 폴더
- `src/features/landing`
- `src/features/library`
- `src/features/typing`
- `src/shared/db`
- `src/shared/store`
- `src/shared/components`
- `src/shared/lib`

## 6) 이번 전환에서 하지 않을 것

- 기존 관리자 UI를 새 MVP 위에 억지로 재사용하지 않는다
- AWS 프로토타입 위에 필사 기능을 덧붙이지 않는다
- 로그인/서버 저장을 MVP 준비 단계에서 되살리지 않는다

## 7) 다음 실제 구현 시작점

다음 구현 작업은 아래 순서가 가장 안전하다.

1. `src/app/layout.tsx`를 MVP 기준으로 단순화
2. `src/app/page.tsx`를 랜딩으로 교체
3. `src/features/landing`과 `src/shared/components` 첫 구조 생성
4. works origin 읽기 클라이언트 추가
5. 그 다음에 필사 엔진으로 들어간다
