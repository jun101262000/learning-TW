$srcDir = "C:\Users\user\Documents\115國文電子書\L4 愛蓮說"
$deployDir = Join-Path $srcDir "deploy_web"

# 1. 本地根目錄檔案同步
Copy-Item (Join-Path $deployDir "index.html") (Join-Path $srcDir "index.html") -Force
Copy-Item (Join-Path $deployDir "audio_quiz.html") (Join-Path $srcDir "audio_quiz.html") -Force
Copy-Item (Join-Path $deployDir "classroom_worksheet.html") (Join-Path $srcDir "classroom_worksheet.html") -Force

# 2. Google 雲端硬碟目錄同步
$gdriveBase = "G:\我的雲端硬碟\新港特教 君\課程與教學\教材庫\國文\115上 第4課 愛蓮說"
$targetEbook = Join-Path $gdriveBase "電子書"
$targetAudio = Join-Path $gdriveBase "有聲卷"
$targetWorksheet = Join-Path $gdriveBase "學習單"

if (-not (Test-Path $targetEbook)) { New-Item -ItemType Directory -Path $targetEbook -Force | Out-Null }
if (-not (Test-Path $targetAudio)) { New-Item -ItemType Directory -Path $targetAudio -Force | Out-Null }
if (-not (Test-Path $targetWorksheet)) { New-Item -ItemType Directory -Path $targetWorksheet -Force | Out-Null }

# 複製電子書（含所有靜態資源與 HTML）
Copy-Item (Join-Path $deployDir "*") $targetEbook -Recurse -Force

# 複製有聲卷（含 HTML 與 assets）
Copy-Item (Join-Path $deployDir "audio_quiz.html") $targetAudio -Force
$assetsDir = Join-Path $deployDir "assets"
if (Test-Path $assetsDir) {
    Copy-Item $assetsDir $targetAudio -Recurse -Force
}

# 複製課堂學習單
Copy-Item (Join-Path $deployDir "classroom_worksheet.html") $targetWorksheet -Force

# 複製 Google Apps Script 接收端腳本至雲端硬碟
$gasFile = Join-Path $srcDir "L4愛蓮說評量成果_GoogleAppsScript.js"
if (Test-Path $gasFile) {
    Copy-Item $gasFile $gdriveBase -Force
}

Write-Output "SUCCESS: L4 愛蓮說 all files synchronized successfully to local and Google Drive!"
