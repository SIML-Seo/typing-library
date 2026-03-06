# 상태관리 원칙 (MVP)

버전: v0.1 (Draft)
작성일: 2026-03-06

## 0) 한 줄 요약

- 새 MVP의 **영속 데이터 source of truth는 IndexedDB**다.
- `zustand`는 필요할 때만 **얇은 UI 상태**에 한해 사용한다.
- 작품 원문/결과/드래프트 같은 핵심 데이터는 `zustand`에 두지 않는다.

## 1) 왜 이렇게 나누는가

- 이 프로젝트는 **정적 사이트 + 0원 보장**이 전제다.
- 따라서 서버 DB나 서버 세션을 상태관리의 기준으로 둘 수 없다.
- 사용자 데이터는 브라우저 로컬에 남아야 하므로, 전역 메모리 store보다 **영속 저장소(IndexedDB)** 가 기준이 되어야 한다.
- 반대로 “설정 패널 열림 여부” 같은 짧은 UI 상태는 IndexedDB에 넣을 이유가 없으므로 `zustand` 또는 React local state가 적합하다.

## 2) 상태 계층

우선순위는 아래 순서로 본다.

### 2.1 URL / 라우트 상태

- 현재 화면, 작품 ID, 파트 ID처럼 **주소로 표현 가능한 상태**
- 예: `/typing/[workId]`, `/results`

### 2.2 React local state

- 특정 화면 내부에서만 쓰는 상태
- 예: 입력 포커스, 현재 문단 렌더링 파생값, hover, 임시 에러 메시지
- 원칙: 다른 화면과 공유할 필요가 없으면 local state로 끝낸다

### 2.3 `zustand` UI store

- 여러 컴포넌트가 공유하지만 **새로고침 후 유지가 필요 없는 상태**
- 예: 설정 패널 열림 여부, 이어하기 다이얼로그 표시 여부
- 원칙: UI 제어용으로만 쓰고, 작품/결과 자체를 store에 장기 보관하지 않는다

### 2.4 IndexedDB

- 새로고침/재방문 후에도 살아 있어야 하는 상태
- 예: 내 작품, 결과 히스토리, 진행 중 드래프트, 사용자 설정
- 원칙: MVP의 핵심 데이터는 전부 IndexedDB를 기준으로 읽고 쓴다

## 3) 무엇을 어디에 둘지

### 3.1 IndexedDB에 둬야 하는 것

- 내 작품 목록과 원문
- 결과 히스토리
- 진행 중 필사 드래프트
- 사용자 설정 스냅샷(폰트/테마/판정 옵션)

### 3.2 `zustand`에 둘 수 있는 것

- 설정 패널 열림/닫힘
- 이어하기 모달 열림/닫힘
- 화면 전역의 일시적인 UI 토글 상태

### 3.3 `zustand`에 두지 않는 것

- 공개 작품 전체 목록 캐시
- 현재 문단 원문 전체
- 문단별 결과 영속본
- 업로드한 내 작품 원문
- 자동 저장 대상 데이터

## 4) 폴더 구조 원칙

```text
src/
└─ shared/
   ├─ db/
   │  ├─ schema.ts
   │  ├─ types.ts
   │  └─ index.ts
   └─ store/
      ├─ ui-store.ts
      └─ index.ts
```

설명
- `src/shared/db/*`: IndexedDB 스키마 이름, 레코드 타입, 공통 접근 레이어
- `src/shared/store/*`: `zustand` 기반 전역 UI 상태
- 기능별 조회/저장은 `src/features/*`에서 `shared/db`를 감싸는 방식으로 둔다

## 5) 초기 구현 규칙

- `src/features/library`: 공개 작품 인덱스 로드와 필터링
- `src/features/my-works`: 내 작품 CRUD + IndexedDB 연결
- `src/features/results`: 결과 저장/조회 + IndexedDB 연결
- `src/features/typing`: 드래프트 자동 저장, 이어하기, 문단 리포트 계산

즉, 기능 코드는 `features`, 저장소 계약은 `shared/db`, 얇은 UI 전역 상태는 `shared/store`가 맡는다.

## 6) 금지 규칙

- 같은 데이터를 `zustand`와 IndexedDB 양쪽에 source of truth로 중복 저장하지 않는다.
- “지금 편해서”라는 이유로 결과/드래프트를 메모리 store 중심으로 구현하지 않는다.
- 레거시 `src/legacy/stores/*` 패턴을 새 MVP에 그대로 복사하지 않는다.

## 7) 현재 레포 기준 정리

- 현재 설치된 상태관리 라이브러리는 `zustand`다.
- 하지만 실제 사용처는 지금 `src/legacy/stores/*`에만 남아 있다.
- 새 MVP에서는 `zustand`를 제거하지는 않되, **UI 상태 한정**으로만 사용한다.
- 영속 데이터 계층은 `src/shared/db/*`에서 새로 시작한다.
