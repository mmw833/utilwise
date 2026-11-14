"use client";

import { useEffect, useRef, useState } from "react";

type TTS = {
  call: (text: string, lang: string, style: { ttl: { dims: number[] } }, steps: number, speed: number, silence: number, progress: (step: number, total: number) => void) => Promise<{ wav: number[]; duration: number[] }>;
  sampleRate: number;
};
type Style = { ttl: { dims: number[] }; dp: unknown };
type Helper = {
  loadTextToSpeech: (dir: string, options: Record<string, unknown>, progress: (name: string, current: number, total: number) => void) => Promise<{ textToSpeech: TTS }>;
  loadVoiceStyle: (paths: string[]) => Promise<Style>;
  writeWavFile: (audio: number[], rate: number) => ArrayBuffer;
};

const MODEL = "https://huggingface.co/supertone-oss-archive/supertonic-3/resolve/aafc6e32416a594460b32413efc49d7fe4ce6d46";
const ONNX = `${MODEL}/onnx`;
const VOICES = ["M1", "M2", "M3", "M4", "M5", "F1", "F2", "F3", "F4", "F5"];

export default function TextToSpeechTool({ lang }: { lang: "ko" | "en" }) {
  const en = lang === "en";
  const [text, setText] = useState(en ? "Hello! Welcome to UTILWISE. This is a simple text to speech demo." : "안녕하세요! UTILWISE 음성 변환 도구입니다. 입력한 문장을 자연스러운 음성으로 들어보세요.");
  const [language, setLanguage] = useState(en ? "en" : "ko");
  const [voice, setVoice] = useState("F1");
  const [speed, setSpeed] = useState(1.05);
  const [steps, setSteps] = useState(8);
  const [engine, setEngine] = useState<Helper | null>(null);
  const [tts, setTts] = useState<TTS | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const helperRef = useRef<Helper | null>(null);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); if (previewUrl) URL.revokeObjectURL(previewUrl); }, [audioUrl, previewUrl]);
  useEffect(() => { if (previewUrl && previewAudioRef.current) void previewAudioRef.current.play().catch(() => {}); }, [previewUrl]);

  const loadEngine = async () => {
    if (loading || tts) return;
    setLoading(true); setError(""); setLoadProgress(0);
    try {
      setStatus(en ? "Preparing the speech runtime…" : "음성 실행 환경을 준비하는 중…");
      // Configure ONNX Runtime's WASM binaries explicitly. Without this, a
      // dynamically imported ESM build can resolve .wasm files against the
      // UTILWISE page URL instead of the CDN package directory.
      const ortUrl = "https://esm.sh/onnxruntime-web@1.17.0/es2022/onnxruntime-web.mjs";
      const ort = await import(/* webpackIgnore: true */ ortUrl);
      ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.0/dist/";
      ort.env.wasm.numThreads = 1;
      setStatus(en ? "Loading the speech engine module…" : "음성 엔진 모듈을 불러오는 중…");
      const helperUrl = "https://esm.sh/gh/supertone-oss-archive/supertonic@1e9799e/web/helper.js?deps=onnxruntime-web@1.17.0";
      const helper = helperRef.current ?? await import(/* webpackIgnore: true */ helperUrl) as Helper;
      helperRef.current = helper;
      setStatus(en ? "Downloading speech models (about 398 MB) and preparing the engine…" : "음성 모델(약 398MB)을 다운로드하고 엔진을 준비하는 중…");
      const loaded = await helper.loadTextToSpeech(ONNX, { executionProviders: ["wasm"], graphOptimizationLevel: "all" }, (name, current, total) => { setLoadProgress(total > 0 ? Math.min(99, Math.round(current / total * 100)) : 0); setStatus(`${en ? "Loading model" : "모델 불러오는 중"} (${current}/${total}): ${name}`); });
      setEngine(helper); setTts(loaded.textToSpeech); setLoadProgress(100);
      setStatus(en ? "Loading voice style…" : "음성 스타일을 준비하는 중…");
      const loadedStyle = await helper.loadVoiceStyle([`${MODEL}/voice_styles/${voice}.json`]);
      setStyle(loadedStyle);
      setStatus(en ? "Ready. Enter text and generate speech." : "준비 완료! 문장을 입력하고 음성을 생성하세요.");
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error("UTILWISE TTS engine initialization failed:", e);
      setError(en
        ? `The speech engine could not be loaded. Check your connection and browser memory, then try again. Details: ${detail}`
        : `음성 엔진을 불러오지 못했습니다. 인터넷 연결과 브라우저 메모리를 확인해 주세요. 오류 내용: ${detail}`);
      setStatus("");
      console.error(e);
    } finally { setLoading(false); }
  };

  const changeVoice = (next: string) => { setVoice(next); setPreviewUrl(""); };

  const previewVoice = async () => {
    if (!tts || !engine || previewBusy || busy || loading) return;
    const sample = text.trim().slice(0, 180);
    if (!sample) { setError(en ? "Enter text to preview." : "미리 들을 문장을 먼저 입력해 주세요."); return; }
    setPreviewBusy(true); setError(""); setStatus(en ? `Preparing ${voice} voice preview…` : `${voice} 목소리 미리 듣기를 준비하는 중…`);
    try {
      const selectedStyle = await engine.loadVoiceStyle([`${MODEL}/voice_styles/${voice}.json`]);
      const result = await tts.call(sample, language, selectedStyle, Math.min(steps, 8), speed, 0.3, () => {});
      const wav = engine.writeWavFile(result.wav, tts.sampleRate);
      const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
      setPreviewUrl(previous => { if (previous) URL.revokeObjectURL(previous); return url; });
      setStatus(en ? "Preview ready. No downloadable file was created." : "미리 듣기가 준비됐습니다. 다운로드 파일은 생성하지 않았습니다.");
    } catch (e) { console.error(e); setError(en ? "Could not preview this voice." : "목소리 미리 듣기에 실패했습니다."); setStatus(""); }
    finally { setPreviewBusy(false); }
  };

  const generate = async () => {
    if (!tts || !engine || busy || previewBusy) return;
    if (!text.trim()) { setError(en ? "Enter some text first." : "먼저 문장을 입력해 주세요."); return; }
    if (text.length > 3000) { setError(en ? "Please keep the text under 3,000 characters." : "입력 문장은 3,000자 이하로 작성해 주세요."); return; }
    setBusy(true); setError(""); setProgress(0); setStatus(en ? "Generating speech…" : "음성을 생성하는 중…");
    try {
      const selectedStyle = await engine.loadVoiceStyle([`${MODEL}/voice_styles/${voice}.json`]);
      const result = await tts.call(text.trim(), language, selectedStyle, steps, speed, 0.3, (step, total) => { setProgress(Math.round(step / total * 100)); setStatus(`${en ? "Generating speech" : "음성 생성 중"} · ${step}/${total}`); });
      const wav = engine.writeWavFile(result.wav, tts.sampleRate);
      const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
      setAudioUrl(previous => { if (previous) URL.revokeObjectURL(previous); return url; });
      setDuration(result.duration[0] || 0);
      setProgress(100); setStatus(en ? "Speech generated. Preview or download the WAV file." : "음성 생성이 완료됐습니다. 미리 듣거나 WAV 파일을 저장하세요.");
    } catch (e) {
      console.error(e); setError(en ? "Speech generation failed. Try shorter text or fewer steps." : "음성 생성에 실패했습니다. 문장을 짧게 줄이거나 생성 단계를 낮춰 다시 시도해 주세요."); setStatus("");
    } finally { setBusy(false); }
  };

  return <div className="tts-tool">
    <section className="panel tts-panel">
      <div className="tts-engine-note"><strong>{en ? "Runs on your device" : "내 기기에서 직접 실행"}</strong><span>{en ? "Your text is not uploaded to UTILWISE." : "입력한 문장은 UTILWISE 서버로 전송되지 않습니다."}</span></div>
      {!tts && <div className="tts-load"><p>{en ? "The first setup downloads approximately 398 MB of open speech models. This may take time and requires a modern browser with enough memory." : "최초 실행 시 약 398MB의 오픈소스 음성 모델을 다운로드합니다. 다운로드에 시간이 걸릴 수 있으며 충분한 메모리가 있는 최신 브라우저가 필요합니다."}</p><button className="primary" type="button" disabled={loading} onClick={loadEngine}>{loading ? (en ? "Preparing…" : "준비 중…") : (en ? "Load speech engine" : "음성 엔진 불러오기")}</button>{(loading || loadProgress > 0) && <div className="tts-load-status" aria-live="polite"><div className="tts-load-progress"><i style={{ width: `${loadProgress}%` }} /></div><span>{status}</span><strong>{loadProgress}%</strong></div>}</div>}
      <label className="tts-label" htmlFor="tts-text">{en ? "Text to convert" : "음성으로 변환할 문장"}</label>
      <textarea id="tts-text" rows={8} maxLength={3000} value={text} onChange={e => setText(e.target.value)} placeholder={en ? "Type or paste your text…" : "문장을 입력하거나 붙여넣으세요…"} />
      <div className="tts-count">{text.length.toLocaleString()} / 3,000</div>
      <div className="tts-settings">
        <label>{en ? "Language" : "언어"}<select value={language} disabled={busy} onChange={e => setLanguage(e.target.value)}><option value="ko">한국어</option><option value="en">English</option><option value="ja">日本語</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option></select></label>
        <label>{en ? "Voice" : "목소리"}<select value={voice} disabled={busy || loading || previewBusy} onChange={e => changeVoice(e.target.value)}>{VOICES.map(v => <option key={v} value={v}>{v.startsWith("F") ? (en ? "Female" : "여성") : (en ? "Male" : "남성")} {v.slice(1)}</option>)}</select></label>
        <label>{en ? "Speed" : "말하기 속도"}<select value={speed} disabled={busy} onChange={e => setSpeed(Number(e.target.value))}><option value={0.9}>0.9×</option><option value={1.05}>1.05×</option><option value={1.2}>1.2×</option><option value={1.35}>1.35×</option><option value={1.5}>1.5×</option></select></label>
        <label>{en ? "Quality" : "음성 품질"}<select value={steps} disabled={busy} onChange={e => setSteps(Number(e.target.value))}><option value={4}>{en ? "Fast" : "빠르게"} (4)</option><option value={8}>{en ? "Balanced" : "균형"} (8)</option><option value={12}>{en ? "High" : "높음"} (12)</option></select></label>
      </div>
      <div className="tts-actions"><button type="button" className="tts-preview-button" disabled={!tts || busy || loading || previewBusy} onClick={() => void previewVoice()}>{previewBusy ? (en ? "Preparing preview…" : "미리 듣기 준비 중…") : (en ? "▶ Preview selected voice" : "▶ 선택한 목소리 미리 듣기")}</button><button type="button" className="primary tts-generate" disabled={!tts || busy || loading || previewBusy} onClick={generate}>{busy ? (en ? "Generating…" : "생성 중…") : (en ? "Generate speech" : "음성 생성하기")}</button></div>
      {previewUrl && <div className="tts-preview-player"><strong>{en ? `Voice preview: ${voice}` : `목소리 미리 듣기: ${voice}`}</strong><audio ref={previewAudioRef} controls preload="auto" src={previewUrl} /></div>}
      {(status || busy) && <div className="tts-status" aria-live="polite"><span>{status}</span>{busy && <div className="tts-progress"><i style={{ width: `${progress}%` }} /></div>}</div>}
      {error && <p className="ocr-error" role="alert">{error}</p>}
    </section>
    {audioUrl && <section className="panel tts-output"><h2>{en ? "Your audio" : "생성된 음성"}</h2><p>{en ? "Audio length" : "음성 길이"}: {duration.toFixed(1)} {en ? "seconds" : "초"}</p><audio controls preload="metadata" src={audioUrl} /><a className="primary tts-download" href={audioUrl} download="utilwise-speech.wav">{en ? "Download WAV" : "WAV 파일 다운로드"}</a></section>}
    <p className="tts-privacy">{en ? "Speech generation runs locally in your browser. The model and voice data are downloaded from Hugging Face and jsDelivr when needed. The model download is large and may be cached by your browser." : "음성 생성은 브라우저에서 실행됩니다. 필요한 모델과 음성 데이터는 Hugging Face 및 jsDelivr에서 다운로드하며, 모델 파일은 브라우저 캐시에 저장될 수 있습니다."}</p>
  </div>;
}
