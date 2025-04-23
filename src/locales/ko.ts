export default {
  // 나중에 여기에 문자열 추가: 예) '로그인': '로그인',
  auth: { // 구조화 가능
    loading: '로딩중...',
    login: '로그인',
    logout: '로그아웃',
    welcome: '{name}님', // 변수 사용 예시
  },
  // 다른 문자열들...
} as const; // 타입 추론을 위해 as const 사용