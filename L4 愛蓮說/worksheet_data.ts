// worksheet_data.ts
// 國中國文二上 第四課〈愛蓮說〉學習單完整核心題庫資料

export interface Word1Item {
  id: number;
  word: string;
  zhuyin: string;
  radical: string;
  struct: string;
  quote: string;
  quoteBlank: string;
  example: string;
  exampleBlank: string;
  clue: string;
  img: string;
}

export interface VirtueItem {
  id: number;
  quote: string;
  virtue: string;
  explain: string;
}

export interface Word2Item {
  id: number;
  word: string;
  targetChar: string;
  targetZhuyin: string;
  fullZhuyin: string;
  radicalInfo: string;
  quoteText: string;
  quoteStem: string; // 依題目寫注音
  quoteCharStem: string; // 依題目寫國字
  quoteBlankSentence: string;
  exampleBlankSentence: string;
  clue: string;
}

export interface NoteItem {
  id: number;
  word: string;
  zhuyin: string;
  explain: string;
  quote: string;
}

export interface McqItem {
  id: number;
  category: "詞義考核" | "君子美德";
  target: string;
  stem: string;
  options: string[]; // 4 options, index 0 is always correct answer in definition, will be shuffled in display
  correctIndex: number; // 0
  explanation: string;
}

// ==========================================
// 1. 詞語一（識字量低組 7 組詞語）
// ==========================================
export const WORDS1_DATA: Word1Item[] = [
  {
    id: 1,
    word: "愛",
    zhuyin: "ㄞˋ",
    radical: "心部（13畫）",
    struct: "上中下（爫＋冖＋心＋夊）",
    quote: "晉陶淵明獨愛菊；自李唐來，世人盛愛牡丹；予獨愛蓮之出淤泥而不染。",
    quoteBlank: "予獨（　　）蓮之出淤泥而不染。",
    example: "我們要愛護大自然，也珍惜身邊每一個關心我們的人。",
    exampleBlank: "我們要（　　）護大自然，也珍惜身邊每一個關心我們的人。",
    clue: "心裡喜歡、疼惜、欣賞某人事物。",
    img: "assets/images/w1_1.jpg"
  },
  {
    id: 2,
    word: "蓮花",
    zhuyin: "ㄌㄧㄢˊ ㄏㄨㄚ",
    radical: "艸部（蓮15畫/花8畫）",
    struct: "上下結構（艹＋連）",
    quote: "予獨愛蓮之出淤泥而不染，濯清漣而不妖……蓮，花之君子者也。",
    quoteBlank: "予獨愛（　　）之出淤泥而不染，象徵品格高潔的君子。",
    example: "夏天到了，池塘裡的蓮花一朵朵盛開，散發出淡淡的清香。",
    exampleBlank: "夏天到了，池塘裡的（　　）一朵朵盛開，散發出淡淡的清香。",
    clue: "生在池塘水中的多年生草本植物，象徵品德高潔的君子。",
    img: "assets/images/w1_2.jpg"
  },
  {
    id: 3,
    word: "說",
    zhuyin: "ㄕㄨㄛ",
    radical: "言部（14畫）",
    struct: "左右結構（言＋兌）",
    quote: "篇名〈愛蓮說〉：周敦頤寫這篇文章，用來說明自己喜愛蓮花的道理。",
    quoteBlank: "課文篇名〈愛蓮（　　）〉，代表闡述喜愛蓮花道理的文章。",
    example: "老師在課堂上說了一個關於周敦頤欣賞蓮花的故事。",
    exampleBlank: "老師在課堂上（　　）了一個關於周敦頤欣賞蓮花的故事。",
    clue: "用話語表達講述；古代用來說明事理的文體。",
    img: "assets/images/w1_3.jpg"
  },
  {
    id: 4,
    word: "淤泥",
    zhuyin: "ㄩ ㄋㄧˊ",
    radical: "水部（淤11畫/泥8畫）",
    struct: "左右結構（氵＋於 / 氵＋尼）",
    quote: "予獨愛蓮之出淤泥而不染。",
    quoteBlank: "予獨愛蓮之出（　　）而不染。",
    example: "蓮花雖然長在池塘底部的淤泥裡，開出來的花朵卻依然潔白乾淨。",
    exampleBlank: "蓮花雖然長在池塘底部的（　　）裡，開出來的花朵卻依然潔白乾淨。",
    clue: "水底沉積的爛泥，在課文中比喻汙濁惡劣的環境。",
    img: "assets/images/w1_4.jpg"
  },
  {
    id: 5,
    word: "洗濯",
    zhuyin: "ㄒㄧˇ ㄓㄨㄛˊ",
    radical: "水部（洗9畫/濯17畫）",
    struct: "左右結構（氵＋先 / 氵＋翟）",
    quote: "濯清漣而不妖。（蓮花在清澈的水波中洗滌過後，不顯妖豔。）",
    quoteBlank: "蓮花在清澈的水波中（　　）過後，卻不會顯得妖豔媚俗。",
    example: "午後的一場陣雨，把庭院裡的樹葉洗濯得一塵不染。",
    exampleBlank: "午後的一場陣雨，把庭院裡的樹葉（　　）得一塵不染。",
    clue: "洗滌、用清水沖洗乾淨。",
    img: "assets/images/w1_5.jpg"
  },
  {
    id: 6,
    word: "菊花",
    zhuyin: "ㄐㄩˊ ㄏㄨㄚ",
    radical: "艸部（菊12畫/花8畫）",
    struct: "上下結構（艹＋匊）",
    quote: "晉陶淵明獨愛菊……予謂：菊，花之隱逸者也。",
    quoteBlank: "晉陶淵明獨愛（　　），作者認為它象徵不慕名利的隱逸者。",
    example: "秋天到了，公園裡金黃色的菊花盛開，非常美麗。",
    exampleBlank: "秋天到了，公園裡金黃色的（　　）盛開，非常美麗。",
    clue: "秋天盛開耐寒的花，陶淵明最愛，象徵不慕名利的隱士。",
    img: "assets/images/w1_6.jpg"
  },
  {
    id: 7,
    word: "牡丹",
    zhuyin: "ㄇㄨˇ ㄉㄢ",
    radical: "牛部7畫 ＋ 丶部4畫",
    struct: "左右（牜＋土） / 獨體",
    quote: "自李唐來，世人盛愛牡丹……牡丹，花之富貴者也。",
    quoteBlank: "自李唐來，世人盛愛（　　），作者認為它是「花之富貴者也」。",
    example: "牡丹的花朵又大又鮮豔，從唐朝開始就受到許多人喜愛。",
    exampleBlank: "（　　）的花朵又大又鮮豔，從唐朝開始就受到許多人喜愛。",
    clue: "花朵碩大華麗，唐人盛愛，課文中象徵追求富貴名利之人。",
    img: "assets/images/w1_7.jpg"
  }
];

