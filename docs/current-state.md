# Current State (프로토타입 스냅샷)

작성일: 2026-03-05
상태: 프로토타입(문서/정리 전) → 문서 기반 개발로 전환 중

## 0) 한 줄 요약

- 핵심 기능(작품 선택 → 문장 그대로 타이핑/필사) UI·로직은 아직 없음
- Amplify Gen2로 Auth/Data/Storage 리소스 정의는 존재
- Admins 그룹 기반 “작품 관리(등록/삭제/일괄 업로드)” UI는 존재
- 실행에 필요한 `amplify_outputs.json`은 gitignore라 레포에 없음(온보딩 문서 필요)
- (결정) MVP(개발/배포)는 **정적 사이트 + 0원 보장** 원칙으로 가며, AWS(Amplify/Cognito/AppSync/S3) 기반 프로토타입은 정리/제거 대상
- (결정) 새 레포를 만들지 않고, 현재 레포 안에서 MVP 구현 영역을 분리해 단계적으로 전환한다

## 1) 제품 목표(현재 정의된 핵심)

- 사용자는 작품을 선택한다
- 작품의 문장을 그대로 타이핑한다(필사)
- 진행률/정확도/WPM/소요시간을 계산한다
- 결과를 저장하고 조회한다(기본: 로컬 저장)
- (관리자) 작품을 등록/삭제/업로드한다

## 2) 기술 스택

- Next.js 15(App Router) + React 19 + TypeScript(strict)
- Tailwind CSS v4
- Auth: NextAuth v4 + Cognito Provider
- Backend: Amplify Gen2(Auth/Data/Storage)
- State: Zustand(현재는 legacy store), 새 MVP는 `IndexedDB + local state + 얇은 UI store` 원칙으로 전환 중
- i18n: next-international(기본 `ko` + 주요 10개 언어 라우팅/사전 추가)

## 3) 레포 구조(주요)

- `amplify/`: Gen2 backend 정의(auth/data/storage)
- `src/app`: 현재 활성 MVP 진입점(랜딩 + `library`)
- `src/features`: 새 MVP 기능 모듈
- `src/legacy`: 기존 AWS/Auth/Admin/Store 코드 격리 영역
- `src/components`: 현재는 `I18nClientProvider` 등 잔여 공통 컴포넌트
- `src/shared`: 새 MVP 공통 계층(`db`, `store`, `lib`) 추가됨

## 4) 백엔드(Amplify Gen2) 현황

### 4.1 Auth

- `amplify/auth/resource.ts`
  - `loginWith.email: true`
  - 그룹 `Admins` 정의(관리자 기능 접근 제어에 사용)

### 4.2 Data

- `amplify/data/resource.ts`
  - `Work`
    - `title` 필수, `author/genre/content/s3Key` 선택
    - 권한: `public apiKey`는 read, `Admins`는 create/update/delete
  - `TypingResult`
    - `userId/username/workId/wpm/accuracy/elapsedTime/typedAt`
    - 권한: owner create/read
  - auth mode: 기본 `apiKey`(30일 만료). `userPool`은 토큰 주입 전제.

### 4.3 Storage

- `amplify/storage/resource.ts`
  - 경로 `public/works/*`: guest/authenticated read, `Admins` write/delete

### 4.4 Outputs

- `amplify_outputs.json`이 레포에 없음(`.gitignore`에서 `amplify_outputs*` 무시)
- 로컬/배포에서 outputs 생성/주입 방법을 문서로 확정해야 함

## 5) 프론트엔드 현황

### 5.1 Public(`/`)

- `src/app/page.tsx`는 새 MVP 랜딩으로 교체됨
- `src/app/library/page.tsx`가 추가되어 공개 작품 카탈로그/로컬 작품 진입점이 구현됨
- `src/app/typing/[workId]/page.tsx`와 `src/app/[locale]/typing/[workId]/page.tsx`가 추가되어 문단 단위 타이핑 콘솔이 연결됨
- `library`는 `NEXT_PUBLIC_WORKS_BASE_URL`이 있으면 works origin의 `index.json`을 읽고, 없으면 샘플 카탈로그로 프리뷰됨
- `typing`은 오버레이 입력, 즉시 오타 표시, 문단 이동, 로컬 자동 저장/이어하기, 완료 결과 로컬 저장까지 연결됨
- `results`는 아직 미구현

### 5.2 Layout

- `src/app/layout.tsx`
  - 정적 MVP 기준 메타데이터와 폰트만 유지
  - i18n provider는 기본 경로(`/`, `/library`)와 `/:locale/*` 레이아웃에서 각각 주입
  - AWS/Auth wrapper는 제거됨

### 5.3 Admin(`/admin`)

- 활성 `app` 라우트에서는 제거되었고, 기존 관리자 UI는 `src/legacy/admin/*`로 이동됨
- 레거시 관리자 코드는 AWS/AppSync 기반 참고 구현으로만 남아 있음

- `src/legacy/admin/components/WorksTable.tsx`
  - `listWorks`: `dataClient.graphql`(apiKey)
  - `deleteWork`: AppSync 직접 fetch + 세션의 `idToken` 사용
  - pagination/search UI는 있으나 `nextToken/필터`는 TODO/임시 계산 존재

