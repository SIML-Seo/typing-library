# 데이터 모델 / 권한 규칙

버전: v0.1 (Draft)  
작성일: 2026-03-05

## 0) 범위

이 문서는 MVP(정적 사이트)에서 사용하는 데이터 구조(정적 작품/로컬 저장)와, 레거시 프로토타입(Amplify Gen2) 스키마를 함께 정리한다.  
MVP의 핵심 원칙은 **서버 저장 없음 + AWS 미사용**이며, 사용자 데이터(내 작품/결과)는 **로컬(IndexedDB)** 저장이 기본이다.

## 1) MVP 데이터(정적/로컬)

### 1.1 공개 작품 인덱스(정적) — 예: `{worksBaseUrl}/works/index.json`

저장 위치: 작품 전용 정적 호스팅(호스팅에 포함)

용어
- `worksBaseUrl`: 작품 호스팅의 origin(예: `https://<project>-works.web.app`)
  - 앱은 이 값을 기준으로 인덱스/원문을 fetch 한다(환경변수 또는 설정 파일로 주입).

권장 필드(MVP)
- `id` (string, required) — 파일명/슬러그
- `title` (string, required)
- `author` (string, optional)
- `language` (string, optional) — `ko`, `en` 등
- `source` (string, optional) — 출처(링크/서지 정보)
- `copyrightProof` (string, required in 운영 데이터) — 저작권 만료 근거
- `textPath` (string, optional) — 단일 원문 파일 경로(예: `/works/{id}.txt`)
- `parts` (array, optional) — 대용량 작품 분할 제공(권장)
  - `id` (string) — `part-001` 등
  - `title` (string, optional) — 장/권 제목
  - `path` (string, required) — 파트 파일 경로(예: `/works/{id}/part-001.txt`)
- (선택) `checksum` (string) — 무결성/캐시용, 생성 스크립트에서 자동 계산 가능

### 1.2 공개 작품 원문(정적) — 예: `{worksBaseUrl}/works/{id}.txt`

저장 위치: 작품 전용 정적 호스팅의 정적 텍스트 파일

규칙(MVP)
- 줄바꿈 정규화: `\r\n` → `\n`
- 문단 분리: ADR 0002(빈 줄 기준) 적용

### 1.3 내 작품(My Work) — IndexedDB

저장 위치: 브라우저 IndexedDB

권장 필드(MVP)
- `id` (string)
- `title` (string)
- `author` (string, optional)
- `content` (string) — 원문 텍스트
- `createdAt`, `updatedAt` (ISO datetime)

### 1.4 결과(Result) — IndexedDB

저장 위치: 브라우저 IndexedDB

권장 필드(MVP)
- `id` (string)
- `workRef` (object)
  - `kind`: `public` | `my`
  - `id`: 작품 id
- `startedAt`, `endedAt` (ISO datetime)
- `elapsedTimeMs` (number)
- `wpm` (number)
- `accuracy` (number)
- `settingsSnapshot` (object) — 판정 옵션/폰트/테마 등
- (선택) `paragraphReports` (array) — 문단별 오타 요약

### 1.5 진행 중 세션 드래프트(Active Typing Session Draft) — IndexedDB

저장 위치: 브라우저 IndexedDB

권장 필드(MVP)
- `id` (string)
- `workRef` (object)
  - `kind`: `public` | `my`
  - `id`: 작품 id
- `partId` (string, optional) — 파트형 공개 작품일 때
- `workChecksum` (string, optional) — 공개 작품 버전 불일치 감지용
- `paragraphIndex` (number) — 현재 진행 중인 문단 인덱스
- `currentParagraphInput` (string) — 현재 문단 입력 스냅샷
- `paragraphReportsSnapshot` (array, optional) — 완료된 문단 리포트 누적값
- `elapsedTimeMs` (number) — 저장 시점까지의 누적 시간
- `settingsSnapshot` (object) — 판정 옵션/폰트/테마 등
- `updatedAt` (ISO datetime)

규칙(MVP)
- 자동 저장은 입력/문단 전환/일시정지 시점마다 수행한다(짧은 debounce 허용).
- 완료 시 드래프트는 삭제하고, 결과(Result)만 남긴다.
- 저장된 공개 작품의 `workChecksum`이 현재 인덱스와 다르면 이어하기 대신 “새로 시작”을 유도할 수 있다.

## 2) 권한(Authorization) — MVP

