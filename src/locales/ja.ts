import { defineMessages } from './messages';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: '言語',
    brandName: 'Typing Library',
    brandTagline: '文章をそのまま写す筆写タイピング',
  },
  landing: {
    nav: {
      library: '作品ライブラリ',
      preview: '入力プレビュー',
      principles: '運営原則',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: '著作権が切れた文学を、目で読みながら手でそのまま写す。',
      description:
        'Typing Library は、読む速度と入力のリズムをひとつの画面に重ねる筆写型タイピングアプリです。灰色の原文の上に入力が重なり、誤字は進行を止めずにすぐ表示されます。',
      primaryAction: '作品を見る',
      secondaryAction: '無料運営の原則を見る',
    },
    facts: {
      principleLabel: 'MVP 原則',
      principleValue: 'ログイン不要 · ローカル保存',
      worksLabel: '公開作品',
      worksValue: 'works origin 分離',
      typoLabel: '誤字フィードバック',
      typoValue: '即時表示 · 進行は継続',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: '原文の上に入力が重なる表示',
      chunkBadge: '段落単位',
      paragraphLabel: 'paragraph 03',
      ghostText:
        '時間がたてば悲しみはやわらぎます。いつか悲しみが過ぎたとき、私に出会えたことを喜びとして思い出すでしょう。',
      typedPrefix: '時間がたてば悲しみは',
      typedError: ' ま',
      typedSuffix:
        'ろやかになります。いつか悲しみが過ぎたとき、私に出会えたことを喜びとして思い出すでしょう。',
      accuracyLabel: '正確度',
      accuracyValue: '97.4%',
      speedLabel: '速度',
      speedValue: '312 CPM',
      typoCountLabel: '誤字',
      typoCountValue: 'この段落で 1 件',
      noteRuleLabel: '入力ルール',
      noteRuleBody: '空白、改行、句読点、大文字小文字まで原文どおりに判定',
      noteResumeLabel: 'セッション復元',
      noteResumeBody: 'リロード後も同じ位置と入力内容を復元',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: '筆写体験と運営原則を同時に固定する',
      description:
        'このプロジェクトは、タイピング UX の品質と恒久的な無料運営を同じ優先度で扱います。',
      item1Title: '原文どおりに判定',
      item1Body:
        '空白、改行、句読点まで原文基準で比較し、誤字は赤色で即時表示します。',
      item2Title: '進行は止めない',
      item2Body:
        '誤字があっても入力は続けられます。段落の終わりで、その段落の誤りを確認します。',
      item3Title: 'ログイン不要 · ローカル保存',
      item3Body:
        '結果、マイ作品、途中再開用ドラフトはすべてこの端末に保存されます。サーバー書き込みは作りません。',
      item4Title: '公開作品 + マイ作品',
      item4Body:
        '著作権切れの公開作品だけでなく、貼り付けや `.txt` で追加した自分の文章も同じ方式で筆写できます。',
    },
    flow: {
      eyebrow: 'Flow',
      title: '利用者が通る流れは短く明確です',
      description: '作品選択から結果保存までの間に、ログインやサーバー保存を挟みません。',
      step1: '作品を選ぶ',
      step2: '灰色の原文の上にそのまま入力する',
      step3: '段落ごとに誤字を確認しながら続ける',
      step4: '完了後に正確度・WPM・時間をローカル保存する',
    },
    faq: {
      eyebrow: 'FAQ',
      title: '実装前の段階で固定した基準',
      description: '後で仕様がぶれないよう、重要な答えを先に確定しています。',
      item1Question: 'なぜログインなしで始めるのですか？',
      item1Answer:
        'MVP では無料運営と素早い導入を優先するためです。記録とマイ作品はまずローカルに保存し、サーバーコストを作りません。',
      item2Question: '誤字が出たら入力は止まりますか？',
      item2Answer:
        '止まりません。誤字だけを赤く表示し、そのまま入力を続けられます。段落終了時に誤字の要約をもう一度見せます。',
      item3Question: '空白や改行も一致しないといけませんか？',
      item3Answer:
        'はい。このサービスの本質は文章をそのまま写すことなので、空白・改行・句読点も原文と一致する必要があります。',
      item4Question: '公開作品はどこから来ますか？',
      item4Answer:
        'アプリとは分離された works origin の静的ファイルから読み込みます。アプリ再配布なしで作品だけ更新できる構成です。',
      item5Question: 'どうやって運営費を 0 円に保つのですか？',
      item5Answer:
        '静的ホスティング、ローカル保存、作品配信の分離、厳格なキャッシュ、サーバー書き込み禁止の 5 つを軸にしています。',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: '読むことと入力することを分けない筆写ツール',
      description:
        '公開作品として提供するのは著作権が切れたテキストのみで、ユーザーデータはローカルに保存されます。問い合わせ先とポリシーは公開時に接続します。',
      library: '作品ライブラリ',
      preview: '入力プレビュー',
      principles: '運営原則',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'プレビューカタログ',
      worksOrigin: 'works origin 接続済み',
    },
    header: {
      eyebrow: 'Works Library',
      title: '公開作品とローカル作品の入口',
      back: 'ランディングへ戻る',
    },
    metrics: {
      publicWorksLabel: '公開作品',
      publicWorksDescription: 'works origin から読み込んだ公開カタログ基準',
      myWorksLabel: 'マイ作品',
      myWorksPending: '確認中',
      myWorksError: 'エラー',
      myWorksDescription: 'この端末の IndexedDB に保存された個人作品数',
      modeLabel: '現在モード',
      liveMode: '実データ',
      previewMode: 'プレビュー',
      liveDescription: '分離された works origin に接続中',
      previewDescription: 'works origin 未設定時はサンプルカタログで動作',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'まず作品を選び、その後に筆写画面へ進む',
      description:
        'この段階では works origin との接続とローカルデータ層を先に整えています。次の段階で選択作品を段落単位の筆写画面へ接続します。',
      searchLabel: 'Search',
      searchPlaceholder: 'タイトル、著者、言語で検索',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL がまだ設定されていないため、サンプルカタログを表示しています。実作品接続前に UI と導線を確認するための画面です。',
      unknownLanguage: 'unknown',
      multipart: '分割作品',
      singleFile: '単一ファイル',
      authorFallback: '著者情報なし',
      sourcePending: 'source pending',
      select: '選択',
      noResults: '一致する作品がありません。タイトルまたは著者名を見直してください。',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: '左の一覧から作品をひとつ選ぶと、ここに詳細が表示されます。',
      languageLabel: '言語',
      languageFallback: '未記載',
      pathLabel: '原文パス',
      sourceLabel: '出典',
      sourceFallback: 'works catalog に追加予定',
      nextLabel: '次の接続',
      nextDescription:
        '次の段階では、選択した作品を /typing/[workId] の段落筆写ルートへ接続します。今は作品選択とデータ境界だけを先に固定しています。',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'まだ接続されていません。NEXT_PUBLIC_WORKS_BASE_URL を設定すると実カタログを読み込みます。',
      worksOriginCurrent: '現在の接続先: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'マイ作品、結果、ドラフトはすべて IndexedDB を基準にします。メモリ store は設定パネルのような一時的 UI 状態だけに使います。',
    },
  },
  typing: typingMessagesEn,
} as const);
