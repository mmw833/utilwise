"use client";

import { useEffect, useRef, useState } from "react";

type Props = { lang: "ko" | "en" };
type OCRResult = { data: { text: string; confidence?: number } };
type OCRWorker = {
  recognize: (image: HTMLCanvasElement) => Promise<OCRResult>;
  setParameters: (params: Record<string, string>) => Promise<unknown>;
  terminate: () => Promise<void>;
};
type OCRModule = {
  createWorker: (
    langs: string,
    oem?: number,
    options?: { logger?: (message: { status?: string; progress?: number }) => void }
  ) => Promise<OCRWorker>;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("IMAGE_DECODE_FAILED"));
    };
    image.src = url;
  });
}

/**
 * Prepare a readable, high-contrast grayscale image without destructive
 * hard-thresholding. Upscaling small screenshots helps Tesseract read glyphs.
 */
async function prepareOCRImage(file: File): Promise<HTMLCanvasElement> {
  const image = await loadImage(file);
  const maxSide = Math.max(image.naturalWidth, image.naturalHeight);
  const minSide = Math.min(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(2.5, 4600 / maxSide, minSide < 1100 ? 2200 / minSide : 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("CANVAS_UNAVAILABLE");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;
  const contrast = 1.28;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const enhanced = Math.max(0, Math.min(255, (gray - 128) * contrast + 128));
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
    data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  return canvas;
}

export default function ImageToTextOCR({ lang }: Props) {
  const en = lang === "en";
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("kor+eng");
  const [error, setError] = useState("");
  const worker = useRef<OCRWorker | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      void worker.current?.terminate();
      worker.current = null;
    };
  }, []);

  const choose = (nextFile?: File) => {
    if (!nextFile) return;
    setError("");
    setResult("");
    if (!nextFile.type.startsWith("image/")) {
      setError(en ? "Please select an image file." : "이미지 파일을 선택해 주세요.");
      return;
    }
    if (nextFile.size > 15 * 1024 * 1024) {
      setError(en ? "The image must be 15 MB or smaller." : "이미지는 15MB 이하만 지원합니다.");
      return;
    }
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setProgress(0);
    setStatus("");
  };

  const extract = async () => {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    setResult("");
    setProgress(3);
    setStatus(en ? "Preparing image…" : "이미지 선명도를 개선하는 중…");

    try {
      const prepared = await prepareOCRImage(file);
      setProgress(12);
      if (!worker.current) {
        const url = "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/+esm";
        const mod = (await import(/* webpackIgnore: true */ url)) as OCRModule;
        worker.current = await mod.createWorker(language, 1, {
          logger: (message) => {
            if (typeof message.progress === "number") {
              setProgress(Math.max(12, Math.min(92, 12 + message.progress * 80)));
            }
            if (message.status === "loading language traineddata") {
              setStatus(en ? "Loading language data…" : "언어 인식 데이터를 불러오는 중…");
            } else if (message.status === "recognizing text") {
              setStatus(en ? "Recognizing text…" : "글자를 분석하는 중…");
            }
          },
        });
      }

      // Test automatic, single-column, block and sparse-text layouts.
      // Confidence alone can favor a shorter result, so prefer a more complete
      // result when its confidence is close to the current best.
      setStatus(en ? "Comparing text recognition layouts…" : "여러 글자 배치 방식으로 인식 결과를 비교하는 중…");
      const candidates: OCRResult[] = [];
      for (const mode of ["3", "4", "6", "11"]) {
        await worker.current.setParameters({
          tessedit_pageseg_mode: mode,
          preserve_interword_spaces: "1",
        });
        candidates.push(await worker.current.recognize(prepared));
      }
      const best = candidates.reduce((currentBest, candidate) => {
        const currentText = currentBest.data.text.trim();
        const candidateText = candidate.data.text.trim();
        const currentConfidence = currentBest.data.confidence ?? 0;
        const candidateConfidence = candidate.data.confidence ?? 0;
        if (!currentText) return candidate;
        if (!candidateText) return currentBest;
        if (candidateConfidence >= currentConfidence - 8 && candidateText.length > currentText.length) {
          return candidate;
        }
        return candidateConfidence > currentConfidence ? candidate : currentBest;
      });

      const extracted = best.data.text.trim();
      setResult(extracted);
      setProgress(100);
      setStatus(
        en
          ? `Recognition complete · confidence ${Math.round(best.data.confidence ?? 0)}%`
          : `인식 완료 · 엔진 신뢰도 ${Math.round(best.data.confidence ?? 0)}%`
      );
      if (!extracted) {
        setError(
          en
            ? "No text was detected. Try a higher-resolution image or select a single language."
            : "인식된 글자가 없습니다. 더 높은 해상도의 이미지나 단일 언어 설정을 사용해 보세요."
        );
      }
    } catch {
      setError(
        en
          ? "OCR could not complete. Check your internet connection and try another image."
          : "문자 인식에 실패했습니다. 인터넷 연결을 확인한 뒤 다른 이미지로 다시 시도해 주세요."
      );
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setStatus(en ? "Copied to clipboard" : "클립보드에 복사했습니다.");
    } catch {
      setError(
        en
          ? "Copy failed. Please select and copy the text manually."
          : "복사하지 못했습니다. 결과 텍스트를 직접 선택해 복사해 주세요."
      );
    }
  };

  const download = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "utilwise-extracted-text.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const changeLanguage = async (nextLanguage: string) => {
    setLanguage(nextLanguage);
    const currentWorker = worker.current;
    worker.current = null;
    if (currentWorker) await currentWorker.terminate();
  };

  return (
    <div className="ocr-tool">
      <section className="panel ocr-panel">
        <div
          className="ocr-upload"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            choose(event.dataTransfer.files[0]);
          }}
        >
          <div className="tool-icon">▧</div>
          <h2>{en ? "Upload an image" : "이미지 업로드"}</h2>
          <p>
            {en
              ? "Extract text from photos, screenshots, and scanned images."
              : "사진, 스크린샷, 스캔 이미지에서 글자를 추출하세요."}
          </p>
          <button type="button" className="primary" onClick={() => input.current?.click()}>
            {en ? "Choose image" : "이미지 선택"}
          </button>
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => choose(event.target.files?.[0])}
          />
          <p className="hint">
            {en
              ? "JPG, PNG, WebP · Up to 15 MB · Drag and drop supported"
              : "JPG, PNG, WebP 등 · 최대 15MB · 드래그 앤 드롭 지원"}
          </p>
        </div>

        {file && (
          <div className="ocr-preview">
            <img src={preview} alt={en ? "Selected image" : "선택한 이미지"} />
            <div>
              <strong>{file.name}</strong>
              <p className="hint">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                className="tab"
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview("");
                  setResult("");
                  setError("");
                  setProgress(0);
                  setStatus("");
                }}
              >
                {en ? "Remove" : "이미지 제거"}
              </button>
            </div>
          </div>
        )}

        <div className="ocr-options">
          <label htmlFor="ocr-language">{en ? "Recognition language" : "인식 언어"}</label>
          <select
            id="ocr-language"
            value={language}
            disabled={busy}
            onChange={(event) => void changeLanguage(event.target.value)}
          >
            <option value="kor+eng">{en ? "Korean + English" : "한국어 + 영어"}</option>
            <option value="eng">{en ? "English" : "영어"}</option>
            <option value="kor">{en ? "Korean" : "한국어"}</option>
          </select>
        </div>

        <button type="button" className="primary ocr-run" disabled={!file || busy} onClick={extract}>
          {busy ? (en ? "Recognizing…" : "인식 중…") : en ? "Extract text" : "글자 추출하기"}
        </button>
        {(busy || status) && (
          <div className="ocr-status" aria-live="polite">
            <span>{status}</span>
            {busy && (
              <div className="ocr-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        )}
        {error && <p className="ocr-error" role="alert">{error}</p>}
      </section>

      <section className="panel ocr-result">
        <div className="ocr-result-head">
          <h2>{en ? "Extracted text" : "추출된 텍스트"}</h2>
          <span className="hint">
            {result.length.toLocaleString(en ? "en-US" : "ko-KR")} {en ? "characters" : "자"}
          </span>
        </div>
        <textarea
          value={result}
          onChange={(event) => setResult(event.target.value)}
          placeholder={
            en
              ? "Recognized text will appear here. You can edit it before copying or downloading."
              : "인식된 글자가 여기에 표시됩니다. 복사하거나 다운로드하기 전에 직접 수정할 수 있습니다."
          }
          rows={12}
        />
        <div className="ocr-actions">
          <button type="button" className="tab" disabled={!result} onClick={copy}>
            {en ? "Copy text" : "텍스트 복사"}
          </button>
          <button type="button" className="tab" disabled={!result} onClick={download}>
            {en ? "Download .txt" : "TXT 파일 다운로드"}
          </button>
          <button type="button" className="tab" disabled={!result} onClick={() => setResult("")}>
            {en ? "Clear" : "결과 지우기"}
          </button>
        </div>
      </section>

      <p className="ocr-privacy">
        {en
          ? "Images are processed in your browser using Tesseract.js. Your image is not uploaded to UTILWISE. The OCR engine and selected language data are downloaded from jsDelivr on first use."
          : "이미지는 Tesseract.js를 이용해 브라우저에서 처리하며 UTILWISE 서버로 업로드하지 않습니다. 최초 사용 시 문자 인식 엔진과 선택한 언어 데이터가 jsDelivr에서 다운로드됩니다."}
      </p>
    </div>
  );
}
