# Firebase Hosting 샘플 설정

이 디렉터리는 문서용 Firebase Hosting 예시다.

- `firebase.json`: 앱(`app`)과 공개 작품(`works`)을 함께 운영하는 예시 설정
- `.firebaserc.example`: 하나의 Firebase 프로젝트에 두 개의 Hosting target을 연결하는 예시

주의
- 실제 프로젝트 ID, 사이트 이름, 경로는 환경에 맞게 바꿔야 한다
- MVP 원칙상 `Hosting`만 사용하고, `Functions/Firestore/Storage`는 활성화하지 않는다
- `works/public` 경로는 실제 works submodule이 루트의 `works/`에 연결된다는 가정이다
