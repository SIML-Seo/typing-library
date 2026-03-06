import { defineMessages } from './messages';
import { myWorksMessagesKo } from './shared-my-works';
import { resultsMessagesKo } from './shared-results';
import { typingMessagesKo } from './shared-typing';

export default defineMessages({
  common: {
    language: '언어',
    brandName: 'Typing Library',
    brandTagline: '문장을 그대로 옮기는 필사 타이핑',
  },
  landing: {
    nav: {
      library: '작품 라이브러리',
      preview: '필사 방식',
      principles: '운영 원칙',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: '저작권이 만료된 문학을, 눈으로 읽고 손으로 그대로 옮긴다.',
      description:
        'Typing Library는 작품을 읽는 속도와 입력의 리듬을 한 화면에 겹쳐 두는 필사형 타이핑 앱이다. 회색 원문 위에 입력이 덮여 올라가고, 오타는 멈추지 않은 채 바로 드러난다.',
      primaryAction: '작품 둘러보기',
      secondaryAction: '무료 운영 원칙 확인',
    },
    facts: {
      principleLabel: 'MVP 원칙',
      principleValue: '비로그인 · 로컬 저장',
      worksLabel: '공개 작품',
      worksValue: 'works origin 분리',
      typoLabel: '오타 피드백',
      typoValue: '즉시 표시 · 진행 허용',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: '작품 위에 입력이 덮여 올라가는 방식',
      chunkBadge: '문단 기준',
      paragraphLabel: 'paragraph 03',
      ghostText:
        '시간이 지나면 슬픔은 무뎌지기 마련이에요. 그래서 아저씨도 언젠가 슬픔이 지나가면 나를 알게 된 것이 기쁨이 되겠지요.',
      typedPrefix: '시간이 지나면 슬픔은',
      typedError: ' 무',
      typedSuffix:
        '뎌지기 마련이에요. 그래서 아저씨도 언젠가 슬픔이 지나가면 나를 알게 된 것이 기쁨이 되겠지요.',
      accuracyLabel: '정확도',
      accuracyValue: '97.4%',
      speedLabel: '속도',
      speedValue: '312 CPM',
      typoCountLabel: '오타',
      typoCountValue: '문단 1건',
      noteRuleLabel: '입력 규칙',
      noteRuleBody: '공백, 줄바꿈, 구두점, 대문자까지 원문 기준으로 판정',
      noteResumeLabel: '세션 복원',
      noteResumeBody: '새로고침 후 같은 작품의 진행 지점과 입력값을 이어서 복원',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: '필사 경험과 운영 원칙을 동시에 고정한다',
      description:
        '이 프로젝트는 타이핑 UX를 만드는 일과 0원 운영을 지키는 일을 같은 우선순위로 둔다.',
      item1Title: '원문 그대로 판정',
      item1Body:
        '공백, 줄바꿈, 구두점까지 원문 기준으로 비교하고, 오타는 즉시 빨간색으로만 보여줍니다.',
      item2Title: '진행은 멈추지 않음',
      item2Body:
        '오타가 나도 계속 입력할 수 있고, 문단이 끝났을 때 해당 문단의 오타를 다시 확인합니다.',
      item3Title: '비로그인 · 로컬 저장',
      item3Body:
        '결과, 내 작품, 이어하기 드래프트는 모두 이 기기 안에 저장합니다. 서버 쓰기를 만들지 않습니다.',
      item4Title: '공개 작품 + 내 작품',
      item4Body:
        '저작권이 만료된 공개 작품을 읽고, 직접 붙여 넣거나 `.txt`로 추가한 내 작품도 같은 방식으로 필사합니다.',
    },
    flow: {
      eyebrow: 'Flow',
      title: '사용자는 짧고 분명한 흐름만 밟는다',
      description: '작품 선택에서 결과 저장까지, 중간에 로그인이나 서버 저장을 끼워 넣지 않는다.',
      step1: '작품을 고른다',
      step2: '회색 원문 위에 그대로 타이핑한다',
      step3: '문단마다 오타를 확인하고 이어 쓴다',
      step4: '완료 후 정확도·WPM·시간을 로컬에 남긴다',
    },
    faq: {
      eyebrow: 'FAQ',
      title: '문서 단계에서 이미 고정된 기준들',
      description: '구현 전에 흔들리지 않도록, 주요 질문의 답을 먼저 확정해 둔다.',
      item1Question: '왜 로그인 없이 시작하나요?',
      item1Answer:
        'MVP 목표가 무료 운영과 빠른 진입이기 때문입니다. 기록과 내 작품은 우선 로컬에만 저장해 서버 비용을 만들지 않습니다.',
      item2Question: '오타가 나면 입력이 멈추나요?',
      item2Answer:
        '멈추지 않습니다. 오타 글자만 빨간색으로 표시하고 계속 입력할 수 있게 둡니다. 문단이 끝나면 이번 문단의 오타를 다시 보여줍니다.',
      item3Question: '공백이나 줄바꿈도 맞아야 하나요?',
      item3Answer:
        '맞습니다. 이 서비스는 문장을 그대로 옮기는 필사 경험이 핵심이라 공백, 줄바꿈, 구두점도 원문과 같아야 합니다.',
      item4Question: '공개 작품은 어디서 오나요?',
      item4Answer:
        '앱과 분리된 works origin에서 정적 파일로 읽습니다. 앱 배포 없이 작품만 갱신할 수 있도록 설계합니다.',
      item5Question: '운영 비용은 어떻게 막나요?',
      item5Answer:
        '정적 호스팅, 로컬 저장, works 분리 배포, 캐시 정책, 서버 쓰기 금지라는 네 가지 원칙으로 0원 운영을 유지합니다.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: '읽는 것과 입력하는 것을 분리하지 않는 필사 도구',
      description:
        '공개 작품은 저작권이 만료된 텍스트만 제공하고, 사용자 데이터는 로컬에만 저장한다. 문의 채널과 정책 페이지는 실제 배포 시점에 연결한다.',
      library: '작품 라이브러리',
      preview: '필사 화면 구조',
      principles: '운영 원칙',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: '프리뷰 카탈로그',
      worksOrigin: 'works origin 연결',
    },
    header: {
      eyebrow: 'Works Library',
      title: '공개 작품과 로컬 작품 진입점',
      back: '랜딩으로 돌아가기',
    },
    metrics: {
      publicWorksLabel: '공개 작품',
      publicWorksDescription: 'works origin에서 읽은 공개 카탈로그 기준',
      myWorksLabel: '내 작품',
      myWorksPending: '확인 중',
      myWorksError: '오류',
      myWorksDescription: 'IndexedDB 로컬 저장소에 보관된 사용자 작품 수',
      modeLabel: '현재 모드',
      liveMode: '실데이터',
      previewMode: '프리뷰',
      liveDescription: '분리된 works origin과 연결된 상태',
      previewDescription: 'works origin 미설정 시 샘플 카탈로그로 동작',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: '작품을 먼저 고르고, 그 다음에 필사 화면으로 들어간다',
      description:
        '지금 단계에서는 works origin 연결과 로컬 데이터 계층을 먼저 붙였다. 다음 단계에서 선택한 작품을 문단 단위 필사 화면으로 연결한다.',
      searchLabel: 'Search',
      searchPlaceholder: '제목, 저자, 언어로 검색',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL이 아직 설정되지 않아 샘플 카탈로그를 보여주고 있다. 실제 작품 연결 전까지는 이 화면으로 UI와 흐름을 먼저 확인한다.',
      unknownLanguage: 'unknown',
      multipart: '분할 작품',
      singleFile: '단일 파일',
      authorFallback: '저자 정보 없음',
      sourcePending: 'source pending',
      select: '선택',
      noResults: '검색 결과가 없다. 제목 또는 저자명을 다시 확인해라.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: '왼쪽 목록에서 작품을 하나 선택하면 상세 정보가 여기에 보인다.',
      languageLabel: '언어',
      languageFallback: '미기재',
      pathLabel: '원문 경로',
      sourceLabel: '출처',
      sourceFallback: 'works catalog에 추가 예정',
      nextLabel: '다음 연결',
      nextDescription:
        '다음 단계에서 선택한 작품을 /typing/[workId] 문단 필사 화면으로 연결한다. 지금은 작품 선택과 데이터 경계만 먼저 고정했다.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        '아직 연결되지 않았다. 환경변수 NEXT_PUBLIC_WORKS_BASE_URL을 설정하면 실제 카탈로그를 읽는다.',
      worksOriginCurrent: '현재 연결 주소: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        '내 작품, 결과, 드래프트는 전부 IndexedDB가 기준이다. 전역 메모리 store는 설정 패널 같은 UI 상태에만 사용한다.',
    },
  },
  myWorks: myWorksMessagesKo,
  results: resultsMessagesKo,
  typing: typingMessagesKo,
} as const);
