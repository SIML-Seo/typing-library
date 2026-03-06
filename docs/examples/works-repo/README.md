# works repo 샘플 구조

이 디렉터리는 실제 `works/` git submodule이 아니라, 문서용 예시 구조다.

- 실제 운영 시에는 이 구조를 별도 works 저장소로 옮겨 사용한다
- 텍스트 파일 내용은 경로/인덱스 예시를 보여주기 위한 샘플이며, 실제 공개 작품 원문이 아니다
- 실제 배포에서는 `public/works/index.json`만 앱이 직접 읽는다

## 구성

- `catalog/`: 사람이 수정하는 작품 메타데이터 원본
- `public/works/index.json`: 앱이 읽는 배포용 인덱스
- `public/works/**/*.txt`: 실제 공개 작품 텍스트 파일

## 기본 작업 순서

1. `catalog/*.json`에 작품 메타데이터를 추가/수정한다
2. `public/works/**/*.txt`에 원문 또는 part 파일을 추가/수정한다
3. 루트 레포에서 검증을 실행한다
   - `npm run works:index:validate -- --root docs/examples/works-repo`
4. 인덱스를 생성한다
   - `npm run works:index:generate -- --root docs/examples/works-repo`

## 실제 운영 시 대응

- 문서 예시 경로 `docs/examples/works-repo`는 실제 운영에서는 `works`로 바뀐다
- 즉, 실제 works submodule에서는 아래처럼 실행한다
  - `npm run works:index:validate -- --root works`
  - `npm run works:index:generate -- --root works`

## 규칙 요약

- `id`는 소문자 kebab-case
- `textPath` 또는 `parts` 중 하나만 사용
- `copyrightProof`는 필수
- 원문 파일은 `UTF-8 + LF`
- 원문 파일을 수정할 때는 파일 경로 버전을 바꾸는 방식을 우선한다
