"use client";

import { useEffect, useRef, useState } from "react";

type Language = "ko" | "en";
type PipelineOutput = { toBlob: () => Promise<Blob> };
type BackgroundPipeline = (image: Blob) => Promise<PipelineOutput[]>;
type ProgressHandler = (progress: { status?: string; progress?: number }) => void;
let pipelinePromise: Promise<BackgroundPipeline> | null = null;
let pipelineProgressHandler: ProgressHandler | null = null;

async function getBackgroundPipeline(onProgress: ProgressHandler): Promise<BackgroundPipeline> {
  pipelineProgressHandler = onProgress;
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      const transformersCdnUrl = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm";
      const { pipeline, env } = (await import(
        /* webpackIgnore: true */ transformersCdnUrl
      )) as {
        pipeline: (task: string, model: string, options?: Record<string, unknown>) => Promise<BackgroundPipeline>;
        env: { allowLocalModels: boolean; allowRemoteModels: boolean; useBrowserCache: boolean };
      };
      env.allowLocalModels = false;
      env.allowRemoteModels = true;
      env.useBrowserCache = true;
      const options = {
        progress_callback: (progress: { status?: string; progress?: number }) => pipelineProgressHandler?.(progress),
      };
      // Prefer WebGPU where available; fall back to the broadly compatible WASM backend.
      if (typeof navigator !== "undefined" && "gpu" in navigator) {
        try {
          return await pipeline("background-removal", "onnx-community/BEN2-ONNX", { ...options, device: "webgpu" });
        } catch (error) {
          console.warn("WebGPU background removal unavailable; falling back to WASM.", error);
        }
      }
      return await pipeline("background-removal", "onnx-community/BEN2-ONNX", { ...options, device: "wasm" });
    })();
  }
  return pipelinePromise;
}

const messages = {
  ko: {
    title: "이미지 선택 또는 여기에 놓기",
    formats: "JPG, PNG, WebP · 파일당 최대 20MB",
    choose: "이미지 선택",
    run: "고화질 배경 제거하기",
    working: "원본 이미지에서 배경을 제거하고 있습니다...",
    loading: "AI 모델을 준비하고 있습니다.",
    previewing: "AI가 배경과 피사체를 분석하고 있습니다.",
    previewReady: "예상 제거 영역을 확인한 뒤 배경 제거를 시작해 주세요.",
    previewLabel: "예상 제거 영역",
    previewHelp: "붉은색으로 표시된 부분은 AI가 배경으로 판단한 예상 영역입니다.",
    download: "투명 PNG 다운로드",
    reset: "다른 이미지 선택",
    privacy: "이미지 자체는 브라우저에서 처리되며 UTILWISE 서버로 업로드되지 않습니다. 최초 이용 시 AI 모델 파일을 다운로드하며 이후에는 브라우저 캐시를 활용합니다.",
    preview: "결과 미리보기",
    original: "원본 이미지",
    background: "미리보기 배경",
    transparent: "투명",
    white: "흰색",
    gray: "회색",
    black: "검정",
    tooLarge: "파일 크기는 20MB 이하여야 합니다.",
    invalid: "JPG, PNG 또는 WebP 이미지 파일을 선택해 주세요.",
    dimensions: "이미지의 가로 또는 세로 길이는 8,000px 이하여야 합니다.",
    error: "이미지를 처리하지 못했습니다. 잠시 후 다시 시도하거나 다른 이미지를 선택해 주세요.",
    guide: "사람과 사물 등 다양한 사진의 배경을 분리하는 AI 모델을 사용합니다. 복잡한 배경이나 작은 디테일은 결과에 따라 차이가 있을 수 있습니다.",
    modelReady: "배경 제거가 완료되었습니다.",
    modelDownload: "AI 모델 다운로드",
    modelLoading: "AI 모델 불러오기",
    analyzing: "저해상도 미리보기 분석",
    finalizing: "원본 고화질 이미지 처리",
    done: "완료",
  },
  en: {
    title: "Choose an image or drop it here",
    formats: "JPG, PNG, WebP · Up to 20 MB per file",
    choose: "Choose image",
    run: "Remove background in high quality",
    working: "Removing the background from the original image...",
    loading: "Preparing the AI model.",
    previewing: "AI is analyzing the subject and background.",
    previewReady: "Review the estimated removal area, then start background removal.",
    previewLabel: "Estimated removal area",
    previewHelp: "Red areas are the regions the AI estimates as background.",
    download: "Download transparent PNG",
    reset: "Choose another image",
    privacy: "Your image is processed in your browser and is never uploaded to UTILWISE. The AI model is downloaded on first use and cached by your browser.",
    preview: "Result preview",
    original: "Original image",
    background: "Preview background",
    transparent: "Transparent",
    white: "White",
    gray: "Gray",
    black: "Black",
    tooLarge: "The file must be 20 MB or smaller.",
    invalid: "Please choose a JPG, PNG, or WebP image.",
    dimensions: "Image width and height must each be 8,000 px or less.",
    error: "Could not process this image. Please try again or choose another file.",
    guide: "The AI model can separate people and objects from a range of photos. Results may vary with complex backgrounds or fine details.",
    modelReady: "Background removal complete.",
    modelDownload: "Downloading AI model",
    modelLoading: "Loading AI model",
    analyzing: "Analyzing low-resolution preview",
    finalizing: "Processing original high-resolution image",
    done: "Done",
  },
};

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not decode image")); };
    image.src = url;
  });
}

