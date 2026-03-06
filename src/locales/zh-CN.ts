import { defineMessages } from './messages';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: '语言',
    brandName: 'Typing Library',
    brandTagline: '逐字照抄的誊写打字',
  },
  landing: {
    nav: {
      library: '作品库',
      preview: '输入预览',
      principles: '运营原则',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: '阅读已进入公版领域的文学，并将文字原样敲出来。',
      description:
        'Typing Library 是一款誊写式打字应用，把阅读速度与输入节奏叠放在同一屏幕上。灰色原文始终在底层显示，输入内容覆盖其上，错字会立刻显现但不会打断继续输入。',
      primaryAction: '浏览作品',
      secondaryAction: '查看零成本原则',
    },
    facts: {
      principleLabel: 'MVP 原则',
      principleValue: '免登录 · 本地存储',
      worksLabel: '公开作品',
      worksValue: 'works origin 分离',
      typoLabel: '错字反馈',
      typoValue: '即时标红 · 不阻断输入',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: '输入直接叠加在原文之上',
      chunkBadge: '按段落',
      paragraphLabel: 'paragraph 03',
      ghostText:
        '随着时间流逝，悲伤会慢慢钝化。总有一天，当悲伤过去时，你会为曾经认识我而感到庆幸。',
      typedPrefix: '随着时间流逝，悲伤会',
      typedError: ' 更',
      typedSuffix:
        '加迟钝。总有一天，当悲伤过去时，你会为曾经认识我而感到庆幸。',
      accuracyLabel: '准确率',
      accuracyValue: '97.4%',
      speedLabel: '速度',
      speedValue: '312 CPM',
      typoCountLabel: '错字',
      typoCountValue: '本段 1 处',
      noteRuleLabel: '输入规则',
      noteRuleBody: '空格、换行、标点和大小写都按原文判定',
      noteResumeLabel: '会话恢复',
      noteResumeBody: '刷新后恢复同一位置与输入内容',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: '同时固定誊写体验与运营规则',
      description: '这个项目把打字体验质量与永久免费运营放在同等优先级上。',
      item1Title: '严格按原文判定',
      item1Body: '空格、换行、标点都按原文比较，错字只用红色即时标出。',
      item2Title: '输入不中断',
      item2Body: '即使打错字也可以继续输入，段落结束后再回看本段错误。',
      item3Title: '免登录 · 本地保存',
      item3Body: '结果、我的作品和继续写作草稿都保存在当前设备，不引入服务器写入。',
      item4Title: '公开作品 + 我的作品',
      item4Body:
        '不仅可以誊写公版文学，也可以用粘贴或 `.txt` 上传自己的文本，并使用同一套引擎。',
    },
    flow: {
      eyebrow: 'Flow',
      title: '用户只走一条短而明确的路径',
      description: '从选择作品到保存结果，中间不插入登录步骤，也不插入服务器保存。',
      step1: '选择作品',
      step2: '在灰色原文上直接输入',
      step3: '按段查看错字并继续',
      step4: '完成后把准确率、WPM 和时间保存在本地',
    },
    faq: {
      eyebrow: 'FAQ',
      title: '在开发前就先固定的规则',
      description: '为了避免实现过程中方向摇摆，关键问题的答案先确定下来。',
      item1Question: '为什么一开始不做登录？',
      item1Answer:
        '因为 MVP 优先考虑零成本运营和快速进入。记录与我的作品先全部保存在本地，不制造服务器成本。',
      item2Question: '打错字时会被阻止吗？',
      item2Answer:
        '不会。错误字符只会被标成红色，输入可以继续。段落结束时会再次显示该段错字摘要。',
      item3Question: '空格和换行也必须一致吗？',
      item3Answer:
        '是的。这个产品的核心就是逐字誊写，所以空格、换行、标点都必须与原文一致。',
      item4Question: '公开作品来自哪里？',
      item4Answer:
        '它们以静态文件形式从分离的 works origin 读取，这样就可以在不重新部署应用的前提下只更新作品目录。',
      item5Question: '如何把运营成本控制在 0？',
      item5Answer:
        '静态托管、本地存储、作品分离部署、严格缓存和禁止服务器写入，是整个方案的核心规则。',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: '不把阅读与输入分开的誊写工具',
      description:
        '公开作品只提供已进入公版领域的文本，用户数据仅保留在本地。联系与政策页面会在正式上线时接入。',
      library: '作品库',
      preview: '输入预览',
      principles: '运营原则',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: '预览目录',
      worksOrigin: '已连接 works origin',
    },
    header: {
      eyebrow: 'Works Library',
      title: '公开作品与本地作品入口',
      back: '返回落地页',
    },
    metrics: {
      publicWorksLabel: '公开作品',
      publicWorksDescription: '基于从 works origin 读取的公开目录',
      myWorksLabel: '我的作品',
      myWorksPending: '检查中',
      myWorksError: '错误',
      myWorksDescription: '当前设备 IndexedDB 中保存的个人作品数量',
      modeLabel: '当前模式',
      liveMode: '真实数据',
      previewMode: '预览',
      liveDescription: '已连接分离的 works origin',
      previewDescription: '未设置 works origin 时使用示例目录',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: '先选作品，再进入誊写页面',
      description:
        '这一阶段先把 works origin 连接和本地数据层搭好。下一阶段再把选中的作品接到按段誊写页面。',
      searchLabel: 'Search',
      searchPlaceholder: '按标题、作者或语言搜索',
      previewWarning:
        '由于 NEXT_PUBLIC_WORKS_BASE_URL 尚未设置，当前显示的是示例目录。在接入真实作品前，可以先用这个页面确认 UI 与流程。',
      unknownLanguage: 'unknown',
      multipart: '分卷作品',
      singleFile: '单文件',
      authorFallback: '暂无作者信息',
      sourcePending: 'source pending',
      select: '选择',
      noResults: '没有匹配的作品。请重新检查标题或作者名。',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: '从左侧列表选择一部作品后，这里会显示详细信息。',
      languageLabel: '语言',
      languageFallback: '未填写',
      pathLabel: '原文路径',
      sourceLabel: '来源',
      sourceFallback: '稍后补充到 works catalog',
      nextLabel: '下一步连接',
      nextDescription:
        '下一阶段会把选中的作品接到 /typing/[workId] 的按段誊写路由。当前先固定作品选择流程与数据边界。',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset: '尚未连接。设置 NEXT_PUBLIC_WORKS_BASE_URL 后即可读取真实目录。',
      worksOriginCurrent: '当前地址：{url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        '我的作品、结果和草稿都以 IndexedDB 为准。内存 store 只用于设置面板之类的临时 UI 状态。',
    },
  },
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
