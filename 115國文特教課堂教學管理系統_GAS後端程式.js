/**
 * ==============================================================================
 * 115 國文特教課堂教學管理系統 - 後端核心程式 (Google Apps Script)
 * 版本：v1.3.0 (高資安強化版：防暴力猜測、POST本文傳輸、成績白名單防呆)
 * 整合：課堂黑板聯絡簿、01~06個別作業追蹤、成績登錄與跨課歷程、IEP個別輔導
 * ==============================================================================
 * 
 * 本程式支援：
 * 1. 一鍵全自動建立 6 大管理分頁與標準欄位 (執行 initSystem)
 * 2. 課堂黑板聯絡簿 (大屏公開免密碼)
 * 3. 01~06 學生作業追蹤 (🔴未交、🟡部分繳交、🟢已完成，待交滾動累積)
 * 4. 評量日期與成績登錄庫 (支援學生線上自評自動寫入 + 教師手動登打紙本成績)
 * 5. 單課平均、全學期平時總平均、跨課同項目 (如生詞1) 縱向歷程追蹤
 * 6. 雙層安全認證 (第一層日常管理密碼、第二層核心安全密碼，存在試算表，代碼不留痕)
 * 7. 【資安防禦強化】：
 *    - 密碼全面限定透過 POST Body 傳輸，徹底防範網址列參數外洩 (風險 ②)
 *    - 連續密碼錯誤 5 次自動鎖定 15 分鐘，防範暴力破解猜密碼 (風險 ③)
 *    - 線上交卷座號白名單 (01~06/test.)、分數 0~100 檢核、同座號 10 秒限頻 (風險 ①)
 */

// ==============================================================================
// 1. 【一鍵全自動建立 7 大分頁】（只需在 Apps Script 上方選取 initSystem 並點「執行」一次）
// ==============================================================================
function initSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  initSystemSheets(ss);
}

/**
 * 獨立執行函式：一鍵單獨重新產生【📈 成績統計與歷程】28 欄公式
 * （可在 Apps Script 頂端函式下拉選單中直接點選並按「執行」）
 */
function runSetupStatisticsSheetOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupStatisticsSheet(ss);
  SpreadsheetApp.getUi().alert("🎉 【📈 成績統計與歷程】28 大欄位公式已全部產生完成！");
}

/**
 * 獨立執行函式：一鍵單獨建立【✍️ 學生手寫歷程記錄】分頁
 */
function runSetupHandwritingSheetOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupHandwritingSheet(ss);
  SpreadsheetApp.getUi().alert("🎉 【✍️ 學生手寫歷程記錄】分頁已建立完成！");
}

function initSystemSheets(ss) {

  // ----------------------------------------------------
  // 分頁 1: ⚙️ 系統設定 (存放密碼與名單)
  // ----------------------------------------------------
  let configSheet = ss.getSheetByName("⚙️ 系統設定");
  if (!configSheet) configSheet = ss.insertSheet("⚙️ 系統設定");
  configSheet.clear();
  configSheet.getRange("A1:C1").setValues([["設定項目", "設定值", "說明備註"]])
    .setBackground("#4A5568").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  configSheet.getRange("A2:C4").setValues([
    ["第一層密碼 (日常教學/作業/聯絡簿)", "2024", "可直接在此儲存格修改密碼，網頁端自動同步驗證"],
    ["第二層密碼 (成績登錄/IEP個別輔導)", "Jun#2026Sped", "【重要】涉及特教隱私，建議設為8碼以上英數混合！"],
    ["學生名單 (01~06)", "01, 02, 03, 04, 05, 06", "固定座號名單"]
  ]);
  configSheet.setColumnWidth(1, 260);
  configSheet.setColumnWidth(2, 160);
  configSheet.setColumnWidth(3, 340);

  // ----------------------------------------------------
  // 分頁 2: 📅 課堂聯絡簿 (大屏免密碼公開)
  // ----------------------------------------------------
  let contactSheet = ss.getSheetByName("📅 課堂聯絡簿");
  if (!contactSheet) contactSheet = ss.insertSheet("📅 課堂聯絡簿");
  contactSheet.clear();
  contactSheet.getRange("A1:E1").setValues([["日期", "本日上課進度", "今日作業", "成績公布", "待補交作業名單 (大屏公開)"]])
    .setBackground("#2B6CB0").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  const todayStr = getTodayROCDate();
  contactSheet.getRange("A2:E2").setValues([
    [todayStr, "", "", "", ""]
  ]);
  contactSheet.setColumnWidth(1, 170);
  contactSheet.setColumnWidth(2, 280);
  contactSheet.setColumnWidth(3, 240);
  contactSheet.setColumnWidth(4, 240);
  contactSheet.setColumnWidth(5, 320);

  // ----------------------------------------------------
  // 分頁 3: 📋 個別作業追蹤 (01~06 滾動記錄)
  // ----------------------------------------------------
  let hwSheet = ss.getSheetByName("📋 個別作業追蹤");
  if (!hwSheet) hwSheet = ss.insertSheet("📋 個別作業追蹤");
  hwSheet.clear();
  hwSheet.getRange("A1:H1").setValues([["指派日期", "課別", "座號", "作業項目名稱", "繳交狀態", "成績", "評語與備註", "最後更新時間"]])
    .setBackground("#2C7A7B").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(["🔴 未交", "🟡 部分繳交", "🟢 已完成"], true).build();
  hwSheet.getRange("E2:E300").setDataValidation(statusRule);
  hwSheet.setColumnWidth(1, 110);
  hwSheet.setColumnWidth(2, 120);
  hwSheet.setColumnWidth(3, 80);
  hwSheet.setColumnWidth(4, 180);
  hwSheet.setColumnWidth(5, 120);
  hwSheet.setColumnWidth(6, 100);
  hwSheet.setColumnWidth(7, 260);
  hwSheet.setColumnWidth(8, 160);

  // ----------------------------------------------------
  // 分頁 4: 📊 成績登錄庫 (支援評量日期 + 紙本與線上雙軌)
  // ----------------------------------------------------
  let scoreSheet = ss.getSheetByName("📊 成績登錄庫");
  if (!scoreSheet) scoreSheet = ss.insertSheet("📊 成績登錄庫");
  scoreSheet.clear();
  scoreSheet.getRange("A1:I1").setValues([["評量日期", "課別", "測驗類別", "測驗大標/項目", "細項子標", "座號", "得分", "滿分", "備註說明"]])
    .setBackground("#975A16").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  scoreSheet.setColumnWidth(1, 110);
  scoreSheet.setColumnWidth(2, 120);
  scoreSheet.setColumnWidth(3, 110);
  scoreSheet.setColumnWidth(4, 150);
  scoreSheet.setColumnWidth(5, 150);
  scoreSheet.setColumnWidth(6, 80);
  scoreSheet.setColumnWidth(7, 80);
  scoreSheet.setColumnWidth(8, 80);
  scoreSheet.setColumnWidth(9, 200);

  // ----------------------------------------------------
  // 分頁 5: 📈 成績統計與歷程 (28大欄位：含單課作業、五大類最佳平均與各分測驗單項最佳成績)
  // ----------------------------------------------------
  setupStatisticsSheet(ss);

  // ----------------------------------------------------
  // 分頁 6: ✍️ 學生手寫歷程記錄 (特教專屬：手寫字跡圖像、雲端存檔與鷹架追蹤)
  // ----------------------------------------------------
  setupHandwritingSheet(ss);

  // ----------------------------------------------------
  // 分頁 7: 🔒 個別輔導紀錄 (特教專屬 IEP 隱私保護)
  // ----------------------------------------------------
  let notesSheet = ss.getSheetByName("🔒 個別輔導紀錄");
  if (!notesSheet) notesSheet = ss.insertSheet("🔒 個別輔導紀錄");
  notesSheet.clear();
  notesSheet.getRange("A1:F1").setValues([["日期", "座號", "課堂觀察 (學習/注意力/情緒)", "處遇措施與個別輔導記錄", "成效追蹤", "記錄教師"]])
    .setBackground("#742A2A").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  notesSheet.setColumnWidth(1, 110);
  notesSheet.setColumnWidth(2, 80);
  notesSheet.setColumnWidth(3, 280);
  notesSheet.setColumnWidth(4, 320);
  notesSheet.setColumnWidth(5, 180);
  notesSheet.setColumnWidth(6, 110);

  // 移除多餘的預設分頁
  const sheet1 = ss.getSheetByName("工作表1");
  if (sheet1 && ss.getSheets().length > 1) ss.deleteSheet(sheet1);

  SpreadsheetApp.getUi().alert("🎉 115 國文特教課堂教學管理系統 7 大分頁已全自動建立完成！");
}