// ==========================================
// 2. 課文名句與君子美德配對（10 組）
// ==========================================
export const VIRTUE_DATA: VirtueItem[] = [
  { id: 1, quote: "予獨愛蓮之出淤泥而不染", virtue: "潔身自愛", explain: "身處惡劣汙濁環境，依然保持純潔高尚、不同流合汙。" },
  { id: 2, quote: "濯清漣而不妖", virtue: "端莊雅致", explain: "立身光明磊落，端莊持重，不逢迎媚世、不取巧討好他人。" },
  { id: 3, quote: "中通外直", virtue: "豁達正直", explain: "內心通達明理、虛懷若谷；行為方正正直、不偏不倚。" },
  { id: 4, quote: "不蔓不枝", virtue: "特立獨行", explain: "品性端正獨立，不逢迎攀附權貴豪門，也不結黨營私搞小團體。" },
  { id: 5, quote: "香遠益清", virtue: "美德遠播", explain: "醇厚美德與高尚名聲能流芳遠播、為人千古稱頌傳揚。" },
  { id: 6, quote: "亭亭淨植", virtue: "卓然獨立", explain: "風骨崚嶒、高潔端直，展現堅定不移的高尚守道節操。" },
  { id: 7, quote: "可遠觀而不可褻玩焉", virtue: "莊重威嚴", explain: "儀表堂堂、莊重端肅，具令人敬畏之威儀，不容輕慢侮弄。" },
  { id: 8, quote: "菊，花之隱逸者也", virtue: "隱士高風", explain: "不與世俗爭榮、安貧樂道、超然遠引的高士典型（陶淵明）。" },
  { id: 9, quote: "牡丹，花之富貴者也", virtue: "世俗名利", explain: "追求榮華富貴、隨俗浮沉的世俗之人（反襯君子的高潔）。" },
  { id: 10, quote: "蓮，花之君子者也", virtue: "有德君子", explain: "兼具高尚德行、處事中道、自尊自愛的完美人格典範（周敦頤）。" }
];

