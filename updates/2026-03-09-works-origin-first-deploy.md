# works origin 첫 실제 배포

## 변경 일자
2026-03-09

## 변경 요약
- `typing-library-works`를 Firebase Hosting `works` 사이트로 실제 배포했다.
- 실제 works origin URL을 확보했고, 사용자 TODO에도 반영했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/user-todo.md`: works origin URL 확정 상태 반영

## 상세 내용
- Firebase project: `typing-library`
- works site id: `typing-library-works`
- 실제 works origin URL: `https://typing-library-works.web.app`
- 배포 명령은 Windows Firebase CLI 경로에서 `firebase deploy --only hosting:works`로 수행했다.
- 다음 사용자 TODO는 배포 환경에 `NEXT_PUBLIC_WORKS_BASE_URL`을 넣는 것이다.
