"use client";

import { useEffect, useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

type Mode = "merge" | "split" | "rotate" | "organize" | "images";
type Props = { mode: Mode; lang?: "ko" | "en" };
type Download = { name: string; url: string; pages?: number };

const copy = {
  ko: {
    merge: { title: "PDF 합치기", lead: "여러 PDF 파일을 하나의 문서로 합칩니다.", upload: "PDF 파일 선택", help: "PDF 파일을 두 개 이상 선택하세요. 선택한 순서대로 합쳐집니다.", action: "PDF 합치기", result: "합쳐진 PDF", privacy: "파일은 브라우저에서 처리되며 서버로 업로드되지 않습니다." },
    split: { title: "PDF 분할", lead: "페이지 범위를 지정해 PDF에서 필요한 페이지만 추출합니다.", upload: "PDF 파일 선택", help: "PDF 파일 하나를 선택한 뒤 추출할 페이지 범위를 입력하세요. 예: 1-3, 5, 8-10", action: "PDF 분할하기", result: "분할 결과", privacy: "파일은 브라우저에서 처리되며 서버로 업로드되지 않습니다." },
    rotate: { title: "PDF 회전", lead: "PDF 페이지를 원하는 각도로 회전해 저장합니다.", upload: "PDF 파일 선택", help: "PDF 파일을 선택하고 회전할 페이지 범위를 입력하세요. 비워두면 모든 페이지가 회전합니다.", action: "페이지 회전하기", result: "회전된 PDF", privacy: "파일은 브라우저에서 처리되며 서버로 업로드되지 않습니다." },
    organize: { title: "PDF 페이지 정리", lead: "페이지 순서를 바꾸거나 필요 없는 페이지를 삭제합니다.", upload: "PDF 파일 선택", help: "페이지 순서를 쉼표로 입력하세요. 예: 3, 1, 2, 5 (입력한 순서대로 새 PDF를 만듭니다. 생략한 페이지는 삭제됩니다.)", action: "페이지 정리하기", result: "정리된 PDF", privacy: "파일은 브라우저에서 처리되며 서버로 업로드되지 않습니다." },
    images: { title: "이미지를 PDF로 변환", lead: "JPG, PNG 이미지를 하나의 PDF 문서로 만듭니다.", upload: "이미지 선택", help: "JPG, PNG 또는 WebP 이미지를 선택하세요. 선택한 순서대로 각 이미지가 PDF 한 페이지가 됩니다.", action: "PDF 만들기", result: "생성된 PDF", privacy: "이미지는 브라우저에서 처리되며 서버로 업로드되지 않습니다." },
    range: "페이지 범위", angle: "회전 각도", download: "다운로드", busy: "처리 중...", select: "파일을 먼저 선택해 주세요.", error: "파일을 처리하지 못했습니다. 올바른 파일인지 확인해 주세요.", count: "페이지 수", file: "선택한 파일", reorder: "페이지 순서", noPages: "페이지 범위를 확인해 주세요."
  },
  en: {
    merge: { title: "Merge PDF", lead: "Combine multiple PDF files into one document.", upload: "Choose PDF files", help: "Select at least two PDF files. They will be merged in the order selected.", action: "Merge PDFs", result: "Merged PDF", privacy: "Files are processed in your browser and are never uploaded to our server." },
    split: { title: "Split PDF", lead: "Extract selected page ranges from a PDF document.", upload: "Choose a PDF file", help: "Select one PDF and enter the page ranges to extract. Example: 1-3, 5, 8-10", action: "Split PDF", result: "Split files", privacy: "Files are processed in your browser and are never uploaded to our server." },
    rotate: { title: "Rotate PDF", lead: "Rotate PDF pages to the angle you need and save a new file.", upload: "Choose a PDF file", help: "Select a PDF and enter page ranges. Leave blank to rotate every page.", action: "Rotate pages", result: "Rotated PDF", privacy: "Files are processed in your browser and are never uploaded to our server." },
    organize: { title: "Organize PDF Pages", lead: "Reorder pages or remove pages you no longer need.", upload: "Choose a PDF file", help: "Enter page numbers separated by commas. Example: 3, 1, 2, 5. The new PDF follows this order; omitted pages are removed.", action: "Organize PDF", result: "Organized PDF", privacy: "Files are processed in your browser and are never uploaded to our server." },
    images: { title: "Image to PDF", lead: "Turn JPG and PNG images into a single PDF document.", upload: "Choose images", help: "Select JPG, PNG, or WebP images. Each image becomes one PDF page in the selected order.", action: "Create PDF", result: "Created PDF", privacy: "Images are processed in your browser and are never uploaded to our server." },
    range: "Page ranges", angle: "Rotation angle", download: "Download", busy: "Processing...", select: "Please select file(s) first.", error: "Could not process the file. Please check that it is a valid file.", count: "Pages", file: "Selected file", reorder: "Page order", noPages: "Please check the page range."
  }
} as const;

function parsePages(input: string, total: number): number[] {
  const result: number[] = [];
  for (const part of input.split(",").map(s => s.trim()).filter(Boolean)) {
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("range");
    const start = Number(match[1]), end = Number(match[2] || match[1]);
    if (start < 1 || end < start || end > total) throw new Error("range");
    for (let n = start; n <= end; n++) result.push(n - 1);
  }
  if (!result.length) throw new Error("range");
  return result;
}
function downloadBlob(bytes: Uint8Array, name: string): Download {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  return { name, url: URL.createObjectURL(blob) };
}
async function imageBytes(file: File): Promise<{ bytes: Uint8Array; type: "jpg" | "png" }> {
  if (file.type === "image/jpeg") return { bytes: new Uint8Array(await file.arrayBuffer()), type: "jpg" };
  if (file.type === "image/png") return { bytes: new Uint8Array(await file.arrayBuffer()), type: "png" };
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width; canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0); bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("canvas")), "image/png"));
  return { bytes: new Uint8Array(await blob.arrayBuffer()), type: "png" };
}

