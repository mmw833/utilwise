"use client";

import { useEffect, useState } from "react";

type Converted = { name: string; url: string; size: number; originalSize: number; width: number; height: number };
const MAX_SIZE = 20 * 1024 * 1024;
const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export default function ImageFormatConverter({ lang = "ko" }: { lang?: "ko" | "en" }) {
  const en = lang === "en";
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Converted[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => () => results.forEach(x => URL.revokeObjectURL(x.url)), [results]);

  function choose(list: FileList | null) {
    if (!list) return;
    results.forEach(x => URL.revokeObjectURL(x.url));
    const picked = Array.from(list).filter(f => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    setFiles(picked); setResults([]); setDone(false);
    setError(picked.length === 0 ? (en ? "Choose JPG, PNG, or WebP images." : "JPG, PNG, WebP 이미지 파일을 선택해 주세요.") : "");
  }

  async function convert() {
    if (!files.length || busy) return;
    setBusy(true); setError(""); setDone(false);
    const converted: Converted[] = [];
    try {
      for (const file of files) {
        if (file.size > MAX_SIZE) throw new Error("large");
        const bitmap = await createImageBitmap(file);
        if (bitmap.width > 12000 || bitmap.height > 12000) { bitmap.close(); throw new Error("dimensions"); }
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width; canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { bitmap.close(); throw new Error("canvas"); }
        if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(bitmap, 0, 0); bitmap.close();
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("export")), format, quality / 100));
        const base = file.name.replace(/\.[^.]+$/, "");
        converted.push({ name: base + "-converted." + EXT[blob.type], url: URL.createObjectURL(blob), size: blob.size, originalSize: file.size, width: canvas.width, height: canvas.height });
      }
      setResults(converted); setDone(true);
    } catch (e) {
      converted.forEach(x => URL.revokeObjectURL(x.url));
      setError(e instanceof Error && e.message === "large" ? (en ? "Each file must be 20 MB or smaller." : "파일당 최대 20MB까지 지원합니다.") : e instanceof Error && e.message === "dimensions" ? (en ? "Images must be no larger than 12,000 pixels per side." : "이미지의 가로·세로는 각각 12,000px 이하여야 합니다.") : (en ? "Some images could not be converted. Check the file format and try again." : "일부 이미지를 변환하지 못했습니다. 파일 형식을 확인하고 다시 시도해 주세요."));
    } finally { setBusy(false); }
  }

  const bytes = (n: number) => n < 1024 * 1024 ? (n / 1024).toFixed(1) + " KB" : (n / 1024 / 1024).toFixed(2) + " MB";
  return <div className="image-tool">
    <div className="panel image-tool-panel">
      <div className="field"><label htmlFor="format-files">{en ? "Choose images" : "이미지 파일 선택"}</label><input id="format-files" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => choose(e.target.files)} /><span className="hint">{en ? "JPG, PNG, and WebP. Select multiple files to convert them together." : "JPG, PNG, WebP를 지원합니다. 여러 파일을 한 번에 선택할 수 있습니다."}</span></div>
      {files.length > 0 && <div className="image-file-list">{files.map((f,i)=><div className="image-file" key={f.name+i}><span>{f.name}</span><small>{bytes(f.size)}</small></div>)}</div>}
      <div className="field"><label htmlFor="format-output">{en ? "Convert to" : "변환할 파일 형식"}</label><select id="format-output" value={format} onChange={e=>setFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG / JPEG</option><option value="image/png">PNG</option></select></div>
      {format !== "image/png" && <div className="field"><label htmlFor="format-quality">{en ? "Image quality" : "이미지 품질"}: {quality}%</label><input id="format-quality" type="range" min="50" max="100" step="5" value={quality} onChange={e=>setQuality(Number(e.target.value))}/><span className="hint">{en ? "Higher quality usually creates a larger file." : "품질을 높이면 일반적으로 파일 용량도 커집니다."}</span></div>}
      <button type="button" className="primary image-process" disabled={!files.length || busy} onClick={convert}>{busy ? (en ? "Converting..." : "변환 중...") : (en ? "Convert images" : "이미지 변환하기")}</button>
      {error && <p className="image-error" role="alert">{error}</p>}
      {done && <p className="hint" role="status">{en ? "Conversion completed. Download each file below." : "변환이 완료되었습니다. 아래에서 파일을 다운로드하세요."}</p>}
      <p className="hint image-privacy">{en ? "Files are processed locally in your browser and are not uploaded to UTILWISE." : "파일은 브라우저에서 처리되며 UTILWISE 서버로 업로드되지 않습니다."}</p>
    </div>
    {results.length > 0 && <section className="image-output"><h2>{en ? "Converted images" : "변환 결과"}</h2><div className="image-output-grid">{results.map((r,i)=><article className="image-output-card" key={r.url}><img src={r.url} alt={r.name}/><strong>{r.name}</strong><div className="image-stats"><span>{en ? "Original" : "원본"}: {bytes(r.originalSize)}</span><span>{en ? "Converted" : "변환 후"}: {bytes(r.size)}</span><span>{r.width} × {r.height} px</span></div><a className="primary image-download" href={r.url} download={r.name}>{en ? "Download" : "다운로드"}</a></article>)}</div></section>}
  </div>;
}
