export const LANGUAGES = { zh: '中文', ja: '日本語', en: 'English', ko: '한국어' };

export const CATEGORY_NAMES = {
  'cinematic-story': { zh: '电影叙事', ja: '映画・ストーリー', en: 'Cinematic stories', ko: '영화·스토리' },
  'music-video': { zh: '音乐 MV', ja: 'ミュージックビデオ', en: 'Music videos', ko: '뮤직비디오' },
  'product-commercial': { zh: '产品广告', ja: '商品広告', en: 'Product commercials', ko: '제품 광고' },
  fashion: { zh: '时尚大片', ja: 'ファッション', en: 'Fashion', ko: '패션' },
  action: { zh: '动作场面', ja: 'アクション', en: 'Action', ko: '액션' },
  anime: { zh: '动漫', ja: 'アニメ', en: 'Anime', ko: '애니메' },
  vlog: { zh: '生活 Vlog', ja: '日常・Vlog', en: 'Vlogs & lifestyle', ko: '일상·브이로그' },
  'cinematic-travel': { zh: '旅行风光', ja: '旅・風景', en: 'Travel & landscapes', ko: '여행·풍경' },
  gameplay: { zh: '游戏', ja: 'ゲーム', en: 'Gameplay', ko: '게임' },
  animation: { zh: '动画', ja: 'アニメーション', en: 'Animation', ko: '애니메이션' },
  horror: { zh: '惊悚', ja: 'ホラー', en: 'Horror', ko: '공포' },
  'motion-graphics': { zh: '动态图形', ja: 'モーショングラフィックス', en: 'Motion graphics', ko: '모션 그래픽' },
  comedy: { zh: '喜剧', ja: 'コメディ', en: 'Comedy', ko: '코미디' },
  'title-sequence': { zh: '片头设计', ja: 'タイトルシーケンス', en: 'Title sequences', ko: '타이틀 시퀀스' },
  'brand-film': { zh: '品牌短片', ja: 'ブランドフィルム', en: 'Brand films', ko: '브랜드 필름' },
  'viral-short': { zh: '创意短片', ja: 'クリエイティブ短編', en: 'Creative shorts', ko: '크리에이티브 숏폼' },
  'product-demo': { zh: '产品演示', ja: '商品デモ', en: 'Product demos', ko: '제품 시연' },
};

