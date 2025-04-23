// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
타입 안전한 클라이언트 생성을 위한 스키마 정의
@see https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/#step-2-define-a-schema
*/
const schema = a.schema({
  /**
   * 작품(Work) 모델
   * 필사할 문학 작품 정보를 저장합니다.
   */
  Work: a
    .model({
      // id: Amplify가 자동 생성 (GraphQL ID 타입)
      title: a.string().required(), // 작품 제목 (필수)
      author: a.string(), // 저자 (선택)
      genre: a.string(), // 장르 (선택)
      content: a.string(), // 작품 내용 전문 (선택, S3 사용 시 null)
      s3Key: a.string(), // S3에 저장된 파일 키 (선택, 대용량 파일인 경우에만 사용)
      // createdAt, updatedAt: Amplify가 자동 생성
      typingResults: a.hasMany('TypingResult', 'workId'), // TypingResult와의 1:N 관계 추가
    })
    // 인증 규칙: 읽기는 API 키, 나머지는 'Admins' 그룹
    .authorization((allow) => [
      allow.publicApiKey().to(['read']), // 누구나 읽기 가능
      allow.groups(['Admins']).to(['create', 'update', 'delete']) // 'Admins' 그룹만 CUD 가능
    ]),

  /**
   * 타자 연습 결과(TypingResult) 모델
   * 사용자의 타자 연습 결과를 저장합니다.
   */
  TypingResult: a
    .model({
      // id: Amplify가 자동 생성
      userId: a.string().required(), // 연습을 수행한 사용자 ID (Cognito Sub 등)
      username: a.string().required(), // 연습을 수행한 사용자 이름 (표시용)
      workId: a.id().required(), // 어떤 작품에 대한 결과인지 (Work 모델의 ID)
      work: a.belongsTo('Work', 'workId'), // Work 모델과의 관계 정의 (1:N)
      wpm: a.integer().required(), // 분당 단어 수 (Words Per Minute)
      accuracy: a.float().required(), // 정확도 (%)
      elapsedTime: a.integer().required(), // 소요 시간 (초)
      typedAt: a.datetime().required(), // 연습 완료 시간
      // createdAt, updatedAt: Amplify가 자동 생성
    })
    // 인증 규칙: Cognito 소유자는 생성/읽기 가능
    .authorization((allow) => [allow.owner().to(['create', 'read'])]),
});

// 클라이언트에서 사용할 스키마 타입을 export 합니다.
export type Schema = ClientSchema<typeof schema>;

// 데이터 리소스를 정의하고 export 합니다.
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey', // 기본은 API 키
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
    // 복잡한 인증 모드 시도는 제거하고 API Key만 사용
    // 프론트엔드에서 직접 헤더에 토큰 포함하는 방식으로 변경
  },
});