async function makeEstimatedOverlay(source: Blob, removedBackground: Blob): Promise<Blob> {
  const sourceImage = await blobToImage(source);
  const maskImage = await blobToImage(removedBackground);
  const width = sourceImage.naturalWidth;
  const height = sourceImage.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is unavailable");
  context.drawImage(sourceImage, 0, 0, width, height);
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  if (!maskContext) throw new Error("Canvas is unavailable");
  maskContext.drawImage(maskImage, 0, 0, width, height);
  const mask = maskContext.getImageData(0, 0, width, height).data;
  const overlay = context.createImageData(width, height);
  for (let i = 0; i < mask.length; i += 4) {
    const removed = 255 - mask[i + 3];
    overlay.data[i] = 239;
    overlay.data[i + 1] = 68;
    overlay.data[i + 2] = 68;
    overlay.data[i + 3] = Math.round(removed * 0.42);
  }
  context.putImageData(overlay, 0, 0);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Preview encoding failed")), "image/jpeg", 0.88));
}

async function makeSmallPreview(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) { bitmap.close(); throw new Error("Canvas is unavailable"); }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Preview encoding failed")), "image/jpeg", 0.86));
}

export default function BackgroundRemover({ lang = "ko" }: { lang?: Language }) {
  const t = messages[lang];
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [background, setBackground] = useState("transparent");
  const [dragging, setDragging] = useState(false);
  const selectionRef = useRef(0);

  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); }, [sourceUrl]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const updateModelProgress = (item: { status?: string; progress?: number }) => {
    if (item.status === "progress" && typeof item.progress === "number") {
      setStage(t.modelDownload);
      setProgress(Math.max(0, Math.min(100, Math.round(item.progress))));
      setStatus(`${t.modelDownload} · ${Math.round(item.progress)}%`);
    } else if (item.status === "initiate" || item.status === "download") {
      setStage(t.modelDownload);
      setProgress(0);
      setStatus(t.loading);
    } else if (item.status === "done") {
      setProgress(100);
    }
  };

  async function selectFile(candidate?: File) {
    if (!candidate) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(candidate.type)) { setError(t.invalid); return; }
    if (candidate.size > 20 * 1024 * 1024) { setError(t.tooLarge); return; }
    try {
      const bitmap = await createImageBitmap(candidate);
      const tooLarge = bitmap.width > 8000 || bitmap.height > 8000;
      bitmap.close();
      if (tooLarge) { setError(t.dimensions); return; }
    } catch { setError(t.invalid); return; }

    const selection = ++selectionRef.current;
    setError("");
    setStatus(t.previewing);
    setStage(t.analyzing);
    setProgress(null);
    setResultUrl("");
    setPreviewUrl("");
    setFile(candidate);
    setSourceUrl(URL.createObjectURL(candidate));
    setPreviewBusy(true);
    try {
      const smallImage = await makeSmallPreview(candidate);
      if (selection !== selectionRef.current) return;
      const remover = await getBackgroundPipeline(updateModelProgress);
      if (selection !== selectionRef.current) return;
      setStage(t.analyzing);
      setProgress(null);
      setStatus(t.previewing);
      const output = await remover(smallImage);
      if (!output?.[0]) throw new Error("No preview output");
      const maskBlob = await output[0].toBlob();
      const overlay = await makeEstimatedOverlay(smallImage, maskBlob);
      if (selection !== selectionRef.current) return;
      setPreviewUrl(URL.createObjectURL(overlay));
      setStatus(t.previewReady);
      setStage(t.analyzing);
      setProgress(100);
    } catch (cause) {
      console.error("Background preview failed", cause);
      if (selection === selectionRef.current) {
        setError(t.error);
        setStatus("");
        setStage("");
      }
    } finally {
      if (selection === selectionRef.current) setPreviewBusy(false);
    }
  }

  async function removeBackground() {
    if (!file || busy || previewBusy) return;
    setBusy(true);
    setError("");
    setStatus(t.working);
    setStage(t.finalizing);
    setProgress(null);
    try {
      const remover = await getBackgroundPipeline(updateModelProgress);
      setStage(t.finalizing);
      setProgress(null);
      setStatus(t.working);
      const output = await remover(file);
      if (!output?.[0]) throw new Error("No image output");
      const blob = await output[0].toBlob();
      if (!blob || blob.size === 0) throw new Error("Empty image output");
      setResultUrl(URL.createObjectURL(blob));
      setStatus(t.modelReady);
      setStage(t.done);
      setProgress(100);
    } catch (cause) {
      pipelinePromise = null;
      console.error("Background removal failed", cause);
      setError(t.error);
      setStatus("");
      setStage("");
      setProgress(null);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    selectionRef.current += 1;
    setFile(null);
    setSourceUrl("");
    setPreviewUrl("");
    setResultUrl("");
    setError("");
    setStatus("");
    setStage("");
    setProgress(null);
    setPreviewBusy(false);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const backgroundStyle = background === "transparent" ? "background-checker" : "background-solid";
  const colorStyle = background === "white" ? "#ffffff" : background === "gray" ? "#e5e7eb" : background === "black" ? "#20252d" : undefined;
  const isProcessing = busy || previewBusy;

  return (
    <div className="background-remover">
      {!file ? (
        <button type="button" className={`background-upload ${dragging ? "is-dragging" : ""}`} onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0]); }}>
          <span className="background-upload-icon" aria-hidden="true">↥</span>
          <strong>{t.title}</strong><span>{t.formats}</span><span className="primary background-choose">{t.choose}</span>
        </button>
      ) : (
        <div className="background-workspace">
          <div className="background-source">
            <div className="background-preview-heading">{t.original}</div>
            <div className="background-preview-frame"><img src={sourceUrl} alt={file.name} /></div>
            <div className="background-file-name">{file.name}</div>
          </div>
          <div className="background-result">
            <div className="background-preview-heading">{resultUrl ? t.preview : t.previewLabel}</div>
            <div className={`background-preview-frame ${backgroundStyle} ${previewUrl && !resultUrl ? "background-estimate-frame" : ""}`} style={colorStyle ? { backgroundColor: colorStyle } : undefined}>
              {resultUrl ? <img src={resultUrl} alt={lang === "ko" ? "배경이 제거된 이미지" : "Image with background removed"} />
                : previewUrl ? <img src={previewUrl} alt={t.previewLabel} />
                : <div className="background-placeholder">{previewBusy ? t.previewing : t.loading}</div>}
            </div>
            {previewUrl && !resultUrl && <p className="background-estimate-help">{t.previewHelp}</p>}
            {resultUrl && <div className="background-color-controls"><span>{t.background}</span>
              {(["transparent", "white", "gray", "black"] as const).map((choice) => <button key={choice} type="button" className={background === choice ? "selected" : ""} onClick={() => setBackground(choice)} aria-pressed={background === choice}>{t[choice]}</button>)}
            </div>}
          </div>
        </div>
      )}
      <input ref={inputRef} className="background-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files?.[0])} />
      {file && <div className="background-actions">
        {!resultUrl && <button type="button" className="primary" onClick={removeBackground} disabled={isProcessing || !previewUrl}>{previewBusy ? t.previewing : busy ? t.working : t.run}</button>}
        {resultUrl && <a className="primary" href={resultUrl} download={`${file.name.replace(/\.[^.]+$/, "")}-background-removed.png`}>{t.download}</a>}
        <button type="button" className="background-secondary" onClick={reset} disabled={isProcessing}>{t.reset}</button>
      </div>}
      {status && <p className="background-status" role="status">{status}</p>}
      {stage && <div className="background-progress" aria-label={stage}>
        <div className="background-progress-top"><span>{stage}</span>{progress !== null && <strong>{progress}%</strong>}</div>
        <div className="background-progress-track"><span className={progress === null ? "is-indeterminate" : ""} style={progress !== null ? { width: `${progress}%` } : undefined} /></div>
      </div>}
      {error && <p className="image-error" role="alert">{error}</p>}
      <p className="hint background-privacy">{t.privacy}</p><p className="hint background-model-note">{t.guide}</p>
    </div>
  );
}
