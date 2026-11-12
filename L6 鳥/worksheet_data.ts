// worksheet_data.ts
// 國中國文二上 第六課 梁實秋〈鳥〉學習單完整核心題庫資料

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
  target: string;
  stem: string;
  options: string[]; // 4 options, index 0 is always correct answer in definition, will be shuffled in display
  correctIndex: number; // 0
  explanation: string;
}

export interface SimilarGroup {
  groupId: number;
  basePart: string;
  chars: {
    char: string;
    zhuyin: string;
    radical: string;
    meaning: string;
    words: string[];
    sampleSentence: string;
    blankSentence: string;
  }[];
}

// ==========================================
// 1. 詞語一（8 組核心生活識字詞）
// ==========================================
export const WORDS1_DATA: Word1Item[] = [
  {
    id: 1,
    word: "鳥",
    zhuyin: "ㄋㄧㄠˇ",
    radical: "鳥部（11畫）",
    struct: "獨體字（象形）",
    quote: "我愛鳥。",
    quoteBlank: "我愛（　　）。",
    example: "下雨天，小鳥躲在樹上。",
    exampleBlank: "下雨天，小（　　）躲在樹上。",
    clue: "脊椎動物，體表被覆羽毛，前肢特化為翼，大部分會飛。",
    img: "assets/images/詞語一/鳥.svg"
  },
  {
    id: 2,
    word: "我",
    zhuyin: "ㄨㄛˇ",
    radical: "戈部（7畫）",
    struct: "左右合體（丿＋手＋戈）",
    quote: "我感覺興味的不是那人的悠閒，卻是那鳥的苦悶。",
    quoteBlank: "（　　）感覺興味的不是那人的悠閒，卻是那鳥的苦悶。",
    example: "我和父親一起住。",
    exampleBlank: "（　　）和父親一起住。",
    clue: "自稱詞，指自己本人。",
    img: "assets/images/詞語一/我.svg"
  },
  {
    id: 3,
    word: "羽毛",
    zhuyin: "ㄩˇ ㄇㄠˊ",
    radical: "羽部（6畫）／毛部（4畫）",
    struct: "羽（左右對稱）／毛（獨體）",
    quote: "有時頭上蒙著一塊皮子，羽翮不整地蜷伏著不動。",
    quoteBlank: "有時頭上蒙著一塊皮子，（　　）不整地蜷伏著不動。",
    example: "我有一根羽毛，好漂亮。",
    exampleBlank: "我有一根（　　），好漂亮。",
    clue: "鳥類身上覆蓋的毛，質輕而韌，有保暖、飛行等功能。",
    img: "assets/images/詞語一/羽毛.svg"
  },
  {
    id: 4,
    word: "白",
    zhuyin: "ㄅㄞˊ",
    radical: "白部（5畫）",
    struct: "獨體字",
    quote: "有時候稻田裡佇立著一隻白鷺，拳著一條腿，縮著頸子。",
    quoteBlank: "有時候稻田裡佇立著一隻（　　）鷺，拳著一條腿，縮著頸子。",
    example: "池塘裡開著白蓮花。",
    exampleBlank: "池塘裡開著（　　）蓮花。",
    clue: "像雪、日光一樣的顏色，與「黑」相對。",
    img: "assets/images/詞語一/白.svg"
  },
  {
    id: 5,
    word: "看",
    zhuyin: "ㄎㄢˋ",
    radical: "目部（9畫）",
    struct: "上下結構（手＋目）",
    quote: "在白晝，聽不到鳥鳴，但是看得見鳥的形體。",
    quoteBlank: "在白晝，聽不到鳥鳴，但是（　　）得見鳥的形體。",
    example: "我看到那裡有小鳥。",
    exampleBlank: "我（　　）到那裡有小鳥。",
    clue: "用眼睛觀察或欣賞。",
    img: "assets/images/詞語一/看.svg"
  },
  {
    id: 6,
    word: "飛",
    zhuyin: "ㄈㄟ",
    radical: "飛部（9畫）",
    struct: "獨體字（象形）",
    quote: "牠倏地振翅飛去，牠像虹似地一下就消逝了。",
    quoteBlank: "牠倏地振翅（　　）去，牠像虹似地一下就消逝了。",
    example: "小鳥在天空自由地飛。",
    exampleBlank: "小鳥在天空自由地（　　）。",
    clue: "鳥類、昆蟲在空中乘風移動前進。",
    img: "assets/images/詞語一/飛.svg"
  },
  {
    id: 7,
    word: "叫",
    zhuyin: "ㄐㄧㄠˋ",
    radical: "口部（5畫）",
    struct: "左右結構（口＋丩）",
    quote: "一直等到夜晚，才又聽到杜鵑叫，由遠叫到近。",
    quoteBlank: "一直等到夜晚，才又聽到杜鵑（　　），由遠叫到近。",
    example: "樹上的小鳥吱吱叫。",
    exampleBlank: "樹上的小鳥吱吱（　　）。",
    clue: "動物發出聲音，或人用口呼喊。",
    img: "assets/images/詞語一/叫.svg"
  },
  {
    id: 8,
    word: "有",
    zhuyin: "ㄧㄡˇ",
    radical: "月部（6畫）",
    struct: "上下結構（𠂇＋月）",
    quote: "世界上的生物，沒有比鳥更俊俏的。",
    quoteBlank: "樹上（　　）可愛的小鳥在跳躍。",
    example: "樹上有可愛的小鳥。",
    exampleBlank: "樹上（　　）可愛的小鳥。",
    clue: "存在、具備、擁有，與「無」相對。",
    img: "assets/images/詞語一/有.svg"
  }
];

