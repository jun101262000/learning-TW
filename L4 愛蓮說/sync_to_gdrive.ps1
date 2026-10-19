$srcDir = "C:\Users\user\Documents\115國文電子書\L4 愛蓮說"

# Google 雲端硬碟目錄同步（直接由精簡後的本地根目錄同步，不再重複建立 deploy_web 雙份檔案）
$gdriveBase = "G:\我的雲端硬碟\新港特教 君\課程與教學\教材庫\國文\115上 第4課 愛蓮說"
$targetEbook = Join-Path $gdriveBase "電子書"
$targetAudio = Join-Path $gdriveBase "有聲卷"
$targetWorksheet = Join-Path $gdriveBase "學習單"

if (-not (Test-Path $targetEbook)) { New-Item -ItemType Directory -Path $targetEbook -Force | Out-Null }
if (-not (Test-Path $targetAudio)) { New-Item -ItemType Directory -Path $targetAudio -Force | Out-Null }
if (-not (Test-Path $targetWorksheet)) { New-Item -ItemType Directory -Path $targetWorksheet -Force | Out-Null }

# 1. 複製電子書（index.html、audio_quiz.html、classroom_worksheet.html 與精簡後的 assets/images）
Copy-Item (Join-Path $srcDir "index.html") $targetEbook -Force
Copy-Item (Join-Path $srcDir "audio_quiz.html") $targetEbook -Force
Copy-Item (Join-Path $srcDir "classroom_worksheet.html") $targetEbook -Force

$targetEbookAssets = Join-Path $targetEbook "assets"
if (Test-Path $targetEbookAssets) { Remove-Item $targetEbookAssets -Recurse -Force }
Copy-Item (Join-Path $srcDir "assets") $targetEbook -Recurse -Force

# 2. 複製有聲卷（純文字語音題目，無須重複複製課文圖片）
$targetAudioAssets = Join-Path $targetAudio "assets"
if (Test-Path $targetAudioAssets) { Remove-Item $targetAudioAssets -Recurse -Force }
Copy-Item (Join-Path $srcDir "audio_quiz.html") $targetAudio -Force

# 3. 複製課堂學習單
Copy-Item (Join-Path $srcDir "classroom_worksheet.html") $targetWorksheet -Force

Write-Output "SUCCESS: L4 愛蓮說 slimmed files synchronized to Google Drive!"