// ==========================================
// 3. 詞語二（重點詞語 15 組）
// ==========================================
export const WORDS2_DATA: Word2Item[] = [
  {
    id: 1,
    word: "解頤",
    targetChar: "頤",
    targetZhuyin: "ㄧˊ",
    fullZhuyin: "ㄐㄧㄝˇ ㄧˊ",
    radicalInfo: "頁部（16畫），左臣右頁",
    quoteText: "令人解頤",
    quoteStem: "令人解「頤」",
    quoteCharStem: "令人解「ㄧˊ」",
    quoteBlankSentence: "濂溪先生為人風趣幽默，談吐常令人解（　　）。",
    exampleBlankSentence: "爺爺說了一個生動逗趣的笑話，逗得大家開懷解（　　）。",
    clue: "鬆開臉頰開懷大笑。"
  },
  {
    id: 2,
    word: "濂溪先生",
    targetChar: "濂",
    targetZhuyin: "ㄌㄧㄢˊ",
    fullZhuyin: "ㄌㄧㄢˊ ㄒㄧ ㄒㄧㄢ ㄕㄥ",
    radicalInfo: "水部（16畫），左氵右廉",
    quoteText: "濂溪先生周敦頤",
    quoteStem: "「濂」溪先生",
    quoteCharStem: "「ㄌㄧㄢˊ」溪先生",
    quoteBlankSentence: "（　　）溪先生周敦頤寫下〈愛蓮說〉，說明喜愛蓮花的操守。",
    exampleBlankSentence: "後世學者尊稱周敦頤為（　　）溪先生，開創了理學思想。",
    clue: "周敦頤的別號。"
  },
  {
    id: 3,
    word: "淤泥",
    targetChar: "淤",
    targetZhuyin: "ㄩ",
    fullZhuyin: "ㄩ ㄋㄧˊ",
    radicalInfo: "水部（11畫），左氵右於",
    quoteText: "出淤泥而不染",
    quoteStem: "出「淤」泥而不染",
    quoteCharStem: "出「ㄩ」泥而不染",
    quoteBlankSentence: "予獨愛蓮之出（　　）泥而不染。",
    exampleBlankSentence: "工人叔叔頂著烈日，努力清理河道底部堆積的（　　）泥。",
    clue: "池底爛泥，音同「迂」（勿寫成瘀）。"
  },
  {
    id: 4,
    word: "洗濯",
    targetChar: "濯",
    targetZhuyin: "ㄓㄨㄛˊ",
    fullZhuyin: "ㄒㄧˇ ㄓㄨㄛˊ",
    radicalInfo: "水部（17畫），左氵右翟",
    quoteText: "濯清漣而不妖",
    quoteStem: "洗「濯」乾淨",
    quoteCharStem: "洗「ㄓㄨㄛˊ」乾淨",
    quoteBlankSentence: "蓮花在清澈的水波中洗（　　）過後，潔淨而不顯妖豔。",
    exampleBlankSentence: "媽媽將剛採收的新鮮青菜仔細洗（　　）乾淨。",
    clue: "洗滌、沖洗乾淨。"
  },
  {
    id: 5,
    word: "清漣",
    targetChar: "漣",
    targetZhuyin: "ㄌㄧㄢˊ",
    fullZhuyin: "ㄑㄧㄥ ㄌㄧㄢˊ",
    radicalInfo: "水部（14畫），左氵右連",
    quoteText: "濯清漣而不妖",
    quoteStem: "濯清「漣」而不妖",
    quoteCharStem: "濯清「ㄌㄧㄢˊ」而不妖",
    quoteBlankSentence: "濯清（　　）而不妖，中通外直。",
    exampleBlankSentence: "微風吹拂過水面，湖面上泛起了一圈圈美麗的清（　　）。",
    clue: "清澈水波，漣漪。"
  },
  {
    id: 6,
    word: "亭亭淨植",
    targetChar: "植",
    targetZhuyin: "ㄓˊ",
    fullZhuyin: "ㄊㄧㄥˊ ㄊㄧㄥˊ ㄐㄧㄥˋ ㄓˊ",
    radicalInfo: "木部（12畫），左木右直",
    quoteText: "亭亭淨植",
    quoteStem: "亭亭淨「植」",
    quoteCharStem: "亭亭淨「ㄓˊ」",
    quoteBlankSentence: "香遠益清，亭亭淨（　　），可遠觀而不可褻玩焉。",
    exampleBlankSentence: "池塘中央的荷花亭亭淨（　　），顯得十分端莊優雅。",
    clue: "高挺潔淨地立在水中。"
  },
  {
    id: 7,
    word: "花梗",
    targetChar: "梗",
    targetZhuyin: "ㄍㄥˇ",
    fullZhuyin: "ㄏㄨㄚ ㄍㄥˇ",
    radicalInfo: "木部（11畫），左木右更",
    quoteText: "花梗中通外直",
    quoteStem: "花「梗」挺拔",
    quoteCharStem: "花「ㄍㄥˇ」挺拔",
    quoteBlankSentence: "蓮花的花（　　）內部中空、外表挺直，象徵君子正直的氣節。",
    exampleBlankSentence: "這枝康乃馨的花（　　）非常翠綠挺拔，適合插在花瓶裡。",
    clue: "植物枝莖、枝柄。"
  },
  {
    id: 8,
    word: "不蔓不枝",
    targetChar: "蔓",
    targetZhuyin: "ㄇㄢˋ",
    fullZhuyin: "ㄅㄨˊ ㄇㄢˋ ㄅㄨˋ ㄓ",
    radicalInfo: "艸部（15畫），上艹下曼",
    quoteText: "中通外直，不蔓不枝",
    quoteStem: "不「蔓」不枝",
    quoteCharStem: "不「ㄇㄢˋ」不枝",
    quoteBlankSentence: "中通外直，不（　　）不枝，比喻君子不攀附權貴。",
    exampleBlankSentence: "爬山虎的細（　　）順著牆壁向上蔓延生長。",
    clue: "不蔓延細莖，比喻不攀附權貴。"
  },
  {
    id: 9,
    word: "褻玩",
    targetChar: "褻",
    targetZhuyin: "ㄒㄧㄝˋ",
    fullZhuyin: "ㄒㄧㄝˋ ㄨㄢˊ",
    radicalInfo: "衣部（17畫），衣包夾執",
    quoteText: "不可褻玩焉",
    quoteStem: "不可「褻」玩",
    quoteCharStem: "不可「ㄒㄧㄝˋ」玩",
    quoteBlankSentence: "蓮花高雅端莊，可遠觀而不可（　　）玩焉。",
    exampleBlankSentence: "文物古蹟應當好好珍惜保護，絕不可隨意觸摸（　　）玩。",
    clue: "輕慢不莊重地玩弄。"
  },
  {
    id: 10,
    word: "隱逸",
    targetChar: "逸",
    targetZhuyin: "ㄧˋ",
    fullZhuyin: "ㄧㄣˇ ㄧˋ",
    radicalInfo: "辵部（11畫），免＋辶",
    quoteText: "花之隱逸者也",
    quoteStem: "隱「逸」之士",
    quoteCharStem: "隱「ㄧˋ」之士",
    quoteBlankSentence: "予謂：菊，花之隱（　　）者也。",
    exampleBlankSentence: "陶淵明不慕名利，辭官歸隱，是歷史上著名的隱（　　）高士。",
    clue: "隱居避世的高士。"
  },
  {
    id: 11,
    word: "噫",
    targetChar: "噫",
    targetZhuyin: "ㄧˋ",
    fullZhuyin: "ㄧˋ",
    radicalInfo: "口部（16畫），左口右意",
    quoteText: "噫！菊之愛，陶後鮮有聞",
    quoteStem: "「噫」！感嘆之詞",
    quoteCharStem: "「ㄧˋ」！感嘆之詞",
    quoteBlankSentence: "（　　）！菊之愛，陶後鮮有聞。蓮之愛，同予者何人？",
    exampleBlankSentence: "（　　）！這件事情真是令人感到無比惋惜與感慨啊！",
    clue: "文言嘆詞，音同意，表感慨。"
  },
  {
    id: 12,
    word: "甚蕃",
    targetChar: "蕃",
    targetZhuyin: "ㄈㄢˊ",
    fullZhuyin: "ㄕㄣˋ ㄈㄢˊ",
    radicalInfo: "艸部（16畫），上艹下番",
    quoteText: "可愛者甚蕃",
    quoteStem: "可愛者甚「蕃」",
    quoteCharStem: "可愛者甚「ㄈㄢˊ」",
    quoteBlankSentence: "水陸草木之花，可愛者甚（　　）。",
    exampleBlankSentence: "春天到了，國家公園裡的花草樹木種類繁多、草木甚（　　）。",
    clue: "音ㄈㄢˊ（通繁），眾多。"
  },
  {
    id: 13,
    word: "牡丹花",
    targetChar: "牡",
    targetZhuyin: "ㄇㄨˇ",
    fullZhuyin: "ㄇㄨˇ ㄉㄢ ㄏㄨㄚ",
    radicalInfo: "牛部（7畫），左牜右土",
    quoteText: "世人盛愛牡丹",
    quoteStem: "「牡」丹富貴",
    quoteCharStem: "「ㄇㄨˇ」丹富貴",
    quoteBlankSentence: "自李唐來，世人盛愛（　　）丹花。",
    exampleBlankSentence: "（　　）丹花朵色彩豔麗，自古以來被視為繁榮富貴的象徵。",
    clue: "不可誤寫成木部的杜。"
  },
  {
    id: 14,
    word: "予獨愛蓮",
    targetChar: "予",
    targetZhuyin: "ㄩˊ",
    fullZhuyin: "ㄩˊ ㄉㄨˊ ㄞˋ ㄌㄧㄢˊ",
    radicalInfo: "亅部（4畫）",
    quoteText: "予獨愛蓮之出淤泥而不染",
    quoteStem: "「予」獨愛蓮",
    quoteCharStem: "「ㄩˊ」獨愛蓮",
    quoteBlankSentence: "（　　）獨愛蓮之出淤泥而不染，濯清漣而不妖。",
    exampleBlankSentence: "「（　　）取予求」讀ㄩˇ，文言文中「（　　）」讀ㄩˊ，指我。",
    clue: "第一人稱「我」讀 ㄩˊ。"
  },
  {
    id: 15,
    word: "鮮有聞",
    targetChar: "鮮",
    targetZhuyin: "ㄒㄧㄢˇ",
    fullZhuyin: "ㄒㄧㄢˇ ㄧㄡˇ ㄨㄣˊ",
    radicalInfo: "魚部（17畫），左魚右羊",
    quoteText: "陶後鮮有聞",
    quoteStem: "陶後「鮮」有聞",
    quoteCharStem: "陶後「ㄒㄧㄢˇ」有聞",
    quoteBlankSentence: "菊之愛，陶後（　　）有聞。",
    exampleBlankSentence: "他平時深居簡出，在公開場合（　　）少發表自己的看法。",
    clue: "作「少」時讀 ㄒㄧㄢˇ。"
  }
];