- 서버 권한은 없다(정적 사이트).
- 사용자 데이터는 로컬에만 저장되며, 다른 사용자/서버와 공유되지 않는다.

## 3) 레거시(프로토타입: Amplify Gen2)

> 아래는 현재 레포에 남아있는 Amplify Gen2 기반 프로토타입 스키마/권한 정리다.  
> MVP에서는 AWS를 사용하지 않으므로, 이 섹션은 참고용이며 정리/제거 대상이다.

### 3.1 `Work` (작품)

저장 위치: Data(AppSync + DynamoDB) + (선택) Storage(S3)

필드(현재 스키마)
- `id`: 자동 생성
- `title` (string, required)
- `author` (string, optional)
- `genre` (string, optional)
- `content` (string, optional)
- `s3Key` (string, optional) — S3에 원문을 저장한 경우 경로 키
- `createdAt`, `updatedAt`: 자동 생성

관계
- `Work` 1 : N `TypingResult` (`typingResults`)

대용량 텍스트 처리(중요)
- DynamoDB 아이템 크기 제한(최대 400KB)을 고려해, 원문이 큰 경우 `content` 대신 Storage(S3)에 업로드하고 `s3Key`만 저장한다.
- 현재 관리자 일괄 업로드 UI에서 380KB 기준으로 분기한다(정책은 문서로 고정 필요).

### 3.2 `TypingResult` (필사 결과)

저장 위치: (현재 스키마 존재) Data(AppSync + DynamoDB)  
MVP 정책: 기본은 로컬 저장(IndexedDB). 서버 저장은 추후 옵션.

필드(현재 스키마)
- `id`: 자동 생성
- `userId` (string, required) — Cognito `sub` 등
- `username` (string, required)
- `workId` (ID, required)
- `wpm` (int, required)
- `accuracy` (float, required)
- `elapsedTime` (int, required, seconds)
- `typedAt` (datetime, required)
- `createdAt`, `updatedAt`: 자동 생성

관계
- `TypingResult` N : 1 `Work` (`work`)

## 4) 권한(Authorization)

> 기준 파일: `amplify/data/resource.ts`

### 4.1 `Work` 권한

- `public apiKey`: `read`
- `Admins` 그룹: `create`, `update`, `delete`

의미
- 공개 작품 라이브러리는 비로그인/게스트도 조회 가능
- 등록/수정/삭제는 관리자만 가능

### 4.2 `TypingResult` 권한

- `owner`: `create`, `read`

의미
- 로그인한 사용자의 “본인 결과”만 서버에 저장/조회 가능(설계상)
- 단, MVP에서는 결과를 로컬 저장하므로 서버 `TypingResult`는 당장 사용하지 않을 수 있음

## 5) 인증 모드(Amplify Data)

> 기준 파일: `amplify/data/resource.ts`

- 기본 모드: `apiKey` (만료 30일)
- (옵션) `userPool` 모드: 클라이언트가 토큰을 주입해 호출

주의
- `apiKey`는 만료/교체가 필요하므로 “운영 절차(키 롤오버)”가 문서로 필요하다.

## 6) Storage 연계

> 기준 파일: `amplify/storage/resource.ts`

- 경로: `public/works/*`
  - guest/authenticated: `read`
  - `Admins`: `read`, `write`, `delete`

권장 규칙
- `Work.content`가 있으면 그것을 사용
- `Work.content`가 없고 `Work.s3Key`가 있으면, 해당 키로 S3에서 원문을 로딩

## 7) API 패턴(초안)

- 작품 목록: `listWorks(limit, nextToken)`
- 작품 생성/삭제: 관리자 토큰(그룹) 기반 호출
- 페이지네이션: `nextToken`을 스토어에 저장하고 페이지 이동 시 사용(현재 UI는 TODO/임시 계산 존재)

## 8) MVP 기준 정리

- MVP에서는 서버 `TypingResult`를 사용하지 않는다. 결과 저장은 전부 로컬(`IndexedDB`) 기준이다.
- 공개 작품 검색은 정적 `index.json`을 로드한 뒤 클라이언트 필터 방식으로 처리한다.
- 공개 작품 캐싱은 아래 기준으로 고정한다.
  - 인덱스: 짧은 캐시 또는 `no-cache`
  - 원문/파트 파일: 버전 또는 해시가 반영된 파일명 + 장기 캐시
- AWS 기반 `Work`/`TypingResult` 스키마는 현재 프로토타입 분석용 메모이며, MVP 구현 기준 모델은 1장(정적/로컬)이다.
