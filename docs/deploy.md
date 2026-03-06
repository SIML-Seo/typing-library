# 배포 / 운영 체크리스트

버전: v0.1 (Draft)  
작성일: 2026-03-05

## 0) 전제

- MVP는 **정적 사이트**로 배포한다(서버 런타임/DB 없음).
- MVP(개발/배포)는 **AWS(Amplify/Cognito/AppSync/S3) 등 종량 과금형 인프라를 사용하지 않는다**.
- 배포 플랫폼은 “결제수단 연결 없이 운영 가능”하고, 한도 초과 시 과금이 아니라 차단/제한되는 **하드 캡**이 있는 무료 플랜을 사용한다.
- “무조건 무료(운영비 0원 보장)”를 목표로 하므로, 자동 과금이 발생할 수 있는 항목은 반드시 제거한다.

선택(1순위)
- Firebase Hosting (Spark, Hosting만)
  - 가드레일: 결제수단(카드) 연결이 필요하거나, 초과 사용 시 과금이 가능한 정책이 확인되면 즉시 제외/대체한다(0원 보장 우선).

백업 후보
- Cloudflare Pages / GitHub Pages / Vercel(정적 배포만)
  - Vercel 주의: Next.js 서버 기능(SSR/Functions/Edge)을 쓰면 “정적 사이트”가 아니게 될 수 있다. MVP에서는 정적 export만 사용한다.

## 1) 배포 전 체크리스트(공통)

- [ ] 시크릿/토큰이 코드/로그에 노출되지 않는다(프로덕션 빌드에서 `console.log` 점검)
- [ ] 공개 작품 인덱스/원문 정적 파일이 포함되어 있고, 배포 후 fetch가 가능하다
- [ ] (SEO/랜딩) `title/description/canonical/OG` 및 `/robots.txt`, `/sitemap.xml`이 배포되어 있다(검색 노출은 랜딩만)
- [ ] (선택) Service Worker 캐싱을 쓴다면, 업데이트 전략(캐시 무효화)이 정의되어 있다
- [ ] (선택) AdSense를 넣는다면, 광고 스크립트가 페이지 정책에 맞게 로드된다

## 2) 환경 변수(배포 플랫폼 시크릿)

- [ ] `/docs/env.md`의 MVP 변수들을 환경별(로컬/프로덕션)로 설정
- [ ] GA4를 사용하는 경우 `NEXT_PUBLIC_GA4_MEASUREMENT_ID`를 설정
- [ ] (선택) AdSense를 사용하는 경우 퍼블리셔/슬롯 ID 등 필요한 값을 설정(구현 시 문서에 추가)

## 3) 빌드/배포(정적)

- [ ] 정적 빌드 산출물(HTML/CSS/JS + 정적 에셋)을 생성한다
- [ ] 호스팅 플랫폼에 산출물을 업로드/배포한다
- [ ] 라우팅이 있는 경우(예: SPA) 새로고침/직접 진입이 깨지지 않도록 fallback 설정을 한다

### 3.1 Firebase Hosting 배포(초안)

> MVP는 Next.js를 “정적 export”로 배포하는 것을 목표로 한다.  
> 아래는 정적 산출물 디렉터리를 `out/`으로 가정한다(정적 export 설정에 따라 달라질 수 있음).
> 샘플 설정은 `/docs/examples/firebase-hosting/firebase.json`, `/docs/examples/firebase-hosting/.firebaserc.example`를 참고한다.

- [ ] Firebase 콘솔에서 프로젝트를 생성하고, Spark(무료) 상태를 유지한다(결제수단 연결 금지)
- [ ] `firebase-tools` 설치 후 로그인
- [ ] `firebase init hosting` 실행
  - public 디렉터리: `out`
  - SPA fallback: 필요 시 `rewrites` 설정(예: `** → /index.html`)
- [ ] `firebase deploy`로 배포

### 3.2 공개 작품(works origin) 배포(초안)

> 공개 작품은 “작품 전용 정적 호스팅(works origin)”으로 분리해, 작품 업데이트를 앱 배포와 독립적으로 처리한다.
> 상세한 작품 저장소 구조/메타데이터 규칙은 `/docs/works-repo-guide.md`를 따른다.

- [ ] works 저장소는 별도 git repo로 관리하고, 앱 레포에는 `works/` git submodule로 연결한다
  - 1회만: `git submodule add <works-repo-url> works`
  - 클론 후: `git submodule update --init --recursive`
- [ ] 인덱스 배포 전에 `npm run works:index:validate -- --root works`로 메타데이터/경로를 검증한다
- [ ] `npm run works:index:generate -- --root works`로 `public/works/index.json`을 생성/갱신한다
- [ ] 작품을 수정/추가한 뒤 works repo에 커밋/푸시한다(works 폴더 안에서 git 사용)
- [ ] 앱 레포에서 submodule 포인터를 업데이트하고 커밋한다(배포 재현성을 위해 권장)
  - 예: `git add works && git commit -m "chore(works): bump works submodule"`
