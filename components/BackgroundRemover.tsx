"use client";

import { useEffect, useRef, useState } from "react";

type Language = "ko" | "en";
type BackgroundPipeline = (image: Blob) => Promise<Array<{ toBlob: () => Promise<Blob> }>>;
let pipelinePromise: Promise<BackgroundPipeline> | null = null;

const messages = {
  ko: {
    title: "이미지 선택 또는 여기에 놓기",
    formats: "JPG, PNG, WebP · 파일당 최대 20MB",
    choose: "이미지 선택",
    run: "배경 제거하기",
    working: "배경을 제거하고 있습니다...",
    loading: "AI 모델을 준비하고 있습니다. 처음에는 모델 다운로드로 시간이 걸릴 수 있습니다.",
    download: "투명 PNG 다운로드",
    reset: "다른 이미지 선택",
    privacy: "이미지 자체는 브라우저에서 처리되며 UTILWISE 서버로 업로드되지 않습니다. 최초 이용 시 AI 모델 파일을 Hugging Face에서 다운로드합니다.",
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
  },
  en: {
    title: "Choose an image or drop it here",
    formats: "JPG, PNG, WebP · Up to 20 MB per file",
    choose: "Choose image",
    run: "Remove background",
    working: "Removing background...",
    loading: "Preparing the AI model. The first visit may take longer while the model downloads.",
    download: "Download transparent PNG",
    reset: "Choose another image",
    privacy: "Your image is processed in your browser and is never uploaded to UTILWISE. The AI model is downloaded from Hugging Face on first use.",
    preview: "Preview",
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
  },
};

export default function BackgroundRemover({ lang = "ko" }: { lang?: Language }) {
  const t = messages[lang];
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [background, setBackground] = useState("transparent");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); };
  }, [sourceUrl]);

  useEffect(() => {
    return () => { if (resultUrl) URL.revokeObjectURL(resultUrl); };
  }, [resultUrl]);

  async function selectFile(candidate?: File) {
    if (!candidate) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(candidate.type)) {
      setError(t.invalid);
      return;
    }
    if (candidate.size > 20 * 1024 * 1024) {
      setError(t.tooLarge);
      return;
    }
    try {
      const bitmap = await createImageBitmap(candidate);
      const tooLarge = bitmap.width > 8000 || bitmap.height > 8000;
      bitmap.close();
      if (tooLarge) { setError(t.dimensions); return; }
    } catch {
      setError(t.invalid);
      return;
    }
    setError("");
    setStatus("");
    setResultUrl("");
    setFile(candidate);
    setSourceUrl(URL.createObjectURL(candidate));
  }

  async function removeBackground() {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    setStatus(t.loading);
    try {
      if (!pipelinePromise) {
        pipelinePromise = (async () => {
          const { pipeline, env } = await import("@huggingface/transformers");
          env.allowLocalModels = false;
          env.useBrowserCache = true;
          return await pipeline(
            "background-removal",
            "onnx-community/BEN2-ONNX",
            {
              progress_callback: (progress: { status?: string; progress?: number; file?: string }) => {
                if (progress.status === "progress" && typeof progress.progress === "number") {
                  setStatus(`${t.loading} ${Math.round(progress.progress)}%`);
                }
              },
            } as never,
          ) as unknown as BackgroundPipeline;
        })();
      }
      const remover = await pipelinePromise;
      setStatus(t.working);
      const output = await remover(file);
      if (!output?.[0]) throw new Error("No image output");
      const blob = await output[0].toBlob();
      if (!blob || blob.size === 0) throw new Error("Empty image output");
      setResultUrl(URL.createObjectURL(blob));
      setStatus(t.modelReady);
    } catch (cause) {
      pipelinePromise = null;
      console.error("Background removal failed", cause);
      setError(t.error);
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setSourceUrl("");
    setResultUrl("");
    setError("");
    setStatus("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const backgroundStyle =
    background === "transparent"
      ? "background-checker"
      : "background-solid";
  const colorStyle =
    background === "white" ? "#ffffff" :
    background === "gray" ? "#e5e7eb" :
    background === "black" ? "#20252d" : undefined;

  return (
    <div className="background-remover">
      {!file ? (
        <button
          type="button"
          className={`background-upload ${dragging ? "is-dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            selectFile(event.dataTransfer.files?.[0]);
          }}
        >
          <span className="background-upload-icon" aria-hidden="true">↥</span>
          <strong>{t.title}</strong>
          <span>{t.formats}</span>
          <span className="primary background-choose">{t.choose}</span>
        </button>
      ) : (
        <div className="background-workspace">
          <div className="background-source">
            <div className="background-preview-heading">{t.original}</div>
            <div className="background-preview-frame"><img src={sourceUrl} alt={file.name} /></div>
            <div className="background-file-name">{file.name}</div>
          </div>
          <div className="background-result">
            <div className="background-preview-heading">{t.preview}</div>
            <div className={`background-preview-frame ${backgroundStyle}`} style={colorStyle ? { backgroundColor: colorStyle } : undefined}>
              {resultUrl ? <img src={resultUrl} alt={lang === "ko" ? "배경이 제거된 이미지" : "Image with background removed"} /> : <div className="background-placeholder">{busy ? t.working : t.loading}</div>}
            </div>
            {resultUrl && (
              <div className="background-color-controls">
                <span>{t.background}</span>
                {(["transparent", "white", "gray", "black"] as const).map((choice) => (
                  <button key={choice} type="button" className={background === choice ? "selected" : ""} onClick={() => setBackground(choice)} aria-pressed={background === choice}>
                    {t[choice]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        className="background-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
      {file && (
        <div className="background-actions">
          {!resultUrl && <button type="button" className="primary" onClick={removeBackground} disabled={busy}>{busy ? t.working : t.run}</button>}
          {resultUrl && <a className="primary" href={resultUrl} download={`${file.name.replace(/\.[^.]+$/, "")}-background-removed.png`}>{t.download}</a>}
          <button type="button" className="background-secondary" onClick={reset} disabled={busy}>{t.reset}</button>
        </div>
      )}
      {status && <p className="background-status" role="status">{status}</p>}
      {error && <p className="image-error" role="alert">{error}</p>}
      <p className="hint background-privacy">{t.privacy}</p>
      <p className="hint background-model-note">{t.guide}</p>
    </div>
  );
}
