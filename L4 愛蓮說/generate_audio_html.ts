// generate_audio_html.ts
import { WORDS1_DATA, VIRTUE_DATA, WORDS2_DATA, NOTES_DATA, MCQ_POOL } from "./worksheet_data.ts";

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let m = result.length;
  let s = seed;
  const nextRandom = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  while (m) {
    const i = Math.floor(nextRandom() * m--);
    const t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
}

const OUTPUT_DIR = "c:/Users/user/Documents/115國文電子書/L4 愛蓮說/學習單/有聲網頁";

// 共用語音播報與外觀樣式
const COMMON_CSS = `
  :root {
    --primary: #0284c7;
    --primary-dark: #0369a1;
    --primary-light: #e0f2fe;
    --accent: #f59e0b;
    --accent-red: #dc2626;
    --bg-page: #f8fafc;
    --card-bg: #ffffff;
    --text-main: #0f172a;
    --border-color: #cbd5e1;
    --font-size: 16pt;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "DFKai-SB", "標楷體", "Noto Sans TC", sans-serif;
    background-color: var(--bg-page);
    color: var(--text-main);
    font-size: var(--font-size);
    line-height: 1.7;
    padding: 16px 12px 80px 12px;
  }
  .container { max-width: 960px; margin: 0 auto; }
  
  /* 頂部固定操作列 */
  header.top-bar {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #ffffff;
    border: 2px solid #bae6fd;
    border-radius: 12px;
    padding: 12px 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .top-title { font-size: 18pt; font-weight: 700; color: #0369a1; }
  .top-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 14px;
    font-size: 14pt;
    font-family: inherit;
    font-weight: 600;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #334155;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .btn:hover { background: #f1f5f9; }
  .btn.primary { background: #0284c7; color: #ffffff; border-color: #0284c7; }
  .btn.primary:hover { background: #0369a1; }
  .btn.accent { background: #f59e0b; color: #ffffff; border-color: #d97706; }
  .btn.danger { background: #ef4444; color: #ffffff; border-color: #dc2626; }
  .btn.active { background: #0284c7; color: #ffffff; }

  /* 語音按鈕微型化 */
  .btn-speak {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    font-size: 12pt;
    font-family: inherit;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    cursor: pointer;
    margin: 2px 4px;
    vertical-align: middle;
    transition: background 0.15s;
  }
  .btn-speak:hover { background: #bae6fd; }

  /* 卷別切換標籤 */
  .tab-nav {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 8px;
  }
  .tab-btn {
    padding: 8px 24px;
    font-size: 16pt;
    font-family: inherit;
    font-weight: 700;
    border-radius: 8px 8px 0 0;
    border: 2px solid #cbd5e1;
    border-bottom: none;
    background: #e2e8f0;
    color: #475569;
    cursor: pointer;
  }
  .tab-btn.active {
    background: #ffffff;
    color: #0284c7;
    border-color: #0284c7;
    box-shadow: 0 -2px 6px rgba(0,0,0,0.05);
  }

  /* 題目卡片 */
  .section-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .section-header {
    border-left: 6px solid #0284c7;
    padding-left: 12px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .section-title { font-size: 17pt; font-weight: 700; color: #1e3a8a; }
  .section-badge {
    background: #fef3c7;
    color: #92400e;
    font-size: 12pt;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 600;
  }

  .item-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 12px;
    position: relative;
  }
  .item-box:hover { border-color: #cbd5e1; }
  .item-title { font-weight: 600; color: #0f172a; margin-bottom: 6px; }
  .item-details { font-size: 14pt; color: #475569; margin-bottom: 6px; }

  /* 選項網格 */
  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 8px;
    margin-top: 8px;
  }
  .option-pill {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* 雙欄排版 */
  .two-col-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 640px) {
    .two-col-container { grid-template-columns: 1fr; }
  }

  /* 解答顯示狀態控制 */
  .teacher-answer {
    color: var(--accent-red);
    font-weight: bold;
    display: none;
    margin-top: 4px;
    padding: 4px 8px;
    background: #fef2f2;
    border-radius: 4px;
    border-left: 4px solid var(--accent-red);
  }
  body.show-answers .teacher-answer { display: block; }
  body.large-font { --font-size: 20pt; }
`;

