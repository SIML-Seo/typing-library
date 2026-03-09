# works 저장소 연결과 초기 구조 반영

## 변경 일자
2026-03-09

## 변경 요약
- `typing-library-works` 원격 저장소에 초기 works 구조를 첫 커밋으로 올렸다.
- 앱 레포에 `works/` git submodule을 연결했다.
- `works` 기준 인덱스 검증/생성 스크립트가 통과하는 것을 확인했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/.gitmodules`: works submodule 설정 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/works`: `typing-library-works` submodule 포인터 추가
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/user-todo.md`: works 저장소 생성 완료 반영

## 상세 내용
- `typing-library-works`는 비어 있는 원격 저장소라, 먼저 샘플 구조를 초기 커밋으로 푸시한 뒤 submodule로 정상 연결했다.
- 현재 works 저장소에는 문서 샘플 구조(`catalog/*`, `public/works/*`)가 들어가 있다.
- 실제 다음 사용자 TODO는 샘플 텍스트를 실제 저작권 만료 작품 원문으로 교체하고 메타데이터를 채우는 것이다.
- 검증 명령
  - `npm run works:index:validate -- --root works`
  - `npm run works:index:generate -- --root works`
