# 앱/works 첫 실제 배포 반영

## 변경 일자
2026-03-09

## 변경 요약
- `typing-library` 앱을 Firebase Hosting `app` 사이트로 실제 배포했다.
- `typing-library-works` works origin URL과 앱 빌드용 환경값 반영 상태를 사용자 TODO에 업데이트했다.

## 상세 내용
- app URL: `https://typing-library.web.app`
- works URL: `https://typing-library-works.web.app`
- 확인 결과
  - app root: HTTP 200
  - works `/works/index.json`: HTTP 200
- 사용자 TODO에서는 아래 항목을 완료 처리했다.
  - works origin URL 확정
  - `NEXT_PUBLIC_WORKS_BASE_URL` 반영
  - works-only 배포 절차 확보