const COMMON_JS = `
  let synth = window.speechSynthesis;
  let currentUtterance = null;
  let speechRate = 1.0;

  function setRate(rate, btn) {
    speechRate = rate;
    document.querySelectorAll('.rate-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function speakText(text) {
    if (!synth) {
      alert("您的瀏覽器不支援語音合成！");
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "zh-TW";
    utter.rate = speechRate;
    synth.speak(utter);
  }

  function stopSpeech() {
    if (synth) synth.cancel();
  }

  function toggleAnswers() {
    document.body.classList.toggle('show-answers');
    const btn = document.getElementById('btnToggleAns');
    if (document.body.classList.contains('show-answers')) {
      btn.innerText = "👁️ 隱藏答案";
      btn.classList.add('accent');
    } else {
      btn.innerText = "👁️ 顯示解答";
      btn.classList.remove('accent');
    }
  }

  function toggleFontSize() {
    document.body.classList.toggle('large-font');
  }

  function switchTab(verKey) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.getElementById('btnTab_' + verKey).classList.add('active');
    document.getElementById('tabContent_' + verKey).style.display = 'block';
  }

  // 自動根據網址參數 ?v=A / ?v=B / ?v=C 切換
  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const ver = params.get('v') || 'A';
    switchTab(ver);
  });
`;

