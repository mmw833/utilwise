"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState} from "react";

type Trait="O"|"C"|"E"|"A"|"S";
type Item={trait:Trait;reverse:boolean;ko:string;en:string};
const items:Item[]=[
{trait:"O",reverse:false,ko:"예술, 자연, 문화처럼 다양한 분야에 호기심이 생긴다.",en:"I feel curious about many areas, such as art, nature, and culture."},
{trait:"O",reverse:true,ko:"익숙한 방식이 가장 편하고 새로운 시도는 부담스럽다.",en:"I feel most comfortable with familiar routines and avoid trying new things."},
{trait:"O",reverse:false,ko:"추상적이거나 복잡한 아이디어를 생각하는 일이 즐겁다.",en:"I enjoy thinking about abstract or complex ideas."},
{trait:"O",reverse:true,ko:"이론적인 이야기보다 당장 실용적인 정보에 관심이 간다.",en:"I am more interested in practical information than theoretical ideas."},
{trait:"O",reverse:false,ko:"낯선 음식, 장소, 활동을 경험해 보는 편이다.",en:"I like experiencing unfamiliar food, places, or activities."},
{trait:"O",reverse:true,ko:"상상하거나 공상하는 일은 별로 하지 않는다.",en:"I rarely spend time imagining or daydreaming."},
{trait:"O",reverse:false,ko:"한 가지 문제도 여러 관점에서 바라보려고 한다.",en:"I try to look at a problem from several different perspectives."},
{trait:"O",reverse:true,ko:"변화가 많은 환경보다 예측 가능한 환경을 선호한다.",en:"I prefer predictable environments over ones with frequent change."},
{trait:"O",reverse:false,ko:"새로운 지식이나 기술을 배우는 과정 자체가 흥미롭다.",en:"I find the process of learning new knowledge or skills interesting."},
{trait:"O",reverse:true,ko:"익숙하지 않은 주제는 깊이 알아보고 싶다는 생각이 잘 들지 않는다.",en:"Unfamiliar topics rarely make me want to explore them further."},
{trait:"C",reverse:false,ko:"해야 할 일을 미리 계획하고 순서대로 처리한다.",en:"I plan tasks ahead and work through them in order."},
{trait:"C",reverse:true,ko:"마감이나 약속 시간을 종종 놓치는 편이다.",en:"I sometimes miss deadlines or agreed times."},
{trait:"C",reverse:false,ko:"시작한 일은 가능한 한 끝까지 마무리한다.",en:"I make an effort to finish what I start."},
{trait:"C",reverse:true,ko:"주변이 다소 어질러져 있어도 크게 신경 쓰이지 않는다.",en:"A somewhat messy environment does not bother me much."},
{trait:"C",reverse:false,ko:"중요한 결정을 내리기 전에 필요한 정보를 꼼꼼히 확인한다.",en:"I carefully check the information I need before making important decisions."},
{trait:"C",reverse:true,ko:"해야 할 일을 알면서도 미루는 경우가 많다.",en:"I often put off tasks even when I know they need to be done."},
{trait:"C",reverse:false,ko:"작은 부분까지 확인해 실수를 줄이려고 한다.",en:"I pay attention to details to reduce mistakes."},
{trait:"C",reverse:true,ko:"장기적인 목표보다 당장의 기분이나 상황에 따라 움직인다.",en:"I tend to act on how I feel in the moment rather than long-term goals."},
{trait:"C",reverse:false,ko:"스스로 정한 기준과 약속을 지키려고 노력한다.",en:"I try to keep the standards and commitments I set for myself."},
{trait:"C",reverse:true,ko:"계획을 세워도 상황에 따라 쉽게 흐지부지되는 편이다.",en:"Even when I make plans, I often let them fade away."},
{trait:"E",reverse:false,ko:"사람들과 함께 있을 때 활력이 생기는 편이다.",en:"I tend to feel energized when I am around people."},
{trait:"E",reverse:true,ko:"모임에서는 주로 다른 사람이 먼저 말을 걸어주기를 기다린다.",en:"At gatherings, I usually wait for others to start conversations."},
{trait:"E",reverse:false,ko:"처음 만난 사람과도 대화를 시작하는 것이 어렵지 않다.",en:"I find it fairly easy to start a conversation with someone new."},
{trait:"E",reverse:true,ko:"여럿이 함께하는 활동보다 혼자 하는 활동을 더 자주 선택한다.",en:"I more often choose activities I can do alone than group activities."},
{trait:"E",reverse:false,ko:"내 생각이나 감정을 말로 표현하는 편이다.",en:"I tend to express my thoughts and feelings openly."},
{trait:"E",reverse:true,ko:"사람들의 관심이 나에게 집중되면 불편함을 느낀다.",en:"I feel uncomfortable when attention is focused on me."},
{trait:"E",reverse:false,ko:"활기차고 자극이 많은 환경을 즐기는 편이다.",en:"I enjoy lively environments with plenty of activity."},
{trait:"E",reverse:true,ko:"약속이 연달아 있으면 사람을 만나는 것 자체가 부담스럽다.",en:"When I have several social plans in a row, socializing feels draining."},
{trait:"E",reverse:false,ko:"대화 중 분위기를 띄우거나 먼저 의견을 내는 편이다.",en:"I often help energize conversations or offer my thoughts first."},
{trait:"E",reverse:true,ko:"조용히 혼자 보내는 시간이 사람들과 어울리는 시간보다 훨씬 편하다.",en:"I feel much more comfortable spending quiet time alone than socializing."},
{trait:"A",reverse:false,ko:"상대방의 입장에서 상황을 이해하려고 노력한다.",en:"I make an effort to understand situations from another person's point of view."},
{trait:"A",reverse:true,ko:"의견이 다르면 상대방의 입장을 이해하기보다 반박부터 하는 편이다.",en:"When I disagree, I tend to argue back before trying to understand."},
{trait:"A",reverse:false,ko:"다른 사람이 어려움을 겪으면 도울 방법을 생각한다.",en:"When someone is struggling, I think about how I might help."},
{trait:"A",reverse:true,ko:"내 목표를 위해서라면 다른 사람의 불편은 감수할 수 있다고 생각한다.",en:"I think others' inconvenience can be acceptable if it helps me reach my goals."},
{trait:"A",reverse:false,ko:"협력해야 할 때 내 몫을 나누고 함께 해결하는 편이다.",en:"When cooperation is needed, I share responsibility and work things out together."},
{trait:"A",reverse:true,ko:"상대방의 실수나 단점을 쉽게 지적하는 편이다.",en:"I tend to point out other people's mistakes or shortcomings readily."},
{trait:"A",reverse:false,ko:"갈등이 생기면 서로 납득할 수 있는 방법을 찾으려 한다.",en:"When conflict arises, I try to find a solution both sides can accept."},
{trait:"A",reverse:true,ko:"다른 사람의 감정에 맞춰 주는 것은 번거롭게 느껴진다.",en:"Adjusting to other people's feelings often feels like a hassle."},
{trait:"A",reverse:false,ko:"상대방의 기여나 친절에 고마움을 표현한다.",en:"I express appreciation for other people's contributions or kindness."},
{trait:"A",reverse:true,ko:"다른 사람과 경쟁할 때는 배려보다 이기는 것이 더 중요하다.",en:"When competing, winning matters more to me than being considerate."},
{trait:"S",reverse:false,ko:"예상치 못한 일이 생겨도 비교적 침착함을 유지한다.",en:"I remain fairly calm when unexpected things happen."},
{trait:"S",reverse:true,ko:"작은 걱정도 머릿속에서 오래 맴도는 편이다.",en:"Even small worries tend to stay on my mind for a long time."},
{trait:"S",reverse:false,ko:"압박감이 있어도 해야 할 일에 집중할 수 있다.",en:"I can focus on what needs to be done even under pressure."},
{trait:"S",reverse:true,ko:"다른 사람의 말이나 평가에 쉽게 마음이 흔들린다.",en:"Other people's comments or judgments easily unsettle me."},
{trait:"S",reverse:false,ko:"문제가 생기면 감정에 휩쓸리기보다 해결책을 찾으려 한다.",en:"When a problem occurs, I look for solutions rather than getting swept up in emotion."},
{trait:"S",reverse:true,ko:"긴장되거나 불안한 감정을 자주 경험한다.",en:"I frequently experience feelings of tension or anxiety."},
{trait:"S",reverse:false,ko:"실수한 뒤에도 비교적 빠르게 마음을 추스르는 편이다.",en:"I tend to recover fairly quickly after making a mistake."},
{trait:"S",reverse:true,ko:"앞으로 일어날 일을 생각하면 쉽게 걱정이 커진다.",en:"Thinking about what might happen often makes my worries grow."},
{trait:"S",reverse:false,ko:"감정 기복이 있어도 일상생활의 균형을 유지하려 한다.",en:"Even when my emotions fluctuate, I try to maintain balance in daily life."},
{trait:"S",reverse:true,ko:"스트레스를 받으면 평소보다 예민하게 반응하는 편이다.",en:"When stressed, I tend to react more sensitively than usual."}
];
const traits:[Trait,string,string,string,string][]=[
["O","개방성","Openness","호기심과 상상력, 새로운 경험을 받아들이는 성향","Curiosity, imagination, and openness to new experiences"],
["C","성실성","Conscientiousness","계획성, 책임감, 꾸준함과 자기조절 성향","Organization, responsibility, persistence, and self-discipline"],
["E","외향성","Extraversion","사회적 교류, 활동성, 표현에서 에너지를 얻는 성향","Sociability, activity, and energy from expression"],
["A","우호성","Agreeableness","공감, 배려, 협력과 타인에 대한 신뢰 성향","Empathy, consideration, cooperation, and trust"],
["S","정서적 안정성","Emotional Stability","스트레스와 감정 변화에 대처하고 균형을 유지하는 성향","Managing stress and emotions while maintaining balance"]
];
const descriptions=(code:Trait,score:number,en:boolean)=>{
const level=score>=70?"high":score>=40?"mid":"low";
const ko:{[k:string]:string[]}={
O:["새로운 관점과 경험을 적극적으로 탐색하고, 익숙한 틀을 넘어 생각하는 경향이 있어요.","새로운 것과 익숙한 것 사이에서 상황에 맞게 균형을 잡는 편이에요.","검증된 방법과 구체적인 경험을 선호하고, 실용적인 접근에서 편안함을 느낄 수 있어요."],
C:["계획을 세우고 책임 있게 실행하며, 세부 사항과 마무리를 중요하게 여기는 편이에요.","필요할 때 계획과 유연함을 조절하며, 상황에 따라 실행 방식을 바꾸는 편이에요.","즉흥성과 유연함을 중시할 수 있어요. 중요한 일에는 작은 계획과 알림이 도움이 될 수 있어요."],
E:["사람들과 교류하고 생각을 표현하는 과정에서 활력을 얻는 경향이 있어요.","혼자만의 시간과 사람들과의 교류를 상황에 맞게 조절하는 편이에요.","조용하고 자극이 적은 환경에서 에너지를 회복하며, 깊이 있는 교류를 선호할 수 있어요."],
A:["상대의 관점을 고려하고 협력하며, 관계의 조화와 배려를 중요하게 여기는 편이에요.","상대에 대한 배려와 자신의 입장을 표현하는 것 사이에서 균형을 잡는 편이에요.","독립적인 판단과 솔직한 표현을 중시할 수 있어요. 협업에서는 상대의 관점을 확인하는 것이 도움이 돼요."],
S:["압박이나 예상 밖의 상황에서도 비교적 차분하게 대처하고 회복하는 경향이 있어요.","상황에 따라 스트레스를 느끼지만, 대체로 감정과 일상의 균형을 조절하는 편이에요.","걱정이나 긴장을 더 자주 경험할 수 있어요. 이는 결함이 아니며, 휴식과 지원 체계를 마련하는 것이 도움이 돼요."]
};
const enText:{[k:string]:string[]}={
O:["You tend to explore new perspectives and experiences and think beyond familiar frameworks.","You often balance novelty and familiarity depending on the situation.","You may prefer proven methods and concrete experience, feeling comfortable with practical approaches."],
C:["You tend to plan, act responsibly, and value details and follow-through.","You adjust between planning and flexibility, changing your approach as needed.","You may value spontaneity and flexibility. Small plans and reminders can help with important tasks."],
E:["You tend to gain energy from social interaction and expressing your thoughts.","You often balance time alone and time with others according to the situation.","You may recharge in quiet, low-stimulation settings and prefer deeper interactions."],
A:["You tend to consider others' perspectives, cooperate, and value harmony and consideration.","You often balance consideration for others with expressing your own position.","You may value independent judgment and direct expression. Checking others' perspectives can help in teamwork."],
S:["You tend to stay relatively calm and recover when facing pressure or unexpected situations.","You may feel stress depending on the situation but generally regulate your emotions and daily balance.","You may experience worry or tension more often. This is not a flaw; rest and support can help."]
};
return en?enText[code][level==="high"?0:level==="mid"?1:2]:ko[code][level==="high"?0:level==="mid"?1:2];
};
export default function BigFiveExperience({mode,locale="ko"}:{mode:"intro"|"test"|"result";locale?:"ko"|"en"}){
const en=locale==="en";
const [answers,setAnswers]=useState<number[]>([]);
const [index,setIndex]=useState(0);
const [scores,setScores]=useState<number[]|null>(null);
const [copied,setCopied]=useState(false);
const [shareNotice,setShareNotice]=useState("");
const advancing=useRef(false);
const labels=en?["Strongly disagree","Disagree","Neither agree nor disagree","Agree","Strongly agree"]:["전혀 그렇지 않다","그렇지 않은 편이다","보통이다","그런 편이다","매우 그렇다"];
const scoreValues=useMemo(()=>scores??[],[scores]);
useEffect(()=>{
if(mode==="result"){
const params=new URLSearchParams(window.location.search);
const raw=traits.map((_,i)=>Number(params.get("s"+i)));
if(traits.every((_,i)=>params.has("s"+i))&&raw.every(v=>Number.isFinite(v)&&v>=0&&v<=100))setScores(raw);else setScores(null);
}
},[mode]);
const current=items[index];
const complete=(next:number[])=>{
const firstMissing=items.findIndex((_,i)=>!Number.isInteger(next[i])||next[i]<1||next[i]>5);
if(firstMissing!==-1){setAnswers(next);setIndex(firstMissing);advancing.current=false;return;}
const result=traits.map(([code])=>{
const selected=items.map((item,i)=>({item,value:next[i]})).filter(x=>x.item.trait===code);
const total=selected.reduce((sum,x)=>sum+(x.item.reverse?6-x.value:x.value),0);
return Math.round(((total/selected.length)-1)*25);
});
const query=result.map((v,i)=>"s"+i+"="+v).join("&");
window.location.href=(en?"/en":"")+"/big-five/result?"+query;
};
const choose=(value:number)=>{
if(advancing.current||!Number.isInteger(value)||value<1||value>5)return;
advancing.current=true;
const next=[...answers];next[index]=value;setAnswers(next);
if(index<items.length-1)setTimeout(()=>{setIndex(Math.min(index+1,items.length-1));advancing.current=false;},120);
else complete(next);
};
const scoreUrl=()=>window.location.href;
const copyShareLink=async(url:string)=>{
try{
if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);setCopied(true);setShareNotice(en?"Result link copied.":"결과 링크가 복사되었습니다.");return;}
}catch{}
try{
const field=document.createElement("textarea");
field.value=url;field.setAttribute("readonly","");
field.style.position="fixed";field.style.opacity="0";
document.body.appendChild(field);field.select();
const ok=document.execCommand("copy");document.body.removeChild(field);
if(ok){setCopied(true);setShareNotice(en?"Result link copied.":"결과 링크가 복사되었습니다.");}else{setShareNotice(en?"Could not copy automatically. Please copy the page address.":"자동 복사에 실패했어요. 주소를 직접 복사해 주세요.");}
}catch{}
};
const share=async()=>{
const url=scoreUrl();
const title=en?"Big Five personality test result":"빅파이브 성격검사 결과 확인";
const text=en?"View my Big Five personality test result on UTILWISE.":"UTILWISE에서 나의 빅파이브 성격검사 결과를 확인해 보세요.";
setShareNotice("");
if(/KAKAOTALK/i.test(navigator.userAgent)){
await copyShareLink(url);
setShareNotice(en?"KakaoTalk in-app browser cannot open the share menu here. The result link has been copied. Tap the ⋮ menu at the bottom of the screen and choose Open in another browser to share.":"카카오톡 안에서는 공유창을 열 수 없어 결과 링크를 복사했어요. 화면 아래쪽의 점 3개(⋮) 메뉴에서 ‘다른 브라우저로 열기’를 선택하면 공유할 수 있어요.");
return;
}
if(navigator.share){
try{await navigator.share({title,text,url});setCopied(false);return;}
catch(error){if(error instanceof DOMException&&error.name==="AbortError")return;}
}
await copyShareLink(url);
if(!navigator.clipboard?.writeText)setShareNotice(en?"Copy the page address to share your result.":"결과 주소를 복사해 공유해 주세요.");
};
if(mode==="intro")return <main className="bf-page"><header className="bf-header"><Link href={en?"/en":"/"} className="bf-logo">UTIL<span>WISE</span>.</Link><nav><Link href={en?"/en":"/"}>{en?"Explore tools":"전체 도구 둘러보기"}</Link><Link href={en?"/big-five":"/en/big-five"}>{en?"한국어":"English"}</Link></nav></header><section className="bf-hero"><div className="bf-eyebrow">PERSONALITY · FIVE FACTORS</div><h1>{en?"Discover your personality in five dimensions":"다섯 가지 차원으로 알아보는 나의 성격"}</h1><p>{en?"Explore your tendencies across five broad personality traits with 50 thoughtful questions.":"50개의 질문으로 다섯 가지 성격 차원을 살펴보고, 나의 성향을 입체적으로 이해해 보세요."}</p><div className="bf-facts"><span>{en?"About 7–10 min":"약 7~10분"}</span><span>{en?"50 questions":"50문항"}</span><span>{en?"Free · No sign-up":"무료 · 회원가입 없음"}</span></div><Link className="bf-primary" href={(en?"/en":"")+"/big-five/test"}>{en?"Start the test":"검사 시작하기"} →</Link><small>{en?"An educational self-reflection tool, not a clinical or diagnostic assessment.":"자기이해를 돕기 위한 참고용 검사이며 임상 진단이나 전문 심리검사가 아닙니다."}</small></section><section className="bf-traits">{traits.map(([code,koName,enName,koDesc,enDesc])=><article key={code}><b>{code}</b><div><h2>{en?enName:koName}</h2><p>{en?enDesc:koDesc}</p></div></article>)}</section><section className="bf-method"><h2>{en?"How it works":"검사 방법"}</h2><p>{en?"Answer each statement based on how you generally think, feel, and behave. There are no right or wrong answers.":"각 문항을 읽고 평소의 생각과 행동에 얼마나 가까운지 선택하면 됩니다. 정답은 없으니 평소의 나를 기준으로 답해주세요."}</p><p>{en?"Your answers are scored locally in your browser and are not sent to our server.":"응답은 브라우저에서만 계산되며 서버로 전송되지 않습니다."}</p><p>{en?"This original 50-item questionnaire is informed by the public-domain IPIP framework. It is not an official IPIP scale and has not been independently validated as a standardized Korean or English instrument.":"공개 IPIP의 5요인 구성 체계를 참고해 자체 작성한 50문항입니다. 공식 IPIP 척도 자체가 아니며, 표준화된 한국어·영어 검사로 별도 타당화된 도구는 아닙니다."}</p><Link href={(en?"/en":"")+"/big-five/test"} className="bf-primary">{en?"Begin":"검사 시작하기"} →</Link></section><footer className="bf-footer"><Link href={en?"/en":"/"}>UTILWISE</Link> · © 2026</footer></main>;
if(mode==="test")return <main className="bf-page"><header className="bf-header"><Link href={en?"/en":"/"} className="bf-logo">UTIL<span>WISE</span>.</Link><span>{en?"Big Five Test":"빅파이브 검사"}</span><Link href={en?"/en/big-five":"/big-five"}>{en?"한국어":"English"}</Link></header><section className="bf-test"><div className="bf-progress-head"><span>{en?"Question":"문항"} {index+1} / 50</span><span>{Math.round((index+1)/50*100)}%</span></div><div className="bf-progress"><i style={{width:((index+1)/50*100)+"%"}}/></div><div className="bf-question"><div className="bf-eyebrow">{en?"THINK ABOUT YOUR USUAL SELF":"평소의 나를 떠올려 보세요"}</div><h1>{en?current.en:current.ko}</h1><p>{en?"Choose how much you agree with this statement.":"이 문장이 평소의 나와 얼마나 가까운지 선택해 주세요."}</p></div><div className="bf-options">{labels.map((label,i)=><button key={label} className={answers[index]===i+1?"selected":""} onClick={()=>choose(i+1)}><span>{i+1}</span>{label}</button>)}</div><div className="bf-test-nav"><button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>{en?"← Previous":"← 이전 문항"}</button><span>{en?"Your answers stay in this browser.":"응답은 이 브라우저 안에서만 처리됩니다."}</span></div></section></main>;
if(!scores)return <main className="bf-page"><section className="bf-result"><h1>{en?"No result found":"결과를 찾을 수 없어요"}</h1><p>{en?"Please take the test to see your profile.":"검사를 완료한 뒤 결과를 확인해 주세요."}</p><Link className="bf-primary" href={(en?"/en":"")+"/big-five/test"}>{en?"Start the test":"검사 시작하기"} →</Link></section></main>;
const names=traits.map(t=>en?t[2]:t[1]);
const levelOf=(v:number)=>v>=70?"high":v>=40?"mid":"low";
const levelLabel=(v:number)=>en?(v>=70?"Higher tendency":v>=40?"Moderate range":"Lower tendency"):(v>=70?"높은 편":v>=40?"중간 범위":"낮은 편");
const detail=(code:Trait,v:number)=>{
const level=levelOf(v);
const copy:{[k:string]:{high:[string,string,string];mid:[string,string,string];low:[string,string,string]}}={
O:{high:["새로운 관점과 경험을 탐색하고 아이디어를 연결하는 데 강점이 나타날 수 있어요.","익숙한 방식에 의문을 품거나 다양한 가능성을 검토할 수 있어요.","아이디어가 많아질 때는 우선순위를 정하고 작은 실험부터 시작해 보세요."],mid:["새로움과 익숙함을 상황에 맞게 조절하는 경향이 있어요.","필요할 때는 새로운 방법을 시도하고, 실용성이 확인된 방식을 유지할 수 있어요.","탐색할 시간과 실행할 시간을 구분하면 균형을 유지하는 데 도움이 돼요."],low:["검증된 방식과 구체적인 경험을 바탕으로 판단하는 편일 수 있어요.","절차가 명확하고 예측 가능한 환경에서 편안함을 느낄 수 있어요.","변화가 필요할 때는 작은 범위에서 시험하고 효과를 확인해 보세요."]},
C:{high:["계획과 책임감, 세부 사항을 챙기는 태도가 두드러질 수 있어요.","목표와 마감이 분명한 업무에서 꾸준함을 발휘할 수 있어요.","완성도와 효율 사이의 균형을 의식하고, 예상치 못한 변경을 위한 여유도 남겨두세요."],mid:["계획성과 유연성을 상황에 맞게 조절하는 편일 수 있어요.","구조가 필요한 일과 즉흥적으로 처리할 일을 구분할 수 있어요.","중요한 목표만 먼저 정하고 세부 일정은 상황에 따라 조정해 보세요."],low:["즉흥성과 상황 대응의 유연함을 중시할 수 있어요.","규칙이 지나치게 많은 환경보다 자율성이 있는 방식이 편할 수 있어요.","마감 알림, 짧은 체크리스트처럼 부담이 적은 외부 장치를 활용해 보세요."]},
E:{high:["대화와 사회적 활동, 활기 있는 환경에서 에너지를 얻을 수 있어요.","먼저 의견을 내거나 사람들을 연결하는 역할이 자연스러울 수 있어요.","혼자 집중해야 하는 일에는 방해받지 않는 시간도 의도적으로 확보하세요."],mid:["혼자만의 시간과 사회적 교류를 균형 있게 활용하는 편일 수 있어요.","상황과 상대에 따라 적극적으로 참여하거나 한발 물러서서 관찰할 수 있어요.","중요한 일정 뒤에 회복 시간을 배치하면 에너지 관리에 도움이 돼요."],low:["조용하고 자극이 적은 환경에서 에너지를 회복할 수 있어요.","넓은 관계보다 소수와 깊이 있는 대화를 선호할 수 있어요.","필요한 의견은 미리 정리하거나 글로 전달하면 표현이 한결 편해질 수 있어요."]},
A:{high:["상대의 관점을 고려하고 협력과 조화를 중요하게 여길 수 있어요.","팀에서 신뢰를 쌓고 갈등을 조정하는 역할을 맡기 쉬울 수 있어요.","배려가 자기희생으로 이어지지 않도록 자신의 필요와 경계도 분명히 표현하세요."],mid:["협력과 자기주장을 상황에 맞게 조절하는 편일 수 있어요.","관계의 조화를 고려하면서도 필요한 경우 다른 의견을 제시할 수 있어요.","갈등 상황에서는 공감 표현과 구체적인 요청을 함께 전달해 보세요."],low:["독립적인 판단과 솔직한 표현을 중요하게 여길 수 있어요.","논점과 결과를 분명히 하는 협업 방식이 편할 수 있어요.","상대가 중요하게 여기는 기준을 먼저 확인하면 불필요한 오해를 줄일 수 있어요."]},
S:{high:["압박이나 예상 밖의 상황에서도 비교적 침착함을 유지하는 경향이 나타날 수 있어요.","문제 해결에 집중하고 감정 회복을 빠르게 하는 편일 수 있어요.","차분해 보이더라도 피로가 쌓일 수 있으니 휴식과 감정 표현을 소홀히 하지 마세요."],mid:["상황에 따라 긴장과 안정이 오가지만 균형을 회복하려는 편일 수 있어요.","준비된 환경에서는 안정적으로 대응하고 갑작스러운 변화에는 시간이 필요할 수 있어요.","걱정이 커질 때 사실·추측·대응 행동을 나누어 적어보세요."],low:["걱정이나 긴장에 민감하게 반응하는 경향이 나타날 수 있어요.","불확실하거나 평가받는 상황에서 생각이 오래 이어질 수 있어요.","할 일을 작게 나누고 회복 루틴이나 믿을 만한 사람의 도움을 활용해 보세요."]}
};
const d=copy[code][level];
return {intro:descriptions(code,v,en),daily:d[0],work:d[1],tip:d[2]};
};
const ranked=traits.map(([code],i)=>({code,score:scoreValues[i]})).sort((a,b)=>b.score-a.score);
const strongest=ranked[0],quietest=ranked[4];
const overall=en
? `Your responses show a relative emphasis on ${names[traits.findIndex(t=>t[0]===strongest.code)]}. ${names[traits.findIndex(t=>t[0]===quietest.code)]} is less prominent in this profile. This combination describes your current response pattern, not a fixed personality label.`
: `이번 응답에서는 ${names[traits.findIndex(t=>t[0]===strongest.code)]} 성향이 상대적으로 두드러지고, ${names[traits.findIndex(t=>t[0]===quietest.code)]} 성향은 비교적 낮게 나타났어요. 이는 현재 응답에서 보이는 조합이며, 성격을 고정하거나 모든 상황의 행동을 단정하는 것은 아니에요.`;
const traitNames:{[k:string]:[string,string]}={O:["개방성","Openness"],C:["성실성","Conscientiousness"],E:["외향성","Extraversion"],A:["우호성","Agreeableness"],S:["정서적 안정성","Emotional stability"]};
const traitStrength:{[k:string]:[string,string]}={
O:["새로운 관점과 대안을 발견하는 탐색력","Ability to explore new perspectives and alternatives"],
C:["목표를 구조화하고 꾸준히 실행하는 힘","Ability to structure goals and follow through"],
E:["생각을 표현하고 관계를 시작하는 적극성","Initiative in expressing ideas and starting interactions"],
A:["상대의 입장을 고려하고 협력하는 태도","Consideration for others and a cooperative approach"],
S:["압박 속에서도 균형을 되찾으려는 회복 지향성","A tendency to regain balance under pressure"]};
const pairKey=[strongest.code,ranked[1].code].sort().join("");
const pairCopy:{[k:string]:[string,string,string,string]}={
AC:["배려와 책임감을 함께 중시하는 조합","A combination that values care and responsibility","사람들과의 약속을 중요하게 여기면서 맡은 일을 안정적으로 완수하려는 모습이 나타날 수 있어요. 다만 주변의 기대를 모두 충족하려다 자신의 부담을 늦게 알아차리지 않도록 살펴보세요.","You may value commitments to others while reliably completing responsibilities. Notice whether you take on too much to meet everyone's expectations."],
AE:["관계 속에서 활력을 얻고 조화를 추구하는 조합","A socially engaged and harmony-oriented combination","사람들과 교류하며 분위기를 살피고 함께하는 과정에서 동기를 얻을 수 있어요. 의견 충돌을 피하기보다 존중을 유지하면서 다른 관점을 표현하는 연습이 도움이 됩니다.","You may gain motivation from interaction and shared momentum. Practice expressing different views respectfully rather than avoiding disagreement."],
AO:["호기심과 공감으로 사람과 아이디어를 연결하는 조합","A combination of curiosity and empathy","새로운 관점을 받아들이면서 다른 사람의 경험에도 관심을 기울일 수 있어요. 여러 가능성을 고려하다 결정이 늦어질 때는 지금 중요한 기준 두세 가지를 먼저 정해보세요.","You may welcome new perspectives while staying curious about others' experiences. When many possibilities delay a decision, identify two or three priorities first."],
AS:["새로운 가능성을 탐색하면서 감정의 균형을 중시하는 조합","A curious and emotionally balanced combination","변화를 시도하면서도 자신의 컨디션과 안정감을 함께 고려할 수 있어요. 새로운 도전은 회복 시간과 현실적인 준비를 함께 계획하면 지속하기 쉬워집니다.","You may explore change while considering your emotional balance. Pair new challenges with recovery time and practical preparation."],
CE:["목표 지향성과 사회적 추진력을 함께 활용하는 조합","A goal-oriented and socially active combination","계획을 세우고 사람들과 함께 실행하는 상황에서 강점을 느낄 수 있어요. 빠르게 추진할수록 구성원의 의견과 개인별 속도를 확인하는 과정도 중요합니다.","You may thrive when planning and acting with others. As momentum builds, make room for teammates' input and different working speeds."],
CO:["체계적인 실행과 새로운 개선을 함께 추구하는 조합","A structured yet exploratory combination","새로운 아이디어를 실제 계획으로 옮기는 데 관심을 가질 수 있어요. 높은 기준이 실행을 지나치게 늦추지 않도록 초안과 개선 단계를 분리해 보세요.","You may enjoy turning new ideas into practical plans. Separate a first draft from later refinement so high standards do not delay action."],
CS:["책임감과 안정적인 대처를 중시하는 조합","A responsible and steady combination","예측 가능한 절차를 만들고 꾸준히 유지하는 데 편안함을 느낄 수 있어요. 계획이 바뀌는 상황을 실패로 받아들이지 말고 대안을 조정하는 과정으로 바라보세요.","You may feel comfortable creating and maintaining reliable routines. Treat changed plans as a chance to adapt rather than as failure."],
EO:["활발한 교류와 새로운 경험을 즐기는 조합","A socially active and exploratory combination","사람과 아이디어가 오가는 환경에서 흥미와 에너지를 얻을 수 있어요. 관심이 넓어질수록 우선순위를 정하고 깊이 집중하는 시간을 확보하는 것이 좋습니다.","You may gain energy from people, ideas, and new experiences. As interests expand, prioritize and protect time for deeper focus."],
ES:["사회적 참여와 정서적 회복을 함께 활용하는 조합","A socially engaged and resilient combination","활동적인 상황에서도 비교적 균형을 유지하려는 경향이 나타날 수 있어요. 주변을 챙기는 데 집중한 뒤에는 혼자 회복할 시간도 일정에 포함해 보세요.","You may stay relatively balanced while being socially engaged. Schedule personal recovery time after focusing on others."],
OS:["탐색심과 신중한 감정 조절을 함께 보이는 조합","A curious and reflective combination","새로운 관점을 탐색하면서 상황을 차분히 살피려는 모습이 나타날 수 있어요. 생각이 길어질 때는 충분히 검토한 뒤 작은 행동으로 확인하는 것이 도움이 됩니다.","You may explore new perspectives while carefully considering situations. When reflection runs long, test an idea through a small action."]
};
const pair=pairCopy[pairKey]??pairCopy.AC;
const strengths=ranked.slice(0,3).map(x=>traitStrength[x.code]);
const watchouts=ranked.slice(-3).reverse().map(x=>x.code);
const growthTips=[
en?"Choose one small behavior to practice for the next seven days.":"앞으로 7일 동안 실천할 작은 행동 한 가지를 정해보세요.",
en?"Ask someone you trust for a concrete example of how your style affects collaboration.":"신뢰하는 사람에게 나의 소통 방식이 협업에 어떤 영향을 주는지 구체적인 사례를 물어보세요.",
en?"Review one situation that felt difficult and identify what support or adjustment would help next time.":"최근 어려웠던 상황 하나를 돌아보고 다음에는 어떤 지원이나 조정이 도움이 될지 적어보세요."
];
const relationText=scoreValues[2]>=65&&scoreValues[3]>=65
?(en?"You may readily initiate contact while also paying attention to others' needs. Keep an eye on your own boundaries and make room for honest disagreement.":"먼저 관계를 시작하는 데 비교적 편안하면서도 상대의 필요를 살피려는 경향이 함께 나타날 수 있어요. 자신의 경계를 지키고 솔직한 의견 차이도 안전하게 표현하는 것이 중요해요.")
:scoreValues[2]<40&&scoreValues[3]>=65
?(en?"You may prefer thoughtful, considerate interactions in smaller or familiar settings. Let others know when you need time to think or recharge.":"소수 또는 익숙한 관계에서 깊이 있고 배려 있는 교류를 선호할 수 있어요. 생각할 시간이나 혼자 회복할 시간이 필요할 때 이를 미리 알려보세요.")
:scoreValues[2]>=65&&scoreValues[3]<40
?(en?"You may communicate directly and energetically, especially when a topic matters to you. Pausing to check how your message lands can strengthen mutual understanding.":"관심 있는 주제에서 활기차고 직접적으로 의견을 표현할 수 있어요. 내 말이 상대에게 어떻게 전달됐는지 한 번 확인하면 상호 이해에 도움이 됩니다.")
:(en?"Your interaction style may shift with context and familiarity. Notice when you prefer to speak, listen, or take time alone, and communicate those needs clearly.":"상황과 친밀도에 따라 교류 방식이 달라질 수 있어요. 말하고 싶은 때, 듣고 싶은 때, 혼자 있고 싶은 때를 알아차리고 필요한 바를 분명히 전해보세요.");
const workText=scoreValues[1]>=65&&scoreValues[0]>=65
?(en?"You may enjoy improving systems and turning ideas into organized plans. Avoid over-polishing early work; use milestones to keep progress visible.":"아이디어를 구조화하고 기존 방식을 개선하는 업무에서 동기를 얻을 수 있어요. 초반부터 완벽하게 만들기보다 중간 목표를 두어 진행 상황을 확인해 보세요.")
:scoreValues[1]>=65
?(en?"Clear goals, ownership, and defined milestones may help you do your best work. Leave some room for unexpected changes and experimentation.":"목표와 책임 범위, 단계별 일정이 분명할 때 역량을 발휘하기 쉬울 수 있어요. 예상치 못한 변화와 새로운 시도를 위한 여유도 남겨두세요.")
:scoreValues[2]>=65
?(en?"Discussion, collaboration, and visible momentum may help you stay engaged. Balance meetings with protected time for focused work.":"토론과 협업, 진행 상황이 보이는 환경에서 몰입하기 쉬울 수 있어요. 회의와 교류뿐 아니라 집중해서 혼자 일하는 시간도 확보해 보세요.")
:(en?"You may benefit from a work setup that matches your preferred balance of structure, autonomy, and interaction. Track which conditions help you focus rather than assuming one style fits all.":"구조와 자율성, 교류의 비중이 자신의 선호와 맞을 때 업무 만족도가 높아질 수 있어요. 한 가지 방식이 정답이라고 보기보다 실제로 집중이 잘 되는 조건을 기록해 보세요.");
const stressText=scoreValues[4]>=65
?(en?"You report a relatively higher tendency toward emotional steadiness. This does not mean stress has no effect; notice early signs of fatigue and allow recovery before overload.":"정서적 안정성 점수가 상대적으로 높게 나타났어요. 스트레스의 영향이 없다는 뜻은 아니므로 피로의 초기 신호를 살피고 과부하 전에 회복 시간을 확보하세요.")
:scoreValues[4]<40
?(en?"Your responses suggest that tension or worry may arise more readily. This is not a diagnosis. Breaking tasks into smaller steps, grounding in observable facts, and seeking support may help.":"긴장이나 걱정이 비교적 쉽게 생길 수 있다는 응답 경향이 나타났어요. 이는 진단이 아니에요. 일을 작은 단계로 나누고 확인 가능한 사실에 집중하며 필요할 때 주변의 도움을 구해보세요.")
:(en?"Your responses suggest a middle-range pattern. Stress may depend strongly on context, workload, and available support. Notice which conditions make recovery easier.":"중간 범위의 응답 경향이 나타났어요. 스트레스 반응은 상황과 업무량, 주변 지원에 따라 달라질 수 있으니 회복을 돕는 조건을 관찰해 보세요.");
const radarPoints=scoreValues.map((v,i)=>{const a=(-90+i*72)*Math.PI/180;const r=34+v*0.82;return `${160+Math.cos(a)*r},${126+Math.sin(a)*r}`;}).join(" ");
return <main className="bf-page"><header className="bf-header"><Link href={en?"/en":"/"} className="bf-logo">UTIL<span>WISE</span>.</Link><nav><Link href={en?"/en":"/"}>{en?"Home":"홈으로"}</Link><Link href={en?"/big-five":"/en/big-five"}>{en?"한국어":"English"}</Link></nav></header><section className="bf-result"><div className="bf-eyebrow">{en?"YOUR PERSONALITY PROFILE":"YOUR PERSONALITY PROFILE"}</div><h1>{en?"Your Big Five Profile":"나의 빅파이브 성격 분석 리포트"}</h1><p>{en?"A more detailed look at the response patterns across five broad personality dimensions.":"다섯 가지 성격 차원의 점수와 일상에서 나타날 수 있는 경향을 함께 살펴보는 결과 리포트예요."}</p>
<div className="bf-report-grid"><article className="bf-report-card bf-radar-card"><div className="bf-card-heading"><h2>{en?"Your profile at a glance":"나의 성향 한눈에 보기"}</h2><span>{en?"Profile chart":"성향 차트"}</span></div><svg className="bf-radar" viewBox="0 0 320 260" role="img" aria-label={en?"Radar chart of five personality scores":"빅파이브 다섯 성향 레이더 차트"}>{[25,50,75,100].map(r=><polygon key={r} points={Array.from({length:5},(_,i)=>{const a=(-90+i*72)*Math.PI/180;const radius=34+r*.82;return `${160+Math.cos(a)*radius},${126+Math.sin(a)*radius}`;}).join(" ")} fill="none" stroke="#dfe6ee" strokeWidth="1"/>)}{Array.from({length:5},(_,i)=>{const a=(-90+i*72)*Math.PI/180;return <line key={i} x1="160" y1="126" x2={160+Math.cos(a)*116} y2={126+Math.sin(a)*116} stroke="#e5eaf0"/>;})}<polygon points={radarPoints} fill="#6d91c0" fillOpacity=".22" stroke="#3268a8" strokeWidth="2.5"/>{scoreValues.map((v,i)=>{const a=(-90+i*72)*Math.PI/180;const r=34+v*.82;return <circle key={i} cx={160+Math.cos(a)*r} cy={126+Math.sin(a)*r} r="3.5" fill="#3268a8"/>;})}{names.map((name,i)=>{const a=(-90+i*72)*Math.PI/180;return <text key={name} x={160+Math.cos(a)*137} y={126+Math.sin(a)*137+4} textAnchor="middle" fontSize="10" fill="#53657b">{name.length>12?name.slice(0,11)+"…":name}</text>;})}</svg><p className="bf-chart-note">{en?"Scores are shown on a 0–100 scale, not as population percentiles.":"점수는 0~100 환산 점수이며, 전체 인구 중 백분위를 의미하지 않아요."}</p></article>
<article className="bf-report-card"><div className="bf-card-heading"><h2>{en?"Score overview":"성향별 점수 요약"}</h2><span>0–100</span></div><div className="bf-score-list">{traits.map(([code,koName,enName,koDesc,enDesc],i)=><article key={code}><div className="bf-score-title"><h2>{en?enName:koName}</h2><b>{scoreValues[i]}<small> / 100</small></b></div><div className="bf-score-track"><i style={{width:scoreValues[i]+"%"}}/></div><div className="bf-score-meta"><span>{levelLabel(scoreValues[i])}</span><span>{en?enDesc:koDesc}</span></div></article>)}</div></article></div>
<article className="bf-summary bf-overall"><div className="bf-eyebrow">{en?"PROFILE SUMMARY":"PROFILE SUMMARY"}</div><h2>{en?"Your overall pattern":"종합 성향 요약"}</h2><p>{overall}</p><p>{en?"The highest and lowest dimensions are relative to your own five scores. They do not mean that one trait is objectively strong or weak compared with other people.":"가장 높은 점수와 낮은 점수는 다섯 영역 안에서의 상대적인 차이예요. 다른 사람과 비교한 우열이나 객관적인 강약을 뜻하지 않습니다."}</p></article>
<section className="bf-deep-analysis"><div className="bf-section-heading"><div className="bf-eyebrow">{en?"FIVE DIMENSIONS":"FIVE DIMENSIONS"}</div><h2>{en?"Detailed trait analysis":"성향별 상세 분석"}</h2><p>{en?"Explore how each tendency may appear in everyday life and work.":"각 성향이 일상과 업무에서 어떻게 나타날 수 있는지, 도움이 되는 활용 팁과 함께 확인해 보세요."}</p></div><div className="bf-detail-grid">{traits.map(([code,koName,enName,koDesc,enDesc],i)=>{const d=detail(code,scoreValues[i]);return <article className="bf-detail-card" key={code}><div className="bf-detail-top"><div><span className="bf-trait-code">{code}</span><h3>{en?enName:koName}</h3></div><div className="bf-detail-score"><b>{scoreValues[i]}</b><span>/100</span><small>{levelLabel(scoreValues[i])}</small></div></div><div className="bf-score-track"><i style={{width:scoreValues[i]+"%"}}/></div><p className="bf-detail-intro">{d.intro}</p><div className="bf-detail-block"><b>{en?"Everyday life":"일상에서"}</b><p>{d.daily}</p></div><div className="bf-detail-block"><b>{en?"Work & decisions":"업무와 의사결정"}</b><p>{d.work}</p></div><div className="bf-detail-tip"><b>{en?"Try this":"활용 팁"}</b><p>{d.tip}</p></div></article>;})}</div></section>
<section className="bf-personalized"><div className="bf-section-heading"><div className="bf-eyebrow">{en?"YOUR COMBINATION":"YOUR COMBINATION"}</div><h2>{en?"How your traits work together":"나의 성향 조합 분석"}</h2><p>{en?"The two most prominent scores offer one useful lens on your profile, not a fixed personality type.":"상대적으로 높은 두 성향을 함께 살펴보는 참고 해석이에요. 고정된 성격 유형이나 모든 상황에 적용되는 규칙은 아닙니다."}</p></div><article className="bf-combo-card"><div className="bf-combo-label">{en?"YOUR TOP TWO DIMENSIONS":"상대적으로 높은 두 성향"}</div><h3>{traitNames[strongest.code][en?1:0]} + {traitNames[ranked[1].code][en?1:0]}</h3><h4>{pair[en?1:0]}</h4><p>{pair[en?3:2]}</p><div className="bf-combo-scores"><span>{traitNames[strongest.code][en?1:0]} <b>{strongest.score}</b></span><span>{traitNames[ranked[1].code][en?1:0]} <b>{ranked[1].score}</b></span></div></article></section>
<section className="bf-personalized"><div className="bf-section-heading"><div className="bf-eyebrow">{en?"PERSONAL RESOURCES":"PERSONAL RESOURCES"}</div><h2>{en?"Strengths and watch-outs":"나의 강점과 주의할 점"}</h2></div><div className="bf-insight-grid"><article className="bf-insight-card"><h3>{en?"Potential strengths":"활용할 수 있는 강점"}</h3>{strengths.map((s,i)=><div className="bf-insight-row" key={i}><b>0{i+1}</b><p>{s[en?1:0]}</p></div>)}</article><article className="bf-insight-card"><h3>{en?"Areas to pay attention to":"살펴보면 좋은 부분"}</h3>{watchouts.map((code,i)=><div className="bf-insight-row" key={code}><b>0{i+1}</b><p>{traitNames[code][en?1:0]} {en?"may need more deliberate support depending on the situation.":"은 상황에 따라 의식적인 보완이나 환경의 도움이 유용할 수 있어요."}</p></div>)}</article></div><p className="bf-chart-note">{en?"These are reflection prompts based on relative scores, not proven abilities or deficits.":"점수에 기반한 자기성찰의 단서이며, 검증된 능력이나 결핍을 판정하는 것은 아닙니다."}</p></section>
<section className="bf-personalized"><div className="bf-section-heading"><div className="bf-eyebrow">{en?"LIFE & WORK":"LIFE & WORK"}</div><h2>{en?"Relationships and work style":"관계와 업무에서의 나"}</h2></div><div className="bf-insight-grid"><article className="bf-insight-card"><h3>{en?"Relationships & communication":"인간관계와 소통"}</h3><p>{relationText}</p><ul><li>{en?"Notice whether you tend to speak first or listen first.":"먼저 말하는 편인지, 충분히 듣고 말하는 편인지 살펴보세요."}</li><li>{en?"State your needs and boundaries clearly and respectfully.":"자신의 필요와 경계를 분명하고 존중하는 방식으로 표현해 보세요."}</li><li>{en?"In conflict, separate facts, feelings, and requests.":"갈등에서는 사실·감정·요청을 구분해 전달해 보세요."}</li></ul></article><article className="bf-insight-card"><h3>{en?"Work & decision-making":"업무와 의사결정"}</h3><p>{workText}</p><ul><li>{en?"Identify the conditions in which you focus best.":"어떤 환경에서 집중이 잘 되는지 확인해 보세요."}</li><li>{en?"Use a decision deadline when analysis starts to loop.":"생각이 반복될 때는 의사결정 기한을 정해보세요."}</li><li>{en?"Ask for feedback early enough to adjust course.":"방향을 조정할 수 있도록 이른 시점에 피드백을 구해보세요."}</li></ul></article></div></section>
<section className="bf-personalized"><div className="bf-section-heading"><div className="bf-eyebrow">{en?"WELLBEING":"WELLBEING"}</div><h2>{en?"Emotions, stress and recovery":"감정·스트레스·회복 방식"}</h2></div><article className="bf-insight-card bf-wide-insight"><p>{stressText}</p><div className="bf-recovery-grid"><div><b>{en?"1. Spot the signal":"1. 신호 알아차리기"}</b><p>{en?"Notice changes in sleep, concentration, patience, or physical tension.":"수면, 집중력, 인내심, 신체 긴장에 변화가 있는지 살펴보세요."}</p></div><div><b>{en?"2. Reduce the load":"2. 부담 줄이기"}</b><p>{en?"Choose the next manageable action and postpone what is not urgent.":"지금 할 수 있는 다음 행동 하나를 정하고 급하지 않은 일은 미뤄보세요."}</p></div><div><b>{en?"3. Restore connection":"3. 회복 자원 활용하기"}</b><p>{en?"Use rest, movement, or a trusted conversation that works for you.":"자신에게 맞는 휴식, 가벼운 움직임, 믿을 만한 사람과의 대화를 활용하세요."}</p></div></div></article></section>
<section className="bf-personalized"><div className="bf-section-heading"><div className="bf-eyebrow">{en?"NEXT STEPS":"NEXT STEPS"}</div><h2>{en?"A practical growth guide":"나를 위한 성장 가이드"}</h2><p>{en?"Choose one or two ideas that feel realistic. Small experiments are more useful than trying to change everything at once.":"모든 것을 한 번에 바꾸기보다 지금 실천할 수 있는 한두 가지부터 선택해 보세요."}</p></div><article className="bf-growth-card">{growthTips.map((tip,i)=><div className="bf-growth-step" key={i}><span>{i+1}</span><p>{tip}</p></div>)}</article></section>
<div className="bf-summary bf-caveat"><h2>{en?"How to read this result":"결과를 읽을 때 참고해 주세요"}</h2><p>{en?"The 0–100 values are transformed scores from this questionnaire, not percentiles or comparisons with a representative population. A higher or lower score is not better or worse. The questionnaire is an original self-reflection tool informed by the IPIP five-factor framework; it is not an official IPIP scale or a validated standardized assessment.":"0~100 점수는 이 자체 문항의 응답을 환산한 값이며, 인구 집단에서의 백분위나 다른 사람과의 비교 점수가 아닙니다. 높고 낮음은 우열을 뜻하지 않아요. 이 검사는 IPIP 5요인 체계를 참고해 자체 작성한 자기이해용 문항으로, 공식 IPIP 척도나 표준화·타당화된 전문 심리검사가 아닙니다."}</p><p>{en?"Use the report as a starting point for reflection, not as a diagnosis or a fixed description of who you are.":"이 결과는 자신을 돌아보는 출발점으로 활용하고, 진단이나 고정된 성격 규정으로 받아들이지 않는 것이 좋아요."}</p></div>
<div className="bf-actions"><button className="bf-primary" onClick={share}>{en?"Share result":"결과 공유하기"} ↗</button><button onClick={()=>window.location.href=(en?"/en":"")+"/big-five/test"}>{en?"Take the Big Five test":"빅5 성격검사하기"}</button></div>{(copied||shareNotice)&&<p className="bf-copied" role="status">{shareNotice||(en?"Result link copied.":"결과 링크를 복사했어요.")}</p>}</section><footer className="bf-footer"><Link href={en?"/en":"/"}>UTILWISE</Link> · © 2026</footer></main>;
}
