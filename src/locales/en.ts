import { defineMessages } from './messages';
import { myWorksMessagesEn } from './shared-my-works';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: 'Language',
    brandName: 'Typing Library',
    brandTagline: 'A typing experience that copies each sentence exactly',
  },
  landing: {
    nav: {
      library: 'Library',
      preview: 'Preview',
      principles: 'Principles',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: 'Read public-domain literature and copy it by hand, exactly as it is.',
      description:
        'Typing Library is a transcription-style typing app where reading pace and input rhythm overlap on one screen. The original text stays in gray behind your input, and typos appear instantly without blocking progress.',
      primaryAction: 'Browse works',
      secondaryAction: 'See zero-cost principles',
    },
    facts: {
      principleLabel: 'MVP principle',
      principleValue: 'No login · local storage',
      worksLabel: 'Public works',
      worksValue: 'Separate works origin',
      typoLabel: 'Typo feedback',
      typoValue: 'Instant highlight · no blocking',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: 'Input appears directly over the source text',
      chunkBadge: 'Paragraph based',
      paragraphLabel: 'paragraph 03',
      ghostText:
        'As time passes, sorrow becomes duller. One day, when your sadness fades, you may be glad that you came to know me.',
      typedPrefix: 'As time passes, sorrow becomes',
      typedError: ' mo',
      typedSuffix:
        're dull. One day, when your sadness fades, you may be glad that you came to know me.',
      accuracyLabel: 'Accuracy',
      accuracyValue: '97.4%',
      speedLabel: 'Speed',
      speedValue: '312 CPM',
      typoCountLabel: 'Typos',
      typoCountValue: '1 in this paragraph',
      noteRuleLabel: 'Input rules',
      noteRuleBody: 'Spaces, line breaks, punctuation, and letter case all follow the original text',
      noteResumeLabel: 'Session resume',
      noteResumeBody: 'Restore the same position and input after a refresh',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: 'Fix the typing experience and the operating rules at the same time',
      description:
        'This project gives equal priority to typing UX quality and to keeping operations permanently free.',
      item1Title: 'Judge against the original text',
      item1Body:
        'Spaces, line breaks, and punctuation are all compared against the source text, and typos are shown only in red.',
      item2Title: 'Never block progress',
      item2Body:
        'Even when you make a typo, you keep typing. At the end of each paragraph, you can review what was wrong.',
      item3Title: 'No login · local storage',
      item3Body:
        'Results, personal works, and resume drafts stay on this device. The MVP does not create server writes.',
      item4Title: 'Public works + personal works',
      item4Body:
        'You can type public-domain literature or your own text added by paste or `.txt` upload using the same engine.',
    },
    flow: {
      eyebrow: 'Flow',
      title: 'Users follow a short and explicit path',
      description: 'From choosing a work to saving a result, there is no login wall and no server-side save in the middle.',
      step1: 'Choose a work',
      step2: 'Type directly over the gray source text',
      step3: 'Review typos paragraph by paragraph and continue',
      step4: 'Save accuracy, WPM, and time locally when finished',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Rules already fixed before implementation',
      description: 'The main answers are settled in advance so the build does not drift later.',
      item1Question: 'Why start without login?',
      item1Answer:
        'Because the MVP optimizes for free operation and immediate access. Records and personal works stay local first, so no server cost is created.',
      item2Question: 'Does typing stop when I make a typo?',
      item2Answer:
        'No. The wrong character is marked in red, but input continues. At the end of the paragraph, the typo summary is shown again.',
      item3Question: 'Do spaces and line breaks matter too?',
      item3Answer:
        'Yes. This product is about copying the sentence exactly, so spaces, line breaks, and punctuation must match the original.',
      item4Question: 'Where do public works come from?',
      item4Answer:
        'They are read as static files from a separate works origin so the catalog can change without redeploying the app.',
      item5Question: 'How do you keep operation costs at zero?',
      item5Answer:
        'Static hosting, local storage, separated works deployment, strict caching, and no server writes are the core rules.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: 'A transcription tool that does not separate reading from typing',
      description:
        'Only public-domain texts are served as public works, and user data stays local. Contact and policy links will be connected at launch.',
      library: 'Library',
      preview: 'Typing preview',
      principles: 'Principles',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'Preview catalog',
      worksOrigin: 'Works origin connected',
    },
    header: {
      eyebrow: 'Works Library',
      title: 'Entry point for public works and local works',
      back: 'Back to landing',
    },
    metrics: {
      publicWorksLabel: 'Public works',
      publicWorksDescription: 'Based on the public catalog loaded from the works origin',
      myWorksLabel: 'My works',
      myWorksPending: 'Checking',
      myWorksError: 'Error',
      myWorksDescription: 'Count of personal works stored in IndexedDB on this device',
      modeLabel: 'Mode',
      liveMode: 'Live data',
      previewMode: 'Preview',
      liveDescription: 'Connected to the separated works origin',
      previewDescription: 'Uses a sample catalog when no works origin is configured',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'Choose a work first, then move into the typing screen',
      description:
        'At this stage, the works origin connection and local data layer are in place first. The next step is to connect the selected work to paragraph-based typing.',
      searchLabel: 'Search',
      searchPlaceholder: 'Search by title, author, or language',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL is not configured yet, so the screen is showing a sample catalog. Use this preview to confirm the UI and flow first.',
      unknownLanguage: 'unknown',
      multipart: 'Multi-part',
      singleFile: 'Single file',
      authorFallback: 'No author info',
      sourcePending: 'source pending',
      select: 'Select',
      noResults: 'No matching works were found. Check the title or author and try again.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: 'Choose a work from the list on the left to see its details here.',
      languageLabel: 'Language',
      languageFallback: 'Not specified',
      pathLabel: 'Text path',
      sourceLabel: 'Source',
      sourceFallback: 'To be added in the works catalog',
      nextLabel: 'Next connection',
      nextDescription:
        'The next step is to connect the selected work to the paragraph typing screen. For now, only the selection flow and data boundary are fixed.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'It is not connected yet. Set NEXT_PUBLIC_WORKS_BASE_URL to read the real catalog.',
      worksOriginCurrent: 'Current endpoint: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'Personal works, results, and drafts all use IndexedDB as the source of truth. The in-memory store is only for transient UI state.',
    },
  },
  myWorks: myWorksMessagesEn,
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
