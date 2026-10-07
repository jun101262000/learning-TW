/**
 * ==============================================================================
 * 115國文數位教材：自學一 世說新語選 - 評量成果接收端 (Google Apps Script)
 * ==============================================================================
 * 
 * 【功能說明】
 * 接收自學一電子書與獨立有聲測驗卷送出的測驗歷程與結果，自動寫入 Google 試算表。
 * 若身分為老師，座號記錄為 "test"；若為學生，記錄其座號 (如 "01"~"06")。
 * 
 * 【安裝與部署步驟】
 * 1. 在 Google 雲端硬碟中，將「自學一評量成果.xlsx」轉換為 Google 試算表開啟（或建立新試算表）。
 * 2. 點擊頂端選單的「擴充功能」->「Apps Script」。
 * 3. 刪除原有代碼，將本檔案代碼完整貼上。
 * 4. 點擊右上角「部署」->「新增部署作業」。
 * 5. 類型選擇「網頁應用程式 (Web App)」：
 *    - 說明：自學一評量資料接收端
 *    - 執行身分：我 (您的 Google 帳號)
 *    - 誰可以存取：所有人 (Anyone)  <--- 重要！這樣電子書才能免登入直接回傳
 * 6. 點擊「部署」，複製產生的「網頁應用程式網址 (Web App URL)」。
 * 7. 在電子書或有聲卷中，可於身分切換面板中設定此網址，即可全自動雲端收集成績！
 */

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000); // 鎖定以防同時多位學生寫入衝突

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 初始化試算表表頭 (如果尚未建立)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "時間戳記", 
        "座號/身分", 
        "評量單元/項目", 
        "得分", 
        "總題數", 
        "答對題數", 
        "正確率", 
        "作答歷程明細", 
        "用戶代理/裝置"
      ]);
      // 格式化表頭
      var headerRange = sheet.getRange(1, 1, 1, 9);
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
    var role = data.role || "未指定"; // 老師為 "test", 學生為 "01"~"06"
    var unit = data.unit || data.quizName || "自學一評量";
    var score = data.score !== undefined ? data.score : "";
    var totalQuestions = data.totalQuestions || "";
    var correctCount = data.correctCount || "";
    var accuracy = (totalQuestions > 0 && correctCount !== "") 
      ? Math.round((correctCount / totalQuestions) * 100) + "%" 
      : "";
    var details = typeof data.details === "object" ? JSON.stringify(data.details) : (data.details || "");
    var userAgent = data.userAgent || "";

    // 寫入新資料行
    sheet.appendRow([
      timestamp,
      role,
      unit,
      score,
      totalQuestions,
      correctCount,
      accuracy,
      details,
      userAgent
    ]);

    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "成績記錄成功！",
      timestamp: timestamp,
      role: role
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 支援 GET 測試連線
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "自學一評量成果接收服務正常運作中！"
  })).setMimeType(ContentService.MimeType.JSON);
}