export default function PDFTools({ mode, lang = "ko" }: Props) {
  const t = copy[lang][mode];
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("");
  const [angle, setAngle] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [outputs, setOutputs] = useState<Download[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  useEffect(() => () => outputs.forEach(item => URL.revokeObjectURL(item.url)), [outputs]);

  async function selectFiles(list: FileList | null) {
    const selected = list ? Array.from(list) : [];
    setFiles(selected); setOutputs([]); setError(""); setPageCount(null);
    if (selected.length === 1 && mode !== "images") {
      try { const pdf = await PDFDocument.load(await selected[0].arrayBuffer()); setPageCount(pdf.getPageCount()); }
      catch { setError(t.error); }
    }
  }

  async function process() {
    if (!files.length || busy) { setError(t.select); return; }
    setBusy(true); setError("");
    outputs.forEach(item => URL.revokeObjectURL(item.url)); setOutputs([]);
    const done: Download[] = [];
    try {
      if (mode === "merge") {
        if (files.length < 2) throw new Error("range");
        const merged = await PDFDocument.create();
        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer());
          const pages = await merged.copyPages(source, source.getPageIndices());
          pages.forEach(page => merged.addPage(page));
        }
        done.push(downloadBlob(await merged.save(), "merged.pdf"));
      } else if (mode === "images") {
        const pdf = await PDFDocument.create();
        for (const file of files) {
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) continue;
          const data = await imageBytes(file);
          const image = data.type === "jpg" ? await pdf.embedJpg(data.bytes) : await pdf.embedPng(data.bytes);
          const page = pdf.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        if (!pdf.getPageCount()) throw new Error("range");
        done.push(downloadBlob(await pdf.save(), "images.pdf"));
      } else {
        if (files.length !== 1) throw new Error("range");
        const source = await PDFDocument.load(await files[0].arrayBuffer());
        const total = source.getPageCount();
        if (mode === "split") {
          const indices = parsePages(range, total);
          const out = await PDFDocument.create();
          const pages = await out.copyPages(source, indices);
          pages.forEach(page => out.addPage(page));
          done.push(downloadBlob(await out.save(), "split-pages.pdf"));
        } else if (mode === "rotate") {
          const indices = range.trim() ? parsePages(range, total) : source.getPageIndices();
          indices.forEach(index => {
            const page = source.getPage(index);
            page.setRotation(degrees((page.getRotation().angle + angle) % 360));
          });
          done.push(downloadBlob(await source.save(), "rotated.pdf"));
        } else if (mode === "organize") {
          const indices = parsePages(range, total);
          const out = await PDFDocument.create();
          const pages = await out.copyPages(source, indices);
          pages.forEach(page => out.addPage(page));
          done.push(downloadBlob(await out.save(), "organized.pdf"));
        }
      }
      setOutputs(done);
    } catch (e) {
      done.forEach(item => URL.revokeObjectURL(item.url));
      setError(e instanceof Error && e.message === "range" ? t.noPages : t.error);
    } finally { setBusy(false); }
  }

  const accept = mode === "images" ? "image/jpeg,image/png,image/webp" : "application/pdf,.pdf";
  return <div className="pdf-tool">
    <div className="panel image-tool-panel">
      <div className="field">
        <label htmlFor="pdf-upload">{t.upload}</label>
        <input id="pdf-upload" type="file" accept={accept} multiple={mode === "merge" || mode === "images"} onChange={e => selectFiles(e.target.files)} />
        <span className="hint">{t.help}</span>
      </div>
      {files.length > 0 && <div className="image-file-list">{files.map((file, i) => <div className="image-file" key={file.name + i}><span>{file.name}</span><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></div>)}</div>}
      {pageCount !== null && <p className="hint">{t.count}: {pageCount}</p>}
      {(mode === "split" || mode === "rotate" || mode === "organize") && <div className="field">
        <label htmlFor="pdf-range">{mode === "organize" ? t.reorder : t.range}</label>
        <input id="pdf-range" type="text" value={range} onChange={e => setRange(e.target.value)} placeholder={mode === "organize" ? "3, 1, 2, 5" : "1-3, 5"} />
      </div>}
      {mode === "rotate" && <div className="field"><label htmlFor="pdf-angle">{t.angle}</label><select id="pdf-angle" value={angle} onChange={e => setAngle(Number(e.target.value))}><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></select></div>}
      <button type="button" className="primary image-process" disabled={!files.length || busy} onClick={process}>{busy ? t.busy : t.action}</button>
      {error && <p className="image-error" role="alert">{error}</p>}
      <p className="hint image-privacy">{t.privacy}</p>
    </div>
    {outputs.length > 0 && <section className="image-output"><h2>{t.result}</h2><div className="image-output-grid">{outputs.map(item => <article className="image-output-card" key={item.url}><strong>{item.name}</strong><a className="primary image-download" href={item.url} download={item.name}>{t.download}</a></article>)}</div></section>}
  </div>;
}