export const MESSAGES = {
  zh: {
    siteName: '我的视频参考库', home: '我的视频参考库首页', description: '按类别和编号浏览视频参考，查看完整提示词并追溯 X 原作者。',
    skip: '跳到视频参考', tagline: '创作，从一个参考开始', categoryIndex: '类别索引', categorySidebar: '视频分类', categoryNav: '按类别筛选',
    codeExplanation: '字母代表分类\n数字对应固定案例', eyebrow: '视频参考索引', all: '全部参考', snapshot: '本次收录', language: '选择语言',
    search: '搜索编号、标题、作者或提示词', grid: '视频参考列表', loading: '正在读取参考库…', loadingVideos: '正在加载视频参考…',
    overview: '{count} 条视频参考 / {categories} 个分类', categorySummary: '{letter} 类 · {count} 条视频参考', results: '{count} 条参考',
    empty: '没有找到匹配的参考，试试其他编号或关键词。', more: '加载更多参考（已显示 {shown} / {total}） ↓',
    loadError: '参考库加载失败，请刷新页面重试。', unavailable: '暂时无法读取参考数据',
    close: '关闭详情', video: '视频参考', videoError: '视频暂时无法加载，请前往下方 X 原帖观看。',
    promptHeading: '完整提示词', copyPrompt: '复制提示词', promptNote: '保留原文，便于直接复用。',
    source: '查看 {author} 的 X 原帖 ↗', thread: '提示词出处 · 同作者线程', originalPost: '提示词出处 · 原帖',
    sourceNumber: '来源 {number} ↗', promptSource: '打开提示词来源 ↗',
    noPreview: '暂无预览图', preview: '{code} {title}，查看视频和提示词', viewPrompt: '查看提示词 ↗', copy: '复制', copyLabel: '复制 {code} 的提示词',
    copied: '提示词已复制', copyError: '无法自动复制，请打开详情并选中提示词复制',
    rights: '视频与提示词归原作者所有。数据整理：', footerNote: '保留原始分类与提示词 · 视频使用源站链接',
    translationNote: '日、韩标题为机器翻译。',
  },
  ja: {
    siteName: 'マイ動画リファレンス', home: '動画リファレンスのホーム', description: 'カテゴリと番号で動画を探し、プロンプト全文と X の投稿元を確認できます。',
    skip: '動画一覧へ移動', tagline: 'ひとつの参考から、創作が始まる', categoryIndex: 'カテゴリ一覧', categorySidebar: '動画カテゴリ', categoryNav: 'カテゴリで絞り込む',
    codeExplanation: '英字はカテゴリ\n数字は固定の作品番号', eyebrow: '動画リファレンス一覧', all: 'すべての動画', snapshot: '収録日', language: '言語を選択',
    search: '番号・タイトル・作者・プロンプトで検索', grid: '動画リファレンス一覧', loading: 'ライブラリを読み込み中…', loadingVideos: '動画一覧を読み込み中…',
    overview: '{count} 件の動画 / {categories} カテゴリ', categorySummary: 'カテゴリ {letter} · {count} 件の動画', results: '{count} 件',
    empty: '該当する動画がありません。別の番号やキーワードをお試しください。', more: 'さらに表示（{shown} / {total} 件） ↓',
    loadError: '読み込めませんでした。ページを再読み込みしてください。', unavailable: 'ライブラリを読み込めません',
    close: '詳細を閉じる', video: '参考動画', videoError: '動画を読み込めません。下のリンクから X の元投稿をご覧ください。',
    promptHeading: 'プロンプト全文', copyPrompt: 'プロンプトをコピー', promptNote: 'そのまま使えるよう、原文を保持しています。',
    source: '{author} の X 元投稿を見る ↗', thread: 'プロンプト出典 · 同じ作者のスレッド', originalPost: 'プロンプト出典 · 元投稿',
    sourceNumber: '出典 {number} ↗', promptSource: 'プロンプトの出典を開く ↗',
    noPreview: 'プレビューなし', preview: '{code} {title}：動画とプロンプトを見る', viewPrompt: 'プロンプトを見る ↗', copy: 'コピー', copyLabel: '{code} のプロンプトをコピー',
    copied: 'プロンプトをコピーしました', copyError: 'コピーできませんでした。詳細でプロンプトを選択してコピーしてください。',
    rights: '動画とプロンプトの権利は原作者に帰属します。データ整理：', footerNote: '元のカテゴリとプロンプトを保持 · 動画は元サイトへのリンクです',
    translationNote: '日本語・韓国語のタイトルは機械翻訳です。',
  },
  en: {
    siteName: 'My Video Reference Library', home: 'Video reference library home', description: 'Browse video references by category and ID, copy full prompts, and trace each example to its original X post.',
    skip: 'Skip to video references', tagline: 'Every creation starts with a reference', categoryIndex: 'CATEGORY INDEX', categorySidebar: 'Video categories', categoryNav: 'Filter by category',
    codeExplanation: 'Letter = category\nNumber = fixed reference ID', eyebrow: 'THE REFERENCE INDEX', all: 'All references', snapshot: 'CAPTURED ON', language: 'Select language',
    search: 'Search ID, title, creator or prompt', grid: 'Video reference list', loading: 'Loading the library…', loadingVideos: 'Loading video references…',
    overview: '{count} video references / {categories} categories', categorySummary: 'Category {letter} · {count} video references', results: '{count} references',
    empty: 'No matching references. Try a different ID or keyword.', more: 'Load more references ({shown} / {total}) ↓',
    loadError: 'The library could not load. Please refresh the page.', unavailable: 'Reference data is unavailable',
    close: 'Close details', video: 'Reference video', videoError: 'The video could not load. Open the original X post using the link below.',
    promptHeading: 'Full prompt', copyPrompt: 'Copy prompt', promptNote: 'Original wording is preserved for reuse.',
    source: 'View {author}’s original X post ↗', thread: 'Prompt source · Same-author thread', originalPost: 'Prompt source · Original post',
    sourceNumber: 'Source {number} ↗', promptSource: 'Open prompt source ↗',
    noPreview: 'No preview available', preview: '{code} {title}: view video and prompt', viewPrompt: 'View prompt ↗', copy: 'Copy', copyLabel: 'Copy the prompt for {code}',
    copied: 'Prompt copied', copyError: 'Automatic copying failed. Open the details and select the prompt to copy it.',
    rights: 'Videos and prompts belong to their original creators. Catalog curated by ', footerNote: 'Original categories and prompts · Videos linked from the source site',
    translationNote: 'Japanese and Korean titles are machine-translated.',
  },
  ko: {
    siteName: '내 영상 레퍼런스 라이브러리', home: '영상 레퍼런스 홈', description: '카테고리와 번호로 영상을 찾아보고, 전체 프롬프트와 X 원본 게시물을 확인하세요.',
    skip: '영상 목록으로 이동', tagline: '하나의 레퍼런스에서 시작되는 창작', categoryIndex: '카테고리 목록', categorySidebar: '영상 카테고리', categoryNav: '카테고리로 필터링',
    codeExplanation: '알파벳은 카테고리\n숫자는 고정 영상 번호', eyebrow: '영상 레퍼런스 인덱스', all: '전체 레퍼런스', snapshot: '수록일', language: '언어 선택',
    search: '번호, 제목, 제작자 또는 프롬프트 검색', grid: '영상 레퍼런스 목록', loading: '라이브러리를 불러오는 중…', loadingVideos: '영상 목록을 불러오는 중…',
    overview: '영상 {count}개 / 카테고리 {categories}개', categorySummary: '{letter} 카테고리 · 영상 {count}개', results: '레퍼런스 {count}개',
    empty: '일치하는 영상이 없습니다. 다른 번호나 검색어를 입력해 보세요.', more: '더 보기 ({shown} / {total}) ↓',
    loadError: '라이브러리를 불러오지 못했습니다. 페이지를 새로고침해 주세요.', unavailable: '레퍼런스 데이터를 불러올 수 없습니다',
    close: '상세 보기 닫기', video: '참고 영상', videoError: '영상을 불러오지 못했습니다. 아래 링크에서 X 원본 게시물을 확인해 주세요.',
    promptHeading: '전체 프롬프트', copyPrompt: '프롬프트 복사', promptNote: '바로 활용할 수 있도록 원문을 유지했습니다.',
    source: '{author}의 X 원본 게시물 보기 ↗', thread: '프롬프트 출처 · 동일 작성자의 스레드', originalPost: '프롬프트 출처 · 원본 게시물',
    sourceNumber: '출처 {number} ↗', promptSource: '프롬프트 출처 열기 ↗',
    noPreview: '미리보기 없음', preview: '{code} {title}: 영상 및 프롬프트 보기', viewPrompt: '프롬프트 보기 ↗', copy: '복사', copyLabel: '{code} 프롬프트 복사',
    copied: '프롬프트를 복사했습니다', copyError: '자동 복사에 실패했습니다. 상세 보기에서 프롬프트를 선택해 복사해 주세요.',
    rights: '영상과 프롬프트의 권리는 원작자에게 있습니다. 자료 정리: ', footerNote: '원본 카테고리 및 프롬프트 유지 · 영상은 원본 사이트 링크 사용',
    translationNote: '일본어·한국어 제목은 기계 번역입니다.',
  },
};

export function normalizeLanguage(value) {
  const language = String(value || '').toLowerCase().split('-')[0];
  return Object.hasOwn(LANGUAGES, language) ? language : 'zh';
}

export function t(language, key, values = {}) {
  return (MESSAGES[normalizeLanguage(language)][key] ?? MESSAGES.en[key] ?? key)
    .replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

export function categoryName(key, language) {
  return key === 'all' ? t(language, 'all') : CATEGORY_NAMES[key]?.[normalizeLanguage(language)] || key;
}

export function itemTitle(item, language, titles = {}) {
  return item.title[language] || titles[item.slug]?.[language] || item.title.en || item.title.zh;
}
