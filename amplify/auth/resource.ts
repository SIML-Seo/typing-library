// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * 인증 리소스를 정의하고 구성합니다.
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  // 사용자가 로그인하는 방법을 정의합니다.
  loginWith: {
    email: true, // 이메일 기반 로그인 활성화 (회원가입 포함)
    // phone: true, // 전화번호 로그인 활성화 시 주석 해제
    // externalProviders: { // 소셜 로그인 시 주석 해제 및 구성 (Post-MVP)
    //   google: {
    //     clientId: process.env.AMPLIFY_AUTH_GOOGLE_CLIENT_ID, // 환경 변수 사용
    //     clientSecret: process.env.AMPLIFY_AUTH_GOOGLE_CLIENT_SECRET, // 환경 변수 사용
    //     scopes: ['email', 'profile'], // 나중에 Drive 접근 위해 'https://www.googleapis.com/auth/drive.readonly' 추가
    //   },
    //   callbackUrls: ['http://localhost:3000/api/auth/callback/google'], // 개발/프로덕션에 맞게 조정
    //   logoutUrls: ['http://localhost:3000/'], // 개발/프로덕션에 맞게 조정
    // },
  },
  groups: ['Admins']
  // (선택 사항) 다중 인증 요소, 비밀번호 정책 등을 구성합니다.
  // mfa: {
  //   mode: 'OPTIONAL',
  //   totp: true,
  // },
  // userAttributes: {
  //   // 필요 시 커스텀 속성 추가
  // },
});