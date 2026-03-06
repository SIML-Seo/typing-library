# MVP 기반 재정의 및 레거시 격리

## 변경 일자
2026-03-06

## 변경 요약
기존 AWS/Amplify 중심 프로토타입을 유지한 채, 같은 레포 안에서 새 MVP를 정적 웹앱 기준으로 다시 시작할 수 있도록 문서, 구조, 보조 스크립트를 정리했다.

## 변경된 파일
- `docs/*`: PRD, 요구사항, ADR, 아키텍처, 배포, 상태관리 원칙 등 MVP 기준 문서 체계 추가
- `docs/examples/works-repo/*`: 공개 작품 저장소 구조와 메타데이터 샘플 추가
- `docs/examples/firebase-hosting/*`: Firebase Hosting `app`/`works` 타겟 예시 추가
- `scripts/works-index.mjs`: works catalog 검증 및 `index.json` 생성 스크립트 추가
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`: 정적 MVP 랜딩 진입점으로 전환
- `src/features/landing/LandingPage.tsx`: 새 랜딩 페이지 추가
- `src/legacy/*`: 기존 AWS/Auth/Admin/Zustand 코드 격리
- `src/shared/db/*`, `src/shared/store/*`: 새 MVP 공통 데이터/상태 계층 초안 추가

## 상세 내용
- 제품 방향을 `정적 사이트 + 0원 보장 + 로컬 퍼시스턴스`로 고정했다.
- 공개 작품은 별도 `works origin`과 `git submodule` 운영으로 분리했다.
- 사용자 데이터는 `IndexedDB`를 source of truth로 두고, `zustand`는 UI 상태 전용으로 제한했다.
- 랜딩은 새 MVP 방향에 맞게 교체했고, 기존 AWS 기반 기능은 `src/legacy`로 이동했다.
- 이후 구현은 `library -> typing -> results/my-works` 순서로 이어갈 수 있는 상태다.
