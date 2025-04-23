// src/auth.config.ts
import type { NextAuthOptions, Session, Account as AuthAccount } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
// jwt 콜백에서 토큰 타입 사용 위해 추가
import type { JWT } from '@auth/core/jwt';
// session 콜백에서 세션, 사용자 타입 사용 위해 추가 (필요시)
// import type { Session, User } from '@auth/core/types';

export const authOptions: NextAuthOptions = {
  // pages: { // (선택 사항) 커스텀 로그인/에러 페이지 사용 시 주석 해제
  //   signIn: '/login',
  //   // error: '/auth/error', // 에러 코드는 쿼리 문자열로 전달됨 (예: ?error=)
  // },
  providers: [
    CognitoProvider({
      clientId: process.env.AUTH_COGNITO_CLIENT_ID!,
      clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET || '', // 타입 만족용 빈 문자열
      issuer: process.env.AUTH_COGNITO_ISSUER!,
      // 👇 클라이언트 인증 방식 명시적으로.. (Public Client용)
      // 안할 경우 CognitoProvider 가 내부적으로 클라이언트 시크릿 사용하려 시도하여 에러 발생
      client: {
        token_endpoint_auth_method: 'none',
      },
      // 참고: Amplify 생성 클라이언트는 보통 클라이언트 시크릿을 사용하지 않음.
      // 수동으로 시크릿이 있는 클라이언트를 만들었다면, 주석 해제하고 환경 변수 설정.
      // ID 토큰을 profile에 포함시키도록 요청 (groups 정보 얻기 위함)
      profile(profile) {
        // console.log("Cognito Profile:", profile); // 디버깅용
        return {
          id: profile.sub, // 필수
          name: profile.name || profile.username || profile.email, // 이름 사용 시도
          email: profile.email,
          image: profile.picture, // 프로필 사진 사용 시도
          // 중요: ID 토큰 전체 또는 필요한 클레임(groups)을 profile에 추가할 수 있음
          // NextAuth는 profile 정보를 account와 함께 jwt 콜백에 전달
          // 하지만 Cognito Provider는 id_token을 직접 노출하지 않을 수 있음
          // -> 대신 jwt 콜백에서 account.id_token을 직접 파싱 시도
        };
      }
    }),
    // 나중에 Google 등 다른 프로바이더 추가
  ],
  secret: process.env.AUTH_SECRET, // v4 권장 사항
  session: { // v4 권장 사항
    strategy: "jwt",
  },
  // (선택 사항) 동작 커스터마이징을 위한 콜백 추가 (예: 세션/JWT 수정)
  callbacks: {
    // JWT 생성/업데이트 시 호출
    async jwt({ token, account }: { token: JWT; account: AuthAccount | null }) { 
      console.log("JWT Callback - Account received:", !!account); // account 객체 수신 확인
      if (account?.provider === 'cognito' && account.id_token) {
        console.log("JWT Callback - Cognito login detected, processing id_token...");
        try {
          // idToken을 JWT 토큰에 저장
          token.idToken = account.id_token; 
          token.accessToken = account.access_token;
          console.log("JWT Callback - idToken stored in token:", !!token.idToken);

          // 그룹 정보 처리
          const decodedIdToken = JSON.parse(Buffer.from(account.id_token.split('.')[1], 'base64').toString());
          if (decodedIdToken['cognito:groups']) {
            token.groups = decodedIdToken['cognito:groups'];
            console.log("JWT Callback - Groups stored in token:", token.groups);
          } else {
             console.log("JWT Callback - No groups found in id_token.");
          }
        } catch (error) {
          console.error("JWT Callback - Error decoding id_token:", error);
        }
      } else {
         console.log("JWT Callback - Not a Cognito login or no id_token found.");
      }
      return token; 
    },

    // 세션 객체 생성/업데이트 시 호출
    async session({ session, token }: { session: Session; token: JWT }) { 
       console.log("Session Callback - Token received:", token); // token 객체 확인

      // groups 정보 전달
      if (token.groups && session.user) { 
        session.user.groups = token.groups as string[]; 
        console.log("Session Callback - Groups assigned to session:", session.user.groups);
      } else {
          console.log("Session Callback - No groups found in token to assign.");
      }

      // idToken 정보 전달 (매우 중요!)
      if (token.idToken && typeof token.idToken === 'string') {
          session.idToken = token.idToken; // 타입 확장 파일(next-auth.d.ts)이 올바르게 작동해야 함
          session.accessToken = token.accessToken as string;
          console.log("Session Callback - idToken assigned to session:", !!session.idToken);
          console.log("Session Callback - accessToken assigned to session:", !!session.accessToken);
      } else {
         console.error("Session Callback - idToken missing or invalid in token!");
      }
      console.log("Session Callback - Final session object:", session); // 최종 세션 객체 확인
      return session; 
    },
  },
  // },
};