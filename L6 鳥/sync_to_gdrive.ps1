# sync_to_gdrive.ps1
# 同步 115國文二上 第六課〈鳥〉教材成果至 Google 雲端硬碟

$srcDir = "C:\Users\user\Documents\115國文電子書\L6 鳥"
$gdriveBase = "G:\我的雲端硬碟\新港特教 君\課程與教學\教材庫\國文\115上 第6課 鳥"

$targetSystem = Join-Path $gdriveBase "電子書"
$targetWorksheet = Join-Path $gdriveBase "學習單"
$targetWorksheetWord = Join-Path $targetWorksheet "Word檔"

if (-not (Test-Path $targetSystem)) { New-Item -ItemType Directory -Path $targetSystem -Force | Out-Null }
if (-not (Test-Path $targetWorksheet)) { New-Item -ItemType Directory -Path $targetWorksheet -Force | Out-Null }
if (-not (Test-Path $targetWorksheetWord)) { New-Item -ItemType Directory -Path $targetWorksheetWord -Force | Out-Null }

Write-Host "開始同步 L6〈鳥〉教材成果至 Google 雲端硬碟..." -ForegroundColor Cyan

# 0. 依據使用者指示，刪除雲端硬碟根目錄下的舊版 index.html，保留最新版電子書資料夾
$rootOldHtml = Join-Path $gdriveBase "index.html"
if (Test-Path $rootOldHtml) {
    Remove-Item $rootOldHtml -Force
    Write-Host "已清理雲端硬碟根目錄舊版 index.html，保留【電子書】資料夾" -ForegroundColor Yellow
}

# 1. 電子書與資產資料夾
Copy-Item (Join-Path $srcDir "index.html") $targetSystem -Force
Copy-Item (Join-Path $srcDir "L6_鳥_完整評量題庫彙整_可編輯檔.md") $targetSystem -Force

$targetSystemAssets = Join-Path $targetSystem "assets"
if (Test-Path $targetSystemAssets) { Remove-Item $targetSystemAssets -Recurse -Force }
Copy-Item (Join-Path $srcDir "assets") $targetSystem -Recurse -Force
Write-Host "電子書系統與圖文資源同步完成 (電子書\index.html, assets, 題庫檔)" -ForegroundColor Green

# 2. 學習單 24 份 Word 檔
$wordSrcDir = Join-Path $srcDir "學習單\Word檔"
if (Test-Path $wordSrcDir) {
    Copy-Item "$wordSrcDir\*.docx" $targetWorksheetWord -Force
    Write-Host "24 份分級學習單 Word 檔同步完成至 學習單\Word檔" -ForegroundColor Green
}

Write-Host "恭喜！L6〈鳥〉全套成果（最新版電子書、24份Word學習單、圖文資源、題庫彙整檔）已完美更新至雲端硬碟！" -ForegroundColor Yellow
