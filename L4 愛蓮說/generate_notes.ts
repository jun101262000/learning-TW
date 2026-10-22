// generate_notes.ts
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Packer
} from "npm:docx";
import { NOTES_DATA, MCQ_POOL, NoteItem, McqItem } from "./worksheet_data.ts";
import {
  FONT_FAMILY,
  BORDER_CELL,
  BORDER_THIN,
  BORDER_THICK,
  generateQrPngBuffer,
  buildHeaderTable
} from "./build_helpers.ts";

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

const VERSIONS = [
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

const OUTPUT_DIR = "c:/Users/user/Documents/115國文電子書/L4 愛蓮說/學習單/Word檔";

// 產製單一卷別的 Word 文件
async function generateDocx(
  versionKey: string,
  versionName: string,
  isTeacher: boolean,
  seed: number,
  mcqIndices: number[]
) {
  const qrUrl = `https://teach-chinese.web.app/l4/notes.html?v=${versionKey}`;
  const qrBytes = await generateQrPngBuffer(qrUrl);
  const modeText = isTeacher ? "【教師紅字解答版】" : "【學生自主練習版】";
  const mainTitle = `國文二上 第四課〈愛蓮說〉解釋學習單（${versionName}）${modeText}`;

  const children: (Paragraph | Table)[] = [];

  // ==========================================
  // 【第 1 頁】題型一：詞與解釋配合題（精簡版型：聚焦於解釋本身）
  // 依您確認之最新排版格式：
  // （　　） 1. 解釋：認為。
  // ==========================================
  children.push(
    buildHeaderTable(mainTitle, "題型一：詞與解釋配合題（全課15則核心注釋・請選填正確詞語代號）", qrBytes, "第 1 頁 / 詞義配合題")
  );

  const shuffledNoteChoices = seededShuffle(NOTES_DATA, seed + 11);
  const choiceLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
  const choiceMap = new Map<number, { letter: string; word: string }>();
  const choicePromptTexts: string[] = [];

  shuffledNoteChoices.forEach((item, idx) => {
    const letter = choiceLetters[idx];
    choiceMap.set(item.id, { letter, word: item.word });
    choicePromptTexts.push(`(${letter}) ${item.word}`);
  });

  const row1Texts = choicePromptTexts.slice(0, 8).join("   ｜   ");
  const row2Texts = choicePromptTexts.slice(8).join("   ｜   ");

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: BORDER_THIN,
        bottom: BORDER_THIN,
        left: BORDER_THIN,
        right: BORDER_THIN
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "F8FAFC" },
              margins: { top: 70, bottom: 70, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "【注釋目標詞語庫】：\n", font: FONT_FAMILY, size: 22, bold: true, color: "1E3A8A" }),
                    new TextRun({ text: `${row1Texts}\n`, font: FONT_FAMILY, size: 22, color: "0F172A" }),
                    new TextRun({ text: row2Texts, font: FONT_FAMILY, size: 22, color: "0F172A" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 80, after: 60 },
      children: [
        new TextRun({
          text: "說明：請細讀各題標準解釋，從上方詞語庫選出最適合的選項代號填入括號中：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledNotesQ = seededShuffle(NOTES_DATA, seed + 22);
  shuffledNotesQ.forEach((item, idx) => {
    const info = choiceMap.get(item.id)!;
    const ansText = isTeacher ? `（【${info.letter}】）` : "（　　）";
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: ansText,
            font: FONT_FAMILY,
            size: 24,
            bold: true,
            color: isTeacher ? "DC2626" : "0F172A"
          }),
          new TextRun({ text: ` ${idx + 1}. `, font: FONT_FAMILY, size: 24, bold: true, color: "1E3A8A" }),
          new TextRun({ text: `解釋：${item.explain}`, font: FONT_FAMILY, size: 24, bold: true }),
          new TextRun({
            text: isTeacher ? `  ➔ 正解：【${info.letter}】${item.word}` : "",
            font: FONT_FAMILY,
            size: 22,
            bold: true,
            color: "DC2626"
          })
        ]
      })
    );
  });

  // ==========================================
  // 【第 2 頁及後續】題型二：解釋單選題（20 題，隨機抽樣自 25 題庫）
  // 換頁！題目與選項皆隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型二：解釋與美德單選測驗（精選20題・每題5分・滿分100分）", qrBytes, "第 2 頁 / 單選測驗")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: "說明：每題有四個選項，請選出一個最適當的答案，並將選項代號填入題前括號中：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const rawSample = mcqIndices.map((i) => MCQ_POOL[i]);
  const shuffledSample = seededShuffle(rawSample, seed + 33);

  shuffledSample.forEach((qItem, idx) => {
    const originalOptions = qItem.options.map((opt, i) => ({ opt, isCorrect: i === 0 }));
    const shuffledOptions = seededShuffle(originalOptions, seed + 100 + idx);
    const optLetters = ["A", "B", "C", "D"];
    let correctLetter = "A";
    const optDisplayTexts: string[] = [];

    shuffledOptions.forEach((o, oIdx) => {
      const letter = optLetters[oIdx];
      if (o.isCorrect) correctLetter = letter;
      optDisplayTexts.push(`(${letter}) ${o.opt}`);
    });

    const ansDisplay = isTeacher ? `（【${correctLetter}】）` : "（　　）";

    children.push(
      new Paragraph({
        spacing: { before: 80, after: 30 },
        children: [
          new TextRun({
            text: ansDisplay,
            font: FONT_FAMILY,
            size: 24,
            bold: true,
            color: isTeacher ? "DC2626" : "0F172A"
          }),
          new TextRun({ text: ` ${idx + 1}. `, font: FONT_FAMILY, size: 24, bold: true, color: "1E3A8A" }),
          new TextRun({ text: qItem.stem, font: FONT_FAMILY, size: 24, bold: true })
        ]
      })
    );

    const isShortOptions = optDisplayTexts.every((t) => t.length < 18);
    if (isShortOptions) {
      children.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `${optDisplayTexts[0]}     ${optDisplayTexts[1]}     ${optDisplayTexts[2]}     ${optDisplayTexts[3]}`, font: FONT_FAMILY, size: 22 })
          ]
        })
      );
    } else {
      children.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `${optDisplayTexts[0]}\n${optDisplayTexts[1]}\n${optDisplayTexts[2]}\n${optDisplayTexts[3]}`, font: FONT_FAMILY, size: 22 })
          ]
        })
      );
    }

    if (isTeacher) {
      children.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 20, after: 40 },
          children: [
            new TextRun({ text: `【試題解析】：${qItem.explanation}`, font: FONT_FAMILY, size: 20, italic: true, color: "B45309" })
          ]
        })
      );
    }

    if (idx === 9) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
      children.push(
        buildHeaderTable(mainTitle, "題型二：解釋與美德單選測驗（續頁）", qrBytes, "第 3 頁 / 單選測驗續")
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 1000, right: 1000 }
          }
        },
        children
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const fileName = `解釋_${versionName.replace(" ", "")}_${isTeacher ? "教師版" : "學生版"}.docx`;
  const filePath = `${OUTPUT_DIR}/${fileName}`;
  await Deno.writeFile(filePath, buffer);
  console.log(`Saved: ${fileName} (${buffer.byteLength} bytes)`);
}

// 產製 3 卷 x 2 版本
console.log("=== 開始產製 解釋 學習單 Word 檔（全新確認版型）===");
for (const v of VERSIONS) {
  await generateDocx(v.key, v.name, false, v.seed, v.mcqIndices); // 學生版
  await generateDocx(v.key, v.name, true, v.seed, v.mcqIndices);  // 教師版
}
console.log("=== 解釋 學習單 Word 檔產製完成！ ===");
