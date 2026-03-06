# 인증 / 보안 설계 (초안)

버전: v0.1 (Draft)  
작성일: 2026-03-05

## 0) MVP 원칙(결정)

- MVP는 **정적 사이트**로 배포하며, **AWS(Amplify/Cognito/AppSync/S3)** 를 사용하지 않는다.
- 따라서 MVP에는 “서버 인증/권한”(로그인/그룹/Admins 기반 접근 제어)을 두지 않는다.
- 내 작품/결과는 로컬 저장이므로, 인증이 없어도 기능이 성립한다(ADR 0003).
- 공개 작품 추가/관리는 앱 내부 “관리자 페이지”가 아니라, 정적 에셋/인덱스를 갱신하는 **운영 프로세스(레포 PR/배포)** 로 처리한다.

## 1) MVP에서의 접근 제어(초안)

- 게스트(기본): 공개 작품 필사 + 내 작품 업로드 + 결과 저장(전부 로컬)
- “내 작품 업로드”는 로컬 저장이므로, MVP에서는 로그인 없이 전 사용자에게 제공한다(ADR 0010).

## 2) 보안/프라이버시 체크리스트(MVP)

- 사용자 입력 텍스트(필사 내용/내 작품)는 서버로 전송하지 않는다(GA4 포함).
- `NEXT_PUBLIC_*`에 민감정보(시크릿/토큰)를 넣지 않는다.
- (선택) AdSense/서드파티 스크립트를 넣는 경우, 최소 로드/최소 권한 원칙을 지키고 개인정보 정책을 준비한다.

## 3) 레거시(프로토타입: NextAuth + Cognito + Amplify)

> 아래는 과거 프로토타입의 인증/권한 설계 메모다.  
> MVP에서는 AWS를 사용하지 않으므로, 이 섹션은 참고용이며 정리/제거 대상이다.

### 3.1 구성요소

- NextAuth v4
  - Cognito Provider(OIDC/OAuth)
  - 세션 전략: JWT
  - 세션 확장: `idToken`, `accessToken`, `groups` 주입
- Amazon Cognito
  - User Pool: 로그인/그룹(Admins)
  - Hosted UI: 로그아웃 엔드포인트 사용
- Amplify Gen2 (Backend)
  - Auth 리소스(Users/Groups) 정의
  - Data/AppSync 권한(Work: Admins만 CUD)
  - Storage 권한(공개 읽기, Admins만 쓰기/삭제)

### 3.2 토큰/클레임(현재 설계)

#### 3.2.1 그룹 클레임

- Cognito ID Token에 `cognito:groups` 클레임이 포함될 수 있다.
- NextAuth `jwt` 콜백에서 `id_token`을 디코딩하여 `groups`를 추출하고,
  `session` 콜백에서 `session.user.groups`로 전달한다.

#### 3.2.2 클라이언트에서 필요한 토큰

- 관리자 기능(작품 생성/삭제 등)이 “Cognito 기반 인증”을 요구하는 경우,
  클라이언트에서 `session.idToken`을 사용해 API 호출 헤더에 포함시킨다.

> 주의: 토큰을 `console.log`로 출력하면 보안 사고로 이어질 수 있으므로,
> 프로덕션에서는 토큰 로그를 제거해야 한다.

### 3.3 로그인/로그아웃 플로우

#### 3.3.1 로그인

- 사용자는 `signIn('cognito')`로 Cognito 로그인 플로우를 진행한다.
- 콜백(`/api/auth/callback/cognito`)에서 NextAuth 세션이 생성된다.
- 세션에는 `idToken/accessToken/groups`가 포함될 수 있다.

#### 3.3.2 로그아웃

- 1단계: `signOut({ redirect: false })`로 NextAuth 로컬 세션을 정리한다.
- 2단계: Cognito Hosted UI 로그아웃 엔드포인트로 리디렉션하여 SSO 세션도 정리한다.

필요 환경변수(클라이언트)
- `NEXT_PUBLIC_AUTH_COGNITO_CLIENT_ID`
- `NEXT_PUBLIC_NEXTAUTH_URL` (로그아웃 후 리디렉션)
- `NEXT_PUBLIC_AWS_REGION`
- `NEXT_PUBLIC_COGNITO_DOMAIN_PREFIX`

### 3.4 권한(Authorization) 적용 지점

#### 3.4.1 UI 접근 제어(프론트)

- `/admin`은 `session.user.groups`에 `Admins`가 포함될 때만 접근 허용한다.

#### 3.4.2 Data(AppSync) 권한

- 공개 작품(Work) 읽기: apiKey 기반 public read 가능
- 공개 작품 CUD: Admins 그룹 기반(서버 설정에 따라 Cognito/UserPool 인증 필요)

⚠️ 검증 필요(중요)
- 현재 프론트는 “목록 조회는 apiKey”, “삭제/생성은 `Authorization: Bearer <idToken>`” 방식으로 호출한다.
- AppSync API가 실제로 **User Pool 인증 모드**를 함께 허용하는지 확인이 필요하다.
  - 허용하지 않으면 관리자 CUD 호출이 실패할 수 있다.

### 3.5 Storage(S3) 권한/업로드

- `public/works/*`는 guest/authenticated read 가능
- `Admins`만 write/delete 가능

⚠️ 검증 필요(중요)
- 현재 구현은 NextAuth 로그인 토큰과 Amplify(Storage)가 자연스럽게 연결되지 않는다.
- 관리자 업로드(`uploadData`)가 동작하려면 “Amplify가 사용할 IAM credential”이 필요하다.
  - (옵션) Cognito Identity Pool 기반 credential 브릿지 구현
  - (옵션) 서버 경유 업로드(프리사인 URL 발급 등)로 클라이언트 직접 업로드 제거

### 3.6 보안 체크리스트

- `AUTH_SECRET`/OAuth client 정보 등 서버 시크릿은 절대 커밋하지 않는다.
- `amplify_outputs.json`은 환경별로 생성/주입하며, 민감 정보(키/엔드포인트) 노출 정책을 정의한다.
- 토큰(`idToken/accessToken`)은 콘솔/로그에 출력하지 않는다.
- Cognito Callback/Logout URL을 환경(로컬/스테이징/프로덕션) 별로 정확히 설정한다.
- API Key 만료/교체 절차를 운영 문서로 둔다(30일 만료 설정 기준).

### 3.7 레거시 보류 메모(비MVP)

아래 항목은 과거 AWS 프로토타입을 다시 살릴 때만 참고한다. 현재 MVP 범위의 결정 대상은 아니다.

- 관리자 CUD/업로드를 “클라이언트 직호출”로 유지할지, “서버 경유”로 바꿀지
- Data(AppSync)에서 사용할 인증 모드 구성(apiKey + userPool 동시 허용 여부)
- 분석 도구 사용 시, 사용자 프라이버시/토큰 노출 방지 정책
