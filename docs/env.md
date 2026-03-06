# 환경변수 / 시크릿 매핑

버전: v0.1 (Draft)  
작성일: 2026-03-05

## 0) 원칙

- `.env*`는 git에 커밋하지 않는다.
- `NEXT_PUBLIC_*`는 브라우저로 노출되므로 “노출되어도 되는 값”만 둔다.
- 토큰/시크릿/키는 로그(`console.log`)로 출력하지 않는다.
- GA4 이벤트에는 필사 텍스트(콘텐츠)나 토큰/시크릿을 포함하지 않는다.

## 1) MVP (정적 배포)

### 1.1 Analytics (GA4)

| 변수 | 필수 | 설명 | 값 출처 |
|---|---:|---|---|
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | △ | GA4 Measurement ID (예: `G-XXXXXXX`) | Google Analytics 4 |

메모
- 로컬 개발에서 GA를 끄고 싶다면, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`를 비워두는 방식으로 제어하는 패턴을 권장한다.
- 이벤트에는 필사 텍스트(콘텐츠)나 PII를 포함하지 않는다(ADR 0005).
- 실측 확인 시에는 DebugView/실시간 이벤트 화면에서 `typing_start`, `typing_paragraph_complete`, `typing_complete`, `my_work_upload` 순서를 본다.

### 1.2 Ads (선택: Google AdSense)

- 정적 사이트에서도 AdSense 스크립트 삽입은 가능하다.
- 퍼블리셔 ID(`ca-pub-...`)는 공개 정보이므로 코드/설정에 포함될 수 있다(시크릿 아님).
- 구체 변수명/삽입 위치는 구현 시 `/docs/deploy.md`와 함께 고정한다.

### 1.3 Public Works (works origin)

| 변수 | 필수 | 설명 | 값 출처 |
|---|---:|---|---|
| `NEXT_PUBLIC_WORKS_BASE_URL` | △ | 공개 작품 호스팅 origin(예: `https://<project>-works.web.app`) | Firebase Hosting(works 사이트) |

메모
- 비워두면 “같은 origin”에서 `/works/*`를 로드하는 방식으로 fallback 할 수 있다(구현에서 결정).
- 다른 origin을 쓰는 경우, works 호스팅에 CORS 헤더 설정이 필요할 수 있다.
- 운영 점검 시에는 앱 네트워크 탭에서 원문이 실제 `worksBaseUrl` origin에서 내려오는지까지 확인한다.

## 2) 레거시(프로토타입) — NextAuth/Cognito/Amplify

> 현재 레포에는 AWS 기반 프로토타입이 남아있을 수 있다.  
> MVP는 정적 + AWS 미사용 원칙이므로, 아래 내용은 참고용이며 정리/제거 대상이다.

### 2.1 NextAuth (서버 런타임)

| 변수 | 필수 | 설명 | 값 출처 |
|---|---:|---|---|
| `AUTH_COGNITO_CLIENT_ID` | O | Cognito App Client ID | Cognito User Pool App Client |
| `AUTH_COGNITO_CLIENT_SECRET` | △ | App Client Secret(없으면 빈 문자열) | Cognito App Client 설정 |
| `AUTH_COGNITO_ISSUER` | O | OIDC Issuer URL | Cognito “issuer” 값 |
| `AUTH_SECRET` | O | NextAuth JWT 서명용 secret | 랜덤 생성(환경별) |
| `NEXTAUTH_URL` | △ | NextAuth base URL(권장) | 환경별(로컬/프로덕션) |

메모
- 현재 코드에서는 `AUTH_SECRET`를 사용하지만, NextAuth 표준 변수(`NEXTAUTH_SECRET`)를 쓸지 여부는 정리 필요.
- `NEXTAUTH_URL`은 코드에서 직접 참조하지 않아도 NextAuth가 내부적으로 필요할 수 있어 설정을 권장한다.

### 2.2 Cognito Hosted UI 로그아웃 (클라이언트 런타임)

> 기준: `src/components/AuthButtons.tsx`

| 변수 | 필수 | 설명 | 값 출처 |
|---|---:|---|---|
| `NEXT_PUBLIC_AUTH_COGNITO_CLIENT_ID` | O | Hosted UI 로그아웃에 사용하는 client_id | `AUTH_COGNITO_CLIENT_ID`와 동일 권장 |
| `NEXT_PUBLIC_NEXTAUTH_URL` | O | 로그아웃 후 돌아갈 URL(`logout_uri`) | 배포 도메인 |
| `NEXT_PUBLIC_AWS_REGION` | O | Cognito 리전 | AWS 리전 |
| `NEXT_PUBLIC_COGNITO_DOMAIN_PREFIX` | O | Cognito 도메인 prefix | Cognito Hosted UI 도메인 |

메모
- `NEXT_PUBLIC_NEXTAUTH_URL`은 “NextAuth URL”이라기보다 “로그아웃 리디렉션 URL”로 쓰이고 있다. 명칭 정리(또는 변수명 변경) 고려.

### 2.3 Amplify outputs 파일

현재 코드가 `amplify_outputs.json`을 직접 import 한다.
- 사용 위치 예)
  - 관리자 UI에서 AppSync URL/API Key 참조
  - Amplify(Storage/Auth) 설정에 사용

주의
- 레포 `.gitignore`에서 `amplify_outputs*`를 무시하고 있어, 신규 환경에서는 파일이 없어 빌드/실행이 실패할 수 있다.
- `amplify_outputs.json`에는 API 엔드포인트/키 등이 포함될 수 있으므로 커밋 정책을 정하고, 로컬/배포에서 안전하게 주입해야 한다.

### 2.4 (추후) 소셜 로그인

Amplify Auth 리소스에 아래 변수가 언급되어 있으나 현재는 주석 상태.
- `AMPLIFY_AUTH_GOOGLE_CLIENT_ID`
- `AMPLIFY_AUTH_GOOGLE_CLIENT_SECRET`
