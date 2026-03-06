# 운영 점검 체크리스트 보강

## 변경 일자
2026-03-06

## 변경 요약
- GA4 실측 점검 절차를 로컬/배포 문서에 구체화했다.
- works origin 연결 스모크 테스트 절차를 운영 문서에 추가했다.
- 운영자가 그대로 따라가며 점검할 수 있도록 확인 순서와 실패 시 점검 항목을 정리했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/testing.md`: GA4 실측/works origin 스모크 체크리스트 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/local-dev.md`: 로컬 GA4/works origin 점검 절차 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/deploy.md`: 프로덕션 GA4 점검 순서와 실패 시 확인 항목 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/env.md`: GA4/works origin 실측 확인 메모 보강

## 상세 내용
- `typing_start`, `typing_paragraph_complete`, `typing_complete`, `my_work_upload`를 실제 네트워크/DebugView에서 어떤 순서로 확인할지 문서화했다.
- 이어하기 복원 시 `typing_start`가 재전송되지 않는지 점검 항목을 추가했다.
- works origin은 인덱스/원문 200 응답, 앱 네트워크 탭에서의 origin 확인, works-only 재배포 반영 여부까지 체크하도록 정리했다.
