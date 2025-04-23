import NextAuth from 'next-auth';
import { authOptions } from '@/auth.config'; // 우리가 만든 설정 파일에서 가져오기

// 핸들러는 NextAuth.js를 옵션으로 초기화하고 GET/POST 핸들러를 export 함
const handler = NextAuth(authOptions);

// Next.js App Router를 위해 핸들러 export
export { handler as GET, handler as POST };