// ==========================================
// 4. 解釋配合題（全課 15 則注釋詞義）
// ==========================================
export const NOTES_DATA: NoteItem[] = [
  { id: 1, word: "蕃", zhuyin: "ㄈㄢˊ", explain: "通「繁」，眾多。", quote: "水陸草木之花，可愛者甚「蕃」。" },
  { id: 2, word: "李唐", zhuyin: "ㄌㄧˇ ㄊㄤˊ", explain: "唐代由李淵建國，故稱李唐。", quote: "自「李唐」來，世人盛愛牡丹。" },
  { id: 3, word: "出淤泥而不染", zhuyin: "ㄔㄨ ㄩ ㄋㄧˊ ㄦˊ ㄅㄨˋ ㄖㄢˇ", explain: "指蓮花由水底的爛泥中長出，卻不受汙染。", quote: "予獨愛蓮之「出淤泥而不染」。" },
  { id: 4, word: "濯清漣而不妖", zhuyin: "ㄓㄨㄛˊ ㄑㄧㄥ ㄌㄧㄢˊ ㄦˊ ㄅㄨˋ ㄧㄠ", explain: "指蓮花生長於清水中卻不妖媚。", quote: "「濯清漣而不妖」，中通外直。" },
  { id: 5, word: "中通外直", zhuyin: "ㄓㄨㄥ ㄊㄨㄥ ㄨㄞˋ ㄓˊ", explain: "花梗中空，外表挺直。", quote: "「中通外直」，不蔓不枝。" },
  { id: 6, word: "不蔓不枝", zhuyin: "ㄅㄨˋ ㄇㄢˋ ㄅㄨˋ ㄓ", explain: "不蔓延細莖，不旁生枝條。", quote: "中通外直，「不蔓不枝」。" },
  { id: 7, word: "益", zhuyin: "ㄧˋ", explain: "更加。", quote: "香遠「益」清，亭亭淨植。" },
  { id: 8, word: "亭亭淨植", zhuyin: "ㄊㄧㄥˊ ㄊㄧㄥˊ ㄐㄧㄥˋ ㄓˊ", explain: "高挺而潔淨地直立在水中。", quote: "香遠益清，「亭亭淨植」。" },
  { id: 9, word: "褻玩焉", zhuyin: "ㄒㄧㄝˋ ㄨㄢˊ ㄧㄢ", explain: "以輕慢的態度接近玩弄。", quote: "可遠觀而不可「褻玩焉」。" },
  { id: 10, word: "謂", zhuyin: "ㄨㄟˋ", explain: "認為。", quote: "予「謂」：菊，花之隱逸者也。" },
  { id: 11, word: "隱逸者", zhuyin: "ㄧㄣˇ ㄧˋ ㄓㄜˇ", explain: "隱居的高士。", quote: "菊，花之「隱逸者」也。" },
  { id: 12, word: "噫", zhuyin: "ㄧˋ", explain: "表示感嘆的語氣，相當於白話的「唉」。", quote: "「噫」！菊之愛，陶後鮮有聞。" },
  { id: 13, word: "菊之愛", zhuyin: "ㄐㄩˊ ㄓ ㄞˋ", explain: "愛菊（的人）。", quote: "噫！「菊之愛」，陶後鮮有聞。" },
  { id: 14, word: "鮮", zhuyin: "ㄒㄧㄢˇ", explain: "少。", quote: "陶後「鮮」有聞。" },
  { id: 15, word: "宜乎", zhuyin: "ㄧˊ ㄏㄨ", explain: "應當。", quote: "牡丹之愛，「宜乎」眾矣！" }
];

