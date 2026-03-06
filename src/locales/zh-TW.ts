import { defineMessages } from './messages';
import { myWorksMessagesEn } from './shared-my-works';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: '語言',
    brandName: 'Typing Library',
    brandTagline: '逐字照抄的筆寫打字',
  },
  landing: {
    nav: {
      library: '作品庫',
      preview: '輸入預覽',
      principles: '營運原則',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: '閱讀進入公版領域的文學，並把文字原樣打出來。',
      description:
        'Typing Library 是一個筆寫式打字應用，把閱讀速度與輸入節奏疊在同一個畫面上。灰色原文保留在底層，輸入內容覆蓋其上，錯字會立刻顯示但不阻止繼續輸入。',
      primaryAction: '瀏覽作品',
      secondaryAction: '查看零成本原則',
    },
    facts: {
      principleLabel: 'MVP 原則',
      principleValue: '免登入 · 本地儲存',
      worksLabel: '公開作品',
      worksValue: 'works origin 分離',
      typoLabel: '錯字回饋',
      typoValue: '即時標紅 · 不阻擋輸入',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: '輸入直接覆蓋在原文之上',
      chunkBadge: '以段落為單位',
      paragraphLabel: 'paragraph 03',
      ghostText:
        '隨著時間流逝，悲傷會漸漸變鈍。總有一天，當悲傷過去時，你會為曾經認識我而感到欣慰。',
      typedPrefix: '隨著時間流逝，悲傷會',
      typedError: ' 更',
      typedSuffix:
        '加遲鈍。總有一天，當悲傷過去時，你會為曾經認識我而感到欣慰。',
      accuracyLabel: '準確率',
      accuracyValue: '97.4%',
      speedLabel: '速度',
      speedValue: '312 CPM',
      typoCountLabel: '錯字',
      typoCountValue: '本段 1 處',
      noteRuleLabel: '輸入規則',
      noteRuleBody: '空格、換行、標點與大小寫都依原文判定',
      noteResumeLabel: '工作階段恢復',
      noteResumeBody: '重新整理後恢復相同位置與輸入內容',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: '同時固定筆寫體驗與營運規則',
      description: '這個專案把打字體驗品質與永久免費營運放在同等優先順序。',
      item1Title: '嚴格依原文判定',
      item1Body: '空格、換行與標點都依照原文比較，錯字只以紅色即時標示。',
      item2Title: '輸入不中斷',
      item2Body: '即使打錯字也能繼續輸入，段落結束後再回看本段錯誤。',
      item3Title: '免登入 · 本地保存',
      item3Body: '結果、我的作品與續寫草稿都儲存在此裝置內，不引入伺服器寫入。',
      item4Title: '公開作品 + 我的作品',
      item4Body:
        '不只可筆寫公版文學，也可用貼上或 `.txt` 上傳自己的文字，並套用同一套引擎。',
    },
    flow: {
      eyebrow: 'Flow',
      title: '使用者只走一條短而明確的路徑',
      description: '從選擇作品到儲存結果，中間不插入登入牆，也不做伺服器存檔。',
      step1: '選擇作品',
      step2: '在灰色原文上直接輸入',
      step3: '逐段檢查錯字並繼續',
      step4: '完成後把準確率、WPM 與時間保存在本地',
    },
    faq: {
      eyebrow: 'FAQ',
      title: '在開發前就先固定的規則',
      description: '為了避免實作時方向搖擺，先把重要問題的答案定下來。',
      item1Question: '為什麼一開始不做登入？',
      item1Answer:
        '因為 MVP 優先考慮零成本營運與快速進入。紀錄與我的作品先全部保存在本地，不製造伺服器成本。',
      item2Question: '打錯字時會被阻止嗎？',
      item2Answer:
        '不會。錯誤字元只會被標成紅色，輸入可以持續。段落結束時會再次顯示該段錯字摘要。',
      item3Question: '空格與換行也必須一致嗎？',
      item3Answer:
        '是的。這個產品的核心就是逐字筆寫，因此空格、換行與標點都必須與原文一致。',
      item4Question: '公開作品從哪裡來？',
      item4Answer:
        '它們以靜態檔案形式從分離的 works origin 讀取，因此可以在不重新部署應用的情況下只更新作品目錄。',
      item5Question: '如何把營運成本維持在 0？',
      item5Answer:
        '靜態託管、本地儲存、作品分離部署、嚴格快取，以及禁止伺服器寫入，是整個方案的核心規則。',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: '不把閱讀與輸入拆開的筆寫工具',
      description:
        '公開作品只提供已進入公版領域的文字，使用者資料只保留在本地。聯絡與政策頁面會在正式上線時接入。',
      library: '作品庫',
      preview: '輸入預覽',
      principles: '營運原則',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: '預覽目錄',
      worksOrigin: '已連接 works origin',
    },
    header: {
      eyebrow: 'Works Library',
      title: '公開作品與本地作品入口',
      back: '返回首頁',
    },
    metrics: {
      publicWorksLabel: '公開作品',
      publicWorksDescription: '以從 works origin 讀取的公開目錄為基準',
      myWorksLabel: '我的作品',
      myWorksPending: '確認中',
      myWorksError: '錯誤',
      myWorksDescription: '目前裝置 IndexedDB 中儲存的個人作品數量',
      modeLabel: '目前模式',
      liveMode: '真實資料',
      previewMode: '預覽',
      liveDescription: '已連接到分離的 works origin',
      previewDescription: '未設定 works origin 時改用範例目錄',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: '先選作品，再進入筆寫畫面',
      description:
        '這個階段先把 works origin 連線與本地資料層建立起來。下一階段再把選定作品接到以段落為單位的筆寫畫面。',
      searchLabel: 'Search',
      searchPlaceholder: '依標題、作者或語言搜尋',
      previewWarning:
        '因為 NEXT_PUBLIC_WORKS_BASE_URL 尚未設定，目前顯示的是範例目錄。在接入真實作品前，可先利用這個畫面確認 UI 與流程。',
      unknownLanguage: 'unknown',
      multipart: '分段作品',
      singleFile: '單一檔案',
      authorFallback: '沒有作者資訊',
      sourcePending: 'source pending',
      select: '選取',
      noResults: '找不到符合的作品。請重新確認標題或作者名稱。',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: '從左側清單選擇一部作品後，這裡會顯示詳細資訊。',
      languageLabel: '語言',
      languageFallback: '未填寫',
      pathLabel: '原文路徑',
      sourceLabel: '來源',
      sourceFallback: '稍後補到 works catalog',
      nextLabel: '下一步連接',
      nextDescription:
        '下一階段會把選中的作品接到 /typing/[workId] 的段落筆寫路由。現在先把作品選擇流程與資料邊界固定下來。',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset: '尚未連接。設定 NEXT_PUBLIC_WORKS_BASE_URL 後即可讀取真實目錄。',
      worksOriginCurrent: '目前位址：{url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        '我的作品、結果與草稿都以 IndexedDB 為準。記憶體 store 只用於設定面板之類的暫時 UI 狀態。',
    },
  },
  myWorks: myWorksMessagesEn,
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
