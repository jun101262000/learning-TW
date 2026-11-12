// build_helpers.ts
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
  ImageRun
} from "npm:docx";
import qrcode from "npm:qrcode";

export const FONT_FAMILY = "DFKai-SB"; // 標楷體
export const BORDER_THIN = { style: BorderStyle.SINGLE, size: 6, color: "94A3B8" };
export const BORDER_THICK = { style: BorderStyle.SINGLE, size: 12, color: "334155" };
export const BORDER_CELL = {
  top: BORDER_THIN,
  bottom: BORDER_THIN,
  left: BORDER_THIN,
  right: BORDER_THIN
};

export async function generateQrPngBuffer(url: string): Promise<Uint8Array> {
  const dataUrl = await qrcode.toDataURL(url, { width: 120, margin: 1 });
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// 產生頁首（含標題、學生資訊、QR Code）
export function buildHeaderTable(title: string, subTitle: string, qrBytes: Uint8Array, pageNumText: string) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: BORDER_THICK,
      bottom: BORDER_THICK,
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 82, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: title, font: FONT_FAMILY, size: 30, bold: true, color: "1E3A8A" }),
                  new TextRun({ text: `  [${pageNumText}]`, font: FONT_FAMILY, size: 24, bold: true, color: "B45309" })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: subTitle, font: FONT_FAMILY, size: 24, color: "475569" })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "國文科 國二上 第四課〈愛蓮說〉 ｜ 班級：______ 座號：______ 姓名：__________", font: FONT_FAMILY, size: 22, bold: true, color: "0F172A" })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: qrBytes,
                    transformation: { width: 68, height: 68 }
                  }),
                  new TextRun({ text: "\n📱掃描聽題目", font: FONT_FAMILY, size: 16, color: "64748B" })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

// 產生下方 4 欄數列訂正表格：1. 錯字／弱點詞 ｜ 訂正習寫1 ｜ 訂正習寫2 ｜ 訂正習寫3
export function buildCorrectionTable(colCount: number, rowCount: number, title: string) {
  const rows: TableRow[] = [];
  // 表頭
  rows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1. 錯字／弱點詞", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "訂正習寫1", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "訂正習寫2", font: FONT_FAMILY, size: 20, bold: true })] })]
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: BORDER_CELL,
          shading: { fill: "F1F5F9" },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "訂正習寫3", font: FONT_FAMILY, size: 20, bold: true })] })]
        })
      ]
    })
  );

  // 空白列
  for (let i = 0; i < rowCount; i++) {
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER_CELL,
            children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}. `, font: FONT_FAMILY, size: 22 })] })]
          }),
          new TableCell({ borders: BORDER_CELL, children: [new Paragraph({ children: [new TextRun({ text: " ", size: 22 })] })] }),
          new TableCell({ borders: BORDER_CELL, children: [new Paragraph({ children: [new TextRun({ text: " ", size: 22 })] })] }),
          new TableCell({ borders: BORDER_CELL, children: [new Paragraph({ children: [new TextRun({ text: " ", size: 22 })] })] })
        ]
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows
  });
}
