"use client";
import { useEffect, useRef, useState } from "react";

type Props={lang:"ko"|"en"};
type OCRWorker={recognize:(image:File)=>Promise<{data:{text:string}}>;terminate:()=>Promise<void>};
type OCRModule={createWorker:(langs:string)=>Promise<OCRWorker>};

export default function ImageToTextOCR({lang}:Props){
 const en=lang==="en";
 const [file,setFile]=useState<File|null>(null),[preview,setPreview]=useState(""),[result,setResult]=useState("");
 const [busy,setBusy]=useState(false),[progress,setProgress]=useState(0),[status,setStatus]=useState("");
 const [language,setLanguage]=useState("kor+eng"),[error,setError]=useState("");
 const worker=useRef<OCRWorker|null>(null),input=useRef<HTMLInputElement>(null);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview);void worker.current?.terminate()},[preview]);
 const choose=(f?:File)=>{if(!f)return;setError("");setResult("");if(!f.type.startsWith("image/")){setError(en?"Please select an image file.":"이미지 파일을 선택해 주세요.");return}if(f.size>15*1024*1024){setError(en?"The image must be 15 MB or smaller.":"이미지는 15MB 이하만 지원합니다.");return}setFile(f);setPreview(URL.createObjectURL(f));setProgress(0);setStatus("")};
 const extract=async()=>{if(!file||busy)return;setBusy(true);setError("");setResult("");setProgress(0);setStatus(en?"Loading OCR engine…":"문자 인식 엔진을 불러오는 중…");try{
   if(!worker.current){const url="https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/+esm";const mod=await import(/* webpackIgnore: true */ url) as OCRModule;worker.current=await mod.createWorker(language);}
   setStatus(en?"Recognizing text…":"이미지의 글자를 인식하는 중…");
   const recognized=await worker.current.recognize(file);const text=recognized.data.text.trim();setResult(text);setProgress(100);setStatus(en?"Recognition complete":"글자 추출이 완료됐습니다.");if(!text)setError(en?"No text was detected. Try a clearer image.":"인식된 글자가 없습니다. 더 선명한 이미지를 사용해 보세요.");
 }catch(e){setError(en?"OCR could not start. Check your internet connection and try again.":"문자 인식에 실패했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.");setStatus("");}finally{setBusy(false)}};
 const copy=async()=>{try{await navigator.clipboard.writeText(result);setStatus(en?"Copied to clipboard":"클립보드에 복사했습니다.");}catch{setError(en?"Copy failed. Please select and copy the text manually.":"복사하지 못했습니다. 결과 텍스트를 직접 선택해 복사해 주세요.")}};
 const download=()=>{const blob=new Blob([result],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="utilwise-extracted-text.txt";a.click();URL.revokeObjectURL(url)};
 return <div className="ocr-tool">
  <section className="panel ocr-panel">
   <div className="ocr-upload" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();choose(e.dataTransfer.files[0])}}>
    <div className="tool-icon">▧</div><h2>{en?"Upload an image":"이미지 업로드"}</h2><p>{en?"Extract text from photos, screenshots, and scanned images.":"사진, 스크린샷, 스캔 이미지에서 글자를 추출하세요."}</p>
    <button type="button" className="primary" onClick={()=>input.current?.click()}>{en?"Choose image":"이미지 선택"}</button>
    <input ref={input} type="file" accept="image/*" hidden onChange={e=>choose(e.target.files?.[0])}/>
    <p className="hint">{en?"JPG, PNG, WebP · Up to 15 MB · Drag and drop supported":"JPG, PNG, WebP 등 · 최대 15MB · 드래그 앤 드롭 지원"}</p>
   </div>
   {file&&<div className="ocr-preview"><img src={preview} alt={en?"Selected image":"선택한 이미지"}/><div><strong>{file.name}</strong><p className="hint">{(file.size/1024/1024).toFixed(2)} MB</p><button className="tab" type="button" onClick={()=>{setFile(null);setPreview("");setResult("");setError("")}}>{en?"Remove":"이미지 제거"}</button></div></div>}
   <div className="ocr-options"><label htmlFor="ocr-language">{en?"Recognition language":"인식 언어"}</label><select id="ocr-language" value={language} disabled={busy} onChange={e=>{setLanguage(e.target.value);void worker.current?.terminate();worker.current=null}}><option value="kor+eng">{en?"Korean + English":"한국어 + 영어"}</option><option value="eng">{en?"English":"영어"}</option><option value="kor">{en?"Korean":"한국어"}</option></select></div>
   <button type="button" className="primary ocr-run" disabled={!file||busy} onClick={extract}>{busy?(en?"Recognizing…":"인식 중…"):(en?"Extract text":"글자 추출하기")}</button>
   {(busy||status)&&<p className="ocr-status" aria-live="polite">{status}{busy&&<span className="ocr-dots">　</span>}</p>}
   {error&&<p className="ocr-error" role="alert">{error}</p>}
  </section>
  <section className="panel ocr-result"><div className="ocr-result-head"><h2>{en?"Extracted text":"추출된 텍스트"}</h2><span className="hint">{result.length.toLocaleString(en?"en-US":"ko-KR")} {en?"characters":"자"}</span></div><textarea value={result} onChange={e=>setResult(e.target.value)} placeholder={en?"Recognized text will appear here. You can edit it before copying or downloading.":"인식된 글자가 여기에 표시됩니다. 복사하거나 다운로드하기 전에 직접 수정할 수 있습니다."} rows={12}/><div className="ocr-actions"><button type="button" className="tab" disabled={!result} onClick={copy}>{en?"Copy text":"텍스트 복사"}</button><button type="button" className="tab" disabled={!result} onClick={download}>{en?"Download .txt":"TXT 파일 다운로드"}</button><button type="button" className="tab" disabled={!result} onClick={()=>setResult("")}>{en?"Clear":"결과 지우기"}</button></div></section>
  <p className="ocr-privacy">{en?"Images are processed in your browser using Tesseract.js. Your image is not uploaded to UTILWISE. The OCR engine and selected language data are downloaded from jsDelivr on first use.":"이미지는 Tesseract.js를 이용해 브라우저에서 처리하며 UTILWISE 서버로 업로드하지 않습니다. 최초 사용 시 문자 인식 엔진과 선택한 언어 데이터가 jsDelivr에서 다운로드됩니다."}</p>
 </div>
}
