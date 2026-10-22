// generate_words2.ts
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
import { WORDS2_DATA, Word2Item } from "./worksheet_data.ts";
import {
  FONT_FAMILY,
  BORDER_CELL,
  BORDER_THIN,
  BORDER_THICK,
  generateQrPngBuffer,
  buildHeaderTable,
  buildCorrectionTable
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
  { key: "A", name: "卷 A", seed: 4057 },
  { key: "B", name: "卷 B", seed: 5071 },
  { key: "C", name: "卷 C", seed: 6089 }
];

const OUTPUT_DIR = "c:/Users/user/Documents/115國文電子書/L4 愛蓮說/學習單/Word檔";

// 產製單一卷別的 Word 文件
async function generateDocx(versionKey: string, versionName: string, isTeacher: boolean, seed: number) {
  const qrUrl = `https://teach-chinese.web.app/l4/w2.html?v=${versionKey}`;
  const qrBytes = await generateQrPngBuffer(qrUrl);
  const modeText = isTeacher ? "【教師紅字解答版】" : "【學生自主練習版】";
  const mainTitle = `國文二上 第四課〈愛蓮說〉詞語二學習單（${versionName}）${modeText}`;

  const children: (Paragraph | Table)[] = [];

  // ==========================================
  // 【第 1 頁】題型一：詞語習寫（5 欄式簡潔排版）＋ 4欄15列訂正表
  // 依學習區固定順序 1~15：號 ｜ 目標詞語／注音 ｜ 習寫 1 (國字+注音) ｜ 習寫 2 (國字+注音) ｜ 習寫 3 (國字+注音)
  // ==========================================
  children.push(
    buildHeaderTable(mainTitle, "題型一：重點詞語習寫（請端正寫出國字與正確注音各3次）", qrBytes, "第 1 頁 / 詞語習寫")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: "說明：請細讀目標生字與注音，在右方練習格內將國字與注音工整習寫 3 次；寫錯時可於下方訂正表進行強化複習。",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const writeRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "號", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 36, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "目標詞語／注音", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "習寫 1\n(國字+注音)", font: FONT_FAMILY, size: 18, bold: true })] })]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "習寫 2\n(國字+注音)", font: FONT_FAMILY, size: 18, bold: true })] })]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "習寫 3\n(國字+注音)", font: FONT_FAMILY, size: 18, bold: true })] })]
        })
      ]
    })
  ];

  for (const item of WORDS2_DATA) {
    const tZhuyin = isTeacher ? item.targetZhuyin : "　";
    const tChar = isTeacher ? item.targetChar : "　";
    const cellChild = () => [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: tZhuyin, font: FONT_FAMILY, size: 18, color: "0284C7" }),
          new TextRun({ text: `\n${tChar}`, font: FONT_FAMILY, size: 24, bold: true, color: isTeacher ? "DC2626" : "000000" })
        ]
      })
    ];

    writeRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.id}`, font: FONT_FAMILY, size: 20, bold: true })] })]
          }),
          new TableCell({
            borders: BORDER_CELL,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${item.word}  `, font: FONT_FAMILY, size: 24, bold: true, color: "1E3A8A" }),
                  new TextRun({ text: `（${item.fullZhuyin}）\n`, font: FONT_FAMILY, size: 18, color: "0284C7" }),
                  new TextRun({ text: `考查：【${item.targetChar}】${item.targetZhuyin}（${item.radicalInfo}）`, font: FONT_FAMILY, size: 18, color: "475569" })
                ]
              })
            ]
          }),
          new TableCell({ borders: BORDER_CELL, children: cellChild() }),
          new TableCell({ borders: BORDER_CELL, children: cellChild() }),
          new TableCell({ borders: BORDER_CELL, children: cellChild() })
        ]
      })
    );
  }

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: writeRows }));

  // 下方 4欄15列空白複習訂正表格
  children.push(
    new Paragraph({
      spacing: { before: 120, after: 60 },
      children: [
        new TextRun({ text: "★ 錯字弱點複習自我訂正區（4欄15列自主檢視）", font: FONT_FAMILY, size: 22, bold: true, color: "B45309" })
      ]
    })
  );
  children.push(buildCorrectionTable(4, 15, "詞語二自我訂正檢核表"));

  // ==========================================
  // 【第 2 頁】題型二：依題目寫出注音（雙欄排列）
  // 換頁！題目隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型二：依題目寫出注音（雙欄標準排版・15題）", qrBytes, "第 2 頁 / 依題目寫注音")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 100 },
      children: [
        new TextRun({
          text: "說明：請仔細看題目引號中的生字，在括號內填入正確的標準注音：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledQ2 = seededShuffle(WORDS2_DATA, seed + 123);
  const leftColQ2 = shuffledQ2.slice(0, 8);
  const rightColQ2 = shuffledQ2.slice(8, 15);

  const renderTwoColRows = (
    leftList: Word2Item[],
    rightList: Word2Item[],
    mode: "zhuyin" | "char"
  ) => {
    const tableRows: TableRow[] = [];
    const maxLen = Math.max(leftList.length, rightList.length);

    for (let i = 0; i < maxLen; i++) {
      const lItem = leftList[i];
      const rItem = rightList[i];

      const renderItemParagraph = (item: Word2Item | undefined, itemNum: number) => {
        if (!item) return new Paragraph({ children: [] });
        const stem = mode === "zhuyin" ? item.quoteStem : item.quoteCharStem;
        const answer = mode === "zhuyin" ? item.targetZhuyin : item.targetChar;
        const ansDisplay = isTeacher
          ? `（　${answer}　）`
          : "（　　　）";

        return new Paragraph({
          spacing: { before: 70, after: 70 },
          children: [
            new TextRun({ text: `${itemNum}. `, font: FONT_FAMILY, size: 26, bold: true, color: "1E3A8A" }),
            new TextRun({ text: `${stem}：`, font: FONT_FAMILY, size: 26, bold: true }),
            new TextRun({
              text: ansDisplay,
              font: FONT_FAMILY,
              size: 26,
              bold: isTeacher,
              color: isTeacher ? "DC2626" : "0F172A"
            })
          ]
        });
      };

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" }
              },
              children: [renderItemParagraph(lItem, i + 1)]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" }
              },
              children: [renderItemParagraph(rItem, i + 1 + 8)]
            })
          ]
        })
      );
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows
    });
  };

  children.push(renderTwoColRows(leftColQ2, rightColQ2, "zhuyin"));

  // ==========================================
  // 【第 3 頁】題型三：依題目寫出國字（雙欄排列）
  // 換頁！題目隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型三：依題目寫出國字（雙欄標準排版・15題）", qrBytes, "第 3 頁 / 依題目寫國字")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 100 },
      children: [
        new TextRun({
          text: "說明：請仔細看題目引號中的注音提示，在括號內填入正確的國字：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledQ3 = seededShuffle(WORDS2_DATA, seed + 234);
  const leftColQ3 = shuffledQ3.slice(0, 8);
  const rightColQ3 = shuffledQ3.slice(8, 15);
  children.push(renderTwoColRows(leftColQ3, rightColQ3, "char"));

  // ==========================================
  // 【第 4 頁】題型四：字詞填空學習單（課文原句・15題）
  // 換頁！題目隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型四：字詞填空（課文原句精讀篇・15題）", qrBytes, "第 4 頁 / 課文原句填空")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: "說明：請熟讀課文文句脈絡，在括號內填入正確的國字或詞語：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledQ4 = seededShuffle(WORDS2_DATA, seed + 345);
  shuffledQ4.forEach((item, idx) => {
    let sentenceText = item.quoteBlankSentence;
    const ans = item.targetChar;
    if (isTeacher) {
      sentenceText = sentenceText.replace("（　　）", `（【${ans}】）`);
    }
    children.push(
      new Paragraph({
        spacing: { before: 50, after: 50 },
        children: [
          new TextRun({ text: `${idx + 1}. `, font: FONT_FAMILY, size: 24, bold: true, color: "1E3A8A" }),
          new TextRun({
            text: isTeacher ? sentenceText : item.quoteBlankSentence,
            font: FONT_FAMILY,
            size: 24,
            bold: isTeacher,
            color: isTeacher ? "DC2626" : "0F172A"
          })
        ]
      })
    );
  });

  // ==========================================
  // 【第 5 頁】題型五：字詞填空學習單（生活例句應用篇・15題）
  // 換頁！題目隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型五：字詞填空（生活例句應用篇・15題）", qrBytes, "第 5 頁 / 生活例句填空")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: "說明：請閱讀生活情境短文，根據文意在括號內填入適當的國字或詞語：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledQ5 = seededShuffle(WORDS2_DATA, seed + 456);
  shuffledQ5.forEach((item, idx) => {
    let sentenceText = item.exampleBlankSentence;
    const ans = item.targetChar;
    if (isTeacher) {
      sentenceText = sentenceText.replace(/（　　）/g, `（【${ans}】）`);
    }
    children.push(
      new Paragraph({
        spacing: { before: 50, after: 50 },
        children: [
          new TextRun({ text: `${idx + 1}. `, font: FONT_FAMILY, size: 24, bold: true, color: "1E3A8A" }),
          new TextRun({
            text: isTeacher ? sentenceText : item.exampleBlankSentence,
            font: FONT_FAMILY,
            size: 24,
            bold: isTeacher,
            color: isTeacher ? "DC2626" : "0F172A"
          })
        ]
      })
    );
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
  const fileName = `詞語二_${versionName.replace(" ", "")}_${isTeacher ? "教師版" : "學生版"}.docx`;
  const filePath = `${OUTPUT_DIR}/${fileName}`;
  await Deno.writeFile(filePath, buffer);
  console.log(`Saved: ${fileName} (${buffer.byteLength} bytes)`);
}

// 產製 3 卷 x 2 版本
console.log("=== 開始產製 詞語二 學習單 Word 檔（全新確認版型）===");
for (const v of VERSIONS) {
  await generateDocx(v.key, v.name, false, v.seed); // 學生版
  await generateDocx(v.key, v.name, true, v.seed);  // 教師版
}
console.log("=== 詞語二 學習單 Word 檔產製完成！ ===");
