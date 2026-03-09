# GA4 Measurement ID 반영

## 변경 일자
2026-03-09

## 변경 요약
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`를 실제 값으로 반영해 앱을 다시 빌드/배포했다.
- 배포된 앱 HTML에서 GA4 스크립트와 측정 ID가 포함되는 것을 확인했다.
- 사용자 TODO의 GA4 항목을 완료 상태로 반영했다.

## 상세 내용
- Measurement ID: `G-FG2QS0JYRF`
- app URL: `https://typing-library.web.app`
- 확인 결과
  - `https://www.googletagmanager.com/gtag/js?id=G-FG2QS0JYRF` preload 존재
  - `gtag('config', 'G-FG2QS0JYRF')` 포함 확인
