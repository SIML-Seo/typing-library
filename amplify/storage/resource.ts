import { defineStorage } from '@aws-amplify/backend';

// Amplify Gen2 파일 스토리지 설정
export const storage = defineStorage({
  name: 'worksContent',
  
  // 접근 제어 설정
  access: (allow) => ({
    // 기본 public 폴더 아래 works 경로에 대한 접근 권한
    'public/works/*': [
      // 인증된 사용자도 읽기 허용 (게스트가 허용되면 보통 자동 포함되나 명시적으로 추가 가능)
      allow.authenticated.to(['read']),

      // 비인증 사용자(게스트)는 읽기만 가능
      allow.guest.to(['read']),

      // 'Admins' 그룹에 속한 사용자만 쓰기(업로드, 덮어쓰기) 및 삭제 허용
      allow.groups(['Admins']).to(['read', 'write', 'delete'])
    ],
    
    // 그냥 works 경로도 같은 권한 설정 (혹시 모를 경로 문제 대비)
    'works/*': [
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete'])
    ],
  })
}); 