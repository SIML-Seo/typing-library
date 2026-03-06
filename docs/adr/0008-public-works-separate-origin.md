# ADR 0008: 공개 작품은 works origin으로 분리(독립 배포)

상태: Accepted  
작성일: 2026-03-05  
관련 문서: `/docs/architecture.md`, `/docs/data-model.md`, `/docs/deploy.md`, `/docs/requirements.md`

## 컨텍스트

- MVP는 “무조건 무료(운영비 0원 보장)” 제약이 있고, 서버 저장/런타임을 도입하지 않는다(ADR 0004).
- 공개 작품은 초기에도 약 100개 수준이고, 누적 용량이 커질 수 있다(대략 0.5GB 예상).
- 작품은 업데이트(추가/교정)가 빈번할 수 있어, 앱 코드 배포와 분리된 운영 흐름이 필요하다.
- 한편 앱은 “작품 선택 → 원문 로드 → 문단 단위 필사” 플로우를 안정적으로 제공해야 한다.

## 결정

- 공개 작품(인덱스/원문)은 **작품 전용 정적 호스팅(works origin)** 에서 제공한다.
  - 1순위: Firebase Hosting 내 별도 사이트(예: `works` 사이트)
  - 앱은 `{worksBaseUrl}/works/index.json` 및 `{worksBaseUrl}/works/*`를 fetch 한다.
- 작품 업데이트는 **works 호스팅만 배포**하여 반영한다(앱 배포와 독립).
  - 예: `firebase deploy --only hosting:works`
- 대용량 작품은 단일 파일이 아니라 “파트(장/권/분할 파일)”로 제공할 수 있어야 한다(인덱스에 `parts` 메타데이터).
- works origin이 앱과 다른 origin인 경우, works 호스팅은 CORS(읽기) 헤더를 제공해야 한다(공개 데이터이므로 `*` 허용 가능).

## 대안

- 대안 A) 앱 호스팅에 작품을 함께 포함(`/public/works/*`)
  - 장점: 단순, CORS 없음, 로컬 개발 용이
  - 단점: 레포/배포 산출물이 커지고, 작품 업데이트가 앱 배포에 묶임
- 대안 B) 별도 스토리지/DB(AWS S3 등)
  - 장점: 대용량/분산 제공에 유리
  - 단점: 종량 과금/결제수단 연결 리스크로 “0원 보장”과 충돌 가능(ADR 0004)

## 결과(Consequences)

- 앱에는 `worksBaseUrl` 설정(환경변수 또는 설정 파일)이 필요하다.
- works 호스팅의 캐시 정책(인덱스 vs 원문)과 파일 분할 정책이 운영 품질/비용에 직접 영향을 준다.
- 저장소 운영은 “works repo(별도) + 앱 레포에 `works/` git submodule”로 한다(ADR 0009).
