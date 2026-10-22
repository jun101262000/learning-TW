/**
 * 115 國文電子書 L4〈愛蓮說〉- 核心資料庫 (課文注釋、生字詞語、相似字與綜合評量題庫)
 * 提煉自翰林版備課用書「課文注釋（P64～65）」與課文補充，收錄本課正式注釋 15 則
 * 支援三層視覺階梯法：原句大字 ➔ 單字拆解氣泡膠囊 ➔ 白話語譯與君子象徵
 */

const LESSON_NOTES_DATABASE = [
  {
    id: 1,
    term: '蕃',
    zhuyin: 'ㄈㄢˊ',
    quote: '水陸草木之花，可愛者甚「蕃」。',
    formalDef: '通「繁」，眾多。',
    breakdowns: [
      { char: '蕃', pinyin: 'ㄈㄢˊ', def: '通「繁」，眾多、繁盛' },
      { char: '甚蕃', pinyin: 'ㄕㄣˋ ㄈㄢˊ', def: '非常多（甚＝很、非常）' }
    ],
    vernacular: '水中、陸地上各種草木的花，值得喜愛的非常多。',
    symbolism: '以普天下眾多花卉總起全文，帶出世人各有偏好，作為後文襯托蓮花的鋪墊。'
  },
  {
    id: 2,
    term: '李唐',
    zhuyin: 'ㄌㄧˇ ㄊㄤˊ',
    quote: '自「李唐」來，世人盛愛牡丹。',
    formalDef: '唐代由李淵建國，故稱李唐。',
    breakdowns: [
      { char: '李', pinyin: 'ㄌㄧˇ', def: '唐朝開國君主李淵的姓氏' },
      { char: '唐', pinyin: 'ㄊㄤˊ', def: '朝代國號（唐朝）' }
    ],
    vernacular: '自從唐朝以來，世上的人們非常喜愛牡丹花。',
    symbolism: '牡丹花容華貴，唐人風氣崇尚富麗，在此以世人盛愛牡丹反襯作者獨鍾蓮花。'
  },
  {
    id: 3,
    term: '出淤泥而不染',
    zhuyin: 'ㄔㄨ ㄩ ㄋㄧˊ ㄦˊ ㄅㄨˋ ㄖㄢˇ',
    quote: '予獨愛蓮之「出淤泥而不染」。',
    formalDef: '指蓮花由水底的爛泥中長出，卻不受汙染。',
    breakdowns: [
      { char: '淤泥', pinyin: 'ㄩ ㄋㄧˊ', def: '池底沉積阻塞的爛泥（比喻惡劣環境）' },
      { char: '染', pinyin: 'ㄖㄢˇ', def: '沾染、汙染' },
      { char: '而不染', pinyin: 'ㄦˊ ㄅㄨˋ ㄖㄢˇ', def: '卻不受汙染（而＝卻，轉折詞）' }
    ],
    vernacular: '我唯獨喜愛蓮花從水底爛泥長出，卻不被汙泥沾染。',
    symbolism: '象徵君子處身於惡劣濁世或誘惑環境中，依然能夠潔身自愛、不同流合汙。'
  },
  {
    id: 4,
    term: '濯清漣而不妖',
    zhuyin: 'ㄓㄨㄛˊ ㄑㄧㄥ ㄌㄧㄢˊ ㄦˊ ㄅㄨˋ ㄧㄠ',
    quote: '「濯清漣而不妖」，中通外直。',
    formalDef: '指蓮花生長於清水中卻不妖媚。',
    breakdowns: [
      { char: '濯', pinyin: 'ㄓㄨㄛˊ', def: '洗滌、沖洗' },
      { char: '清漣', pinyin: 'ㄑㄧㄥ ㄌㄧㄢˊ', def: '清澈的水波（借指清水）' },
      { char: '漣', pinyin: 'ㄌㄧㄢˊ', def: '水面上被風吹起細小的波紋' },
      { char: '妖', pinyin: 'ㄧㄠ', def: '妖豔、妖媚媚俗' }
    ],
    vernacular: '在清澈的水波中洗滌過，卻不顯得妖媚俗氣。',
    symbolism: '象徵君子品格端莊雅致、行事光明磊落，不逢迎媚世、不取巧討好他人。'
  },
  {
    id: 5,
    term: '中通外直',
    zhuyin: 'ㄓㄨㄥ ㄊㄨㄥ ㄨㄞˋ ㄓˊ',
    quote: '「中通外直」，不蔓不枝。',
    formalDef: '花梗中空，外表挺直。',
    breakdowns: [
      { char: '中通', pinyin: 'ㄓㄨㄥ ㄊㄨㄥ', def: '蓮花花梗中間貫通暢達（中空）' },
      { char: '外直', pinyin: 'ㄨㄞˋ ㄓˊ', def: '花梗外表挺拔筆直' }
    ],
    vernacular: '（蓮花的花梗）內部中空通達，外表挺拔筆直。',
    symbolism: '象徵君子內心通達明理、虛懷若谷；對外立身行事正直方正，不偏不倚。'
  },
  {
    id: 6,
    term: '不蔓不枝',
    zhuyin: 'ㄅㄨˊ ㄇㄢˋ ㄅㄨˋ ㄓ',
    quote: '中通外直，「不蔓不枝」。',
    formalDef: '不蔓延細莖，不旁生枝條。',
    breakdowns: [
      { char: '蔓', pinyin: 'ㄇㄢˋ', def: '名詞作動詞用，長出細蔓纏繞' },
      { char: '枝', pinyin: 'ㄓ', def: '名詞作動詞用，旁生枝條' }
    ],
    vernacular: '不蔓延攀附細莖，也不雜亂旁生枝條。',
    symbolism: '象徵君子品性端正獨立，不逢迎攀附權貴豪門，也不結黨營私搞小團體。'
  },
  {
    id: 7,
    term: '益',
    zhuyin: 'ㄧˋ',
    quote: '香遠「益」清，亭亭淨植。',
    formalDef: '更加。',
    breakdowns: [
      { char: '益', pinyin: 'ㄧˋ', def: '更加、越發' },
      { char: '益清', pinyin: 'ㄧˋ ㄑㄧㄥ', def: '更加顯得清新幽香' }
    ],
    vernacular: '香氣飄散得越遠，聞起來反而更加清幽芬芳。',
    symbolism: '象徵君子的醇厚美德與高尚名聲能流芳遠播、為人千古稱頌傳揚。'
  },
  {
    id: 8,
    term: '亭亭淨植',
    zhuyin: 'ㄊㄧㄥˊ ㄊㄧㄥˊ ㄐㄧㄥˋ ㄓˊ',
    quote: '香遠益清，「亭亭淨植」。',
    formalDef: '高挺而潔淨地直立在水中。',
    breakdowns: [
      { char: '亭亭', pinyin: 'ㄊㄧㄥˊ ㄊㄧㄥˊ', def: '聳立、挺拔端莊的樣子' },
      { char: '淨', pinyin: 'ㄐㄧㄥˋ', def: '潔淨無暇' },
      { char: '植', pinyin: 'ㄓˊ', def: '直立、挺立' }
    ],
    vernacular: '潔淨而高挺地端直挺立在水池中央。',
    symbolism: '象徵君子卓然獨立、風骨崚嶒，展現堅定不移的高尚節操。'
  },
  {
    id: 9,
    term: '褻玩焉',
    zhuyin: 'ㄒㄧㄝˋ ㄨㄢˊ ㄧㄢ',
    quote: '可遠觀而不可「褻玩焉」。',
    formalDef: '以輕慢的態度接近玩弄。',
    breakdowns: [
      { char: '褻', pinyin: 'ㄒㄧㄝˋ', def: '輕慢、輕浮不莊重' },
      { char: '玩', pinyin: 'ㄨㄢˊ', def: '玩弄、折摘戲弄' },
      { char: '焉', pinyin: 'ㄧㄢ', def: '句末語助詞，指它（蓮花）' }
    ],
    vernacular: '只可以從遠處觀賞，卻不容許用輕慢輕浮的態度隨意接近玩弄。',
    symbolism: '象徵君子儀表堂堂、莊重端肅，具有令人敬佩的威嚴，不容許他人輕薄侮慢。'
  },
  {
    id: 10,
    term: '謂',
    zhuyin: 'ㄨㄟˋ',
    quote: '予「謂」：菊，花之隱逸者也。',
    formalDef: '認為。',
    breakdowns: [
      { char: '予謂', pinyin: 'ㄩˊ ㄨㄟˋ', def: '我認為（予＝我，周敦頤自稱）' },
      { char: '謂', pinyin: 'ㄨㄟˋ', def: '評定、以為、評論' }
    ],
    vernacular: '我認為：菊花，是花中的隱士。',
    symbolism: '作者由描繪蓮花轉入議論抒懷，親自對三種花所象徵的人格特質進行評價。'
  },
  {
    id: 11,
    term: '隱逸者',
    zhuyin: 'ㄧㄣˇ ㄧˋ ㄓㄜˇ',
    quote: '菊，花之「隱逸者」也。',
    formalDef: '隱居的高士。',
    breakdowns: [
      { char: '隱逸', pinyin: 'ㄧㄣˇ ㄧˋ', def: '隱退避世、歸隱山林不作官' },
      { char: '者', pinyin: 'ㄓㄜˇ', def: '代詞，「……的人」' }
    ],
    vernacular: '菊花，是花中的隱居避世高士。',
    symbolism: '菊花在秋霜中綻放，象徵不與世俗爭榮、安貧樂道的高士典型（如陶淵明）。'
  },
  {
    id: 12,
    term: '噫',
    zhuyin: 'ㄧˋ',
    quote: '「噫」！菊之愛，陶後鮮有聞。',
    formalDef: '表示感嘆的語氣，相當於白話的「唉」。',
    breakdowns: [
      { char: '噫', pinyin: 'ㄧˋ', def: '文言嘆詞（音同意），相當於「唉！」' }
    ],
    vernacular: '唉！喜愛菊花的清高隱士，自從陶淵明之後就很少聽說了。',
    symbolism: '作者發出一聲深沉嘆息，為下文感嘆君子知音難尋做情感上的有力鋪墊。'
  },
  {
    id: 13,
    term: '菊之愛',
    zhuyin: 'ㄐㄩˊ ㄓ ㄞˋ',
    quote: '噫！「菊之愛」，陶後鮮有聞。',
    formalDef: '愛菊（的人）。',
    breakdowns: [
      { char: '之', pinyin: 'ㄓ', def: '助詞，賓語提前的結構標誌（愛菊➔菊之愛）' },
      { char: '菊之愛', pinyin: 'ㄐㄩˊ ㄓ ㄞˋ', def: '喜愛菊花這件事，借指喜愛菊花的高潔之人' }
    ],
    vernacular: '對於菊花的這份喜愛與情懷。',
    symbolism: '借花喻人，文法倒裝結構強調了「愛菊之人」的特殊情操。'
  },
  {
    id: 14,
    term: '鮮',
    zhuyin: 'ㄒㄧㄢˇ',
    quote: '陶後「鮮」有聞。',
    formalDef: '少。',
    breakdowns: [
      { char: '鮮', pinyin: 'ㄒㄧㄢˇ', def: '讀三聲ㄒㄧㄢˇ，少、罕見、少有' },
      { char: '鮮有聞', pinyin: 'ㄒㄧㄢˇ ㄧㄡˇ ㄨㄣˊ', def: '很少聽說過（聞＝聽說）' }
    ],
    vernacular: '在陶淵明之後，就很少有聽聞了。',
    symbolism: '感嘆像陶淵明那樣不慕名利的隱士已經非常稀少，更暗示像自己一樣守道之君子更為罕見。'
  },
  {
    id: 15,
    term: '宜乎',
    zhuyin: 'ㄧˊ ㄏㄨ',
    quote: '牡丹之愛，「宜乎」眾矣！',
    formalDef: '應當。',
    breakdowns: [
      { char: '宜', pinyin: 'ㄧˊ', def: '應當、理所當然（這裡含有難怪之意）' },
      { char: '乎', pinyin: 'ㄏㄨ', def: '語助詞，無義' },
      { char: '眾矣', pinyin: 'ㄓㄨㄥˋ ㄧˇ', def: '人數很多啊！（矣＝感嘆助詞）' }
    ],
    vernacular: '喜愛牡丹的追求富貴之人，理所當然是很多了！',
    symbolism: '筆調委婉含蓄，表面說理所當然，實則微言大義，感嘆世人隨波逐流追逐功名利祿。'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LESSON_NOTES_DATABASE };
}
