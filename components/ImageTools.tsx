"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { mode: "compress" | "resize"; lang?: "ko" | "en" };
type Output = { name: string; url: string; size: number; originalSize: number; width: number; height: number; type: string };

const copy = {
  ko: {
    compress: { title: "이미지 압축기", lead: "이미지 용량을 줄여 웹사이트, 블로그, 문서에 더 가볍게 사용하세요.", upload: "이미지 선택", help: "JPG, PNG, WebP 이미지를 선택하세요. 여러 파일을 한 번에 처리할 수 있습니다.", quality: "압축 품질", format: "저장 형식", process: "이미지 압축하기", processing: "처리 중...", output: "압축 결과", before: "원본", after: "압축 후", saved: "절감", download: "다운로드", privacy: "이미지는 이 브라우저 안에서 처리되며 서버로 업로드되지 않습니다.", tooLarge: "파일당 최대 20MB까지 지원합니다.", error: "이미지를 처리하지 못했습니다. 다른 이미지 파일을 선택해 주세요.", formatOptions: ["WebP (권장)", "JPEG", "PNG"] },
    resize: { title: "이미지 크기 조절기", lead: "이미지의 가로·세로 픽셀을 원하는 크기로 변경하세요.", upload: "이미지 선택", help: "JPG, PNG, WebP 이미지를 선택하세요. 여러 파일을 한 번에 처리할 수 있습니다.", width: "가로 (px)", height: "세로 (px)", keep: "가로세로 비율 유지", format: "저장 형식", process: "크기 조절하기", processing: "처리 중...", output: "변환 결과", before: "원본", after: "변경 후", download: "다운로드", privacy: "이미지는 이 브라우저 안에서 처리되며 서버로 업로드되지 않습니다.", tooLarge: "파일당 최대 20MB까지 지원합니다.", error: "이미지를 처리하지 못했습니다. 다른 이미지 파일을 선택해 주세요.", formatOptions: ["원본 형식", "WebP", "JPEG", "PNG"] }
  },
  en: {
    compress: { title: "Image Compressor", lead: "Reduce image file sizes for faster websites, blogs, and documents.", upload: "Choose images", help: "Select JPG, PNG, or WebP images. You can process multiple files.", quality: "Compression quality", format: "Output format", process: "Compress images", processing: "Processing...", output: "Compressed images", before: "Original", after: "Compressed", saved: "Saved", download: "Download", privacy: "Images are processed in your browser and are never uploaded to our server.", tooLarge: "Each file must be 20 MB or smaller.", error: "Could not process this image. Please try another image file.", formatOptions: ["WebP (recommended)", "JPEG", "PNG"] },
    resize: { title: "Image Resizer", lead: "Resize images to the exact width and height you need in pixels.", upload: "Choose images", help: "Select JPG, PNG, or WebP images. You can process multiple files.", width: "Width (px)", height: "Height (px)", keep: "Keep aspect ratio", format: "Output format", process: "Resize images", processing: "Processing...", output: "Resized images", before: "Original", after: "Resized", download: "Download", privacy: "Images are processed in your browser and are never uploaded to our server.", tooLarge: "Each file must be 20 MB or smaller.", error: "Could not process this image. Please try another image file.", formatOptions: ["Original format", "WebP", "JPEG", "PNG"] }
  }
} as const;

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
function extension(type: string) { return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp"; }
function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Canvas export failed")), type, quality));
}

