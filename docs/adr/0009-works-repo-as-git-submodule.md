# ADR 0009: works 저장소는 별도 repo + git submodule로 연결

상태: Accepted  
작성일: 2026-03-05  
관련 문서: `/docs/architecture.md`, `/docs/deploy.md`, `/docs/local-dev.md`, `/docs/adr/0008-public-works-separate-origin.md`

## 컨텍스트

- 공개 작품은 works origin으로 분리하여 “작품만 배포”가 가능해야 한다(ADR 0008).
- 초기에도 작품이 많고(약 100개), 누적 용량이 커질 수 있다(예상 ~0.5GB).
- 작품 원문을 앱 레포에 그대로 포함하면 레포가 비대해져 개발/리뷰/클론 비용이 커진다.
- 그렇다고 작품을 “커밋 없이” 파일로만 관리하면 히스토리/리뷰/롤백이 불가능해 운영이 불안정해진다.
- 한편, 사용자는 “모노레포처럼 한 곳에서 작업하는 경험”을 원한다.

## 결정

- 작품 원문/인덱스는 **별도 git 저장소(works repo)** 에 커밋하여 관리한다.
- 앱 레포에는 works repo를 `works/` 디렉터리로 **git submodule** 연결한다.
  - 앱 레포는 가볍게 유지하면서도, 로컬에서는 모노레포처럼 함께 편집/검증할 수 있다.
- works origin 배포는 `works/public`(submodule 내부)을 Firebase Hosting의 `works` 타겟으로 배포하는 방식으로 한다.
  - 작품 업데이트 시 “앱 배포”는 하지 않고, `--only hosting:works`로 작품만 배포한다.

## 대안

- 대안 A) 앱 레포에 작품을 포함(진짜 모노레포)
  - 장점: 가장 단순, submodule 개념 없음
  - 단점: 레포/클론/리뷰 비용이 계속 증가(대용량에서 특히)
- 대안 B) works repo를 별도로 두되 submodule 없이 운영
  - 장점: 레포가 깔끔하고 단순
  - 단점: 앱 개발 워크스페이스에서 작품/인덱스를 함께 다루는 경험이 떨어짐
- 대안 C) Git LFS
  - 장점: 대용량 파일 관리는 쉬움
  - 단점: 무료/한도/정책에 따라 “0원 보장”과 충돌할 수 있어 MVP에서는 지양

## 결과(Consequences)

- 클론 후 works가 필요하면 submodule 초기화가 필요하다.
  - `git submodule update --init --recursive`
- 작품 수정은 `works/` 폴더 안에서 커밋/푸시한다(works repo의 히스토리로 남김).
- 배포 재현성을 위해, works 업데이트 시 앱 레포의 submodule 포인터도 커밋하는 것을 권장한다(작품 버전 핀).
