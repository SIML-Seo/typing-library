# 공개 작품 저장소 운영 가이드

버전: v0.1 (Draft)  
작성일: 2026-03-06

## 0) 목적

이 문서는 공개 작품 원문/메타데이터를 관리하는 `works repo`의 운영 기준을 정리한다.  
목표는 아래 4가지를 동시에 만족하는 것이다.

- 앱 배포 없이 공개 작품만 별도로 업데이트한다
- 작품 원문/메타데이터의 히스토리와 리뷰를 git으로 관리한다
- 대용량 작품도 분할/캐시 정책으로 무료 운영 범위에서 다룬다
- 앱은 항상 같은 형식의 `index.json`과 텍스트 파일만 읽도록 고정한다

관련 문서
- `architecture.md`
- `data-model.md`
- `deploy.md`
- `adr/0008-public-works-separate-origin.md`
- `adr/0009-works-repo-as-git-submodule.md`

샘플 구조
- 문서용 예시는 `docs/examples/works-repo/`에 둔다
- 실제 운영 저장소는 이 구조를 별도 works repo 또는 `works/` submodule에 반영한다

## 1) 저장소 역할

- `works repo`는 공개 작품의 **원문/메타데이터/배포 산출물**을 관리하는 별도 git 저장소다
- 앱 레포는 `works/` git submodule로 이 저장소를 연결한다
- 앱은 `works repo`의 내부 구조를 직접 탐색하지 않고, 배포된 아래 경로만 읽는다
  - `GET {worksBaseUrl}/works/index.json`
  - `GET {worksBaseUrl}/works/{workId}.txt`
  - `GET {worksBaseUrl}/works/{workId}/part-001.txt` 같은 분할 파일

## 2) 권장 디렉터리 구조

```text
works/
├─ public/
│  └─ works/
│     ├─ index.json
│     ├─ spring-spring-kim-yujeong.txt
│     ├─ little-prince/
│     │  ├─ part-001.v1.txt
│     │  └─ part-002.v1.txt
│     └─ ...
├─ catalog/
│  ├─ spring-spring-kim-yujeong.json
│  ├─ little-prince.json
│  └─ ...
└─ README.md
```

운영 원칙
- `catalog/`는 사람이 읽고 수정하는 작품 메타데이터 원본이다
- `public/works/index.json`은 앱이 직접 읽는 배포용 인덱스다
- 초기에는 `index.json`을 수동으로 갱신해도 되지만, 작품 수가 늘면 `catalog/` 기준 생성 스크립트로 전환한다
- 문서용 샘플 파일은 `docs/examples/works-repo/`를 참고한다

## 3) 파일 규칙

### 3.1 문자 인코딩 / 줄바꿈

- 원문 텍스트는 `UTF-8` 저장
- 줄바꿈은 `LF(\n)` 기준으로 정규화
- BOM은 사용하지 않는다

### 3.2 작품 ID

- 작품 ID는 앱/인덱스/파일 경로에서 공통으로 쓰는 안정적인 식별자다
- 권장 형식은 소문자 kebab-case 영문/숫자 조합이다
  - 예: `spring-spring-kim-yujeong`
  - 예: `little-prince-saint-exupery`
- 제목 수정이나 표기 변경이 있더라도 ID는 바꾸지 않는다

### 3.3 단일 파일 vs 분할 파일

- 짧은 작품은 단일 파일을 사용한다
  - 예: `/works/{workId}.txt`
- 긴 작품은 파트 파일로 분할한다
  - 예: `/works/{workId}/part-001.v1.txt`
- 분할 기준은 “장/권/의미 있는 단위”를 우선한다
- 앱은 인덱스에 선언된 경로만 신뢰한다

### 3.4 버전 / 캐시 규칙

- 인덱스 파일은 짧은 캐시 또는 `no-cache`
- 원문/파트 파일은 변경 시 **파일 경로를 바꾸는 방식**으로 관리한다
  - 예: `part-001.v1.txt` → `part-001.v2.txt`
- 같은 경로의 원문 파일 내용을 덮어쓰지 않는 것을 원칙으로 한다
- 이렇게 해야 원문 파일에 장기 캐시를 적용해도 배포 반영이 안전하다

## 4) 메타데이터 기준

### 4.1 `catalog/{workId}.json` 권장 필드

```json
{
  "id": "spring-spring-kim-yujeong",
  "title": "봄봄",
  "author": "김유정",
  "language": "ko",
  "source": "국립중앙도서관 원문 링크 또는 서지 정보",
  "copyrightProof": "저작권 만료 근거",
  "textPath": "/works/spring-spring-kim-yujeong.txt"
}
```

분할 작품 예시

