"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import {answerLabels,questions} from "../data";
const axes=["E","S","T","J"] as const;
const opposite:Record<string,string>={E:"I",S:"N",T:"F",J:"P"};
export default function MbtiTest(){
 const router=useRouter();
 const [answers,setAnswers]=useState<number[]>(Array(24).fill(0));
 const [index,setIndex]=useState(0);
 const q=questions[index];
 function finish(finalAnswers:number[]){
  const scores:Record<string,number>={E:0,S:0,T:0,J:0};
  questions.forEach((item,i)=>{scores[item.axis]+=item.reverse?6-finalAnswers[i]:finalAnswers[i];});
  const type=axes.map(axis=>scores[axis]>=18?axis:opposite[axis]).join("");
  const query=new URLSearchParams({e:String(scores.E),s:String(scores.S),t:String(scores.T),j:String(scores.J)});
  router.push("/mbti/result/"+type+"?"+query.toString());
 }
 function selectAnswer(value:number){
  const nextAnswers=answers.map((answer,i)=>i===index?value:answer);
  setAnswers(nextAnswers);
  if(index<questions.length-1){
   window.setTimeout(()=>setIndex(current=>current===index?current+1:current),140);
  }else{
   finish(nextAnswers);
  }
 }
 return <main className="mbti-page"><header className="mbti-header"><Link href="/mbti" className="mbti-brand">UTIL<span>WISE</span>.</Link><Link href="/">전체 도구 ↗</Link><LanguageSwitcher/></header><section className="mbti-test-wrap"><div className="mbti-test-top"><span>나를 알아가는 중</span><b>{index+1} / 24</b></div><div className="mbti-progress"><i style={{width:((index+1)/24*100)+"%"}}/></div><div className="mbti-question-card"><div className="mbti-question-kicker">QUESTION {String(index+1).padStart(2,"0")}</div><h1>{q.text}</h1><p>너무 오래 고민하지 말고, 평소의 나와 가까운 쪽을 골라봐!</p><div className="mbti-answers">{answerLabels.map((label,i)=><button key={label} className={answers[index]===i+1?"selected":""} onClick={()=>selectAnswer(i+1)} aria-pressed={answers[index]===i+1}><span className="mbti-answer-dot">{i+1}</span>{label}</button>)}</div></div><div className="mbti-test-actions"><button className="mbti-back" disabled={index===0} onClick={()=>setIndex(v=>Math.max(0,v-1))}>← 이전 질문</button><span className="mbti-auto-next">{index===23?"답변을 선택하면 결과가 바로 나와요":"답변을 선택하면 다음 질문으로 자동 이동해요"}</span></div><p className="mbti-save-note">답변은 이 브라우저에서만 처리되며 서버로 전송되지 않아요.</p></section><footer className="mbti-footer"><Link href="/mbti">검사 처음으로</Link> · <Link href="/">UTILWISE 홈</Link></footer></main>
}