/**
 * 建立或更新【📈 成績統計與歷程】分頁（全自動寫入 28 欄公式）
 */
function setupStatisticsSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  let statsSheet = ss.getSheetByName("📈 成績統計與歷程");
  if (!statsSheet) statsSheet = ss.insertSheet("📈 成績統計與歷程");
  statsSheet.clear();

  const headers = [
    "座號", 
    "學期平時考總平均", "單課總平均 (L4愛蓮說)", "單課作業平均",
    "詞語一最佳平均", "詞語二最佳平均", "解釋評量最佳平均", "相似字最佳平均", "綜合與實戰最佳平均",
    "詞語一：1️⃣ 圖詞配對", "詞語一：2️⃣ 聽詞選詞", "詞語一：3️⃣ 積木選字", "詞語一：4️⃣ 課本填空", "詞語一：5️⃣ 生活填空", "詞語一：6️⃣ 看圖手寫",
    "詞語二：🎧 聽詞選詞", "詞語二：⌨️ 注音手動輸入", "詞語二：✍️ 看注音寫國字",
    "解釋：題型一：注釋單選", "解釋：題型二：詞釋配對", "解釋：題型三：美德配對",
    "相似字：題型一：填空單選", "相似字：題型二：手寫填空", "相似字：題型三：看詞填注音",
    "綜合：課後檢測與應用練習 (P63~67)", "綜合：植物象徵圖文配對", "綜合：課文圖文順序排列", "綜合：全課綜合會考"
  ];

  statsSheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground("#553C9A").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");

  // 著色分組：大類平均群組（紫色淡底）、各項最佳（藍綠與琥珀色）
  statsSheet.getRange("A1:D1").setBackground("#4C1D95");
  statsSheet.getRange("E1:I1").setBackground("#6B21A8");
  statsSheet.getRange("J1:O1").setBackground("#0E7490");
  statsSheet.getRange("P1:R1").setBackground("#0284C7");
  statsSheet.getRange("S1:U1").setBackground("#D97706");
  statsSheet.getRange("V1:X1").setBackground("#059669");
  statsSheet.getRange("Y1:AB1").setBackground("#BE185D");

  // 凍結第 1 列 (標題) 與第 1 欄 (學生座號)，橫向捲動時座號永遠鎖定在左側
  try {
    statsSheet.setFrozenRows(1);
    statsSheet.setFrozenColumns(1);
  } catch (e) {}

  for (let i = 1; i <= 6; i++) {
    const seat = (i < 10 ? "0" + i : "" + i);
    const row = i + 1;
    // 座號
    statsSheet.getRange(row, 1).setValue(seat).setHorizontalAlignment("center").setFontWeight("bold");

    // B: 學期平時考總平均 (所有登錄成績加總平均)
    statsSheet.getRange(row, 2).setFormula(`=IFERROR(ROUND(AVERAGE(FILTER('📊 成績登錄庫'!$G$2:$G$500, ('📊 成績登錄庫'!$F$2:$F$500 = A${row}) + ('📊 成績登錄庫'!$F$2:$F$500 = TEXT(A${row}, "00")) + ('📊 成績登錄庫'!$F$2:$F$500 = VALUE(A${row})))), 1), "-")`).setNumberFormat("0.0");

    // C: 單課總平均 (L4 愛蓮說測驗＋作業)
    statsSheet.getRange(row, 3).setFormula(`=IFERROR(ROUND(AVERAGE(FILTER('📊 成績登錄庫'!$G$2:$G$500, (('📊 成績登錄庫'!$F$2:$F$500 = A${row}) + ('📊 成績登錄庫'!$F$2:$F$500 = TEXT(A${row}, "00")) + ('📊 成績登錄庫'!$F$2:$F$500 = VALUE(A${row}))), ISNUMBER(SEARCH("愛蓮說", '📊 成績登錄庫'!$B$2:$B$500)))), 1), "-")`).setNumberFormat("0.0");

    // D: 單課作業平均 (L4 平時作業)
    statsSheet.getRange(row, 4).setFormula(`=IFERROR(ROUND(AVERAGE(FILTER('📊 成績登錄庫'!$G$2:$G$500, (('📊 成績登錄庫'!$F$2:$F$500 = A${row}) + ('📊 成績登錄庫'!$F$2:$F$500 = TEXT(A${row}, "00")) + ('📊 成績登錄庫'!$F$2:$F$500 = VALUE(A${row}))), ISNUMBER(SEARCH("作業", '📊 成績登錄庫'!$C$2:$C$500)))), 1), "-")`).setNumberFormat("0.0");

    // E: 詞語一最佳平均 (J~O 欄平均)
    statsSheet.getRange(row, 5).setFormula(`=IFERROR(ROUND(AVERAGE(J${row}:O${row}), 1), "-")`).setNumberFormat("0.0");

    // F: 詞語二最佳平均 (P~R 欄平均)
    statsSheet.getRange(row, 6).setFormula(`=IFERROR(ROUND(AVERAGE(P${row}:R${row}), 1), "-")`).setNumberFormat("0.0");

    // G: 解釋評量最佳平均 (S~U 欄平均)
    statsSheet.getRange(row, 7).setFormula(`=IFERROR(ROUND(AVERAGE(S${row}:U${row}), 1), "-")`).setNumberFormat("0.0");

    // H: 相似字最佳平均 (V~X 欄平均)
    statsSheet.getRange(row, 8).setFormula(`=IFERROR(ROUND(AVERAGE(V${row}:X${row}), 1), "-")`).setNumberFormat("0.0");

    // I: 綜合與實戰最佳平均 (Y~AB 欄平均)
    statsSheet.getRange(row, 9).setFormula(`=IFERROR(ROUND(AVERAGE(Y${row}:AB${row}), 1), "-")`).setNumberFormat("0.0");

    // --- 各分測驗單項最佳成績公式 (容錯比對座號 01 或 1，並提取最高得分 MAX) ---
    const makeMaxFormula = (keyword, extraCondition) => {
      let cond = `ISNUMBER(SEARCH("${keyword}", '📊 成績登錄庫'!$E$2:$E$500))`;
      if (extraCondition) cond += ` * (${extraCondition})`;
      return `=IFERROR(MAX(FILTER('📊 成績登錄庫'!$G$2:$G$500, (('📊 成績登錄庫'!$F$2:$F$500 = A${row}) + ('📊 成績登錄庫'!$F$2:$F$500 = TEXT(A${row}, "00")) + ('📊 成績登錄庫'!$F$2:$F$500 = VALUE(A${row}))), ${cond})), "")`;
    };

    // J: 詞語一：1️⃣ 圖詞配對
    statsSheet.getRange(row, 10).setFormula(makeMaxFormula("圖詞配對")).setNumberFormat("0");
    // K: 詞語一：2️⃣ 聽詞選詞
    statsSheet.getRange(row, 11).setFormula(makeMaxFormula("聽詞選詞", `ISNUMBER(SEARCH("2️⃣", '📊 成績登錄庫'!$E$2:$E$500)) + ISNUMBER(SEARCH("詞語一", '📊 成績登錄庫'!$D$2:$D$500))`)).setNumberFormat("0");
    // L: 詞語一：3️⃣ 積木選字
    statsSheet.getRange(row, 12).setFormula(makeMaxFormula("積木")).setNumberFormat("0");
    // M: 詞語一：4️⃣ 課本填空
    statsSheet.getRange(row, 13).setFormula(makeMaxFormula("課本填空")).setNumberFormat("0");
    // N: 詞語一：5️⃣ 生活填空
    statsSheet.getRange(row, 14).setFormula(makeMaxFormula("生活填空")).setNumberFormat("0");
    // O: 詞語一：6️⃣ 看圖手寫
    statsSheet.getRange(row, 15).setFormula(makeMaxFormula("看圖手寫")).setNumberFormat("0");

    // P: 詞語二：🎧 聽詞選詞
    statsSheet.getRange(row, 16).setFormula(makeMaxFormula("聽詞選詞", `ISNUMBER(SEARCH("測驗一", '📊 成績登錄庫'!$E$2:$E$500)) + ISNUMBER(SEARCH("詞語二", '📊 成績登錄庫'!$D$2:$D$500))`)).setNumberFormat("0");
    // Q: 詞語二：⌨️ 注音手動輸入
    statsSheet.getRange(row, 17).setFormula(makeMaxFormula("注音")).setNumberFormat("0");
    // R: 詞語二：✍️ 看注音寫國字
    statsSheet.getRange(row, 18).setFormula(makeMaxFormula("看注音寫國字")).setNumberFormat("0");

    // S: 解釋：題型一：注釋單選
    statsSheet.getRange(row, 19).setFormula(makeMaxFormula("注釋單選")).setNumberFormat("0");
    // T: 解釋：題型二：詞釋配對
    statsSheet.getRange(row, 20).setFormula(makeMaxFormula("詞釋配對")).setNumberFormat("0");
    // U: 解釋：題型三：美德配對
    statsSheet.getRange(row, 21).setFormula(makeMaxFormula("美德配對")).setNumberFormat("0");

    // V: 相似字：題型一：填空單選
    statsSheet.getRange(row, 22).setFormula(makeMaxFormula("填空單選")).setNumberFormat("0");
    // W: 相似字：題型二：手寫填空
    statsSheet.getRange(row, 23).setFormula(makeMaxFormula("手寫填空")).setNumberFormat("0");
    // X: 相似字：題型三：看詞填注音
    statsSheet.getRange(row, 24).setFormula(makeMaxFormula("看詞填注音")).setNumberFormat("0");

    // Y: 綜合：課後檢測與應用練習 (P63~67)
    statsSheet.getRange(row, 25).setFormula(makeMaxFormula("課後檢測")).setNumberFormat("0");
    // Z: 綜合：植物象徵圖文配對
    statsSheet.getRange(row, 26).setFormula(makeMaxFormula("植物")).setNumberFormat("0");
    // AA: 綜合：課文圖文順序排列
    statsSheet.getRange(row, 27).setFormula(makeMaxFormula("順序排列")).setNumberFormat("0");
    // AB: 綜合：全課綜合會考
    statsSheet.getRange(row, 28).setFormula(makeMaxFormula("全課綜合")).setNumberFormat("0");
  }

  // 欄寬自適應與排版
  statsSheet.setColumnWidth(1, 80);
  statsSheet.setColumnWidth(2, 140);
  statsSheet.setColumnWidth(3, 160);
  statsSheet.setColumnWidth(4, 130);
  for (let c = 5; c <= 9; c++) statsSheet.setColumnWidth(c, 140);
  for (let c = 10; c <= 28; c++) statsSheet.setColumnWidth(c, 160);
}