// ==========================================
// 2. 詞語二（16 組課文重點詞語）
// ==========================================
export const WORDS2_DATA: Word2Item[] = [
  {
    id: 1,
    word: "蹓躂",
    targetChar: "蹓",
    targetZhuyin: "ㄌㄧㄡˋ",
    fullZhuyin: "ㄌㄧㄡˋ ㄉㄚ˙",
    radicalInfo: "足部（蹓18畫）",
    quoteText: "清早在街上蹓躂",
    quoteStem: "清早在街上「蹓」躂",
    quoteCharStem: "清早在街上「ㄌㄧㄡˋ」躂",
    quoteBlankSentence: "清早在街上（　　）躂",
    clue: "散步、閒逛。"
  },
  {
    id: 2,
    word: "胳膊",
    targetChar: "膊",
    targetZhuyin: "ㄅㄛˊ",
    fullZhuyin: "ㄍㄜ ㄅㄛˊ",
    radicalInfo: "肉部（膊14畫）",
    quoteText: "胳膊上架著的鷹",
    quoteStem: "胳「膊」上架著的鷹",
    quoteCharStem: "胳「ㄅㄛˊ」上架著的鷹",
    quoteBlankSentence: "胳（　　）上架著的鷹",
    clue: "肩膀以下、手腕以上的部位。"
  },
  {
    id: 3,
    word: "羽翮",
    targetChar: "翮",
    targetZhuyin: "ㄍㄜˊ",
    fullZhuyin: "ㄩˇ ㄍㄜˊ",
    radicalInfo: "羽部（翮16畫）",
    quoteText: "羽翮不整地蜷伏著不動",
    quoteStem: "羽「翮」不整地蜷伏著不動",
    quoteCharStem: "羽「ㄏㄜˊ」不整地蜷伏著不動",
    quoteBlankSentence: "羽（　　）不整地蜷伏著不動",
    clue: "鳥類羽毛的莖管，借指羽毛。"
  },
  {
    id: 4,
    word: "蜷伏",
    targetChar: "蜷",
    targetZhuyin: "ㄑㄩㄢˊ",
    fullZhuyin: "ㄑㄩㄢˊ ㄈㄨˊ",
    radicalInfo: "虫部（蜷14畫）",
    quoteText: "蜷伏著不動",
    quoteStem: "「蜷」伏著不動",
    quoteCharStem: "「ㄑㄩㄢˊ」伏著不動",
    quoteBlankSentence: "（　　）伏著不動",
    clue: "彎曲著身體。"
  },
  {
    id: 5,
    word: "瞵視昂藏",
    targetChar: "瞵",
    targetZhuyin: "ㄌㄧㄣˊ",
    fullZhuyin: "ㄌㄧㄣˊ ㄕˋ ㄤˊ ㄘㄤˊ",
    radicalInfo: "目部（瞵17畫）",
    quoteText: "哪裡有半點瞵視昂藏的神氣",
    quoteStem: "哪裡有半點「瞵」視昂藏的神氣",
    quoteCharStem: "哪裡有半點「ㄌㄧㄣˊ」視昂藏的神氣",
    quoteBlankSentence: "哪裡有半點（　　）視昂藏的神氣",
    clue: "左顧右盼、神采飛揚的樣子。"
  },
  {
    id: 6,
    word: "盤踞",
    targetChar: "踞",
    targetZhuyin: "ㄐㄩˋ",
    fullZhuyin: "ㄆㄢˊ ㄐㄩˋ",
    radicalInfo: "足部（踞15畫）",
    quoteText: "看牠高踞枝頭，臨風顧盼",
    quoteStem: "看牠高「踞」枝頭，臨風顧盼",
    quoteCharStem: "看牠高「ㄐㄩˋ」枝頭，臨風顧盼",
    quoteBlankSentence: "看牠高（　　）枝頭，臨風顧盼",
    clue: "蹲、坐，這裡指高高停駐盤佔。"
  },
  {
    id: 7,
    word: "穠纖合度",
    targetChar: "穠",
    targetZhuyin: "ㄋㄨㄥˊ",
    fullZhuyin: "ㄋㄨㄥˊ ㄒㄧㄢ ㄏㄜˊ ㄉㄨˋ",
    radicalInfo: "禾部（穠18畫）",
    quoteText: "那樣地穠纖合度",
    quoteStem: "那樣地「穠」纖合度",
    quoteCharStem: "那樣地「ㄋㄨㄥˊ」纖合度",
    quoteBlankSentence: "那樣地（　　）纖合度",
    clue: "大小肥瘦都恰到好處。穠，肥胖。"
  },
  {
    id: 8,
    word: "乾癟",
    targetChar: "癟",
    targetZhuyin: "ㄅㄧㄝˇ",
    fullZhuyin: "ㄍㄢ ㄅㄧㄝˇ",
    radicalInfo: "疒部（癟19畫）",
    quoteText: "細瘦而不乾癟",
    quoteStem: "細瘦而不乾「癟」",
    quoteCharStem: "細瘦而不乾「ㄅㄧㄝˇ」",
    quoteBlankSentence: "細瘦而不乾（　　）",
    clue: "枯瘦、凹陷不飽滿。"
  },
  {
    id: 9,
    word: "釉綠",
    targetChar: "釉",
    targetZhuyin: "ㄧㄡˋ",
    fullZhuyin: "ㄧㄡˋ ㄌㄩˋ",
    radicalInfo: "采部（釉12畫）",
    quoteText: "釉綠的梯田",
    quoteStem: "「釉」綠的梯田",
    quoteCharStem: "「ㄧㄡˋ」綠的梯田",
    quoteBlankSentence: "（　　）綠的梯田",
    clue: "油亮的綠色。"
  },
  {
    id: 10,
    word: "窗櫺",
    targetChar: "櫺",
    targetZhuyin: "ㄌㄧㄥˊ",
    fullZhuyin: "ㄔㄨㄤ ㄌㄧㄥˊ",
    radicalInfo: "木部（櫺21畫）",
    quoteText: "伏在窗櫺上的雀兒的映影",
    quoteStem: "伏在窗「櫺」上的雀兒的映影",
    quoteCharStem: "伏在窗「ㄌㄧㄥˊ」上的雀兒的映影",
    quoteBlankSentence: "伏在窗（　　）上的雀兒的映影",
    clue: "窗上雕刻有格子圖紋的木框。"
  },
  {
    id: 11,
    word: "鴟梟",
    targetChar: "鴟",
    targetZhuyin: "ㄔ",
    fullZhuyin: "ㄔ ㄒㄧㄠ",
    radicalInfo: "鳥部（鴟16畫）",
    quoteText: "鴟梟的怪叫",
    quoteStem: "「鴟」梟的怪叫",
    quoteCharStem: "「ㄔ」梟的怪叫",
    quoteBlankSentence: "（　　）梟的怪叫",
    clue: "貓頭鷹一類的鳥，常發出怪叫聲。"
  },
  {
    id: 12,
    word: "曳著長尾巴",
    targetChar: "曳",
    targetZhuyin: "ㄧˋ",
    fullZhuyin: "ㄧˋ ㄓㄜ˙ ㄔㄤˊ ㄨㄟˇ ㄅㄚ",
    radicalInfo: "曰部（曳6畫）",
    quoteText: "有的曳著長長的尾巴",
    quoteStem: "有的「曳」著長長的尾巴",
    quoteCharStem: "有的「ㄧˋ」著長長的尾巴",
    quoteBlankSentence: "有的（　　）著長長的尾巴",
    clue: "拖著。"
  },
  {
    id: 13,
    word: "翹著長喙",
    targetChar: "喙",
    targetZhuyin: "ㄏㄨㄟˋ",
    fullZhuyin: "ㄑㄧㄠˊ ㄓㄜ˙ ㄔㄤˊ ㄏㄨㄟˋ",
    radicalInfo: "口部（喙12畫）",
    quoteText: "有的翹著尖尖的長喙",
    quoteStem: "有的翹著尖尖的長「喙」",
    quoteCharStem: "有的翹著尖尖的長「ㄏㄨㄟˋ」",
    quoteBlankSentence: "有的翹著尖尖的長（　　）",
    clue: "鳥嘴。"
  },
  {
    id: 14,
    word: "斑斕的花彩",
    targetChar: "斕",
    targetZhuyin: "ㄌㄢˊ",
    fullZhuyin: "ㄅㄢ ㄌㄢˊ ㄉㄜ˙ ㄏㄨㄚ ㄘㄞˇ",
    radicalInfo: "文部（斕21畫）",
    quoteText: "閃露一下斑斕的花彩",
    quoteStem: "閃露一下斑「斕」的花彩",
    quoteCharStem: "閃露一下斑「ㄌㄢˊ」的花彩",
    quoteBlankSentence: "閃露一下斑（　　）的花彩",
    clue: "形容花紋鮮麗，光彩奪目。"
  },
  {
    id: 15,
    word: "白鷺",
    targetChar: "鷺",
    targetZhuyin: "ㄌㄨˋ",
    fullZhuyin: "ㄅㄞˊ ㄌㄨˋ",
    radicalInfo: "鳥部（鷺24畫）",
    quoteText: "一行白鷺上青天",
    quoteStem: "一行白「鷺」上青天",
    quoteCharStem: "一行白「ㄌㄨˋ」上青天",
    quoteBlankSentence: "一行白（　　）上青天",
    clue: "羽毛潔白的水鳥。"
  },
  {
    id: 16,
    word: "黛青的山色",
    targetChar: "黛",
    targetZhuyin: "ㄉㄞˋ",
    fullZhuyin: "ㄉㄞˋ ㄑㄧㄥ ㄉㄜ˙ ㄕㄢ ㄙㄜˋ",
    radicalInfo: "黑部（黛17畫）",
    quoteText: "背後還襯著黛青的山色",
    quoteStem: "背後還襯著「黛」青的山色",
    quoteCharStem: "背後還襯著「ㄉㄞˋ」青的山色",
    quoteBlankSentence: "背後還襯著（　　）青的山色",
    clue: "青黑色。"
  }
];

