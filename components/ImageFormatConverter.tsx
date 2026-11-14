"use client";

import { useEffect, useState } from "react";

type Converted = { name: string; url: string; size: number; originalSize: number; width: number; height: number };
type HeicConverter = (options: { blob: Blob; toType: "image/png" }) => Promise<Blob | Blob[]>;
declare global { interface Window { heic2any?: HeicConverter } }
const MAX_SIZE = 20 * 1024 * 1024;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];

function isHeic(file: File) {
  return /\.(heic|heif)$/i.test(file.name) || file.type.toLowerCase().includes("heic") || file.type.toLowerCase().includes("heif");
}
function loadHeicConverter(): Promise<HeicConverter> {
  if (typeof window === "undefined") return Promise.reject(new Error("browser"));
  if (window.heic2any) return Promise.resolve(window.heic2any);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-heic2any="true"]');
    const script = existing || document.createElement("script");
    const fail = () => reject(new Error("heic-library"));
    script.addEventListener("load", () => window.heic2any ? resolve(window.heic2any) : fail(), { once: true });
    script.addEventListener("error", fail, { once: true });
    if (!existing) {
      script.src = "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
      script.async = true;
      script.dataset.heic2any = "true";
      document.head.appendChild(script);
    }
  });
}

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
    const picked = Array.from(list).filter(f => SUPPORTED_TYPES.includes(f.type.toLowerCase()) || isHeic(f));
    setFiles(picked); setResults([]); setDone(false);
    setError(picked.length === 0 ? (en ? "Choose JPG, PNG, WebP, HEIC, or HEIF images." : "JPG, PNG, WebP, HEIC 또는 HEIF 이미지 파일을 선택해 주세요.") : "");
  }

  async function convert() {
    if (!files.length || busy) return;
    setBusy(true); setError(""); setDone(false);
    const converted: Converted[] = [];
    try {
      for (const file of files) {
        if (file.size > MAX_SIZE) throw new Error("large");
        let bitmap: ImageBitmap;
        if (isHeic(file)) {
          const heic2any = await loadHeicConverter();
          const decoded = await heic2any({ blob: file, toType: "image/png" });
          const png = Array.isArray(decoded) ? decoded[0] : decoded;
          if (!png) throw new Error("decode");
          bitmap = await createImageBitmap(png);
        } else {
          bitmap = await createImageBitmap(file);
        }
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
      const message = e instanceof Error ? e.message : "";
      setError(message === "large" ? (en ? "Each file must be 20 MB or smaller." : "파일당 최대 20MB까지 지원합니다.") : message === "dimensions" ? (en ? "Images must be no larger than 12,000 pixels per side." : "이미지의 가로·세로는 각각 12,000px 이하여야 합니다.") : message === "heic-library" ? (en ? "The HEIC decoder could not be loaded. Check your connection and try again." : "HEIC 변환 모듈을 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.") : (en ? "Some images could not be converted. The file may be unsupported or damaged." : "일부 이미지를 변환하지 못했습니다. 지원하지 않거나 손상된 파일일 수 있습니다."));
    } finally { setBusy(false); }
  }

  const bytes = (n: number) => n < 1024 * 1024 ? (n / 1024).toFixed(1) + " KB" : (n / 1024 / 1024).toFixed(2) + " MB";
  return <div className="image-tool">
    <div className="panel image-tool-panel">
      <div className="field"><label htmlFor="format-files">{en ? "Choose images" : "이미지 파일 선택"}</label><input id="format-files" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple onChange={e => choose(e.target.files)} /><span className="hint">{en ? "JPG, PNG, WebP, HEIC, and HEIF. Select multiple files to convert them together." : "JPG, PNG, WebP, HEIC, HEIF를 지원합니다. 여러 파일을 한 번에 선택할 수 있습니다."}</span></div>
      {files.length > 0 && <div className="image-file-list">{files.map((f,i)=><div className="image-file" key={f.name+i}><span>{f.name}</span><small>{bytes(f.size)}</small></div>)}</div>}
      <div className="field"><label htmlFor="format-output">{en ? "Convert to" : "변환할 파일 형식"}</label><select id="format-output" value={format} onChange={e=>setFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG / JPEG</option><option value="image/png">PNG</option></select></div>
      {format !== "image/png" && <div className="field"><label htmlFor="format-quality">{en ? "Image quality" : "이미지 품질"}: {quality}%</label><input id="format-quality" type="range" min="50" max="100" step="5" value={quality} onChange={e=>setQuality(Number(e.target.value))}/><span className="hint">{en ? "Higher quality usually creates a larger file." : "품질을 높이면 일반적으로 파일 용량도 커집니다."}</span></div>}
      <button type="button" className="primary image-process" disabled={!files.length || busy} onClick={convert}>{busy ? (en ? "Converting..." : "변환 중...") : (en ? "Convert images" : "이미지 변환하기")}</button>
      {error && <p className="image-error" role="alert">{error}</p>}
      {done && <p className="hint" role="status">{en ? "Conversion completed. Download each file below." : "변환이 완료되었습니다. 아래에서 파일을 다운로드하세요."}</p>}
      <p className="hint image-privacy">{en ? "Files are processed locally in your browser and are not uploaded to UTILWISE. HEIC conversion loads a decoder from jsDelivr when first needed." : "파일은 브라우저에서 처리되며 UTILWISE 서버로 업로드되지 않습니다. HEIC 변환 시 처음 한 번 외부 변환 모듈을 불러옵니다."}</p>
    </div>
    {results.length > 0 && <section className="image-output"><h2>{en ? "Converted images" : "변환 결과"}</h2><div className="image-output-grid">{results.map(r=><article className="image-output-card" key={r.url}><img src={r.url} alt={r.name}/><strong>{r.name}</strong><div className="image-stats"><span>{en ? "Original" : "원본"}: {bytes(r.originalSize)}</span><span>{en ? "Converted" : "변환 후"}: {bytes(r.size)}</span><span>{r.width} × {r.height} px</span></div><a className="primary image-download" href={r.url} download={r.name}>{en ? "Download" : "다운로드"}</a></article>)}</div></section>}
  </div>;
}