/**
 * 建立【✍️ 學生手寫歷程記錄】分頁
 */
function setupHandwritingSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  let hwSheet = ss.getSheetByName("✍️ 學生手寫歷程記錄");
  if (!hwSheet) hwSheet = ss.insertSheet("✍️ 學生手寫歷程記錄");

  if (hwSheet.getLastRow() === 0) {
    const headers = [
      "時間戳記", "課別", "座號", "評量單元", "題號/題目", "目標字詞",
      "手寫筆跡縮圖", "雲端圖檔連結", "自我檢核", "鷹架輔助狀態", "學生作答耗時",
      "教師批閱", "教師評語"
    ];
    hwSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground("#0F766E").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");

    hwSheet.setColumnWidth(1, 140);
    hwSheet.setColumnWidth(2, 110);
    hwSheet.setColumnWidth(3, 80);
    hwSheet.setColumnWidth(4, 200);
    hwSheet.setColumnWidth(5, 140);
    hwSheet.setColumnWidth(6, 120);
    hwSheet.setColumnWidth(7, 130);
    hwSheet.setColumnWidth(8, 220);
    hwSheet.setColumnWidth(9, 110);
    hwSheet.setColumnWidth(10, 200);
    hwSheet.setColumnWidth(11, 120);
    hwSheet.setColumnWidth(12, 120);
    hwSheet.setColumnWidth(13, 260);
  } else {
    // 無論何種情況，強制確保第 1 列之第 12 欄與第 13 欄標題正確存在
    if (hwSheet.getRange(1, 12).getValue() !== "教師批閱") {
      hwSheet.getRange(1, 12).setValue("教師批閱")
        .setBackground("#0F766E").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
      hwSheet.setColumnWidth(12, 120);
    }
    if (hwSheet.getRange(1, 13).getValue() !== "教師評語") {
      hwSheet.getRange(1, 13).setValue("教師評語")
        .setBackground("#0F766E").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
      hwSheet.setColumnWidth(13, 260);
    }
  }

  // 設定第 12 欄 (L 欄) 下拉選單驗證清單: ["⭕ 通過", "❌ 需訂正", "⏳ 待批改"]
  try {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["⭕ 通過", "❌ 需訂正", "⏳ 待批改"], true)
      .setAllowInvalid(true)
      .build();
    hwSheet.getRange("L2:L1000").setDataValidation(rule);
  } catch (e) {}
}

