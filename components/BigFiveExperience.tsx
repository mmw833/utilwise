"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";

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
const result=traits.map(([code])=>{
const selected=items.map((item,i)=>({item,value:next[i]})).filter(x=>x.item.trait===code);
const total=selected.reduce((sum,x)=>sum+(x.item.reverse?6-x.value:x.value),0);
return Math.round(((total/selected.length)-1)*25);
});
const query=result.map((v,i)=>"s"+i+"="+v).join("&");
window.location.href=(en?"/en":"")+"/big-five/result?"+query;
};
const choose=(value:number)=>{
const next=[...answers];next[index]=value;setAnswers(next);
if(index<items.length-1)setTimeout(()=>setIndex(i=>Math.min(i+1,items.length-1)),120);
else complete(next);
};
const scoreUrl=()=>window.location.href;
const share=async()=>{
const url=scoreUrl();
const title=en?"My Big Five personality profile":"나의 빅파이브 성격 프로필";
try{if(navigator.share)await navigator.share({title,url});else{await navigator.clipboard.writeText(url);setCopied(true);}}catch{}
};
if(mode==="intro")return <main className="bf-page"><header className="bf-header"><Link href={en?"/en":"/"} className="bf-logo">UTIL<span>WISE</span>.</Link><nav><Link href={en?"/en":"/"}>{en?"Explore tools":"전체 도구 둘러보기"}</Link><Link href={en?"/big-five":"/en/big-five"}>{en?"한국어":"English"}</Link></nav></header><section className="bf-hero"><div className="bf-eyebrow">PERSONALITY · FIVE FACTORS</div><h1>{en?"Discover your personality in five dimensions":"다섯 가지 차원으로 알아보는 나의 성격"}</h1><p>{en?"Explore your tendencies across five broad personality traits with 50 thoughtful questions.":"50개의 질문으로 다섯 가지 성격 차원을 살펴보고, 나의 성향을 입체적으로 이해해 보세요."}</p><div className="bf-facts"><span>{en?"About 7–10 min":"약 7~10분"}</span><span>{en?"50 questions":"50문항"}</span><span>{en?"Free · No sign-up":"무료 · 회원가입 없음"}</span></div><Link className="bf-primary" href={(en?"/en":"")+"/big-five/test"}>{en?"Start the test":"검사 시작하기"} →</Link><small>{en?"An educational self-reflection tool, not a clinical or diagnostic assessment.":"자기이해를 돕기 위한 참고용 검사이며 임상 진단이나 전문 심리검사가 아닙니다."}</small></section><section className="bf-traits">{traits.map(([code,koName,enName,koDesc,enDesc])=><article key={code}><b>{code}</b><div><h2>{en?enName:koName}</h2><p>{en?enDesc:koDesc}</p></div></article>)}</section><section className="bf-method"><h2>{en?"How it works":"검사 방법"}</h2><p>{en?"Answer each statement based on how you generally think, feel, and behave. There are no right or wrong answers.":"각 문항을 읽고 평소의 생각과 행동에 얼마나 가까운지 선택하면 됩니다. 정답은 없으니 평소의 나를 기준으로 답해주세요."}</p><p>{en?"Your answers are scored locally in your browser and are not sent to our server.":"응답은 브라우저에서만 계산되며 서버로 전송되지 않습니다."}</p><p>{en?"This original 50-item questionnaire is informed by the public-domain IPIP framework. It is not an official IPIP scale and has not been independently validated as a standardized Korean or English instrument.":"공개 IPIP의 5요인 구성 체계를 참고해 자체 작성한 50문항입니다. 공식 IPIP 척도 자체가 아니며, 표준화된 한국어·영어 검사로 별도 타당화된 도구는 아닙니다."}</p><Link href={(en?"/en":"")+"/big-five/test"} className="bf-primary">{en?"Begin":"검사 시작하기"} →</Link></section><footer className="bf-footer"><Link href={en?"/en":"/"}>UTILWISE</Link> · © 2026</footer></main>;
if(mode==="test")return <main className="bf-page"><header className="bf-header"><Link href={en?"/en":"/"} className="bf-logo">UTIL<span>WISE</span>.</Link><span>{en?"Big Five Test":"빅파이브 검사"}</span><Link href={en?"/en/big-five":"/big-five"}>{en?"한국어":"English"}</Link></header><section className="bf-test"><div className="bf-progress-head"><span>{en?"Question":"문항"} {index+1} / 50</span><span>{Math.round((index+1)/50*100)}%</span></div><div className="bf-progress"><i style={{width:((index+1)/50*100)+"%"}}/></div><div className="bf-question"><div className="bf-eyebrow">{en?"THINK ABOUT YOUR USUAL SELF":"평소의 나를 떠올려 보세요"}</div><h1>{en?current.en:current.ko}</h1><p>{en?"Choose how much you agree with this statement.":"이 문장이 평소의 나와 얼마나 가까운지 선택해 주세요."}</p></div><div className="bf-options">{labels.map((label,i)=><button key={label} className={answers[index]===i+1?"selected":""} onClick={()=>choose(i+1)}><span>{i+1}</span>{label}</button>)}</div><div className="bf-test-nav"><button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>{en?"← Previous":"← 이전 문항"}</button><span>{en?"Your answers stay in this browser.":"응답은 이 브라우저 안에서만 처리됩니다."}</span></div></section></main>;
if(!scores)return <main className="bf-page"><section className="bf-result"><h1>{en?"No result found":"결과를 찾을 수 없어요"}</h1><p>{en?"Please take the test to see your profile.":"검사를 완료한 뒤 결과를 확인해 주세요."}</p><Link className="bf-primary" href={(en?"/en":"")+"/big-five/test"}>{en?"Start the test":"검사 시작하기"} →</Link></section></main>;
return <main className="bf-page"><header className="bf-header"><Link href={en?"/en":"/"} className="bf-logo">UTIL<span>WISE</span>.</Link><nav><Link href={en?"/en":"/"}>{en?"Home":"홈으로"}</Link><Link href={en?"/big-five":"/en/big-five"}>{en?"한국어":"English"}</Link></nav></header><section className="bf-result"><div className="bf-eyebrow">{en?"YOUR PERSONALITY PROFILE":"YOUR PERSONALITY PROFILE"}</div><h1>{en?"Your Big Five Profile":"나의 빅파이브 성격 프로필"}</h1><p>{en?"A snapshot of your responses across five broad personality dimensions.":"다섯 가지 성격 차원에서 나타난 나의 응답 경향을 살펴보세요."}</p><div className="bf-score-list">{traits.map(([code,koName,enName,koDesc,enDesc],i)=><article key={code}><div className="bf-score-title"><h2>{en?enName:koName}</h2><b>{scoreValues[i]}<small> / 100</small></b></div><div className="bf-score-track"><i style={{width:scoreValues[i]+"%"}}/></div><p>{en?enDesc:koDesc}</p><strong>{descriptions(code,scoreValues[i],en)}</strong></article>)}</div><div className="bf-summary"><h2>{en?"Reading your profile":"결과를 이해하는 방법"}</h2><p>{en?"Higher scores indicate that the trait is more characteristic of your responses; lower scores indicate that it is less characteristic. Neither direction is inherently better. Your profile describes tendencies, not fixed labels.":"점수가 높다고 무조건 좋거나 낮다고 나쁜 것은 아닙니다. 각 점수는 응답에서 해당 성향이 얼마나 두드러졌는지를 나타내며, 상황과 경험에 따라 행동은 달라질 수 있습니다."}</p><p>{en?"This questionnaire is an educational self-reflection tool, not a clinical assessment. It is inspired by the IPIP five-factor framework but is not a validated standardized scale.":"이 검사는 IPIP 5요인 체계를 참고해 자체 작성한 참고용 문항입니다. 표준화·타당화된 전문 심리검사나 임상 진단을 대체하지 않습니다."}</p></div><div className="bf-actions"><button className="bf-primary" onClick={share}>{en?"Share result":"결과 공유하기"} ↗</button><button onClick={()=>window.location.href=(en?"/en":"")+"/big-five/test"}>{en?"Retake the test":"다시 검사하기"}</button></div>{copied&&<p className="bf-copied">{en?"Result link copied.":"결과 링크를 복사했어요."}</p>}</section><footer className="bf-footer"><Link href={en?"/en":"/"}>UTILWISE</Link> · © 2026</footer></main>;
}
