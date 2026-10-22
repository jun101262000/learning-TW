// generate_words1.ts
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
  ImageRun,
  Packer
} from "npm:docx";
import { WORDS1_DATA, VIRTUE_DATA, Word1Item, VirtueItem } from "./worksheet_data.ts";
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
  { key: "A", name: "卷 A", seed: 1013 },
  { key: "B", name: "卷 B", seed: 2027 },
  { key: "C", name: "卷 C", seed: 3041 }
];

const OUTPUT_DIR = "c:/Users/user/Documents/115國文電子書/L4 愛蓮說/學習單/Word檔";

// 載入詞語一圖片 bytes
const imgCache: Record<string, Uint8Array> = {};
for (const item of WORDS1_DATA) {
  const fullPath = `c:/Users/user/Documents/115國文電子書/L4 愛蓮說/${item.img}`;
  imgCache[item.id] = await Deno.readFile(fullPath);
}

// 產製單一卷別的 Word 文件
async function generateDocx(versionKey: string, versionName: string, isTeacher: boolean, seed: number) {
  const qrUrl = `https://teach-chinese.web.app/l4/w1.html?v=${versionKey}`;
  const qrBytes = await generateQrPngBuffer(qrUrl);
  const modeText = isTeacher ? "【教師紅字解答版】" : "【學生自主練習版】";
  const mainTitle = `國文二上 第四課〈愛蓮說〉詞語一學習單（${versionName}）${modeText}`;

  const children: (Paragraph | Table)[] = [];

  // ==========================================
  // 【第 1 頁】題型一：詞語精熟習寫（圖片內嵌於第2欄）＋ 4欄7列訂正表
  // 依學習區固定順序 1~7
  // ==========================================
  children.push(
    buildHeaderTable(mainTitle, "題型一：詞語精熟習寫（請依字形筆畫端正書寫3次）", qrBytes, "第 1 頁 / 詞語習寫")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: "說明：請仔細觀察每個詞語的部首與結構，在右方練習格內各工整習寫 3 次；如有錯字，請於頁面下方訂正表加強熟練。",
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
          width: { size: 8, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "編號", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 34, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "目標詞語／注音", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "部首筆畫／結構拆解", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "習寫 1", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "習寫 2", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "習寫 3", font: FONT_FAMILY, size: 20, bold: true })] })]
        })
      ]
    })
  ];

  for (const item of WORDS1_DATA) {
    const tWord = isTeacher ? item.word : "　";
    writeRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.id}`, font: FONT_FAMILY, size: 22, bold: true })] })]
          }),
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: item.word, font: FONT_FAMILY, size: 26, bold: true, color: "1E3A8A" }),
                  new TextRun({ text: `   （${item.zhuyin}）\n`, font: FONT_FAMILY, size: 20, color: "0284C7" }),
                  new ImageRun({
                    data: imgCache[item.id],
                    transformation: { width: 90, height: 65 }
                  })
                ]
              })
            ]
          }),
          new TableCell({
            borders: BORDER_CELL,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${item.radical}\n`, font: FONT_FAMILY, size: 20 }),
                  new TextRun({ text: `${item.struct}`, font: FONT_FAMILY, size: 20, color: "475569" })
                ]
              })
            ]
          }),
          new TableCell({
            borders: BORDER_CELL,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tWord, font: FONT_FAMILY, size: 26, bold: isTeacher, color: "DC2626" })] })]
          }),
          new TableCell({
            borders: BORDER_CELL,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tWord, font: FONT_FAMILY, size: 26, bold: isTeacher, color: "DC2626" })] })]
          }),
          new TableCell({
            borders: BORDER_CELL,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tWord, font: FONT_FAMILY, size: 26, bold: isTeacher, color: "DC2626" })] })]
          })
        ]
      })
    );
  }

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: writeRows }));

  // 下方 4欄7列空白複習訂正表
  children.push(
    new Paragraph({
      spacing: { before: 120, after: 50 },
      children: [
        new TextRun({ text: "★ 錯字弱點複習自我訂正區（4欄7列自主檢視）", font: FONT_FAMILY, size: 22, bold: true, color: "B45309" })
      ]
    })
  );
  children.push(buildCorrectionTable(4, 7, "詞語一自我訂正檢核表"));

  // ==========================================
  // 【第 2 頁】題型二：看圖填寫字詞（配合題模式・三欄式表格：圖片 ｜ 題目(解釋) ｜ 答案）
  // 換頁！題目與選項皆隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型二：看圖填寫字詞（配合題模式・請依圖片情境選填正確詞語）", qrBytes, "第 2 頁 / 看圖配合題")
  );

  // 選項庫隨機重排
  const shuffledChoices = seededShuffle(WORDS1_DATA, seed + 11);
  const choiceLetters = ["A", "B", "C", "D", "E", "F", "G"];
  const choiceMap = new Map<number, string>();
  const choicePromptTexts: string[] = [];
  shuffledChoices.forEach((item, idx) => {
    choiceMap.set(item.id, choiceLetters[idx]);
    choicePromptTexts.push(`(${choiceLetters[idx]}) ${item.word}`);
  });

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
                    new TextRun({ text: "【詞語選項參考庫】：  ", font: FONT_FAMILY, size: 22, bold: true, color: "1E3A8A" }),
                    new TextRun({ text: choicePromptTexts.join("   "), font: FONT_FAMILY, size: 22, color: "0F172A" })
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
        new TextRun({ text: "請觀察情境圖與釋義，從上方選項庫選出最適合的詞語代號與名稱：", font: FONT_FAMILY, size: 22 })
      ]
    })
  );

  // 3 欄式表格：圖片 ｜ 題目(解釋) ｜ 答案
  const shuffledQ2 = seededShuffle(WORDS1_DATA, seed + 22);
  const q2Rows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "圖片", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 56, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "題目(解釋)", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "答案", font: FONT_FAMILY, size: 20, bold: true })] })]
        })
      ]
    })
  ];

  shuffledQ2.forEach((item, idx) => {
    const letter = choiceMap.get(item.id)!;
    const ansText = isTeacher ? `(${letter}) ${item.word}` : " ";
    q2Rows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: imgCache[item.id],
                    transformation: { width: 95, height: 68 }
                  })
                ]
              })
            ]
          }),
          new TableCell({
            borders: BORDER_CELL,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${idx + 1}. `, font: FONT_FAMILY, size: 24, bold: true, color: "1E3A8A" }),
                  new TextRun({ text: item.clue, font: FONT_FAMILY, size: 24 })
                ]
              })
            ]
          }),
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: ansText,
                    font: FONT_FAMILY,
                    size: 24,
                    bold: isTeacher,
                    color: isTeacher ? "DC2626" : "000000"
                  })
                ]
              })
            ]
          })
        ]
      })
    );
  });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: q2Rows }));

  // ==========================================
  // 【第 3 頁】題型三：看圖自主寫字（三欄式表格：圖片 ｜ 語境提示與注音引導 ｜ 答案：）
  // 換頁！題目隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型三：看圖自主寫字（無字詞提示・請依圖意自主工整書寫）", qrBytes, "第 3 頁 / 看圖自主寫")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 60 },
      children: [
        new TextRun({
          text: "說明：本大題無任何文字提示，請觀察情境圖與釋義說明，在右方書寫格內親筆寫出正確的國字詞語：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledQ3 = seededShuffle(WORDS1_DATA, seed + 33);
  const q3Rows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "圖片", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 56, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "語境提示與注音引導", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "答案", font: FONT_FAMILY, size: 20, bold: true })] })]
        })
      ]
    })
  ];

  shuffledQ3.forEach((item, idx) => {
    const ansText = isTeacher ? item.word : " ";
    q3Rows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: imgCache[item.id],
                    transformation: { width: 95, height: 68 }
                  })
                ]
              })
            ]
          }),
          new TableCell({
            borders: BORDER_CELL,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${idx + 1}. 語境提示：`, font: FONT_FAMILY, size: 22, bold: true, color: "1E3A8A" }),
                  new TextRun({ text: `${item.clue}\n   `, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: `注音引導：（${item.zhuyin}）`, font: FONT_FAMILY, size: 22, color: "0284C7" })
                ]
              })
            ]
          }),
          new TableCell({
            borders: BORDER_CELL,
            alignment: AlignmentType.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: ansText,
                    font: FONT_FAMILY,
                    size: 28,
                    bold: isTeacher,
                    color: isTeacher ? "DC2626" : "000000"
                  })
                ]
              })
            ]
          })
        ]
      })
    );
  });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: q3Rows }));

  // ==========================================
  // 【第 4 頁】題型四：字詞填空（課文原句精讀篇・附選項參考庫）
  // 換頁！題目與選項隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型四：字詞填空（課文原句精讀篇）", qrBytes, "第 4 頁 / 課文填空")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 60 },
      children: [
        new TextRun({
          text: "說明：請熟讀課文文句脈絡，在括號內填入正確的課文詞語：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  // 選項參考庫
  const shuffledFillChoices1 = seededShuffle(WORDS1_DATA, seed + 41);
  const fillChoiceLetters1 = ["A", "B", "C", "D", "E", "F", "G"];
  const fillPromptTexts1 = shuffledFillChoices1.map((item, idx) => `(${fillChoiceLetters1[idx]}) ${item.word}`);

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
                    new TextRun({ text: "【詞語選項參考庫】：  ", font: FONT_FAMILY, size: 22, bold: true, color: "1E3A8A" }),
                    new TextRun({ text: fillPromptTexts1.join("   "), font: FONT_FAMILY, size: 22, color: "0F172A" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  );

  const shuffledQ4 = seededShuffle(WORDS1_DATA, seed + 44);
  shuffledQ4.forEach((item, idx) => {
    let sentenceText = item.quoteBlank;
    const ans = item.word;
    if (isTeacher) {
      sentenceText = sentenceText.replace("（　　）", `（【${ans}】）`);
    }
    children.push(
      new Paragraph({
        spacing: { before: 70, after: 70 },
        children: [
          new TextRun({ text: `${idx + 1}. `, font: FONT_FAMILY, size: 26, bold: true, color: "1E3A8A" }),
          new TextRun({
            text: isTeacher ? sentenceText : item.quoteBlank,
            font: FONT_FAMILY,
            size: 26,
            bold: isTeacher,
            color: isTeacher ? "DC2626" : "0F172A"
          })
        ]
      })
    );
  });

  // ==========================================
  // 【第 5 頁】題型五：字詞填空（生活例句應用篇・附選項參考庫）
  // 換頁！題目與選項隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型五：字詞填空（生活例句應用篇）", qrBytes, "第 5 頁 / 生活例句填空")
  );
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 60 },
      children: [
        new TextRun({
          text: "說明：請閱讀生活情境短文，根據文意在括號內填入適當的詞語：",
          font: FONT_FAMILY,
          size: 22,
          color: "475569"
        })
      ]
    })
  );

  const shuffledFillChoices2 = seededShuffle(WORDS1_DATA, seed + 51);
  const fillPromptTexts2 = shuffledFillChoices2.map((item, idx) => `(${fillChoiceLetters1[idx]}) ${item.word}`);

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
                    new TextRun({ text: "【詞語選項參考庫】：  ", font: FONT_FAMILY, size: 22, bold: true, color: "1E3A8A" }),
                    new TextRun({ text: fillPromptTexts2.join("   "), font: FONT_FAMILY, size: 22, color: "0F172A" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  );

  const shuffledQ5 = seededShuffle(WORDS1_DATA, seed + 55);
  shuffledQ5.forEach((item, idx) => {
    let sentenceText = item.exampleBlank;
    const ans = item.word;
    if (isTeacher) {
      sentenceText = sentenceText.replace("（　　）", `（【${ans}】）`);
    }
    children.push(
      new Paragraph({
        spacing: { before: 70, after: 70 },
        children: [
          new TextRun({ text: `${idx + 1}. `, font: FONT_FAMILY, size: 26, bold: true, color: "1E3A8A" }),
          new TextRun({
            text: isTeacher ? sentenceText : item.exampleBlank,
            font: FONT_FAMILY,
            size: 26,
            bold: isTeacher,
            color: isTeacher ? "DC2626" : "0F172A"
          })
        ]
      })
    );
  });

  // ==========================================
  // 【第 6 頁】題型六：課文名句與君子美德配合題（10 組名句）
  // 換頁！選項與題目皆隨機排列
  // ==========================================
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    buildHeaderTable(mainTitle, "題型六：課文名句與君子美德配合題（10組核心名句深層理解）", qrBytes, "第 6 頁 / 君子美德配合題")
  );

  // 選項庫 A~J 隨機重排
  const shuffledVirtueChoices = seededShuffle(VIRTUE_DATA, seed + 66);
  const vLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const virtueLetterMap = new Map<number, string>();
  const virtuePromptTexts: string[] = [];
  shuffledVirtueChoices.forEach((item, idx) => {
    virtueLetterMap.set(item.id, vLetters[idx]);
    virtuePromptTexts.push(`(${vLetters[idx]}) ${item.virtue}`);
  });

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
                    new TextRun({ text: "【君子美德選項庫】：   ", font: FONT_FAMILY, size: 22, bold: true, color: "1E3A8A" }),
                    new TextRun({ text: virtuePromptTexts.join("      "), font: FONT_FAMILY, size: 22, color: "0F172A" })
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
        new TextRun({ text: "說明：請閱讀課文句子與象徵意涵，將上方適當的君子美德代號填入括號中：", font: FONT_FAMILY, size: 22 })
      ]
    })
  );

  const shuffledVirtueQ = seededShuffle(VIRTUE_DATA, seed + 77);
  shuffledVirtueQ.forEach((item, idx) => {
    const correctLetter = virtueLetterMap.get(item.id)!;
    const ansText = isTeacher ? `（【${correctLetter}】）` : "（　　）";
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: ansText,
            font: FONT_FAMILY,
            size: 26,
            bold: true,
            color: isTeacher ? "DC2626" : "0F172A"
          }),
          new TextRun({ text: ` ${idx + 1}. `, font: FONT_FAMILY, size: 26, bold: true, color: "1E3A8A" }),
          new TextRun({ text: `「${item.quote}」 —— \n`, font: FONT_FAMILY, size: 26, bold: true }),
          new TextRun({ text: `象徵：${item.explain}`, font: FONT_FAMILY, size: 22, color: "475569" }),
          new TextRun({
            text: isTeacher ? `  ➔ 正解：【${correctLetter}】${item.virtue}` : "",
            font: FONT_FAMILY,
            size: 22,
            bold: true,
            color: "DC2626"
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
  const fileName = `詞語一_${versionName.replace(" ", "")}_${isTeacher ? "教師版" : "學生版"}.docx`;
  const filePath = `${OUTPUT_DIR}/${fileName}`;
  await Deno.writeFile(filePath, buffer);
  console.log(`Saved: ${fileName} (${buffer.byteLength} bytes)`);
}

// 產製 3 卷 x 2 版本
console.log("=== 開始產製 詞語一 學習單 Word 檔（全新確認版型）===");
for (const v of VERSIONS) {
  await generateDocx(v.key, v.name, false, v.seed); // 學生版
  await generateDocx(v.key, v.name, true, v.seed);  // 教師版
}
console.log("=== 詞語一 學習單 Word 檔產製完成！ ===");
