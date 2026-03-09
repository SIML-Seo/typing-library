# 사용자 TODO

작성일: 2026-03-06

이 문서는 **현재 코드/문서 기준으로 사용자만 직접 해야 하는 일**만 모은 체크리스트다.
코드로 해결 가능한 항목은 제외했다.

## 0) 체크 관리 방식

- 이 문서는 **사용자 전용 TODO** 다.
- 여기 있는 체크박스는 **사용자가 직접 완료를 확인한 뒤** 체크한다.
- 나는 이 문서의 체크박스를 임의로 완료 처리하지 않는다.
- 내가 처리할 수 있는 일은 이 문서에 넣지 않고, 코드/문서 변경 + 커밋으로 따로 남긴다.

운영 규칙
- `[ ]` 아직 안 함
- `[x]` 사용자가 직접 완료 확인함

권장 방식
1. 사용자는 이 문서에서 본인이 직접 해야 하는 항목만 체크한다
2. 나는 별도로 구현/문서/테스트 작업을 진행하고 커밋으로 남긴다
3. 사용자가 어떤 외부 작업을 끝냈다고 말하면, 그때 내가 이 문서 반영을 도와줄 수 있다

즉, **이 문서는 “사용자 확인용”, 커밋/업데이트 문서는 “내 작업 이력용”** 으로 분리해서 관리한다.

## 1) 지금 해야 하는 것

### 1.1 배포 계정/프로젝트 준비

- [x] Firebase 프로젝트를 만든다
- [x] `app`와 `works` 배포 타겟을 실제 계정 기준으로 연결한다
- [ ] Spark 무료 플랜 유지 가능 여부와 결제수단 요구 여부를 직접 확인한다

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/deploy.md:41`

### 1.2 실제 공개 작품 저장소 준비

- [x] `works` 전용 저장소를 만든다
  - `typing-library-works`
  - 앱 repo의 `works/` submodule로 연결 완료
- [ ] 실제 공개 작품 텍스트를 넣는다
  - UTF-8 / LF 규칙
  - 저작권 만료 작품만
- [ ] 작품별 메타데이터를 준비한다
  - 제목
  - 저자
  - 언어
  - 출처
  - `copyrightProof`

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/works-repo-guide.md:1`
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/examples/works-repo/README.md:1`

### 1.3 실제 works origin 연결

- [ ] works origin으로 쓸 실제 호스팅 URL을 정한다
  - 현재 후보: `https://typing-library-works.web.app`
- [ ] 배포 환경에 `NEXT_PUBLIC_WORKS_BASE_URL`을 설정한다
- [ ] works만 따로 배포할 수 있는 운영 절차를 실제 계정 기준으로 만든다

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/env.md:32`
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/deploy.md:54`

### 1.4 GA4 실제 속성 연결

- [ ] GA4 속성을 만든다
- [ ] Measurement ID를 발급받는다
- [ ] 배포 환경에 `NEXT_PUBLIC_GA4_MEASUREMENT_ID`를 넣는다

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/env.md:15`
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/deploy.md:113`

## 2) 런칭 직전에 해야 하는 것

### 2.1 실제 수동 검증

- [ ] 한국어 IME 입력을 실제 브라우저/실제 키보드 환경에서 확인한다
- [ ] 모바일 브라우저에서 입력/레이아웃을 확인한다
- [ ] works origin 실서비스 URL로 연결했을 때 라이브러리/타이핑/결과 흐름을 직접 확인한다
- [ ] GA4 DebugView/실시간 이벤트 화면에서 실제 이벤트 순서를 확인한다

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/testing.md:99`
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/testing.md:115`

### 2.2 정책/문의 정보

- [ ] 개인정보 처리방침/서비스 안내 문구를 준비한다
- [ ] 문의 채널 또는 연락 수단을 정한다

현재 랜딩 문구는 “배포 시점에 연결” 상태다.

관련 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/ko.ts:108`
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/src/locales/en.ts:108`

### 2.3 최종 운영 주소 확정

- [ ] 무료 서브도메인으로 갈지, 별도 도메인을 붙일지 정한다
- [ ] 실제 운영 주소 기준으로 SEO/정책 링크 기준점을 확정한다

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/deploy.md:103`

## 3) 선택 항목

### 3.1 광고를 넣을 경우

- [ ] AdSense를 실제로 사용할지 결정한다
- [ ] 사용할 거면 퍼블리셔 ID와 정책 대응을 준비한다

지금 코드에는 광고 삽입을 아직 붙이지 않았다.

관련 문서
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/env.md:26`
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/deploy.md:27`

## 4) 지금 안 해도 되는 것

- AWS/Amplify/Cognito 정리
- 코드 리팩터링
- 테스트 코드 작성
- 결과/필사/내 작품/설정 기능 구현

이건 이미 내가 처리했거나, 계속 내가 처리할 수 있는 영역이다.
