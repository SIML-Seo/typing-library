// next-auth.d.ts
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * 클라이언트 Session 객체 (`useSession`, `getSession`)에 추가 속성 정의
   */
  interface Session {
    user: {
      groups?: string[]; // groups 속성 추가 (선택적 배열)
    } & DefaultSession["user"]; // 기존 속성 (name, email, image) 유지
    idToken?: string; // idToken 속성 추가 (선택적 문자열)
    accessToken?: string; // accessToken 속성 추가 (선택적 문자열)
  }

  // (선택 사항) User 객체에도 추가하려면
  // interface User extends DefaultUser {
  //   groups?: string[];
  // }
}

declare module "next-auth/jwt" {
  /** JWT (`jwt` 콜백)에 추가 속성 정의 */
  interface JWT extends DefaultJWT {
    groups?: string[];
    idToken?: string; // JWT에도 idToken 추가 (선택적)
    accessToken?: string; // JWT에도 accessToken 추가 (선택적)
  }
}