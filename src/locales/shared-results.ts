export const resultsMessagesKo = {
  navLabel: '내 기록',
  header: {
    eyebrow: 'Typing Results',
    title: '이 기기에 저장된 필사 기록',
    description:
      '완료한 세션만 결과 히스토리에 남는다. 진행 중 드래프트는 별도로 관리되고, 이 화면에는 섞이지 않는다.',
    backToLibrary: '라이브러리로 돌아가기',
    backToLanding: '랜딩으로 돌아가기',
  },
  metrics: {
    sessions: '완료 세션',
    averageAccuracy: '평균 정확도',
    averageWpm: '평균 WPM',
    latestSession: '가장 최근 기록',
    noData: '기록 없음',
  },
  toolbar: {
    searchLabel: '검색',
    searchPlaceholder: '작품 제목, 저자, 언어로 검색',
    filterLabel: '구분',
    all: '전체',
    public: '공개 작품',
    my: '내 작품',
  },
  status: {
    loading: '로컬 기록을 불러오는 중',
    error: '결과 기록을 불러오지 못했다.',
  },
  empty: {
    title: '아직 저장된 결과가 없다.',
    body: '작품을 하나 끝내면 정확도, WPM, 소요시간이 이 화면에 누적된다.',
    action: '작품 보러 가기',
  },
  card: {
    publicBadge: '공개 작품',
    myBadge: '내 작품',
    authorFallback: '저자 정보 없음',
    languageFallback: '언어 미기재',
    endedAt: '완료 시각',
    accuracy: '정확도',
    wpm: 'WPM',
    elapsed: '소요시간',
    typos: '최종 오타',
    unknownPublicTitle: '알 수 없는 공개 작품',
    unknownMyTitle: '알 수 없는 내 작품',
  },
  side: {
    title: '저장 정책',
    body: '결과는 전부 IndexedDB에 저장된다. 브라우저 데이터를 지우면 함께 삭제되며, 서버와 동기화되지 않는다.',
    catalogNotice: 'works origin 메타데이터를 읽지 못하면 공개 작품 제목 일부가 기본 라벨로 보일 수 있다.',
  },
} as const;

export const resultsMessagesEn = {
  navLabel: 'Results',
  header: {
    eyebrow: 'Typing Results',
    title: 'Saved typing history on this device',
    description:
      'Only completed sessions stay in the result history. Active drafts are managed separately and do not appear in this screen.',
    backToLibrary: 'Back to library',
    backToLanding: 'Back to landing',
  },
  metrics: {
    sessions: 'Completed sessions',
    averageAccuracy: 'Average accuracy',
    averageWpm: 'Average WPM',
    latestSession: 'Latest session',
    noData: 'No records',
  },
  toolbar: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by title, author, or language',
    filterLabel: 'Type',
    all: 'All',
    public: 'Public works',
    my: 'My works',
  },
  status: {
    loading: 'Loading local typing history',
    error: 'The result history could not be loaded.',
  },
  empty: {
    title: 'No saved results yet.',
    body: 'Once you finish a work, its accuracy, WPM, and elapsed time will accumulate here.',
    action: 'Browse works',
  },
  card: {
    publicBadge: 'Public work',
    myBadge: 'My work',
    authorFallback: 'No author info',
    languageFallback: 'Language not specified',
    endedAt: 'Finished at',
    accuracy: 'Accuracy',
    wpm: 'WPM',
    elapsed: 'Elapsed',
    typos: 'Final typos',
    unknownPublicTitle: 'Unknown public work',
    unknownMyTitle: 'Unknown personal work',
  },
  side: {
    title: 'Persistence rules',
    body: 'Results are stored only in IndexedDB. Clearing browser data removes them, and nothing syncs to a server.',
    catalogNotice:
      'If the works origin metadata cannot be loaded, some public-work titles may appear with fallback labels.',
  },
} as const;
