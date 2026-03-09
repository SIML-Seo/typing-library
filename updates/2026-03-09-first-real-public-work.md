# 첫 실제 공개 작품 추가

## 변경 일자
2026-03-09

## 변경 요약
- `typing-library-works` 저장소에 첫 실제 공개 작품으로 `Pride and Prejudice`를 추가했다.
- 샘플 works 데이터를 제거하고, 실제 텍스트/메타데이터/인덱스를 반영했다.
- 사용자 TODO에서도 “실제 공개 작품 텍스트/메타데이터 준비” 항목을 첫 작품 기준으로 완료 처리했다.

## 변경된 파일
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/works`: submodule 포인터 업데이트
- `/mnt/c/Users/Neolab-WON/Desktop/another/typing-library/docs/user-todo.md`: 첫 실제 공개 작품 반영 상태 업데이트

## 상세 내용
- 작품: `Pride and Prejudice`
- 저자: `Jane Austen`
- 출처: Project Gutenberg eBook #1342
- 저작권 근거: Jane Austen 사망 1817년, 퍼블릭 도메인
- works 저장소에서는 샘플 `little-prince`, `spring-spring-kim-yujeong` 예시 파일을 제거하고 실제 작품 1건 기준으로 정리했다.
- 검증 명령
  - `npm run works:index:validate -- --root works`
  - `npm run works:index:generate -- --root works`
