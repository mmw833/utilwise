"use client";
import {useMemo,useState} from "react";

type Mode="counter"|"compare"|"dedupe";
const countWords=(text:string)=>text.trim()?text.trim().split(/\s+/u).length:0;
const countChars=(text:string)=>Array.from(text).length;
const countCharsNoSpace=(text:string)=>Array.from(text).filter(ch=>!/\s/u.test(ch)).length;

export default function TextTools({mode,english=false}:{mode:Mode;english?:boolean}){
 const [text,setText]=useState("");
 const [left,setLeft]=useState("");
 const [right,setRight]=useState("");
 const [copied,setCopied]=useState(false);
 const copy=(value:string)=>{if(typeof navigator!=="undefined"&&navigator.clipboard){navigator.clipboard.writeText(value).then(()=>setCopied(true)).catch(()=>setCopied(false));}};
 const deduped=useMemo(()=>{
  const seen=new Set<string>();
  const parts=text.match(/[^.!?。！？\n]+[.!?。！？]?|\n+/gu)||[];
  return parts.filter(part=>{
   if(/^\n+$/u.test(part))return true;
   const key=part.trim().toLocaleLowerCase();
   if(!key)return true;
   if(seen.has(key))return false;
   seen.add(key);return true;
  }).join("").replace(/\n{3,}/gu,"\n\n").trim();
 },[text]);
 const leftLines=left.split(/\r?\n/u).filter(line=>line.length>0);
 const rightLines=right.split(/\r?\n/u).filter(line=>line.length>0);
 const onlyLeft=leftLines.filter(line=>!rightLines.includes(line));
 const onlyRight=rightLines.filter(line=>!leftLines.includes(line));
 const labels=english?{
  back:"← All tools",counter:"Character & Word Counter",compare:"Text Comparison",dedupe:"Duplicate Sentence Remover",
  introCounter:"Count characters and words instantly as you type.",introCompare:"Compare two texts and identify lines that appear only on one side.",introDedupe:"Remove repeated sentences while keeping the first occurrence.",
  input:"Enter your text",placeholder:"Type or paste your text here...",characters:"Characters (with spaces)",noSpaces:"Characters (without spaces)",words:"Words",clear:"Clear",copy:"Copy result",left:"Original text",right:"Text to compare",leftPlaceholder:"Paste the first text...",rightPlaceholder:"Paste the second text...",leftOnly:"Only in first text",rightOnly:"Only in second text",same:"No unique lines found. The texts contain the same non-empty lines.",dedupeNote:"Sentences are identified by common sentence-ending punctuation or line breaks. The first occurrence is kept.",result:"Cleaned text",copied:"Copied",faq:"How it works",faqText:"All processing happens locally in your browser. Your text is not sent to UTILWISE servers."
 }:{
  back:"← 전체 도구",counter:"글자 수·단어 수 세기",compare:"텍스트 비교",dedupe:"중복 문장 제거",
  introCounter:"글을 입력하면 글자 수와 단어 수를 실시간으로 계산합니다.",introCompare:"두 텍스트를 비교해 한쪽에만 있는 문장을 확인합니다.",introDedupe:"반복된 문장을 찾아 첫 번째 문장만 남기고 정리합니다.",
  input:"텍스트 입력",placeholder:"여기에 글을 입력하거나 붙여넣으세요...",characters:"공백 포함 글자 수",noSpaces:"공백 제외 글자 수",words:"단어 수",clear:"지우기",copy:"결과 복사",left:"첫 번째 텍스트",right:"두 번째 텍스트",leftPlaceholder:"비교할 첫 번째 글을 입력하세요...",rightPlaceholder:"비교할 두 번째 글을 입력하세요...",leftOnly:"첫 번째에만 있는 내용",rightOnly:"두 번째에만 있는 내용",same:"서로 다른 줄이 없습니다. 두 텍스트의 내용이 같습니다.",dedupeNote:"마침표·물음표·느낌표 또는 줄바꿈을 기준으로 문장을 구분하며, 처음 나온 문장은 유지합니다.",result:"중복 제거 결과",copied:"복사 완료",faq:"이용 안내",faqText:"모든 처리는 브라우저 안에서 이루어집니다. 입력한 텍스트는 UTILWISE 서버로 전송되지 않습니다."
 };
 const heading=mode==="counter"?labels.counter:mode==="compare"?labels.compare:labels.dedupe;
 const intro=mode==="counter"?labels.introCounter:mode==="compare"?labels.introCompare:labels.introDedupe;
 return <main><header className="wrap header"><a href={english?"/en":"/"} className="logo">UTIL<span>WISE</span>.</a><a className="sub" href={english?"/en/text-tools":"/text-tools"}>{labels.back}</a></header>
 <section className="wrap section text-tool-page"><div className="eyebrow">UTILWISE TEXT TOOLS</div><h1>{heading}</h1><p className="sub">{intro}</p>
 {mode==="counter"&&<><section className="panel text-tool-panel"><label className="text-tool-label" htmlFor="text-counter">{labels.input}</label><textarea id="text-counter" value={text} onChange={e=>setText(e.target.value)} placeholder={labels.placeholder}/><div className="text-tool-stats"><div><strong>{countChars(text).toLocaleString(english?"en-US":"ko-KR")}</strong><span>{labels.characters}</span></div><div><strong>{countCharsNoSpace(text).toLocaleString(english?"en-US":"ko-KR")}</strong><span>{labels.noSpaces}</span></div><div><strong>{countWords(text).toLocaleString(english?"en-US":"ko-KR")}</strong><span>{labels.words}</span></div></div><button className="text-tool-secondary" onClick={()=>setText("")}>{labels.clear}</button></section></>}
 {mode==="compare"&&<><div className="text-tool-columns"><section className="panel text-tool-panel"><label className="text-tool-label" htmlFor="text-left">{labels.left}</label><textarea id="text-left" value={left} onChange={e=>setLeft(e.target.value)} placeholder={labels.leftPlaceholder}/></section><section className="panel text-tool-panel"><label className="text-tool-label" htmlFor="text-right">{labels.right}</label><textarea id="text-right" value={right} onChange={e=>setRight(e.target.value)} placeholder={labels.rightPlaceholder}/></section></div><div className="text-tool-columns"><section className="panel"><h2>{labels.leftOnly} ({onlyLeft.length})</h2>{onlyLeft.length?onlyLeft.map((line,i)=><p className="text-diff-line removed" key={i}>{line}</p>):<p className="hint">—</p>}</section><section className="panel"><h2>{labels.rightOnly} ({onlyRight.length})</h2>{onlyRight.length?onlyRight.map((line,i)=><p className="text-diff-line added" key={i}>{line}</p>):<p className="hint">—</p>}</section></div>{left.trim()&&right.trim()&&!onlyLeft.length&&!onlyRight.length&&<p className="text-tool-same">{labels.same}</p>}</>}
 {mode==="dedupe"&&<><section className="panel text-tool-panel"><label className="text-tool-label" htmlFor="text-dedupe">{labels.input}</label><textarea id="text-dedupe" value={text} onChange={e=>{setText(e.target.value);setCopied(false)}} placeholder={labels.placeholder}/><p className="hint">{labels.dedupeNote}</p></section><section className="panel text-tool-panel"><h2>{labels.result}</h2><textarea readOnly value={deduped}/><button className="primary" type="button" onClick={()=>copy(deduped)}>{copied?labels.copied:labels.copy}</button></section></>}
 <section className="text-tool-guide"><h2>{labels.faq}</h2><p>{labels.faqText}</p></section>
 </section></main>;
}