// ==========================================
// 3. 解釋（22 則課文正式注釋）
// ==========================================
export const NOTES_DATA: NoteItem[] = [
  { id: 1, word: "羽翮", zhuyin: "ㄩˇ ㄏㄜˊ", explain: "指羽毛。翮，鳥類羽毛的莖管。", quote: "羽翮不整地蜷伏著不動" },
  { id: 2, word: "蜷伏", zhuyin: "ㄑㄩㄢˊ ㄈㄨˊ", explain: "彎曲著身體。", quote: "羽翮不整地蜷伏著不動" },
  { id: 3, word: "瞵視昂藏", zhuyin: "ㄌㄧㄣˊ ㄕˋ ㄤˊ ㄘㄤˊ", explain: "左顧右盼、神采飛揚的樣子。瞵，注視。昂藏，神采飛揚。", quote: "哪裡有半點瞵視昂藏的神氣？" },
  { id: 4, word: "搏扶搖而直上", zhuyin: "ㄅㄛˊ ㄈㄨˊ ㄧㄠˊ ㄦˊ ㄓˊ ㄕㄤˋ", explain: "拍著翅膀，乘著旋風向天空飛去。", quote: "如果想要「搏扶搖而直上」，便要撞頭碰壁。" },
  { id: 5, word: "呱呱", zhuyin: "ㄍㄨㄚ ㄍㄨㄚ", explain: "形容烏鴉的叫聲。", quote: "不是呱呱噪啼的烏鴉" },
  { id: 6, word: "市聲鼎沸", zhuyin: "ㄕˋ ㄕㄥ ㄉㄧㄥˇ ㄈㄟˋ", explain: "形容市街上的喧譁聲，像鼎裡的水沸騰起來一樣。", quote: "等到旭日高升，市聲鼎沸，鳥就沉默了" },
  { id: 7, word: "客夜", zhuyin: "ㄎㄜˋ ㄧㄝˋ", explain: "到其他地方作客的夜晚。", quote: "客夜聞此，說不出的酸楚！" },
  { id: 8, word: "酸楚", zhuyin: "ㄙㄨㄢ ㄔㄨˇ", explain: "辛酸悲苦。", quote: "客夜聞此，說不出的酸楚！" },
  { id: 9, word: "曳", zhuyin: "ㄧˋ", explain: "拖。", quote: "有的曳著長長的尾巴" },
  { id: 10, word: "翹", zhuyin: "ㄑㄧㄠˊ", explain: "向上舉起。", quote: "有的翹著尖尖的長喙" },
  { id: 11, word: "喙", zhuyin: "ㄏㄨㄟˋ", explain: "鳥嘴。", quote: "有的翹著尖尖的長喙" },
  { id: 12, word: "照眼", zhuyin: "ㄓㄠˋ ㄧㄢˇ", explain: "耀眼醒目。", quote: "胸襟上帶著一塊照眼的顏色" },
  { id: 13, word: "斑斕", zhuyin: "ㄅㄢ ㄌㄢˊ", explain: "形容花紋鮮麗，光彩奪目。", quote: "閃露一下斑斕的花彩" },
  { id: 14, word: "乾癟", zhuyin: "ㄍㄢ ㄅㄧㄝˇ", explain: "枯瘦、不飽滿。", quote: "細瘦而不乾癟" },
  { id: 15, word: "豐腴", zhuyin: "ㄈㄥ ㄩˊ", explain: "豐滿圓潤。", quote: "豐腴而不臃腫" },
  { id: 16, word: "穠纖合度", zhuyin: "ㄋㄨㄥˊ ㄒㄧㄢ ㄏㄜˊ ㄉㄨˋ", explain: "大小肥瘦都恰到好處。穠，肥胖。", quote: "增一分則太肥那樣地穠纖合度" },
  { id: 17, word: "踞", zhuyin: "ㄐㄩˋ", explain: "蹲、坐，這裡有居高盤佔之意。", quote: "看牠高踞枝頭，臨風顧盼" },
  { id: 18, word: "一行白鷺上青天", zhuyin: "ㄧˋ ㄏㄤˊ ㄅㄞˊ ㄌㄨˋ ㄕㄤˋ ㄑㄧㄥ ㄊㄧㄢ", explain: "語出杜甫絕句，描繪成群白鷺飛向青天之景致。", quote: "有時候「一行白鷺上青天」" },
  { id: 19, word: "黛", zhuyin: "ㄉㄞˋ", explain: "青黑色。", quote: "背後還襯著黛青的山色" },
  { id: 20, word: "釉綠", zhuyin: "ㄧㄡˋ ㄌㄩˋ", explain: "油亮的綠色。釉，使瓷器發亮的塗料。", quote: "釉綠的梯田" },
  { id: 21, word: "煙突", zhuyin: "ㄧㄢ ㄊㄨ", explain: "煙囪。", quote: "一群麻雀擠在簷下的煙突旁邊取暖" },
  { id: 22, word: "鼓噪", zhuyin: "ㄍㄨˇ ㄗㄠˋ", explain: "喧譁吵鬧。", quote: "寒鴉在古木上鼓噪" }
];