// ==========================================
// 5. 解釋單選題庫（25 題完整題庫，每次隨機抽測 20 題）
// options[0] 為正確答案，渲染時會與干擾項一同隨機打亂
// ==========================================
export const MCQ_POOL: McqItem[] = [
  {
    id: 1,
    category: "詞義考核",
    target: "蕃",
    stem: "課文「水陸草木之花，可愛者甚蕃」中，最後一個字的意思是什麼？",
    options: ["眾多、非常多", "外國傳來的品種", "稀少罕見", "枯萎凋謝"],
    correctIndex: 0,
    explanation: "「蕃」通「繁」，意思是眾多、非常多。"
  },
  {
    id: 2,
    category: "詞義考核",
    target: "李唐",
    stem: "課文「自李唐來，世人盛愛牡丹」中，提到哪一個歷史朝代？為什麼這樣稱呼？",
    options: ["唐朝，因為開國君主李淵姓李，國號唐", "宋朝，因為皇帝喜歡吃李子", "晉朝，因為陶淵明姓李", "漢朝，因為首都種滿李樹"],
    correctIndex: 0,
    explanation: "唐代由李淵建國，皇帝姓李，故歷史上常稱為「李唐」。"
  },
  {
    id: 3,
    category: "詞義考核",
    target: "淤泥",
    stem: "課文「予獨愛蓮之出淤泥而不染」中，關於「淤泥」的解釋何者正確？",
    options: ["水底沉積黏軟的爛泥", "清澈見底的溪水", "肥沃的花盆培養土", "岸邊乾燥的沙子"],
    correctIndex: 0,
    explanation: "「淤泥」指水底沉積的爛泥，在文中比喻混濁惡劣的環境。"
  },
  {
    id: 4,
    category: "詞義考核",
    target: "濯清漣而不妖",
    stem: "課文「濯清漣而不妖」中，句中的「濯」和「清漣」分別是什麼意思？",
    options: ["洗滌；清澈的水波", "游泳；深綠色的水草", "採摘；奔流的大河", "照鏡子；細小的雨滴"],
    correctIndex: 0,
    explanation: "「濯」是洗滌、沖洗；「清漣」指清澈的水波。"
  },
  {
    id: 5,
    category: "詞義考核",
    target: "中通外直",
    stem: "課文有一句四字詞語描寫蓮花的花梗「內部中空貫通、外表挺直不彎」，請問是哪一句？",
    options: ["中通外直", "盛愛牡丹", "宜乎眾矣", "隱逸者也"],
    correctIndex: 0,
    explanation: "「中通外直」描繪蓮花花梗中空挺直，比喻君子內心通達明理、外表方正正直。"
  },
  {
    id: 6,
    category: "詞義考核",
    target: "不蔓不枝",
    stem: "課文「不蔓不枝」中的「蔓」和「枝」在此處作什麼詞性使用？意思為何？",
    options: ["都是動詞，指長出細蔓、長出旁枝", "都是名詞，指植物的細蔓與枝條", "都是形容詞，形容花朵茂盛", "都是副詞，修飾生長速度"],
    correctIndex: 0,
    explanation: "「蔓」與「枝」在此皆作動詞用，指蔓延細莖、旁生枝條。"
  },
  {
    id: 7,
    category: "詞義考核",
    target: "益",
    stem: "課文「香遠益清」的意思是「香氣傳得越遠就越清香」，句中哪一個字是「更加、越發」的意思？",
    options: ["益", "香", "遠", "清"],
    correctIndex: 0,
    explanation: "「益」在此為副詞，表示更加、越發。"
  },
  {
    id: 8,
    category: "詞義考核",
    target: "亭亭淨植",
    stem: "課文中哪一個四字詞語的意思是「高聳潔淨地挺立在水中」，形容蓮花挺拔的姿態？",
    options: ["亭亭淨植", "可愛者甚蕃", "陶後鮮有聞", "世人盛愛"],
    correctIndex: 0,
    explanation: "「亭亭淨植」形容蓮花高潔挺拔、卓然獨立於水中。"
  },
  {
    id: 9,
    category: "詞義考核",
    target: "不可褻玩焉",
    stem: "課文「可遠觀而不可褻玩焉」後半句的「不可褻玩焉」意思是什麼？",
    options: ["用輕慢、不莊重的態度去接近玩弄它", "可以隨手摘下來種在花盆裡賞玩", "站在很遠的地方大聲呼喊", "把花瓣採摘下來泡茶飲用"],
    correctIndex: 0,
    explanation: "「褻玩」是以輕慢不莊重的態度玩弄；「不可褻玩」形容君子端莊有威儀，不可輕侮。"
  },
  {
    id: 10,
    category: "詞義考核",
    target: "謂",
    stem: "課文「予謂菊，花之隱逸者也」中，其中的「謂」意思是什麼？",
    options: ["認為、以為（提出看法評論）", "害怕、擔憂恐懼", "大聲責備斥責", "悲傷嘆息"],
    correctIndex: 0,
    explanation: "「謂」在此為動詞，意思是「認為、評論說」。"
  },
  {
    id: 11,
    category: "詞義考核",
    target: "隱逸者",
    stem: "課文把菊花比喻為「隱居避世、不慕名利的高士」，請問課文使用哪一個詞語？",
    options: ["隱逸者", "富貴者", "同予者", "甚蕃者"],
    correctIndex: 0,
    explanation: "菊花在深秋獨自盛開，不與百花爭豔，故周敦頤稱其為「花之隱逸者」。"
  },
  {
    id: 12,
    category: "詞義考核",
    target: "噫",
    stem: "文末感嘆「陶後鮮有聞」之前，作者先發出一個文言嘆詞（相當於白話的「唉！」），請問這個字的正確讀音與字形為何？",
    options: ["ㄧˋ（四聲，音同「意」），寫作「噫」", "ㄧ（一聲），寫作「依」", "ㄧˊ（二聲），寫作「疑」", "ㄞˋ（四聲），寫作「愛」"],
    correctIndex: 0,
    explanation: "「噫」讀作 ㄧˋ，文言嘆詞，相當於現代口語的「唉！」，表示深切的感慨。"
  },
  {
    id: 13,
    category: "詞義考核",
    target: "菊之愛",
    stem: "文末「陶後鮮有聞」前面提到的「菊之愛」，在課文中的正確解釋是什麼？",
    options: ["對於菊花的喜愛（指像陶淵明那樣喜愛菊花的清高隱士）", "菊花愛上了荷花的花香", "種植菊花販售的花農", "每年菊花盛開的秋天季節"],
    correctIndex: 0,
    explanation: "「菊之愛」即「愛菊」，在文中代指像陶淵明一樣追求清高、隱居避世之人。"
  },
  {
    id: 14,
    category: "詞義考核",
    target: "鮮",
    stem: "課文「陶後鮮有聞」的意思是「陶淵明之後就很少聽說了」，句中表示「少」的那個字，正確讀音是什麼？",
    options: ["ㄒㄧㄢˇ（三聲）", "ㄒㄧㄢ（一聲）", "ㄒㄧㄢˋ（四聲）", "ㄇㄟˇ（三聲）"],
    correctIndex: 0,
    explanation: "「鮮」作「少」的意思時，讀為 ㄒㄧㄢˇ（如鮮為人知、寡廉鮮恥）。"
  },
  {
    id: 15,
    category: "詞義考核",
    target: "宜乎",
    stem: "課文最後一句「牡丹之愛，宜乎眾矣！」中，用來表達「理所當然、難怪」的詞語是哪一個？",
    options: ["宜乎", "甚蕃", "盛愛", "獨愛"],
    correctIndex: 0,
    explanation: "「宜乎」意思是應當、理所當然。"
  },
  {
    id: 16,
    category: "君子美德",
    target: "出淤泥而不染的美德",
    stem: "課文描寫蓮花「出淤泥而不染」，主要是象徵君子的哪一種品格美德？",
    options: ["潔身自愛，身處惡劣環境依然堅守清白、不同流合汙", "懂得離開家鄉去大城市做生意發財", "喜歡穿白色的衣服以顯得乾淨高雅", "遇到環境不好就立刻逃跑避開"],
    correctIndex: 0,
    explanation: "「淤泥」比喻混濁惡劣的環境，「不染」象徵君子潔身自愛、不同流合汙。"
  },
  {
    id: 17,
    category: "君子美德",
    target: "濯清漣而不妖的美德",
    stem: "課文以蓮花「濯清漣而不妖」，象徵君子的哪一種處世態度？",
    options: ["端莊雅致、光明磊落，不逢迎媚世也不取巧討好他人", "喜歡在清水中游泳鍛鍊強健身體", "喜歡打扮得妖豔媚俗來吸引眾人目光", "追求奢華富貴的生活方式"],
    correctIndex: 0,
    explanation: "「濯清漣而不妖」象徵君子氣度端莊穩重，不媚俗逢迎、不譁眾取寵。"
  },
  {
    id: 18,
    category: "君子美德",
    target: "中通外直的美德",
    stem: "課文「中通外直」用來比喻君子的哪一種人格特質？",
    options: ["內心通達明理、虛懷若谷；立身處世行為方正正直", "心裡藏不住祕密，到處宣揚別人的隱私", "個性固執不知變通，容易得罪朋友", "身材高大挺拔，擅長體育運動"],
    correctIndex: 0,
    explanation: "「中通」象徵君子虛懷若谷、豁達通理；「外直」象徵行為方正正直、光明磊落。"
  },
  {
    id: 19,
    category: "君子美德",
    target: "不蔓不枝的美德",
    stem: "蓮梗「不蔓不枝」不攀附其他植物、不橫生旁枝，比喻君子的哪一種品格？",
    options: ["不逢迎攀附權貴豪門、不阿諛諂媚，處世獨立端正", "喜歡組織小圈圈、結黨營私搞派系", "做事情不給自己留後路", "個性孤僻不喜歡結交朋友"],
    correctIndex: 0,
    explanation: "「不蔓不枝」象徵君子品格端方自立，不阿諛奉承、不依附權貴豪門。"
  },
  {
    id: 20,
    category: "君子美德",
    target: "香遠益清的美德",
    stem: "蓮花「香遠益清」香氣飄散得越遠越清幽，象徵君子的什麼特質？",
    options: ["醇厚美德與高尚名聲能流芳遠播、受人千古稱頌傳揚", "隨身攜帶高級香水散發香味", "喜歡居住在空氣清新的深山裡", "做飯廚藝高超，香氣飄散整條街"],
    correctIndex: 0,
    explanation: "「香遠益清」比喻君子美好的德行聲譽能流芳遠播、為人所敬仰。"
  },
  {
    id: 21,
    category: "君子美德",
    target: "亭亭淨植的美德",
    stem: "「亭亭淨植」描寫蓮花潔淨聳立在水池中央，比喻君子的何種風骨？",
    options: ["卓然獨立、風骨崚嶒，堅守高尚節操不隨俗屈服", "驕傲自滿、目中無人，看不起身邊的人", "站崗衛兵姿勢端正不搖晃", "害怕與人群接觸而選擇逃避"],
    correctIndex: 0,
    explanation: "「亭亭淨植」象徵君子卓立孤傲、堅定守道，不為世俗所動搖。"
  },
  {
    id: 22,
    category: "君子美德",
    target: "不可褻玩焉的美德",
    stem: "「可遠觀而不可褻玩焉」表現出君子哪一種令人敬仰的氣度？",
    options: ["端莊自持、威儀肅穆，令人心生敬重而不敢隨意輕慢侮弄", "態度凶惡傲慢，讓人不敢靠近說話", "躲藏在隱密的地方不願見人", "身體虛弱嬌嫩碰不得"],
    correctIndex: 0,
    explanation: "「可遠觀而不可褻玩」表現君子莊重有威儀，令人油然而生敬仰與尊重。"
  },
  {
    id: 23,
    category: "君子美德",
    target: "菊花象徵",
    stem: "周敦頤在文中把菊花喻為「花之隱逸者」，是代表哪一種人生境界？",
    options: ["不慕名利、不隨世俗沉浮，超然遠引的隱士高風", "悲觀消極、放棄生活希望的逃避心態", "貪生怕死躲避兵役的農民", "喜歡在秋天賞花品茶的富貴人家"],
    correctIndex: 0,
    explanation: "陶淵明「採菊東籬下，悠然見南山」，菊花代表安貧樂道、超然物外的隱士情操。"
  },
  {
    id: 24,
    category: "君子美德",
    target: "牡丹象徵與反襯",
    stem: "文中寫「世人盛愛牡丹」，作者以牡丹象徵「富貴者」，在文章結構中起到什麼作用？",
    options: ["反襯世人普遍追逐功名利祿，更凸顯蓮花君子品格之難能可貴", "讚美唐朝社會經濟繁榮昌盛、百姓富裕", "說明作者自己也想種植牡丹花發財", "批評牡丹花的花瓣長得不夠漂亮"],
    correctIndex: 0,
    explanation: "作者以牡丹的富貴熱鬧，反襯出世俗之人多追逐名利，藉以烘托蓮花君子人格的高尚。"
  },
  {
    id: 25,
    category: "君子美德",
    target: "蓮花君子總結",
    stem: "周敦頤在《愛蓮說》中將蓮花譽為「花之君子者也」，「君子」最核心的精神內涵是什麼？",
    options: ["身處世俗濁浪與誘惑中，依然能堅持道義、自重自愛的高尚品格", "家財萬貫、社會地位非常崇高", "飽讀詩書且必須在朝廷做大官考上狀元", "隱居深山老林，永遠不與任何人群接觸交流"],
    correctIndex: 0,
    explanation: "君子入世而不染世，既能處於濁世之中，又能保持方正自愛、中通外直的完美人格。"
  }
];