- `src/legacy/admin/components/WorkForm.tsx`
  - `createWork`: AppSync 직접 fetch + `idToken` 필요

- `src/legacy/admin/components/FileUploadForm.tsx`
  - 다중 `.txt` 파일 → 파일명 파싱(저자/제목) → 중복 체크 → `createWork`
  - 380KB 초과 시 S3에 업로드 후 `s3Key` 저장(`content`는 null)

### 5.4 Auth

- 인증 관련 코드는 모두 `src/legacy/auth/*`, `src/legacy/api/auth/*`로 이동됨

- `src/legacy/auth/auth.config.ts`
  - JWT/session 콜백에서 `idToken/accessToken/groups`를 세션에 주입
- `src/legacy/auth/AuthButtons.tsx`
  - `signIn('cognito')`
  - `signOut` 후 Cognito Hosted UI logout URL로 이동(클라이언트 env 필요)
- `src/legacy/amplify/AmplifyCredentialsManager.tsx`
  - `Amplify.configure(outputs)`
  - NextAuth 토큰을 Amplify Storage 인증에 연결하려는 시도는 현재 미완(실제 credential 주입 로직 부재)

### 5.5 i18n

- `src/locales/*`: `ko`, `en`, `ja`, `zh-CN`, `zh-TW`, `es`, `fr`, `de`, `pt-BR`, `id` 사전 추가
- 기본 경로(`/`, `/library`)는 `ko`, 그 외 언어는 `/:locale`, `/:locale/library` 경로로 접근 가능
- 랜딩/라이브러리 상단에 언어 전환 UI가 추가됨

### 5.6 Local-first 계층

- `src/shared/db/*`
  - IndexedDB 오픈/트랜잭션 유틸과 `myWorks`, `typingResults`, `typingDrafts`, `appSettings` 리포지토리 초안이 추가됨
- `src/shared/store/*`
  - `zustand` 기반 UI store(`isSettingsPanelOpen`, `isResumeDialogOpen`)가 추가됨
- 현재 원칙은 “영속 데이터는 IndexedDB, UI 전역 상태만 store”로 고정됨

## 6) 리스크/갭

- 필사 엔진(`typing`)과 결과 화면(`results`)은 아직 미구현
- outputs 파일 미포함으로 신규 개발자 온보딩/실행이 막힘
- AppSync Cognito 인증 헤더 형식(`Authorization: Bearer <jwt>`)은 실제 동작 검증 필요
- NextAuth ↔ Amplify(Storage) 인증 브릿지 미완 → S3 업로드 권한/자격증명 이슈 가능
- Admin 검색/페이지네이션은 임시(TODO/임시 계산)

## 7) 최근 합의된 방향(2026-03-05)

- 공개 작품 텍스트는 관리자가 **저작권 만료 작품만** 선별하여 대량 업로드해 공개 제공한다.
- 로그인 없이도 “내 작품 업로드”가 가능하며, MVP에서는 비용 방지를 위해 **IndexedDB 로컬 저장**을 기본으로 한다(서버 업로드/동기화 없음).
- 내 작품 업로드는 `.txt` 파일 선택과 텍스트 붙여넣기를 모두 허용한다.
- 비로그인도 필사는 가능하며, 결과 저장은 **로컬(IndexedDB/LocalStorage)** 로 한다.
- 타이핑 UI는 원문을 고스트(회색)로 보여주고, 입력이 같은 위치에 덮어씌워지는(overlay) 느낌으로 렌더링한다.
- 오타가 나도 진행은 계속 허용하되, 오타 위치를 즉시 빨간색으로 표시하고 문단 종료 시 오타 요약 리포트한다.
- 필사 화면에서는 붙여넣기/드래그앤드롭/자동 다문자 입력을 막고, 한글 IME와 일반 키보드 입력만 허용한다.
- 페이지(Chunk) 단위는 **문단 기준**으로 한다.
- 설정 패널은 MVP에 포함한다(폰트/테마, 구두점·대문자 판정, 오타 표시 방식).
- 성공 지표는 **DAU(일일 활성 사용자)**.
- DAU는 GA4로 측정한다.
- 운영비는 **무조건 무료(0원 보장)** 여야 하며, 유저 증가가 곧바로 서버 비용 증가로 이어지는 설계를 피한다.
- MVP(개발/배포)는 **정적 사이트**로 운영하며, AWS(Amplify/Cognito/AppSync/S3) 기반 백엔드는 사용하지 않는다.
- 정적 호스팅(1순위)은 Firebase Hosting(Spark, Hosting만)으로 한다.
- 공개 작품 텍스트는 작품 전용 정적 호스팅(works origin)으로 분리해, 작품 업데이트를 앱 배포와 독립적으로 처리한다.
- works 원문/인덱스는 별도 git 저장소로 관리하고, 앱 레포에는 `works/` git submodule로 연결한다(모노레포처럼 작업).
- 필사 중 진행 상태는 로컬에 자동 저장하며, 새로고침/재방문 시 “이어하기”를 제공한다.
- 구현은 **현재 레포 유지 + 새 MVP 구현 영역 분리** 전략으로 진행한다. 기존 AWS 프로토타입은 당분간 레거시로 보존한다.