// ==========================================
// 4. 解釋單選題（精選 15 題，排版 A4 雙面 1 張紙）
// ==========================================
export const NOTES_MCQ_DATA: McqItem[] = [
  {
    id: 1,
    target: "羽翮",
    stem: "課文中「羽翮不整」的「羽翮」是指鳥類的什麼部位？",
    options: ["羽毛", "鳥嘴", "腳爪", "尾巴"],
    correctIndex: 0,
    explanation: "「羽翮」借指羽毛。翮，鳥類羽毛的莖管。"
  },
  {
    id: 2,
    target: "蜷伏",
    stem: "「蜷伏」一詞在課文中的意思為何？",
    options: ["彎曲著身體", "展翅高飛", "昂首挺胸", "四處跳躍"],
    correctIndex: 0,
    explanation: "「蜷伏」指彎曲著身體臥倒不動。"
  },
  {
    id: 3,
    target: "瞵視昂藏",
    stem: "下列何者最能形容「瞵視昂藏」的神采？",
    options: ["左顧右盼、神采飛揚", "垂頭喪氣、萎靡不振", "小心翼翼、膽小怯懦", "驚慌失措、四處逃竄"],
    correctIndex: 0,
    explanation: "「瞵視昂藏」形容左顧右盼、神采飛揚的樣子。瞵，注視；昂藏，神采飛揚。"
  },
  {
    id: 4,
    target: "搏扶搖而直上",
    stem: "「搏扶搖而直上」這句成語中的「搏」字，其意思為何？",
    options: ["拍擊翅膀", "爭取奪取", "互相搏鬥", "廣博博學"],
    correctIndex: 0,
    explanation: "「搏」在此指拍擊翅膀。整句形容拍打翅膀乘著旋風向天空高飛。"
  },
  {
    id: 5,
    target: "市聲鼎沸",
    stem: "「等到旭日高升，市聲鼎沸」句中的「市聲鼎沸」形容何種情景？",
    options: ["市街上的喧譁聲極其熱鬧", "廚房裡的水煮滾沸騰", "市場裡空無一人十分安靜", "森林裡的鳥鳴清脆嘹亮"],
    correctIndex: 0,
    explanation: "「市聲鼎沸」形容市街上的喧鬧人聲像水在鼎中沸騰一樣吵雜熱鬧。"
  },
  {
    id: 6,
    target: "客夜",
    stem: "作者說「客夜聞此，說不出的酸楚」，其中的「客夜」是指何時？",
    options: ["作客他鄉的夜晚", "邀請客人來訪的夜晚", "觀賞鳥類的黃昏", "四川黎明的早晨"],
    correctIndex: 0,
    explanation: "「客夜」指旅居、作客他鄉的夜晚，常引發遊子的思鄉情懷。"
  },
  {
    id: 7,
    target: "喙",
    stem: "「翹著尖尖的長喙」中的「喙」是指鳥類的哪一個器官？",
    options: ["鳥嘴", "翅膀", "眼睛", "腳掌"],
    correctIndex: 0,
    explanation: "「喙」專指鳥類的嘴部。"
  },
  {
    id: 8,
    target: "斑斕",
    stem: "「閃露一下斑斕的花彩」中的「斑斕」，形容何種視覺感受？",
    options: ["花紋鮮麗，光彩奪目", "顏色單調，灰暗無光", "閃爍微弱，難以看清", "潔白無瑕，純淨清爽"],
    correctIndex: 0,
    explanation: "「斑斕」形容花紋色彩鮮麗絢爛、光彩奪目。"
  },
  {
    id: 9,
    target: "乾癟",
    stem: "文中形容鳥體「細瘦而不乾癟」，「乾癟」的意思為何？",
    options: ["枯瘦、凹陷不飽滿", "肥胖臃腫", "健壯結實", "輕巧靈活"],
    correctIndex: 0,
    explanation: "「乾癟」指枯瘦、乾枯萎縮而不飽滿。"
  },
  {
    id: 10,
    target: "穠纖合度",
    stem: "「減一分則太瘦，增一分則太肥那樣地穠纖合度」在此形容鳥的什麼特點？",
    options: ["身材胖瘦大小恰到好處", "羽毛顏色斑斕艷麗", "飛行速度極其敏捷", "鳴叫聲清脆圓潤"],
    correctIndex: 0,
    explanation: "「穠纖合度」形容身材胖瘦適中，恰到好處。穠，肥胖；纖，細瘦。"
  },
  {
    id: 11,
    target: "高踞",
    stem: "「看牠高踞枝頭」的「踞」字，在此是什麼意思？",
    options: ["蹲、坐，盤踞停駐", "恐懼害怕", "快速跳躍", "張開翅膀"],
    correctIndex: 0,
    explanation: "「踞」指蹲或坐，此處形容鳥兒高高停駐盤佔在樹枝頭上。"
  },
  {
    id: 12,
    target: "黛青",
    stem: "「背後還襯著黛青的山色」，「黛」原本是指古代婦女用來畫眉的青黑色礦物，在此借指何種顏色？",
    options: ["青黑色", "鮮黃色", "淡粉色", "翠綠色"],
    correctIndex: 0,
    explanation: "「黛」是青黑色。"
  },
  {
    id: 13,
    target: "釉綠",
    stem: "「釉綠的梯田」中的「釉」，其本義與特色為何？",
    options: ["塗在陶瓷表面燒製後發亮的藥料", "種植稻米的天然肥料", "大雨過後的泥濘積水", "梯田邊緣堆砌的石塊"],
    correctIndex: 0,
    explanation: "「釉」是塗在陶器或瓷器上，經高溫燒製後會發出油亮光澤的藥料，「釉綠」即形容油亮翠綠。"
  },
  {
    id: 14,
    target: "煙突",
    stem: "「一群麻雀擠在簷下的煙突旁邊取暖」，「煙突」是指生活中的什麼設施？",
    options: ["煙囪", "火爐", "瓦斯管", "屋頂雨棚"],
    correctIndex: 0,
    explanation: "「煙突」即是煙囪。"
  },
  {
    id: 15,
    target: "鼓噪",
    stem: "「黃昏時偶爾還聽見寒鴉在古木上鼓噪」中的「鼓噪」，意思是：",
    options: ["喧譁吵鬧", "敲擊鼓聲", "安靜沉睡", "哀傷哭泣"],
    correctIndex: 0,
    explanation: "「鼓噪」指喧譁吵鬧。"
  }
];

