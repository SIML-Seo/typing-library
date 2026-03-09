# Firebase 타겟 설정과 사용자 TODO 반영

## 변경 일자
2026-03-09

## 변경 요약
- 실제 Firebase 프로젝트/사이트 ID를 기준으로 `.firebaserc`와 `firebase.json`을 추가했다.
- 사용자 TODO 문서를 우선순위 기준으로 재정리하고, 사용자가 완료했다고 알려준 항목을 반영했다.
- works origin 후보 URL도 TODO 문서에 메모로 남겼다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/.firebaserc`: 실제 Firebase project/hosting target 매핑 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/firebase.json`: app/works Hosting 설정 초안 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/user-todo.md`: 우선순위 재정리 및 완료 항목 반영
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/README.md`: 사용자 TODO 문서 링크 추가

## 상세 내용
- Firebase project id는 `typing-library`, app site id는 `typing-library`, works site id는 `typing-library-works`로 반영했다.
- 사용자 TODO는 `지금 해야 하는 것 / 런칭 직전 / 선택 / 지금 안 해도 되는 것` 순서로 재정리했다.
- 주의: 현재 `firebase.json`의 app `public`은 `out`으로 잡혀 있지만, 앱 자체는 아직 정적 export 배포를 바로 할 수 있는 상태로 마무리되지 않았다. 실제 배포 전 이 부분은 별도 정리가 필요하다.