// ==========================================
// 1. 產生 詞語一學習單 有聲網頁
// ==========================================
function buildWords1Html(): string {
  const versions = [
    { key: "A", name: "卷 A", seed: 1013 },
    { key: "B", name: "卷 B", seed: 2027 },
    { key: "C", name: "卷 C", seed: 3041 }
  ];

  let tabButtons = "";
  let tabContents = "";

  versions.forEach((v, vIdx) => {
    const activeClass = vIdx === 0 ? "active" : "";
    tabButtons += `<button id="btnTab_${v.key}" class="tab-btn ${activeClass}" onclick="switchTab('${v.key}')">${v.name}</button>`;

    // 隨機重排
    const shuffledChoices = seededShuffle(WORDS1_DATA, v.seed + 11);
    const choiceLetters = ["A", "B", "C", "D", "E", "F", "G"];
    const choiceMap = new Map<number, string>();
    shuffledChoices.forEach((item, idx) => choiceMap.set(item.id, choiceLetters[idx]));

    const shuffledQ2 = seededShuffle(WORDS1_DATA, v.seed + 22);
    const shuffledQ3 = seededShuffle(WORDS1_DATA, v.seed + 33);
    const shuffledQ4 = seededShuffle(WORDS1_DATA, v.seed + 44);
    const shuffledQ5 = seededShuffle(WORDS1_DATA, v.seed + 55);
    const shuffledVirtueChoices = seededShuffle(VIRTUE_DATA, v.seed + 66);
    const vLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const virtueLetterMap = new Map<number, string>();
    shuffledVirtueChoices.forEach((item, idx) => virtueLetterMap.set(item.id, vLetters[idx]));
    const shuffledVirtueQ = seededShuffle(VIRTUE_DATA, v.seed + 77);

    let contentHtml = `<div id="tabContent_${v.key}" class="tab-content" style="${vIdx === 0 ? '' : 'display:none;'}">`;

    // 題型一：詞語習寫 (Page 1)
    contentHtml += `
      <section class="section-card" id="${v.key}-p1">
        <div class="section-header">
          <div class="section-title">題型一：詞語精熟習寫（7組詞語）</div>
          <span class="section-badge">第 1 頁 / 詞語習寫</span>
        </div>
        <p style="margin-bottom:12px; color:#64748b;">依學習區順序排列，點擊按鈕可聽正確讀音與生字部首結構口訣：</p>
    `;
    WORDS1_DATA.forEach((w) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            <span style="font-size:18pt; color:#1e3a8a;">${w.id}. ${w.word}</span>
            <span style="color:#0284c7; margin-left:8px;">（${w.zhuyin}）</span>
            <button class="btn-speak" onclick="speakText('${w.word}，注音：${w.zhuyin}')">🔊 聽發音</button>
            <button class="btn-speak" onclick="speakText('${w.word}，${w.radical}，${w.struct}。${w.clue}')">🔊 聽部首與釋義</button>
          </div>
          <div class="item-details">
            部首筆畫：${w.radical} ｜ 結構拆解：${w.struct}<br>
            詞義重點：${w.clue}
          </div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型二：看圖填詞配合題 (Page 2)
    contentHtml += `
      <section class="section-card" id="${v.key}-p2">
        <div class="section-header">
          <div class="section-title">題型二：看圖填寫字詞（配合題模式）</div>
          <span class="section-badge">第 2 頁 / 看圖配合題</span>
        </div>
        <div style="background:#f1f5f9; padding:10px 14px; border-radius:8px; margin-bottom:14px;">
          <strong>【詞語選項參考庫】：</strong><br>
          ${shuffledChoices.map((c, idx) => `(${choiceLetters[idx]}) ${c.word}（${c.zhuyin}）`).join(" ｜ ")}
        </div>
    `;
    shuffledQ2.forEach((q, idx) => {
      const letter = choiceMap.get(q.id)!;
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            第 ${idx + 1} 題
            <button class="btn-speak" onclick="speakText('第${idx + 1}題。情境釋義：${q.clue}')">🔊 聽題目</button>
          </div>
          <div class="item-details">情境釋義：${q.clue}</div>
          <div class="teacher-answer">★ 正解：【${letter}】 ${q.word}（${q.zhuyin}）</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型三：看圖寫字 (Page 3)
    contentHtml += `
      <section class="section-card" id="${v.key}-p3">
        <div class="section-header">
          <div class="section-title">題型三：看圖自主寫字（無提示手寫）</div>
          <span class="section-badge">第 3 頁 / 看圖自主寫</span>
        </div>
    `;
    shuffledQ3.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            第 ${idx + 1} 題
            <button class="btn-speak" onclick="speakText('第${idx + 1}題。語境提示：${q.clue}。注音：${q.zhuyin}')">🔊 聽提示</button>
          </div>
          <div class="item-details">語境提示：${q.clue} ｜ 注音引導：（${q.zhuyin}）</div>
          <div class="teacher-answer">★ 正解國字：【${q.word}】</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型四：課文原句填空 (Page 4)
    contentHtml += `
      <section class="section-card" id="${v.key}-p4">
        <div class="section-header">
          <div class="section-title">題型四：字詞填空（課文原句精讀篇）</div>
          <span class="section-badge">第 4 頁 / 課文填空</span>
        </div>
    `;
    shuffledQ4.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. ${q.quoteBlank}
            <button class="btn-speak" onclick="speakText('${q.quote}')">🔊 朗讀原句</button>
          </div>
          <div class="teacher-answer">★ 正解填空：【${q.word}】 ➔ 原句全文：${q.quote}</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型五：生活例句填空 (Page 5)
    contentHtml += `
      <section class="section-card" id="${v.key}-p5">
        <div class="section-header">
          <div class="section-title">題型五：字詞填空（生活例句應用篇）</div>
          <span class="section-badge">第 5 頁 / 生活例句填空</span>
        </div>
    `;
    shuffledQ5.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. ${q.exampleBlank}
            <button class="btn-speak" onclick="speakText('${q.example}')">🔊 朗讀例句</button>
          </div>
          <div class="teacher-answer">★ 正解填空：【${q.word}】 ➔ 例句全文：${q.example}</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型六：課文名句與君子美德 (Page 6)
    contentHtml += `
      <section class="section-card" id="${v.key}-p6">
        <div class="section-header">
          <div class="section-title">題型六：課文名句與君子美德配合題（10組）</div>
          <span class="section-badge">第 6 頁 / 君子美德配合題</span>
        </div>
        <div style="background:#f1f5f9; padding:10px 14px; border-radius:8px; margin-bottom:14px;">
          <strong>【君子美德選項庫】：</strong><br>
          ${shuffledVirtueChoices.map((vc, idx) => `(${vLetters[idx]}) ${vc.virtue}`).join(" ｜ ")}
        </div>
    `;
    shuffledVirtueQ.forEach((vq, idx) => {
      const vLetter = virtueLetterMap.get(vq.id)!;
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. 「${vq.quote}」
            <button class="btn-speak" onclick="speakText('名句：${vq.quote}。象徵：${vq.explain}')">🔊 聽名句與象徵</button>
          </div>
          <div class="item-details">象徵意涵：${vq.explain}</div>
          <div class="teacher-answer">★ 正解美德：【${vLetter}】 ${vq.virtue}</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    contentHtml += `</div>`; // end tabContent
    tabContents += contentHtml;
  });

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>國文二上 第四課〈愛蓮說〉詞語一學習單（有聲報讀系統）</title>
  <style>${COMMON_CSS}</style>
</head>
<body>
  <div class="container">
    <header class="top-bar">
      <div class="top-title">📖 愛蓮說・詞語一學習單（有聲報讀）</div>
      <div class="top-controls">
        <button class="btn rate-btn" onclick="setRate(0.8, this)">0.8x 慢速</button>
        <button class="btn rate-btn active" onclick="setRate(1.0, this)">1.0x 正常</button>
        <button class="btn rate-btn" onclick="setRate(1.2, this)">1.2x 快速</button>
        <button class="btn danger" onclick="stopSpeech()">⏹ 停止朗讀</button>
        <button class="btn" onclick="toggleFontSize()">🔤 字體大小</button>
        <button id="btnToggleAns" class="btn" onclick="toggleAnswers()">👁️ 顯示解答</button>
      </div>
    </header>

    <div class="tab-nav">
      ${tabButtons}
    </div>

    ${tabContents}
  </div>

  <script>${COMMON_JS}</script>
</body>
</html>`;
}

// ==========================================
// 2. 產生 詞語二學習單 有聲網頁
// ==========================================
function buildWords2Html(): string {
  const versions = [
    { key: "A", name: "卷 A", seed: 4057 },
    { key: "B", name: "卷 B", seed: 5071 },
    { key: "C", name: "卷 C", seed: 6089 }
  ];

  let tabButtons = "";
  let tabContents = "";

  versions.forEach((v, vIdx) => {
    const activeClass = vIdx === 0 ? "active" : "";
    tabButtons += `<button id="btnTab_${v.key}" class="tab-btn ${activeClass}" onclick="switchTab('${v.key}')">${v.name}</button>`;

    const shuffledQ2 = seededShuffle(WORDS2_DATA, v.seed + 123);
    const shuffledQ3 = seededShuffle(WORDS2_DATA, v.seed + 234);
    const shuffledQ4 = seededShuffle(WORDS2_DATA, v.seed + 345);
    const shuffledQ5 = seededShuffle(WORDS2_DATA, v.seed + 456);

    let contentHtml = `<div id="tabContent_${v.key}" class="tab-content" style="${vIdx === 0 ? '' : 'display:none;'}">`;

    // 題型一：詞語習寫 (Page 1)
    contentHtml += `
      <section class="section-card" id="${v.key}-p1">
        <div class="section-header">
          <div class="section-title">題型一：重點詞語習寫（15組重點詞語）</div>
          <span class="section-badge">第 1 頁 / 詞語習寫</span>
        </div>
        <p style="margin-bottom:12px; color:#64748b;">依學習區順序排列，點擊按鈕可聽目標生字讀音與部首筆畫記憶重點：</p>
    `;
    WORDS2_DATA.forEach((w) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            <span style="font-size:18pt; color:#1e3a8a;">${w.id}. ${w.word}</span>
            <span style="color:#0284c7; margin-left:8px;">（${w.fullZhuyin}）</span>
            <button class="btn-speak" onclick="speakText('${w.word}，注音：${w.fullZhuyin}')">🔊 聽詞語</button>
            <button class="btn-speak" onclick="speakText('目標字：${w.targetChar}，讀音：${w.targetZhuyin}。${w.radicalInfo}。${w.clue}')">🔊 聽考查重點</button>
          </div>
          <div class="item-details">
            考查生字：【${w.targetChar}】${w.targetZhuyin} ｜ ${w.radicalInfo}<br>
            提示：${w.clue}
          </div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型二：依題目寫注音 (Page 2)
    contentHtml += `
      <section class="section-card" id="${v.key}-p2">
        <div class="section-header">
          <div class="section-title">題型二：依題目寫出注音（雙欄排列・15題）</div>
          <span class="section-badge">第 2 頁 / 依題目寫注音</span>
        </div>
        <div class="two-col-container">
    `;
    shuffledQ2.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. ${q.quoteStem}
            <button class="btn-speak" onclick="speakText('${q.quoteStem}')">🔊 聽題目</button>
          </div>
          <div class="teacher-answer">★ 正確注音：【${q.targetZhuyin}】</div>
        </div>
      `;
    });
    contentHtml += `</div></section>`;

    // 題型三：依題目寫國字 (Page 3)
    contentHtml += `
      <section class="section-card" id="${v.key}-p3">
        <div class="section-header">
          <div class="section-title">題型三：依題目寫出國字（雙欄排列・15題）</div>
          <span class="section-badge">第 3 頁 / 依題目寫國字</span>
        </div>
        <div class="two-col-container">
    `;
    shuffledQ3.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. ${q.quoteCharStem}
            <button class="btn-speak" onclick="speakText('${q.quoteCharStem}')">🔊 聽題目</button>
          </div>
          <div class="teacher-answer">★ 正確國字：【${q.targetChar}】</div>
        </div>
      `;
    });
    contentHtml += `</div></section>`;

    // 題型四：課文原句填空 (Page 4)
    contentHtml += `
      <section class="section-card" id="${v.key}-p4">
        <div class="section-header">
          <div class="section-title">題型四：字詞填空（課文原句精讀篇・15題）</div>
          <span class="section-badge">第 4 頁 / 課文填空</span>
        </div>
    `;
    shuffledQ4.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. ${q.quoteBlankSentence}
            <button class="btn-speak" onclick="speakText('${q.quoteText}')">🔊 朗讀原句</button>
          </div>
          <div class="teacher-answer">★ 正解填空：【${q.targetChar}】</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型五：生活例句填空 (Page 5)
    contentHtml += `
      <section class="section-card" id="${v.key}-p5">
        <div class="section-header">
          <div class="section-title">題型五：字詞填空（生活例句應用篇・15題）</div>
          <span class="section-badge">第 5 頁 / 生活例句填空</span>
        </div>
    `;
    shuffledQ5.forEach((q, idx) => {
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. ${q.exampleBlankSentence}
            <button class="btn-speak" onclick="speakText('${q.exampleBlankSentence.replace(/（　　）/g, q.targetChar)}')">🔊 朗讀例句</button>
          </div>
          <div class="teacher-answer">★ 正解填空：【${q.targetChar}】</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    contentHtml += `</div>`;
    tabContents += contentHtml;
  });

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>國文二上 第四課〈愛蓮說〉詞語二學習單（有聲報讀系統）</title>
  <style>${COMMON_CSS}</style>
</head>
<body>
  <div class="container">
    <header class="top-bar">
      <div class="top-title">📖 愛蓮說・詞語二學習單（有聲報讀）</div>
      <div class="top-controls">
        <button class="btn rate-btn" onclick="setRate(0.8, this)">0.8x 慢速</button>
        <button class="btn rate-btn active" onclick="setRate(1.0, this)">1.0x 正常</button>
        <button class="btn rate-btn" onclick="setRate(1.2, this)">1.2x 快速</button>
        <button class="btn danger" onclick="stopSpeech()">⏹ 停止朗讀</button>
        <button class="btn" onclick="toggleFontSize()">🔤 字體大小</button>
        <button id="btnToggleAns" class="btn" onclick="toggleAnswers()">👁️ 顯示解答</button>
      </div>
    </header>

    <div class="tab-nav">
      ${tabButtons}
    </div>

    ${tabContents}
  </div>

  <script>${COMMON_JS}</script>
</body>
</html>`;
}

// ==========================================
// 3. 產生 解釋學習單 有聲網頁
// ==========================================
function buildNotesHtml(): string {
  const versions = [
    {
      key: "A",
      name: "卷 A",
      seed: 7013,
      mcqIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    },
    {
      key: "B",
      name: "卷 B",
      seed: 8027,
      mcqIndices: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    },
    {
      key: "C",
      name: "卷 C",
      seed: 9041,
      mcqIndices: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    }
  ];

  let tabButtons = "";
  let tabContents = "";

  versions.forEach((v, vIdx) => {
    const activeClass = vIdx === 0 ? "active" : "";
    tabButtons += `<button id="btnTab_${v.key}" class="tab-btn ${activeClass}" onclick="switchTab('${v.key}')">${v.name}</button>`;

    // 題型一：詞義配合題（全課 15 則）
    const shuffledNoteChoices = seededShuffle(NOTES_DATA, v.seed + 11);
    const choiceLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
    const choiceMap = new Map<number, { letter: string; word: string }>();
    shuffledNoteChoices.forEach((item, idx) => {
      choiceMap.set(item.id, { letter: choiceLetters[idx], word: item.word });
    });
    const shuffledNotesQ = seededShuffle(NOTES_DATA, v.seed + 22);

    // 題型二：解釋單選題（20 題）
    const rawSample = v.mcqIndices.map((i) => MCQ_POOL[i]);
    const shuffledSample = seededShuffle(rawSample, v.seed + 33);

    let contentHtml = `<div id="tabContent_${v.key}" class="tab-content" style="${vIdx === 0 ? '' : 'display:none;'}">`;

    // 題型一：配合題 (Page 1)
    contentHtml += `
      <section class="section-card" id="${v.key}-p1">
        <div class="section-header">
          <div class="section-title">題型一：詞與解釋配合題（全課15則注釋詞義）</div>
          <span class="section-badge">第 1 頁 / 詞義配合題</span>
        </div>
        <div style="background:#f1f5f9; padding:10px 14px; border-radius:8px; margin-bottom:14px;">
          <strong>【注釋目標詞語庫】：</strong><br>
          ${shuffledNoteChoices.map((nc, idx) => `(${choiceLetters[idx]}) ${nc.word}`).join(" ｜ ")}
        </div>
    `;
    shuffledNotesQ.forEach((nq, idx) => {
      const info = choiceMap.get(nq.id)!;
      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            ${idx + 1}. 釋義：${nq.explain}
            <button class="btn-speak" onclick="speakText('第${idx + 1}題。釋義：${nq.explain}。課文出處：${nq.quote}')">🔊 聽解釋與出處</button>
          </div>
          <div class="item-details">出處：「${nq.quote}」</div>
          <div class="teacher-answer">★ 正解代號：【${info.letter}】 詞語：${nq.word}</div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    // 題型二：單選測驗 (Page 2)
    contentHtml += `
      <section class="section-card" id="${v.key}-p2">
        <div class="section-header">
          <div class="section-title">題型二：解釋與美德單選測驗（精選20題）</div>
          <span class="section-badge">第 2 頁 / 單選測驗</span>
        </div>
    `;
    shuffledSample.forEach((mq, idx) => {
      const originalOptions = mq.options.map((opt, i) => ({ opt, isCorrect: i === 0 }));
      const shuffledOptions = seededShuffle(originalOptions, v.seed + 100 + idx);
      const optLetters = ["A", "B", "C", "D"];
      let correctLetter = "A";

      const optHtmls = shuffledOptions.map((o, oIdx) => {
        const letter = optLetters[oIdx];
        if (o.isCorrect) correctLetter = letter;
        return `
          <div class="option-pill">
            <span><strong>(${letter})</strong> ${o.opt}</span>
            <button class="btn-speak" onclick="speakText('選項${letter}：${o.opt}')">🔊</button>
          </div>
        `;
      });

      contentHtml += `
        <div class="item-box">
          <div class="item-title">
            第 ${idx + 1} 題：${mq.stem}
            <button class="btn-speak" onclick="speakText('第${idx + 1}題。${mq.stem}')">🔊 聽題目</button>
          </div>
          <div class="options-grid">
            ${optHtmls.join("")}
          </div>
          <div class="teacher-answer">
            ★ 正解選項：【${correctLetter}】<br>
            【解析】：${mq.explanation}
          </div>
        </div>
      `;
    });
    contentHtml += `</section>`;

    contentHtml += `</div>`;
    tabContents += contentHtml;
  });

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>國文二上 第四課〈愛蓮說〉解釋學習單（有聲報讀系統）</title>
  <style>${COMMON_CSS}</style>
</head>
<body>
  <div class="container">
    <header class="top-bar">
      <div class="top-title">📖 愛蓮說・解釋學習單（有聲報讀）</div>
      <div class="top-controls">
        <button class="btn rate-btn" onclick="setRate(0.8, this)">0.8x 慢速</button>
        <button class="btn rate-btn active" onclick="setRate(1.0, this)">1.0x 正常</button>
        <button class="btn rate-btn" onclick="setRate(1.2, this)">1.2x 快速</button>
        <button class="btn danger" onclick="stopSpeech()">⏹ 停止朗讀</button>
        <button class="btn" onclick="toggleFontSize()">🔤 字體大小</button>
        <button id="btnToggleAns" class="btn" onclick="toggleAnswers()">👁️ 顯示解答</button>
      </div>
    </header>

    <div class="tab-nav">
      ${tabButtons}
    </div>

    ${tabContents}
  </div>

  <script>${COMMON_JS}</script>
</body>
</html>`;
}

// 產製 3 個有聲網頁檔案
console.log("=== 開始產製 有聲網頁 HTML 檔 ===");
await Deno.writeTextFile(`${OUTPUT_DIR}/詞語一學習單_有聲報讀.html`, buildWords1Html());
console.log("Saved: 詞語一學習單_有聲報讀.html");
await Deno.writeTextFile(`${OUTPUT_DIR}/詞語二學習單_有聲報讀.html`, buildWords2Html());
console.log("Saved: 詞語二學習單_有聲報讀.html");
await Deno.writeTextFile(`${OUTPUT_DIR}/解釋學習單_有聲報讀.html`, buildNotesHtml());
console.log("Saved: 解釋學習單_有聲報讀.html");
console.log("=== 有聲網頁 HTML 檔產製完成！ ===");
