// src/amplify-client.ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
// import outputs from '../amplify_outputs.json';
// import { Amplify } from 'aws-amplify';

// Amplify 설정
// Amplify.configure(outputs);

// 기본 데이터 클라이언트 생성
export const dataClient = generateClient<Schema>({
  authMode: 'apiKey' // 기본 인증 모드를 apiKey로 설정
});

// 사용자 지정 인증 헤더로 클라이언트 생성하는 함수
export function createAuthClient(idToken?: string) {
  if (!idToken) {
    // 인증 토큰이 없으면 API 키 모드 사용
    return generateClient<Schema>({
      authMode: 'apiKey'
    });
  }
  
  // 인증 토큰이 있으면 해당 토큰으로 userPool 모드 사용
  return generateClient<Schema>({
    authMode: 'userPool',
    authToken: idToken
  });
}