- [ ] Firebase Hosting에 `works` 사이트(또는 hosting target)를 추가한다
  - public 디렉터리 예: `works/public`
  - 인덱스 경로 예: `/works/index.json`
- [ ] CORS/캐시 헤더를 설정한다(정적 파일 헤더)
  - (권장) 인덱스는 짧은 캐시 또는 no-cache
  - (권장) 원문 텍스트는 ETag 기반 캐시(또는 버전/해시 기반 파일명 + 장기 캐시)
- [ ] `firebase deploy --only hosting:works`로 “작품만” 배포한다

예시 명령

```bash
firebase target:apply hosting app typing-library-app
firebase target:apply hosting works typing-library-works
firebase deploy --only hosting:app
firebase deploy --only hosting:works
```

## 4) 운영 체크리스트(장애/이슈 대응)

### 4.1 정적 배포/캐시

- [ ] 최신 배포가 반영되었는지 확인(브라우저 캐시/Service Worker 영향 점검)
- [ ] 작품 인덱스/원문이 404 없이 로드되는지 확인
- [ ] 작품 인덱스가 앱 origin이 아닌 `worksBaseUrl`에서 응답하는지 확인
- [ ] works만 재배포했을 때 앱 재배포 없이 목록/원문이 갱신되는지 확인

### 4.2 로컬 데이터(IndexedDB)

- [ ] 필사 결과가 저장/조회되는지 확인(새로고침 후 유지)
- [ ] 내 작품 업로드/삭제가 정상 동작하는지 확인(로컬만)
- [ ] 필사 중 새로고침/재진입 시 진행 중 드래프트가 복원되는지 확인

## 5) 비용 가드레일(무료 운영)

> 목표: 운영비 0원(자동 과금 없음). “경고”만으로는 부족할 수 있으므로, 가능한 한 **무료 한도 초과 시 차단/제한되는 구성(하드 캡)** 을 택한다.

- [ ] Firebase 프로젝트가 `Spark` 상태이며, 결제수단/유료 플랜 연결 없이 배포 가능한지 확인한다. 요구 시 공개 런칭을 중단하고 백업 호스트로 전환한다.
- [ ] Firebase 제품은 `Hosting`만 사용한다(Functions/Firestore/Storage 미사용).
- [ ] 한도 초과 시 자동 과금이 아니라 차단/제한으로 끝나는지 런칭 전에 확인한다.
- [ ] 공개 작품(정적 텍스트) 용량/요청 수를 관리한다(분할/캐싱/압축)
- [ ] 사용자 데이터(내 작품/결과)는 로컬 저장 유지(서버 쓰기 금지)
- [ ] 도메인은 무료 서브도메인으로 시작(외부 비용 0원)
- [ ] 앱과 works origin의 캐시 정책을 분리한다
  - 앱/인덱스: 짧은 캐시 또는 `no-cache`
  - 작품 원문/part 파일: 버전/해시 파일명 + 장기 캐시

## 6) Analytics (GA4)

- [ ] GA4 태그가 프로덕션에서만 로드되도록 설정(또는 Measurement ID가 있을 때만)
- [ ] 이벤트에 필사 텍스트(콘텐츠)나 토큰/시크릿이 포함되지 않는지 확인
- [ ] DAU는 GA4의 “Active users(일별)”로 확인
- [ ] `typing_start`가 첫 입력에서만 1회 전송되는지 확인
- [ ] `typing_paragraph_complete`, `typing_complete`, `my_work_upload` 이벤트가 각각 성공 시점에 맞게 전송되는지 확인
- [ ] 이어하기 복원 시 `typing_start`가 재전송되지 않는지 확인

### 6.1 프로덕션 점검 순서

1. 프로덕션 배포 후 브라우저 DevTools에서 `gtag/js` 로드 여부를 확인한다
2. 공개 작품 1건을 열고 첫 입력을 넣어 `typing_start`를 확인한다
3. 문단 완료와 작품 완료까지 진행해 `typing_paragraph_complete`, `typing_complete`를 확인한다
4. 같은 브라우저에서 새로고침 후 이어하기를 수행하고 `typing_start` 중복이 없는지 본다
5. 내 작품 1건을 저장해 `my_work_upload`와 파라미터(`upload_source`, `text_length`)를 확인한다

### 6.2 실패 시 우선 점검 항목

- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` 누락 여부
- GA 스크립트가 CSP/광고차단 확장 프로그램에 막히는지 여부
- 이벤트 파라미터에 `typing_session_id`, `work_kind`, `punctuation_case_on`이 기대대로 붙는지 여부
- 로컬 드래프트 복원 시 `hasSentTypingStart` 상태가 유지되는지 여부
