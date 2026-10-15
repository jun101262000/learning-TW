/**
 * ==============================================================================
 * 115國文數位教材：第4課 愛蓮說 - 評量成果接收端 (Google Apps Script)
 * ==============================================================================
 * 
 * 【對應雲端試算表】
 * G:\我的雲端硬碟\新港特教 君\課程與教學\教材庫\國文\115上 第4課 愛蓮說\115上B3自學2 學生作答歷程.gsheet
 * 
 * 【收集欄位規範（完全符合手冊第 7 條與第 10 條）】
 * 1. 作答日期 (Timestamp)
 * 2. 座號 (老師為 test.，學生為 01~06)
 * 3. 第幾次作答 (歷程計次)
 * 4. 作答內容 (題號與選項字串)
 * 5. 評分結果 (答對題數/所有題數，正確率，得分)
 * 6. 提示方式或自主完成 (自主完成 / 提示後完成)
 * 7. 測驗單元 (例：綜合會考有聲練習卷)
 * 8. 耗時秒數 (例：180 秒)
 * 
 * 【安裝與部署步驟】
 * 1. 在 Google 雲端硬碟開啟「115上B3自學2 學生作答歷程.gsheet」。
 * 2. 點擊頂端功能列「擴充功能」->「Apps Script」。
 * 3. 刪除原有代碼，將本檔案內容全部複製貼上。
 * 4. 點擊右上角「部署」->「新增部署作業」。
 * 5. 類型選擇「網頁應用程式 (Web App)」：
 *    - 說明：115 第4課 愛蓮說 作答歷程收集服務
 *    - 執行身分：我 (您的 Google 帳號)
 *    - 誰可以存取：所有人 (Anyone)  <--- 必須選此項以確保免登入即可回傳成績
 * 6. 點擊「部署」，複製產生的「網頁應用程式網址 (Web App URL)」。
 * 7. 將該網址貼入本課電子書首頁或有聲卷的身分設定面板中，即可自動在線同步收集成績！
 */

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000); // 防範並發寫入衝突

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // 初始化試算表表頭 (如果新表無表頭)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "作答日期", 
        "座號", 
        "第幾次作答", 
        "評分結果 (得分)", 
        "答對題數/所有題數", 
        "正確率", 
        "提示方式或自主完成", 
        "評量單元名稱", 
        "作答內容明細", 
        "耗時(秒)"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground("#0284c7");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp = new Date();
    var seat = data.seat || data.userRole || "未指定"; // 老師為 test.，學生為 01~06
    var attemptCount = data.attemptCount || "第 1 次";
    var score = data.score !== undefined ? data.score : "";
    var totalQuestions = data.totalQuestions || 10;
    var correctCount = data.correctCount !== undefined ? data.correctCount : 0;
    var scoreRatio = correctCount + " / " + totalQuestions + " 題";
    var accuracy = data.accuracy !== undefined ? (data.accuracy + "%") : (Math.round((correctCount / totalQuestions) * 100) + "%");
    var completionMode = data.completionMode || "自主完成";
    var moduleTitle = data.moduleTitle || data.title || "第4課 愛蓮說 綜合會考評量";
    var userAnswers = typeof data.userAnswers === "object" ? JSON.stringify(data.userAnswers) : (data.userAnswers || "");
    var durationSeconds = data.durationSeconds || "";

    // 寫入試算表資料列
    sheet.appendRow([
      timestamp,
      seat,
      attemptCount,
      score,
      scoreRatio,
      accuracy,
      completionMode,
      moduleTitle,
      userAnswers,
      durationSeconds
    ]);

    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "第4課 愛蓮說 成績歷程記錄成功！",
      seat: seat,
      score: score,
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "第4課 愛蓮說 評量成果接收服務運作中！"
  })).setMimeType(ContentService.MimeType.JSON);
}
