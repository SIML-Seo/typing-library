# ADR 0007: MVP 정적 호스팅으로 Firebase Hosting 선택(Hosting만)

상태: Accepted  
작성일: 2026-03-05  
관련 문서: `/docs/deploy.md`, `/docs/architecture.md`, `/docs/prd.md`

## 컨텍스트

- MVP는 **운영비 0원 보장**이 핵심 제약이다(ADR 0004).
- 서버 런타임(SSR/Functions/DB/Storage)을 도입하면 요청/사용량에 따라 비용 리스크가 커질 수 있다.
- 따라서 MVP는 “정적 사이트(서버 런타임/DB 없음)”로 배포해야 한다.
- 정적 호스팅 플랫폼은 개발 단계부터 “결제수단 연결 없이 운영 가능”하고, 한도 초과 시 과금이 아니라 차단/제한되는 **하드 캡** 구성이어야 한다.

## 결정

- MVP 정적 호스팅 1순위로 **Firebase Hosting**을 사용한다.
- 단, **Spark 플랜 + Hosting만** 사용한다.
  - Functions/Firestore/Storage 등 서버 기능은 MVP에서 사용하지 않는다.
- 결제수단(카드) 연결이 필요하거나, 초과 사용 시 과금이 가능한 정책이 확인되면 즉시 제외/대체한다(0원 보장 우선).
- 백업 후보는 Cloudflare Pages / GitHub Pages / Vercel(정적 배포만)로 둔다.

## 대안

- 대안 A) Cloudflare Pages
  - 장점: 정적 배포 경험/프리뷰가 좋고 CDN 성능이 강함
  - 단점: 0원 보장 관점에서 정책/한도/초과 동작을 별도로 확인해야 함
- 대안 B) GitHub Pages
  - 장점: Git 기반 운영/콘텐츠 배포가 단순
  - 단점: basePath 등 Next 정적 export 설정이 번거로울 수 있음
- 대안 C) Vercel(정적 export만)
  - 장점: Next.js 배포 DX 우수
  - 단점: SSR/Functions/Edge로 확장되기 쉬워 “정적” 원칙이 흔들릴 수 있음

## 결과(Consequences)

- 배포는 “정적 산출물(예: `out/`) → Firebase Hosting 업로드” 흐름으로 고정된다.
- Firebase 프로젝트/권한/배포 절차(`firebase.json`, CLI 등)를 문서화/자동화해야 한다.
- Hosting 이외 Firebase 제품을 활성화하지 않도록 운영 가드레일이 필요하다.
