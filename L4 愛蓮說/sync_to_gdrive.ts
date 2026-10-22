// sync_to_gdrive.ts
import { copy } from "https://deno.land/std@0.224.0/fs/copy.ts";

const srcDir = "C:/Users/user/Documents/115國文電子書/L4 愛蓮說";
const gdriveBase = "G:/我的雲端硬碟/新港特教 君/課程與教學/教材庫/國文/115上 第4課 愛蓮說";

const targetEbook = `${gdriveBase}/電子書`;
const targetAudio = `${gdriveBase}/有聲卷`;
const targetWorksheet = `${gdriveBase}/學習單`;

await Deno.mkdir(targetEbook, { recursive: true });
await Deno.mkdir(targetAudio, { recursive: true });
await Deno.mkdir(targetWorksheet, { recursive: true });

async function safeCopyFile(src: string, dest: string, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await Deno.copyFile(src, dest);
      return;
    } catch (e) {
      if (i === maxRetries - 1) {
        console.warn(`[WARN] Could not copy ${src} -> ${dest}: ${e.message}`);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
}

// 1. 複製電子書檔案
await safeCopyFile(`${srcDir}/index.html`, `${targetEbook}/index.html`);
await safeCopyFile(`${srcDir}/audio_quiz.html`, `${targetEbook}/audio_quiz.html`);
await safeCopyFile(`${srcDir}/classroom_worksheet.html`, `${targetEbook}/classroom_worksheet.html`);

// 2. 複製有聲卷檔案
await safeCopyFile(`${srcDir}/audio_quiz.html`, `${targetAudio}/audio_quiz.html`);

// 3. 複製題庫 Markdown
await safeCopyFile(`${srcDir}/L4_愛蓮說_完整評量題庫彙整_可編輯檔.md`, `${gdriveBase}/L4_愛蓮說_完整評量題庫彙整_可編輯檔.md`);
await safeCopyFile(`${srcDir}/L4_愛蓮說_完整評量題庫彙整_可編輯檔.md`, `${targetEbook}/L4_愛蓮說_完整評量題庫彙整_可編輯檔.md`);

// 4. 複製學習單目錄所有 Word 檔與有聲網頁
const targetWordDir = `${targetWorksheet}/Word檔`;
const targetHtmlDir = `${targetWorksheet}/有聲網頁`;
await Deno.mkdir(targetWordDir, { recursive: true });
await Deno.mkdir(targetHtmlDir, { recursive: true });

for await (const entry of Deno.readDir(`${srcDir}/學習單/Word檔`)) {
  if (entry.isFile) {
    await safeCopyFile(`${srcDir}/學習單/Word檔/${entry.name}`, `${targetWordDir}/${entry.name}`);
  }
}

for await (const entry of Deno.readDir(`${srcDir}/學習單/有聲網頁`)) {
  if (entry.isFile) {
    await safeCopyFile(`${srcDir}/學習單/有聲網頁/${entry.name}`, `${targetHtmlDir}/${entry.name}`);
  }
}

console.log("SUCCESS: All L4 愛蓮說 worksheets, word docs, audio web pages, and question bank Markdown synchronized to Google Drive!");