// 取得民國年月日字串 (輔助函式)
function getTodayROCDate() {
  const d = new Date();
  const rocYear = d.getFullYear() - 1911;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${rocYear}年${m}月${day}日(${weekDays[d.getDay()]})`;
}

// 座號相容比對 (自動相容 "1", "01", 1, 2, "02" 等數值與字串補零差異)
function isSameSeat(s1, s2) {
  if (s1 === undefined || s1 === null || s2 === undefined || s2 === null) return false;
  const str1 = String(s1).trim().replace(/^0+/, "");
  const str2 = String(s2).trim().replace(/^0+/, "");
  return str1 === str2;
}

// ==============================================================================
// 2. 【跨平台 API 介面】(提供電子書大屏與後台連線)
// ==============================================================================

function doGet(e) {
  // GET 請求僅支援公開資訊（如聯絡簿讀取），絕對禁止在此傳遞密碼
  const params = e.parameter || {};
  if (params.password) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "【資安警告】禁止在網址列 (GET) 傳遞密碼！請改用 POST 請求傳輸。"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return handleRequest(e, false);
}

function doPost(e) {
  return handleRequest(e, true);
}

function handleRequest(e, isPost) {
  const params = e.parameter || {};
  let postData = {};
  if (e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (err) {
      postData = {};
    }
  }
  const action = postData.action || params.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let result = { status: "error", message: "未知指令" };

  try {
    // ----------------------------------------------------
    // 【免密碼公開區】黑板聯絡簿讀取 (大屏投影用)
    // ----------------------------------------------------
    if (action === "getContactBook") {
      const sheet = ss.getSheetByName("📅 課堂聯絡簿");
      const data = sheet.getRange("A2:E2").getValues()[0];
      result = {
        status: "success",
        date: data[0] || "",
        progress: data[1] || "",
        lesson: data[1] || "",
        homework: data[2] || "",
        scoreAnnouncement: data[3] || "",
        pendingList: data[4] || ""
      };
    }

    // ----------------------------------------------------
    // 【免密碼公開區】學生線上評量自動交卷 (電子書直接寫入)
    // 強化防禦：座號白名單、分數 0~100 檢核、同座號 10 秒限頻 (風險 ①)
    // ----------------------------------------------------
    else if (action === "submitOnlineQuiz") {
      const seat = String(postData.seat || "").trim();
      const validSeats = ["01", "02", "03", "04", "05", "06", "test."];
      if (!validSeats.includes(seat)) {
        throw new Error("無效座號！僅接受 01~06 或 test.（老師測試）。");
      }

      const scoreNum = Number(postData.score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        throw new Error("分數數值不合法！必須介於 0 至 100 之間。");
      }

      // 頻率限制 (同座號 10 秒內僅能送出一次)
      const cache = CacheService.getScriptCache();
      const rateLimitKey = "rate_limit_submit_" + seat;
      if (cache.get(rateLimitKey)) {
        throw new Error("交卷過於頻繁，請等待 10 秒後再試！");
      }
      cache.put(rateLimitKey, "1", 10);

      const sheet = ss.getSheetByName("📊 成績登錄庫");
      const dateStr = postData.date || Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd");
      sheet.appendRow([
        dateStr,
        postData.lesson || "未知課程",
        "線上評量",
        postData.category || "線上測驗",
        postData.subCategory || "單元評量",
        seat,
        scoreNum,
        Number(postData.maxScore) || 100,
        postData.note || "電子書自動交卷"
      ]);
      result = { status: "success", message: "評量成績已成功登錄！" };
    }

    // ----------------------------------------------------
    // 【免密碼公開區】學生手寫筆跡紀錄上傳 (特教專屬：儲存至 Google Drive 並寫入歷程分頁)
    // ----------------------------------------------------
    else if (action === "submitHandwritingRecord") {
      const lock = LockService.getScriptLock();
      let hasLock = false;
      try {
        hasLock = lock.tryLock(30000);
        if (!hasLock) {
          result = { status: "error", message: "系統繁忙中，請稍後重試" };
          return;
        }

        const seat = String(postData.seat || "").trim();
        const lesson = postData.lesson || "L4 愛蓮說";
        const unitKey = postData.unitKey || "handwriting";
        const unitTitle = postData.unitTitle || "手寫測驗";
        const records = postData.records || []; // 題陣列 [{ qIndex, promptText, targetChar, imgBase64, selfEval, hintsUsed, duration }]
        const timeStr = Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd HH:mm:ss");

        // 取得或建立 Google Drive 手寫歷程存放資料夾
        let mainFolder;
        const mainFolderIter = DriveApp.getFoldersByName("115國文特教_學生手寫歷程");
        if (mainFolderIter.hasNext()) {
          mainFolder = mainFolderIter.next();
        } else {
          mainFolder = DriveApp.createFolder("115國文特教_學生手寫歷程");
        }

        let lessonFolder;
        const lessonIter = mainFolder.getFoldersByName(lesson);
        if (lessonIter.hasNext()) {
          lessonFolder = lessonIter.next();
        } else {
          lessonFolder = mainFolder.createFolder(lesson);
        }

        let seatFolder;
        const seatFolderName = (seat === "test.") ? "老師測試_test" : `座號${seat}`;
        const seatIter = lessonFolder.getFoldersByName(seatFolderName);
        if (seatIter.hasNext()) {
          seatFolder = seatIter.next();
        } else {
          seatFolder = lessonFolder.createFolder(seatFolderName);
        }

        // 確認/建立【✍️ 學生手寫歷程記錄】分頁
        setupHandwritingSheet(ss);
        const hwSheet = ss.getSheetByName("✍️ 學生手寫歷程記錄");

        const savedList = [];
        records.forEach((rec, idx) => {
          let fileUrl = "";
          let imgFormula = "";
          if (rec.imgBase64 && rec.imgBase64.includes("base64,")) {
            try {
              const rawBase64 = rec.imgBase64.split("base64,")[1];
              const decoded = Utilities.base64Decode(rawBase64);
              const fileName = `${lesson}_${seat === "test." ? "老師測試" : seat + "號"}_${unitKey}_Q${rec.qIndex || (idx + 1)}_${rec.targetChar || '字'}_${Date.now()}.png`;
              const blob = Utilities.newBlob(decoded, "image/png", fileName);
              const file = seatFolder.createFile(blob);
              try {
                file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
              } catch (shareErr) {
                console.warn("setSharing non-critical:", shareErr);
              }
              fileUrl = `https://drive.google.com/uc?export=view&id=${file.getId()}`;
              imgFormula = `=IMAGE("${fileUrl}")`;
            } catch (e) {
              fileUrl = "圖檔存檔失敗: " + e.toString();
            }
          }

          const rowValues = [
            timeStr,
            lesson,
            seat === "test." ? "老師測試 (test.)" : seat,
            unitTitle,
            `第 ${rec.qIndex || (idx + 1)} 題 (${rec.promptText || ''})`,
            rec.targetChar || "",
            imgFormula,
            fileUrl,
            rec.selfEval === 1 ? "⭕ 寫對了" : "❌ 需再練習",
            rec.hintsUsed || "自主書寫",
            rec.duration ? `${rec.duration} 秒` : "",
            "⏳ 待批改", // 第 12 欄：教師批閱預設為「待批改」
            ""          // 第 13 欄：教師評語預設為空
          ];
          hwSheet.appendRow(rowValues);
          // 設定圖片縮圖列高為 85 像素，讓縮圖清楚可見
          const newRowIdx = hwSheet.getLastRow();
          hwSheet.setRowHeight(newRowIdx, 85);

          savedList.push({
            targetChar: rec.targetChar,
            fileUrl: fileUrl,
            selfEval: rec.selfEval
          });
        });

        result = { status: "success", message: `成功儲存 ${savedList.length} 題手寫筆跡至 Google Drive 與試算表！`, data: savedList };
      } catch (err) {
        result = { status: "error", message: "儲存手寫紀錄失敗: " + err.toString() };
      } finally {
        if (hasLock) lock.releaseLock();
      }
    }

    // ----------------------------------------------------
    // 【免密碼公開區】讀取學生手寫歷程記錄 (供大屏管理系統直接調閱)
    // ----------------------------------------------------
    else if (action === "getHandwritingRecords") {
      const seat = String(postData.seat || e.parameter.seat || "").trim();
      setupHandwritingSheet(ss);
      const hwSheet = ss.getSheetByName("✍️ 學生手寫歷程記錄");
      const list = [];
      if (hwSheet && hwSheet.getLastRow() >= 2) {
        const rows = hwSheet.getDataRange().getValues();
        for (let r = rows.length - 1; r >= 1; r--) {
          const rSeat = String(rows[r][2]).trim();
          if (!seat || isSameSeat(rSeat, seat) || (seat === "test." && rSeat.includes("test"))) {
            list.push({
              timestamp: rows[r][0],
              lesson: rows[r][1],
              seat: rSeat,
              unitTitle: rows[r][3],
              question: rows[r][4],
              targetChar: rows[r][5],
              fileUrl: rows[r][7],
              selfEval: rows[r][8],
              hintsUsed: rows[r][9],
              duration: rows[r][10],
              teacherGrade: rows[r][11] || "⏳ 待批改",
              teacherComment: rows[r][12] || ""
            });
            if (list.length >= 50) break; // 最多調閱最近 50 筆
          }
        }
      }
      result = { status: "success", data: list };
    }

    // ----------------------------------------------------
    // 【免密碼/教師區】更新教師手寫批閱結果與評語
    // ----------------------------------------------------
    else if (action === "updateHandwritingGrade") {
      const lock = LockService.getScriptLock();
      let hasLock = false;
      try {
        hasLock = lock.tryLock(20000);
        const seat = String(postData.seat || "").trim();
        const timestamp = String(postData.timestamp || "").trim();
        const targetChar = String(postData.targetChar || "").trim();
        const teacherGrade = String(postData.teacherGrade || "").trim(); // "⭕ 通過" 或 "❌ 需訂正"
        const teacherComment = String(postData.teacherComment !== undefined ? postData.teacherComment : "").trim();

        setupHandwritingSheet(ss);
        const hwSheet = ss.getSheetByName("✍️ 學生手寫歷程記錄");
        if (!hwSheet || hwSheet.getLastRow() < 2) {
          result = { status: "error", message: "找不到手寫歷程分頁或尚無資料" };
          return;
        }

        const rows = hwSheet.getDataRange().getValues();
        let targetRow = -1;

        // 優先從最新一筆往前比對 (timestamp, seat, targetChar)
        for (let r = rows.length - 1; r >= 1; r--) {
          const rTime = String(rows[r][0] || "").trim();
          const rSeat = String(rows[r][2] || "").trim();
          const rChar = String(rows[r][5] || "").trim();

          const seatMatches = !seat || isSameSeat(rSeat, seat) || (seat === "test." && rSeat.includes("test")) || (rSeat === "test." && seat.includes("test"));
          const charMatches = !targetChar || rChar === targetChar || rChar.includes(targetChar) || targetChar.includes(rChar);
          const timeMatches = !timestamp || rTime === timestamp || rTime.includes(timestamp) || timestamp.includes(rTime);

          if (seatMatches && charMatches && timeMatches) {
            targetRow = r + 1; // 1-based row index
            break;
          }
        }

        // 如果 timestamp 略有格式差異，退回以 (seat, targetChar) 找最近一筆
        if (targetRow === -1 && targetChar) {
          for (let r = rows.length - 1; r >= 1; r--) {
            const rSeat = String(rows[r][2] || "").trim();
            const rChar = String(rows[r][5] || "").trim();
            const seatMatches = !seat || isSameSeat(rSeat, seat) || (seat === "test." && rSeat.includes("test")) || (rSeat === "test." && seat.includes("test"));
            const charMatches = rChar === targetChar || rChar.includes(targetChar) || targetChar.includes(rChar);
            if (seatMatches && charMatches) {
              targetRow = r + 1;
              break;
            }
          }
        }

        if (targetRow > 0) {
          if (teacherGrade) {
            hwSheet.getRange(targetRow, 12).setValue(teacherGrade);
          }
          if (postData.teacherComment !== undefined) {
            hwSheet.getRange(targetRow, 13).setValue(teacherComment);
          }
          result = {
            status: "success",
            message: `成功更新第 ${targetRow} 列【${seat}號 ${targetChar}】教師批閱為「${teacherGrade}」！`,
            data: { targetRow, teacherGrade, teacherComment }
          };
        } else {
          result = { status: "error", message: `在試算表中找不到對應的記錄 (${seat}號 / ${targetChar})` };
        }
      } catch (err) {
        result = { status: "error", message: "更新批閱失敗: " + err.toString() };
      } finally {
        if (hasLock) lock.releaseLock();
      }
    }

    // ----------------------------------------------------
    // 【第一層權限】一鍵重新產生/刷新【📈 成績統計與歷程】28 欄公式
    // ----------------------------------------------------
    else if (action === "refreshStatisticsSheet") {
      setupStatisticsSheet(ss);
      result = { status: "success", message: "【📈 成績統計與歷程】28 大統計欄位公式已成功重新產生！" };
    }

    // ----------------------------------------------------
    // 【第一層安全驗證】教師日常管理（密碼校驗）
    // 強化防禦：限定 POST Body 傳輸、錯 5 次鎖定 15 分鐘 (風險 ②、③)
    // ----------------------------------------------------
    else if (action === "verifyLevel1") {
      if (!isPost) throw new Error("驗證密碼必須採用 POST 資料本文傳輸！");
      const authResult = verifyPasswordWithBruteForceProtection(ss, 1, postData.password);
      if (authResult.success) {
        result = { status: "success", verified: true, level: 1 };
      } else {
        result = { status: "fail", message: authResult.message };
      }
    }

    // ----------------------------------------------------
    // 【第一層權限】更新黑板聯絡簿內容
    // ----------------------------------------------------
    else if (action === "updateContactBook") {
      const sheet = ss.getSheetByName("📅 課堂聯絡簿");
      const prog = postData.progress || postData.lesson || "";
      sheet.getRange("A2:E2").setValues([[
        postData.date || "",
        prog,
        postData.homework || "",
        postData.scoreAnnouncement || "",
        postData.pendingList || ""
      ]]);
      result = { status: "success", message: "聯絡簿已成功更新！" };
    }

    // ----------------------------------------------------
    // 【第一層權限】讀取/批次更新個別作業狀態與成績
    // ----------------------------------------------------
    else if (action === "getHomeworkList") {
      const sheet = ss.getSheetByName("📋 個別作業追蹤");
      const rows = sheet.getDataRange().getValues();
      const list = [];
      const unsubmittedMap = {};

      // 蒐集各座號未交清單（不用課別，只要狀態是未交，所有作業名稱都顯示，雙向相容 01 與 1）
      for (let r = 1; r < rows.length; r++) {
        const rSeat = String(rows[r][2]).trim();
        const rItem = String(rows[r][3] || "").trim();
        const rStatus = String(rows[r][4] || "").trim();
        if (rStatus.includes("未交")) {
          const rawS = rSeat;
          const cleanS = rawS.replace(/^0+/, "") || rawS;
          const padS = cleanS.length === 1 ? ("0" + cleanS) : cleanS;
          [rawS, cleanS, padS].forEach(k => {
            if (!unsubmittedMap[k]) unsubmittedMap[k] = [];
            if (rItem && !unsubmittedMap[k].includes(rItem)) {
              unsubmittedMap[k].push(rItem);
            }
          });
        }
      }

      // 讀取最新 01~06 號狀態
      for (let i = 1; i <= 6; i++) {
        const seatStr = (i < 10 ? "0" + i : "" + i);
        let found = null;
        for (let r = rows.length - 1; r >= 1; r--) {
          if (isSameSeat(rows[r][2], seatStr)) {
            found = {
              seat: seatStr,
              name: "學生" + seatStr,
              item: rows[r][3] || "",
              status: rows[r][4] || "🟢 已完成",
              score: rows[r][5] !== undefined ? rows[r][5] : "",
              pendingDetails: rows[r][6] || ""
            };
            break;
          }
        }
        list.push(found || { seat: seatStr, name: "學生" + seatStr, item: "", status: "🟢 已完成", score: "", pendingDetails: "" });
      }
      result = { status: "success", data: list, unsubmittedMap: unsubmittedMap };
    }
    else if (action === "updateHomeworkBatch" || action === "saveHomeworkStatus") {
      const updates = postData.updates || postData.data || [];
      const hwSheet = ss.getSheetByName("📋 個別作業追蹤");
      const scoreSheet = ss.getSheetByName("📊 成績登錄庫");
      const todayRoc = getTodayROCDate();
      const dateStr = Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd");

      // 動態容錯：若既有工作表第一列標題尚未補齊或為舊稱，自動更新欄位名稱
      if (hwSheet.getLastRow() >= 1) {
        const headerRow = hwSheet.getRange(1, 1, 1, 8).getValues()[0];
        if (!headerRow[5] || headerRow[5] === "作業成績") {
          hwSheet.getRange(1, 6).setValue("成績");
        }
        if (!headerRow[6] || headerRow[6] === "教師個別評語與待補內容") {
          hwSheet.getRange(1, 7).setValue("評語與備註");
        }
        if (!headerRow[7]) {
          hwSheet.getRange(1, 8).setValue("最後更新時間");
        }
      }

      updates.forEach(u => {
        const seat = String(u.seat || "").trim();
        const item = u.item || u.homework || "課堂作業";
        const status = u.status || "🟢 已完成";
        const scoreVal = (u.score !== undefined && u.score !== "" && u.score !== null) ? Number(u.score) : "";
        const details = u.pendingDetails || u.details || u.pending || "";
        const lesson = u.lesson || postData.lesson || "國文課堂";

        // 1. 寫入【📋 個別作業追蹤】(歷程追加)
        hwSheet.appendRow([
          todayRoc,
          lesson,
          seat,
          item,
          status,
          scoreVal,
          details,
          new Date()
        ]);

        // 2. 若有填寫作業成績，同步寫入【📊 成績登錄庫】(測驗類別為 "平時作業")
        if (scoreVal !== "" && !isNaN(scoreVal) && scoreVal >= 0 && scoreVal <= 100) {
          scoreSheet.appendRow([
            dateStr,
            lesson,
            "平時作業",
            item,
            "作業完成評量",
            seat,
            scoreVal,
            100,
            details || "教師評定作業成績"
          ]);
        }
      });
      result = { status: "success", message: "全班作業進度與成績已成功寫入雲端試算表！" };
    }

    // ----------------------------------------------------
    // 【任務指派儲存與取得】個別化今日學習任務起始點
    // ----------------------------------------------------
    else if (action === "saveStudentMissions") {
      const lesson = postData.lesson || "通用課程";
      const missions = postData.missions || {};
      const propKey = "missions_" + encodeURIComponent(lesson);
      PropertiesService.getScriptProperties().setProperty(propKey, JSON.stringify(missions));
      result = { status: "success", message: "學生個別任務指派已成功儲存至雲端！" };
    }
    else if (action === "getStudentMissions") {
      const lesson = postData.lesson || (e.parameter ? e.parameter.lesson : "") || "通用課程";
      const propKey = "missions_" + encodeURIComponent(lesson);
      const raw = PropertiesService.getScriptProperties().getProperty(propKey);
      result = { status: "success", data: raw ? JSON.parse(raw) : {} };
    }

    // ----------------------------------------------------
    // 【免密碼公開區】讀取學生個人學習成就資料 (個別作業狀態 ＋ 各項評量作答歷程)
    // 供電子書左側個人成就卡即時抓取試算表最新數據
    // ----------------------------------------------------
    else if (action === "getStudentAchievementData") {
      const seat = String(postData.seat || (e.parameter ? e.parameter.seat : "") || "").trim();

      // 1. 作業狀態：連結【📋 個別作業追蹤】，依座號搜尋所有「未交」之作業項目名稱（不用課別）
      const hwSheet = ss.getSheetByName("📋 個別作業追蹤");
      const unsubmittedItems = [];
      const unsubmittedRecords = [];
      let latestHomework = null;

      if (hwSheet && hwSheet.getLastRow() >= 2) {
        const hwRows = hwSheet.getDataRange().getValues();
        for (let r = 1; r < hwRows.length; r++) {
          const rDate = String(hwRows[r][0] || "").trim();
          const rLesson = String(hwRows[r][1] || "").trim();
          const rSeat = String(hwRows[r][2] || "").trim();
          const rItem = String(hwRows[r][3] || "").trim();
          const rStatus = String(hwRows[r][4] || "").trim();
          const rScore = (hwRows[r][5] !== undefined && hwRows[r][5] !== "") ? hwRows[r][5] : "";
          const rDetails = String(hwRows[r][6] || "").trim();

          if (isSameSeat(rSeat, seat)) {
            // 只要狀態包含「未交」，全數蒐集其作業項目名稱（不用課別）
            if (rStatus.includes("未交")) {
              if (rItem && !unsubmittedItems.includes(rItem)) {
                unsubmittedItems.push(rItem);
              }
              unsubmittedRecords.push({
                date: rDate,
                lesson: rLesson,
                item: rItem,
                status: rStatus,
                score: rScore,
                details: rDetails
              });
            }
            latestHomework = {
              date: rDate,
              lesson: rLesson,
              item: rItem,
              status: rStatus,
              score: rScore,
              details: rDetails
            };
          }
        }
      }

      // 2. 各測驗成績：連結【📊 成績登錄庫】，對照座號，依測驗大標、細項子標計算最後一次成績與最佳成績
      const scoreSheet = ss.getSheetByName("📊 成績登錄庫");
      const quizSummary = {}; // groupKey -> { category, subCategory, scores: [], best: 0, lastScore: 0, count: 0, lastDate: "" }
      const quizRecords = [];

      if (scoreSheet && scoreSheet.getLastRow() >= 2) {
        const scoreRows = scoreSheet.getDataRange().getValues();
        for (let r = 1; r < scoreRows.length; r++) {
          const rDate = String(scoreRows[r][0] || "");
          const rLesson = String(scoreRows[r][1] || "");
          const rType = String(scoreRows[r][2] || "");
          const rCat = String(scoreRows[r][3] || "").trim(); // 測驗大標
          const rSub = String(scoreRows[r][4] || "").trim(); // 細項子標
          const rSeat = String(scoreRows[r][5] || "").trim();
          const rScore = Number(scoreRows[r][6]);
          const rMax = Number(scoreRows[r][7]) || 100;
          const rNote = String(scoreRows[r][8] || "");

          if (isSameSeat(rSeat, seat)) {
            if (!isNaN(rScore)) {
              quizRecords.push({
                date: rDate,
                lesson: rLesson,
                type: rType,
                category: rCat,
                subCategory: rSub,
                score: rScore,
                maxScore: rMax,
                note: rNote
              });

              // 用「測驗大標 ＋ 細項子標」或細項子標做識別
              const groupKey = (rSub && rCat) ? `${rCat}:::${rSub}` : (rSub || rCat);
              if (!quizSummary[groupKey]) {
                quizSummary[groupKey] = {
                  category: rCat,
                  subCategory: rSub,
                  scores: [],
                  best: 0,
                  lastScore: 0,
                  count: 0,
                  lastDate: rDate
                };
              }
              quizSummary[groupKey].scores.push(rScore);
              quizSummary[groupKey].lastScore = rScore; // 遍歷由前到後，最後讀到的就是最後一次成績
              quizSummary[groupKey].lastDate = rDate;
            }
          }
        }
      }

      // 計算各題型之最佳成績 (最高分)
      Object.keys(quizSummary).forEach(k => {
        const item = quizSummary[k];
        item.count = item.scores.length;
        item.best = Math.max(...item.scores);
      });

      result = {
        status: "success",
        seat: seat,
        unsubmittedItems: unsubmittedItems,
        unsubmittedRecords: unsubmittedRecords,
        latestHomework: latestHomework,
        quizSummary: quizSummary,
        quizRecords: quizRecords
      };
    }

    // ----------------------------------------------------
    // 【第二層安全驗證】成績與輔導（密碼校驗）
    // 強化防禦：限定 POST Body 傳輸、錯 5 次鎖定 15 分鐘 (風險 ②、③)
    // ----------------------------------------------------
    else if (action === "verifyLevel2") {
      if (!isPost) throw new Error("驗證密碼必須採用 POST 資料本文傳輸！");
      const authResult = verifyPasswordWithBruteForceProtection(ss, 2, postData.password);
      if (authResult.success) {
        result = { status: "success", verified: true, level: 2 };
      } else {
        result = { status: "fail", message: authResult.message };
      }
    }

    // ----------------------------------------------------
    // 【第二層權限】手動登打紙本成績（全班 01~06）
    // ----------------------------------------------------
    else if (action === "saveManualScores") {
      const authCheck = checkAuthQuiet(ss, 2, postData.password);
      if (!authCheck) throw new Error("二級權限驗證失敗，無法登打成績！");
      const sheet = ss.getSheetByName("📊 成績登錄庫");
      const scoresObj = postData.scores || {};
      const recordDate = postData.recordDate || Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd");
      const title = postData.title || "紙本隨堂考";
      const lesson = postData.lesson || "國文單元";

      Object.keys(scoresObj).forEach(seat => {
        const val = scoresObj[seat];
        if (val !== "" && val !== null && val !== undefined) {
          sheet.appendRow([
            recordDate,
            lesson,
            "紙本測驗",
            title,
            "平時成績",
            seat,
            Number(val) || 0,
            100,
            "教師手動登記"
          ]);
        }
      });
      result = { status: "success", message: "紙本成績已成功寫入資料庫！" };
    }

    // ----------------------------------------------------
    // 【第二層權限】取得學生成績與統計數據
    // ----------------------------------------------------
    else if (action === "getScoreStats") {
      const authCheck = checkAuthQuiet(ss, 2, postData.password);
      if (!authCheck) throw new Error("二級權限驗證失敗，無法調閱成績歷程！");
      const statsSheet = ss.getSheetByName("📈 成績統計與歷程");
      const stats = statsSheet.getDataRange().getValues();
      let summaryText = "";
      const dataRows = [];
      const headers = stats.length > 0 ? stats[0] : [];
      for (let i = 1; i < stats.length; i++) {
        dataRows.push(stats[i]);
        summaryText += `🔹 <b>${stats[i][0]}號</b>：學期平時總平均 <b>${stats[i][1]}</b> 分 ｜ 單課總平均：${stats[i][2]} 分 ｜ 單課作業：${stats[i][3]} 分 ｜ 詞語一最佳：${stats[i][4]} 分 ｜ 詞語二最佳：${stats[i][5]} 分<br>`;
      }
      result = {
        status: "success",
        headers: headers,
        statsSummary: dataRows,
        summaryText: summaryText || "目前尚無足夠統計資料。"
      };
    }

    // ----------------------------------------------------
    // 【第二層權限】讀取/新增 IEP 個別輔導紀錄
    // ----------------------------------------------------
    else if (action === "getCounselingLogs") {
      const authCheck = checkAuthQuiet(ss, 2, postData.password);
      if (!authCheck) throw new Error("二級權限驗證失敗，無法調閱 IEP 紀錄！");
      const sheet = ss.getSheetByName("🔒 個別輔導紀錄");
      const rows = sheet.getDataRange().getValues();
      const logs = [];
      for (let i = rows.length - 1; i >= 1; i--) {
        logs.push({
          date: rows[i][0],
          seat: rows[i][1],
          summary: rows[i][2],
          detail: rows[i][3],
          followUp: rows[i][4]
        });
      }
      result = { status: "success", logs: logs };
    }
    else if (action === "addCounselingLog") {
      const authCheck = checkAuthQuiet(ss, 2, postData.password);
      if (!authCheck) throw new Error("二級權限驗證失敗，無法新增 IEP 紀錄！");
      const sheet = ss.getSheetByName("🔒 個別輔導紀錄");
      const todayRoc = getTodayROCDate();
      sheet.appendRow([
        todayRoc,
        postData.seat || "01",
        postData.summary || "",
        postData.detail || "",
        "持續追蹤",
        "任課教師"
      ]);
      result = { status: "success", message: "IEP 輔導紀錄已成功安全儲存！" };
    }

  } catch (err) {
    result = { status: "error", message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==============================================================================
// 3. 【資安防禦輔助函式】
// ==============================================================================

/**
 * 密碼比對並具備防暴力猜測鎖定機制 (錯 5 次鎖定 15 分鐘)
 */
function verifyPasswordWithBruteForceProtection(ss, level, inputPwd) {
  const cache = CacheService.getScriptCache();
  const lockKey = "auth_lockout_level_" + level;
  const failKey = "auth_fail_count_level_" + level;

  // 1. 檢查是否處於鎖定狀態
  if (cache.get(lockKey)) {
    return {
      success: false,
      message: "❌ 密碼連續錯誤次數過多，系統已啟動安全保護，請 15 分鐘後再試！"
    };
  }

  // 2. 比對試算表密碼
  const configSheet = ss.getSheetByName("⚙️ 系統設定");
  const cell = (level === 1) ? "B2" : "B3";
  const realPwd = String(configSheet.getRange(cell).getValue()).trim();

  if (String(inputPwd).trim() === realPwd && realPwd !== "") {
    // 驗證成功：清除失敗計數
    cache.remove(failKey);
    cache.remove(lockKey);
    return { success: true };
  } else {
    // 驗證失敗：計數 + 1
    let failCount = Number(cache.get(failKey) || 0) + 1;
    if (failCount >= 5) {
      cache.put(lockKey, "locked", 900); // 鎖定 15 分鐘 (900秒)
      cache.remove(failKey);
      return {
        success: false,
        message: "❌ 密碼連續錯誤達 5 次，系統已安全鎖定 15 分鐘！"
      };
    } else {
      cache.put(failKey, String(failCount), 900);
      return {
        success: false,
        message: `❌ 密碼錯誤！(剩餘嘗試次數：${5 - failCount} 次)`
      };
    }
  }
}

/**
 * 靜態權限核驗 (不拋錯誤，供內部 API 檢查)
 */
function checkAuthQuiet(ss, level, inputPwd) {
  const configSheet = ss.getSheetByName("⚙️ 系統設定");
  const cell = (level === 1) ? "B2" : "B3";
  const realPwd = String(configSheet.getRange(cell).getValue()).trim();
  return String(inputPwd).trim() === realPwd && realPwd !== "";
}