// ==========================================
// 5. 相似字（4 大組形音義伸展秀）
// ==========================================
export const SIMILAR_DATA: SimilarGroup[] = [
  {
    groupId: 1,
    basePart: "冊",
    chars: [
      {
        char: "柵",
        zhuyin: "ㄓㄢˋ",
        radical: "木部（9畫）",
        meaning: "用竹木、鐵條等做成阻攔人畜通行的欄杆。",
        words: ["柵欄", "木柵"],
        sampleSentence: "動物園四周都設有堅固的柵欄。",
        blankSentence: "大華跨越（　　）欄時不小心扭傷腳踝。"
      },
      {
        char: "跚",
        zhuyin: "ㄕㄢ",
        radical: "足部（12畫）",
        meaning: "走路緩慢、不靈活的樣子（常連用為「蹣跚」）。",
        words: ["步履蹣跚", "蹣跚"],
        sampleSentence: "老爺爺步履蹣跚地在公園散步。",
        blankSentence: "他扭傷了腳，走起路來步履蹣（　　）。"
      },
      {
        char: "珊",
        zhuyin: "ㄕㄢ",
        radical: "玉部（9畫）",
        meaning: "衰減消沉（闌珊）；或指海洋生物珊瑚。",
        words: ["意興闌珊", "珊瑚"],
        sampleSentence: "燈火闌珊的夜色顯得格外迷人。",
        blankSentence: "弟弟對學圍棋意興闌（　　），缺乏動力。"
      },
      {
        char: "姍",
        zhuyin: "ㄕㄢ",
        radical: "女部（8畫）",
        meaning: "形容走路從容緩慢的樣子（常連用為「姍姍」）。",
        words: ["姍姍來遲", "姍姍"],
        sampleSentence: "會議都快結束了，他才姍姍來遲。",
        blankSentence: "上課鐘響了很久，他才（　　）（　　）來遲。"
      }
    ]
  },
  {
    groupId: 2,
    basePart: "臾",
    chars: [
      {
        char: "腴",
        zhuyin: "ㄩˊ",
        radical: "肉部（13畫）",
        meaning: "豐滿圓潤；或指土地肥沃。",
        words: ["豐腴", "膏腴"],
        sampleSentence: "鳥的身軀細瘦而不乾癟，豐腴而不臃腫。",
        blankSentence: "春雨過後，這片荒地變成了膏（　　）沃野。"
      },
      {
        char: "諛",
        zhuyin: "ㄩˊ",
        radical: "言部（16畫）",
        meaning: "曲意奉承討好他人。",
        words: ["阿諛", "諛詞"],
        sampleSentence: "他為人正直，從不向長官阿諛奉承。",
        blankSentence: "為爭取職位高升，他對長官極為阿（　　）奉承。"
      },
      {
        char: "臾",
        zhuyin: "ㄩˊ",
        radical: "臼部（8畫）",
        meaning: "片刻、極短的時間（常連用為「須臾」）。",
        words: ["須臾", "頃臾"],
        sampleSentence: "魔術師手一揮，須臾之間鴿子就飛了出來。",
        blankSentence: "仙女魔法棒輕輕一揮，須（　　）間沙漠變成綠洲。"
      }
    ]
  },
  {
    groupId: 3,
    basePart: "黃",
    chars: [
      {
        char: "簧",
        zhuyin: "ㄏㄨㄤˊ",
        radical: "竹部（18畫）",
        meaning: "樂器中振動發聲的薄片；或有彈力的機件（彈簧）。",
        words: ["彈簧", "巧舌如簧"],
        sampleSentence: "鳥兒跳盪得那樣輕靈，腳上像是有彈簧。",
        blankSentence: "他巧舌如（　　），把大家都說得心服口服。"
      },
      {
        char: "潢",
        zhuyin: "ㄏㄨㄤˊ",
        radical: "水部（15畫）",
        meaning: "裝飾建築或修補字畫。",
        words: ["裝潢", "裝潢一新"],
        sampleSentence: "新家經過設計師精心裝潢後，顯得寬敞明亮。",
        blankSentence: "我終於答應重新裝（　　）老舊的房子。"
      },
      {
        char: "磺",
        zhuyin: "ㄏㄨㄤˊ",
        radical: "石部（17畫）",
        meaning: "一種黃色固體礦物（硫磺）。",
        words: ["硫磺", "硫磺溫泉"],
        sampleSentence: "北投的硫磺溫泉聞名全臺。",
        blankSentence: "陽明山的硫（　　）溫泉是知名的觀光景點。"
      }
    ]
  },
  {
    groupId: 4,
    basePart: "卷/絭",
    chars: [
      {
        char: "拳",
        zhuyin: "ㄑㄩㄢˊ",
        radical: "手部（10畫）",
        meaning: "手指屈握成團狀；或曲彎肢體。",
        words: ["拳頭", "拳著腿"],
        sampleSentence: "白鷺佇立在稻田裡，拳著一條腿，縮著頸子。",
        blankSentence: "紅鶴在池邊（　　）著一條腿休息，姿態優雅。"
      },
      {
        char: "眷",
        zhuyin: "ㄐㄩㄢˋ",
        radical: "目部（11畫）",
        meaning: "思慕留戀；關心照顧；親屬家眷。",
        words: ["眷顧", "眷戀", "攜家帶眷"],
        sampleSentence: "出外打拚的遊子，心中永遠眷戀著故鄉。",
        blankSentence: "她祈求上蒼（　　）顧，讓家人平安健康。"
      },
      {
        char: "券",
        zhuyin: "ㄑㄩㄢˋ",
        radical: "刀部（8畫）",
        meaning: "可作憑證的紙票或收據。",
        words: ["彩券", "證券", "禮券"],
        sampleSentence: "這張彩券中了大獎，讓他喜出望外。",
        blankSentence: "他買了一張彩（　　），希望能夠幸運中獎。"
      },
      {
        char: "豢",
        zhuyin: "ㄏㄨㄢˋ",
        radical: "豕部（13畫）",
        meaning: "飼養家禽、牲畜或動物。",
        words: ["豢養", "豢養家畜"],
        sampleSentence: "人類豢養鳥類當寵物，往往剝奪了牠們的自由。",
        blankSentence: "動物園裡（　　）養的野生動物，受到良好照顧。"
      }
    ]
  }
];