```json
{
  "id": "little-prince-saint-exupery",
  "title": "The Little Prince",
  "author": "Antoine de Saint-Exupéry",
  "language": "en",
  "source": "Project Gutenberg 또는 공개 출처",
  "copyrightProof": "저작권 만료 근거",
  "parts": [
    { "id": "part-001", "title": "Chapter 1", "path": "/works/little-prince/part-001.v1.txt" },
    { "id": "part-002", "title": "Chapter 2", "path": "/works/little-prince/part-002.v1.txt" }
  ]
}
```

### 4.2 필수 검증 규칙

- `id`, `title`은 필수
- `textPath` 또는 `parts` 중 하나는 반드시 있어야 한다
- `copyrightProof`는 운영상 필수로 간주한다
- `textPath`/`parts.path`가 실제 `public/works` 파일과 일치해야 한다
- 분할 작품은 `parts` 순서가 실제 읽기 순서와 같아야 한다

## 5) 배포용 `index.json` 기준

- 앱은 `public/works/index.json`만 읽는다
- `index.json`의 각 항목은 `catalog/*.json`의 공개 가능한 필드만 포함한다
- 운영 내부 메모가 필요하면 `catalog/`에만 두고 `index.json`에는 싣지 않는다
- 메인 레포의 `scripts/works-index.mjs`로 `catalog/` 기준 인덱스 생성/검증을 수행할 수 있다
- 생성 스크립트는 각 작품의 현재 원문 기준 `checksum`도 함께 계산해 넣는다

권장 명령

```bash
npm run works:index:validate -- --root docs/examples/works-repo
npm run works:index:generate -- --root docs/examples/works-repo
```

권장 예시

```json
[
  {
    "id": "spring-spring-kim-yujeong",
    "title": "봄봄",
    "author": "김유정",
    "language": "ko",
    "source": "국립중앙도서관",
    "copyrightProof": "저작권 만료 근거",
    "textPath": "/works/spring-spring-kim-yujeong.txt"
  }
]
```

## 6) 작품 추가/수정 절차

### 6.1 새 작품 추가

1. `works/` submodule을 초기화한다
2. 원문 텍스트를 `public/works` 아래에 추가한다
3. 작품 메타데이터를 `catalog/{workId}.json`에 추가한다
4. `public/works/index.json`을 갱신한다
5. 경로/필수 필드/줄바꿈을 검증한다
6. works repo에서 커밋/푸시한다
7. 필요하면 앱 레포에서 submodule 포인터를 갱신한다
8. `hosting:works`만 배포한다

### 6.2 기존 작품 수정

- 단순 메타데이터 수정이면 `catalog/*.json`과 `index.json`만 갱신한다
- 원문 수정이면 기존 파일을 덮어쓰기보다 **새 파일 경로로 교체**한다
  - 단일 파일 예: `old.txt` 대신 `work.v2.txt`
  - 분할 파일 예: `part-001.v1.txt` 대신 `part-001.v2.txt`
- 수정 후 `index.json` 경로를 새 파일로 바꾼다

## 7) Git 운영 규칙

### 7.1 works repo 안에서 하는 일

- 작품 추가/수정 커밋은 `works/` 디렉터리 안에서 수행한다
- 작품 원문 변경 이력은 works repo에 남긴다
- 커밋 메시지는 작품 단위로 분리하는 것을 권장한다
  - 예: `feat(work): add spring-spring-kim-yujeong`
  - 예: `fix(work): correct little-prince part-002 text`

### 7.2 앱 repo에서 하는 일

- 앱에서 참조하는 작품 버전을 고정하려면 submodule 포인터를 업데이트해 함께 커밋한다
- 앱 코드 수정 없이 작품만 배포할 때도, 배포 재현성이 필요하면 포인터 커밋을 남기는 편이 안전하다

## 8) Firebase Hosting 기준 배포 메모

- works 호스팅의 public 디렉터리는 `works/public` 기준으로 둔다
- 앱과 works는 분리 배포한다
- 권장 캐시 헤더
  - `/works/index.json`: `no-cache` 또는 매우 짧은 캐시
  - `/works/**/*.txt`: 장기 캐시(`max-age` 길게) + 경로 버전 관리
- works origin이 앱과 다른 origin이면 CORS 읽기 헤더를 설정한다

## 9) 런칭 전 체크리스트

- `index.json`이 JSON 파싱 가능하다
- 모든 `textPath`/`parts.path`가 실제 파일과 일치한다
- 텍스트 파일이 UTF-8 + LF 규칙을 지킨다
- `copyrightProof`가 모든 공개 작품에 채워져 있다
- 긴 작품은 단일 초대형 파일 대신 파트 분할이 되어 있다
- works 배포 후 앱에서 `worksBaseUrl` 기준으로 목록/원문을 읽을 수 있다

## 10) 후속 자동화 대상

- `catalog/` 기준 `public/works/index.json` 생성 스크립트
- 누락 필드/잘못된 경로 검증 스크립트
- UTF-8/LF 정규화 검사
- 파트 파일 크기/개수 기준 검사