export default function ImageTools({ mode, lang = "ko" }: Props) {
  const t = copy[lang][mode] as any;
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState(mode === "compress" ? "image/webp" : "original");
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [keepRatio, setKeepRatio] = useState(true);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sourceDimensions, setSourceDimensions] = useState<{width:number;height:number}|null>(null);

  useEffect(() => () => outputs.forEach(item => URL.revokeObjectURL(item.url)), [outputs]);
  const ready = files.length > 0 && !busy;
  const accept = "image/jpeg,image/png,image/webp";

  function selectFiles(list: FileList | null) {
    if (!list) return;
    const selected = Array.from(list).filter(file => file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp");
    setFiles(selected);
    setOutputs([]);
    setError("");
    if (selected[0]) {
      createImageBitmap(selected[0]).then(bitmap => {
        setSourceDimensions({width:bitmap.width,height:bitmap.height});
        if (mode === "resize") { setWidth(bitmap.width); setHeight(bitmap.height); }
        bitmap.close();
      }).catch(() => setSourceDimensions(null));
    }
  }

  function updateWidth(value: number) {
    setWidth(value);
    if (keepRatio && sourceDimensions && value > 0) setHeight(Math.max(1, Math.round(value * sourceDimensions.height / sourceDimensions.width)));
  }
  function updateHeight(value: number) {
    setHeight(value);
    if (keepRatio && sourceDimensions && value > 0) setWidth(Math.max(1, Math.round(value * sourceDimensions.width / sourceDimensions.height)));
  }

  async function processImages() {
    if (!files.length || busy) return;
    setBusy(true); setError("");
    outputs.forEach(item => URL.revokeObjectURL(item.url));
    setOutputs([]);
    const completed: Output[] = [];
    try {
      for (const file of files) {
        if (file.size > 20 * 1024 * 1024) throw new Error("too-large");
        const bitmap = await createImageBitmap(file);
        const targetWidth = mode === "resize" ? Math.max(1, Math.min(12000, Math.round(width))) : bitmap.width;
        const targetHeight = mode === "resize" ? Math.max(1, Math.min(12000, Math.round(height))) : bitmap.height;
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth; canvas.height = targetHeight;
        const context = canvas.getContext("2d");
        if (!context) { bitmap.close(); throw new Error("canvas"); }
        const outputType = format === "original" ? file.type : format;
        if (outputType === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0,0,targetWidth,targetHeight); }
        context.drawImage(bitmap,0,0,targetWidth,targetHeight);
        bitmap.close();
        const blob = await canvasBlob(canvas, outputType, quality / 100);
        const url = URL.createObjectURL(blob);
        const base = file.name.replace(/\.[^.]+$/, "");
        completed.push({name: base + "-" + (mode === "compress" ? "compressed" : "resized") + "." + extension(blob.type),url,size:blob.size,originalSize:file.size,width:targetWidth,height:targetHeight,type:blob.type});
      }
      setOutputs(completed);
    } catch (e) {
      completed.forEach(item => URL.revokeObjectURL(item.url));
      setError(e instanceof Error && e.message === "too-large" ? t.tooLarge : t.error);
    } finally { setBusy(false); }
  }

  const labels = mode === "compress" ? { original: t.before, result: t.after } : { original: t.before, result: t.after };
  return <div className="image-tool">
    <div className="panel image-tool-panel">
      <div className="field"><label htmlFor="image-upload">{t.upload}</label><input id="image-upload" type="file" accept={accept} multiple onChange={e=>selectFiles(e.target.files)} /><span className="hint">{t.help}</span></div>
      {files.length > 0 && <div className="image-file-list">{files.map((file,index)=><div className="image-file" key={file.name+index}><span>{file.name}</span><small>{formatBytes(file.size)}</small></div>)}</div>}
      {mode === "compress" ? <div className="field"><label htmlFor="image-quality">{t.quality}: {quality}%</label><input id="image-quality" type="range" min="10" max="100" step="5" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></div> : <div className="image-size-fields">
        <div className="field"><label htmlFor="image-width">{t.width}</label><input id="image-width" type="number" min="1" max="12000" value={width} onChange={e=>updateWidth(Number(e.target.value))}/></div>
        <div className="field"><label htmlFor="image-height">{t.height}</label><input id="image-height" type="number" min="1" max="12000" value={height} onChange={e=>updateHeight(Number(e.target.value))}/></div>
        <label className="image-check"><input type="checkbox" checked={keepRatio} onChange={e=>setKeepRatio(e.target.checked)}/>{t.keep}</label>
        {sourceDimensions && <p className="hint">{lang === "ko" ? "원본 크기" : "Original size"}: {sourceDimensions.width} × {sourceDimensions.height} px</p>}
      </div>}
      <div className="field"><label htmlFor="image-format">{t.format}</label><select id="image-format" value={format} onChange={e=>setFormat(e.target.value)}>{(t.formatOptions as readonly string[]).map((label,index)=><option key={label} value={mode === "resize" && index === 0 ? "original" : ["image/webp","image/jpeg","image/png"][mode === "resize" ? index-1 : index]}>{label}</option>)}</select></div>
      <button type="button" className="primary image-process" disabled={!ready} onClick={processImages}>{busy ? t.processing : t.process}</button>
      {error && <p className="image-error" role="alert">{error}</p>}
      <p className="hint image-privacy">{t.privacy}</p>
    </div>
    {outputs.length > 0 && <section className="image-output"><h2>{t.output}</h2><div className="image-output-grid">{outputs.map((item,index)=><article className="image-output-card" key={item.url}><img src={item.url} alt={item.name}/><strong>{item.name}</strong><div className="image-stats"><span>{labels.original}: {formatBytes(item.originalSize)}</span><span>{labels.result}: {formatBytes(item.size)}</span>{mode === "compress" && <span>{t.saved}: {Math.max(0,Math.round((1-item.size/item.originalSize)*100))}%</span>}<span>{item.width} × {item.height} px</span></div><a className="primary image-download" href={item.url} download={item.name}>{t.download}</a></article>)}</div></section>}
  </div>;
}
