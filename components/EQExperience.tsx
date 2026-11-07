"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";

type Area={id:string;name:string;en:string;desc:string};
type Question={area:number;reverse:boolean;ko:string;en:string};
const areas:Area[]=[
{id:"awareness",name:"자기 감정 인식",en:"Emotional awareness",desc:"감정의 이름과 원인, 몸과 생각에 나타나는 신호를 알아차리는 능력"},
{id:"regulation",name:"감정 조절",en:"Emotional regulation",desc:"강한 감정에 휩쓸리지 않고 반응을 선택하며 회복하는 능력"},
{id:"empathy",name:"공감",en:"Empathy",desc:"타인의 감정과 관점을 이해하고 성급한 판단 없이 반응하는 능력"},
{id:"relationship",name:"대인관계·소통",en:"Relationship skills",desc:"감정과 요구를 존중 있게 표현하고 신뢰와 경계를 함께 만드는 능력"},
{id:"motivation",name:"자기 동기부여",en:"Self-motivation",desc:"좌절 후 다시 시작하고 감정을 목표를 향한 행동으로 연결하는 능력"},
{id:"conflict",name:"갈등 대응",en:"Conflict management",desc:"불일치와 긴장 속에서도 문제를 분리해 대화하고 해결책을 찾는 능력"}
];
const questions:Question[]=[
{area:0,reverse:false,ko:"나는 지금 느끼는 감정을 몇 가지 구체적인 단어로 설명할 수 있다.",en:"I can describe what I am feeling in specific words."},
{area:0,reverse:false,ko:"감정이 갑자기 변할 때 그 직전에 있었던 상황이나 생각을 돌아본다.",en:"When my feelings shift, I reflect on what happened just before."},
{area:0,reverse:true,ko:"불편한 기분이 들어도 무엇 때문에 그런지 잘 모를 때가 많다.",en:"I often feel uncomfortable without knowing why."},
{area:0,reverse:false,ko:"긴장하거나 속상할 때 몸에서 나타나는 신호를 알아차린다.",en:"I notice physical signs when I feel tense or upset."},
{area:0,reverse:true,ko:"내 감정과 사실에 대한 판단을 구분하기 어렵다.",en:"I find it hard to separate my feelings from my judgment of facts."},
{area:0,reverse:false,ko:"상황에 따라 같은 감정도 강도와 이유가 다를 수 있음을 이해한다.",en:"I recognize that the same emotion can have different causes and intensity."},
{area:1,reverse:false,ko:"화가 나더라도 즉시 말하거나 행동하기 전에 잠시 멈출 수 있다.",en:"Even when angry, I can pause before speaking or acting."},
{area:1,reverse:false,ko:"스트레스를 받을 때 나에게 효과적인 진정 방법을 활용한다.",en:"I use calming strategies that work for me when stressed."},
{area:1,reverse:true,ko:"감정이 격해지면 나중에 후회할 말을 하거나 행동하는 편이다.",en:"When emotions run high, I say or do things I later regret."},
{area:1,reverse:false,ko:"실망스러운 일이 생겨도 감정을 정리한 뒤 해야 할 일을 다시 시작한다.",en:"After a disappointment, I can regroup and return to what needs doing."},
{area:1,reverse:true,ko:"한 번 기분이 상하면 그 감정에서 벗어나기까지 오랜 시간이 걸린다.",en:"Once upset, it takes me a long time to move on from the feeling."},
{area:1,reverse:false,ko:"감정을 억누르기보다 안전하고 적절한 방식으로 표현하려 한다.",en:"I try to express emotions safely rather than simply suppressing them."},
{area:2,reverse:false,ko:"상대방의 말뿐 아니라 표정과 말투의 변화에도 주의를 기울인다.",en:"I pay attention to changes in others' expressions and tone, not just their words."},
{area:2,reverse:false,ko:"나와 의견이 다른 사람도 어떤 경험 때문에 그렇게 생각하는지 궁금해한다.",en:"I wonder what experiences may have shaped a different viewpoint."},
{area:2,reverse:true,ko:"상대방이 힘들다고 말하면 해결책부터 제시하고 감정은 나중에 살핀다.",en:"When someone is upset, I jump to solutions before acknowledging feelings."},
{area:2,reverse:false,ko:"상대의 감정을 이해하려고 하되, 내 추측이 맞는지 확인한다.",en:"I try to understand others' feelings and check whether my interpretation is right."},
{area:2,reverse:true,ko:"다른 사람의 감정 표현을 과민하거나 과장된 반응이라고 쉽게 판단한다.",en:"I easily judge other people's emotional reactions as over-sensitive or exaggerated."},
{area:2,reverse:false,ko:"상대가 조언보다 공감과 경청을 원할 수 있다는 점을 고려한다.",en:"I consider that someone may want listening and empathy rather than advice."},
{area:3,reverse:false,ko:"불편한 점이 있을 때 상대를 비난하기보다 내 입장에서 구체적으로 설명한다.",en:"When something bothers me, I explain it clearly without blaming the other person."},
{area:3,reverse:false,ko:"상대방의 말을 끊지 않고 핵심을 이해한 뒤 내 의견을 말한다.",en:"I listen without interrupting and respond after understanding the main point."},
{area:3,reverse:true,ko:"갈등이 생기면 문제를 이야기하기보다 연락이나 대화를 피하는 편이다.",en:"When conflict arises, I tend to avoid contact or discussion."},
{area:3,reverse:false,ko:"상대의 부탁을 거절해야 할 때도 이유와 한계를 정중하게 전달할 수 있다.",en:"I can politely explain my limits when I need to say no."},
{area:3,reverse:true,ko:"상대가 내 마음을 알아서 이해해야 한다고 기대하는 경우가 많다.",en:"I often expect others to understand how I feel without telling them."},
{area:3,reverse:false,ko:"관계에서 상대를 배려하는 것과 내 필요를 표현하는 일을 함께 중요하게 여긴다.",en:"I value both considering others and expressing my own needs."},
{area:4,reverse:false,ko:"기분이 좋지 않은 날에도 중요한 목표를 위한 작은 행동을 할 수 있다.",en:"Even on a difficult day, I can take a small step toward an important goal."},
{area:4,reverse:false,ko:"실패했을 때 나를 비난하기보다 다음에 바꿀 수 있는 점을 찾는다.",en:"After failure, I look for what I can change next time rather than attacking myself."},
{area:4,reverse:true,ko:"일이 계획대로 되지 않으면 목표 자체를 포기하고 싶어진다.",en:"When things do not go to plan, I feel like abandoning the goal."},
{area:4,reverse:false,ko:"큰 목표를 부담스럽지 않은 단계로 나누어 실행한다.",en:"I break large goals into manageable steps."},
{area:4,reverse:true,ko:"칭찬이나 즉각적인 보상이 없으면 꾸준히 노력하기 어렵다.",en:"Without praise or immediate rewards, I struggle to keep going."},
{area:4,reverse:false,ko:"내가 중요하게 여기는 가치와 목표를 연결해 동기를 유지한다.",en:"I connect my goals to personal values to sustain motivation."},
{area:5,reverse:false,ko:"의견 충돌이 생기면 사람에 대한 평가와 해결해야 할 문제를 구분한다.",en:"During disagreement, I separate the person from the problem."},
{area:5,reverse:false,ko:"갈등 상황에서도 상대가 중요하게 여기는 점을 질문하고 확인한다.",en:"Even in conflict, I ask what matters most to the other person."},
{area:5,reverse:true,ko:"다툼이 생기면 누가 잘못했는지 가리는 데 집중하는 편이다.",en:"When an argument happens, I focus on proving who is at fault."},
{area:5,reverse:false,ko:"감정이 너무 격해졌다면 대화를 잠시 멈추고 다시 이야기할 시간을 정한다.",en:"If emotions run too high, I pause and agree on a time to resume."},
{area:5,reverse:true,ko:"상대가 먼저 사과하지 않으면 내 입장을 조정하기 어렵다.",en:"I find it hard to adjust my position unless the other person apologizes first."},
{area:5,reverse:false,ko:"갈등이 끝난 뒤에도 재발을 막기 위해 필요한 약속이나 변화를 정리한다.",en:"After conflict, I clarify agreements or changes that can prevent a repeat."}
];
const scale=["전혀 그렇지 않다","그렇지 않은 편이다","보통이다","그런 편이다","매우 그렇다"];
const levels=(v:number)=>v>=80?"매우 두드러짐":v>=65?"강점으로 나타남":v>=45?"상황에 따라 발휘됨":v>=30?"성장 여지가 있음":"우선 살펴볼 영역";
const intros=[
["감정의 이름을 붙이고 원인을 추적하는 힘이 비교적 잘 발휘됩니다.","감정을 막연한 기분으로 넘기지 않고 구체적으로 구분할수록 선택의 폭이 넓어집니다.","감정 기록을 할 때 상황·감정 단어·강도(0~10)·필요했던 것을 짧게 적어보세요."],
["감정이 행동을 대신 결정하지 않도록 잠시 멈추고 회복하는 전략을 활용하는 편입니다.","조절은 감정을 없애는 일이 아니라 감정을 인정하면서 행동을 선택하는 과정입니다.","반응 전 10초 멈춤, 천천히 내쉬기, 대화 재개 시간 정하기 중 하나를 반복해 보세요."],
["상대의 관점을 상상하고 감정의 맥락을 살피는 태도가 비교적 잘 나타납니다.","공감은 상대의 감정에 동의하거나 책임지는 것이 아니라 이해하려고 확인하는 과정입니다.","조언하기 전에 '지금은 들어주길 원해, 같이 방법을 찾길 원해?'라고 물어보세요."],
["자신의 생각과 감정을 표현하면서 관계의 필요와 경계를 함께 고려하는 편입니다.","건강한 소통은 무조건 맞춰주는 것도, 강하게 주장하는 것도 아닌 명확하고 존중 있는 표현입니다.","'나는 ~할 때 ~하게 느껴져. 다음에는 ~해줄 수 있을까?' 형식으로 요청해 보세요."],
["기분과 상황이 흔들려도 목표를 작은 행동으로 이어가려는 경향이 나타납니다.","동기부여는 늘 의욕이 넘치는 상태가 아니라 의욕이 낮은 날에도 시작할 수 있는 구조를 만드는 일입니다.","목표를 10분 안에 끝낼 수 있는 첫 행동으로 바꾸고 완료 여부만 기록해 보세요."],
["갈등에서 승패보다 쟁점과 해결 가능성을 살피려는 태도가 나타납니다.","갈등 해결은 즉시 합의하는 것이 아니라 서로의 우려를 분명히 하고 실행 가능한 다음 단계를 찾는 과정입니다.","쟁점·내가 원하는 것·상대가 원하는 것·공통 목표를 각각 한 문장으로 적어보세요."]
];
const lowTips=[
["감정을 참거나 무시하기 전에 '지금 불편하다'는 신호부터 인정해 보세요.","하루 두 번 감정 단어 목록에서 현재 감정을 하나 고르고 강도를 숫자로 적어보세요.","감정이 생긴 상황과 머릿속에 떠오른 해석을 분리해 적어보세요."],
["강한 감정이 올라오면 즉시 결론을 내리지 말고 몸을 안정시킬 시간을 확보하세요.","대화 중 감정이 커지면 잠시 멈출 문장을 미리 정해두세요.","수면·식사·휴식 등 기본적인 회복 조건이 무너졌는지도 점검해 보세요."],
["상대의 말에 바로 판단을 붙이기보다 한 번 더 질문해 맥락을 확인해 보세요.","'그때 어떤 점이 가장 힘들었어?'처럼 열린 질문을 사용해 보세요.","공감과 동의는 다르다는 점을 기억하고, 이해한 내용을 상대에게 확인하세요."],
["상대가 알아서 알아주길 기다리기보다 필요한 것을 구체적으로 말해보세요.","요청·거절·감사 중 한 가지를 짧고 명확하게 표현하는 연습을 하세요.","배려와 자기희생을 구분하고 지킬 수 있는 경계를 정해보세요."],
["목표를 작게 쪼개고 의욕보다 일정과 환경에 기대어 시작해 보세요.","실패를 전체 능력의 평가로 받아들이지 말고 다음 시도에서 바꿀 한 가지를 찾으세요.","진행을 방해하는 장애물을 미리 예상하고 도움이나 도구를 준비하세요."],
["잘잘못을 가리기 전에 지금 해결해야 할 구체적인 쟁점을 한 가지로 좁혀보세요.","감정이 가라앉은 뒤 대화할 시간과 목적을 합의해 보세요.","상대의 요구를 요약해 확인한 다음 내 요구도 같은 방식으로 전달하세요."]
];
const highTips=[
"강점이 과도하게 사용되어 피로·완벽주의·타인 감정에 대한 과잉 책임으로 이어지지 않는지 살펴보세요.",
"상황과 상대에 따라 다른 방식이 필요합니다. 잘하는 방식 하나만 고집하지 않는 유연성을 유지하세요.",
"주변을 돕는 만큼 자신의 회복과 경계도 같은 수준으로 중요하게 다뤄보세요."
];
export default function EQExperience({mode}:{mode:"intro"|"test"|"result"}){
const [answers,setAnswers]=useState<number[]>([]);const [index,setIndex]=useState(0);const [scores,setScores]=useState<number[]|null>(null);const lock=useRef(false);const [notice,setNotice]=useState("");
useEffect(()=>{if(mode==="result"){const p=new URLSearchParams(window.location.search);const vals=areas.map((_,i)=>Number(p.get("s"+i)));if(areas.every((_,i)=>p.has("s"+i))&&vals.every(v=>Number.isFinite(v)&&v>=0&&v<=100))setScores(vals);}},[mode]);
const finish=(a:number[])=>{const missing=questions.findIndex((_,i)=>!Number.isInteger(a[i])||a[i]<1||a[i]>5);if(missing>=0){setAnswers(a);setIndex(missing);lock.current=false;return;}const result=areas.map((_,area)=>{const q=questions.map((item,i)=>({item,value:a[i]})).filter(x=>x.item.area===area);const avg=q.reduce((sum,x)=>sum+(x.item.reverse?6-x.value:x.value),0)/q.length;return Math.round((avg-1)*25);});window.location.href="/eq/result?"+result.map((v,i)=>"s"+i+"="+v).join("&");};
const choose=(v:number)=>{if(lock.current)return;lock.current=true;const a=[...answers];a[index]=v;setAnswers(a);if(index===questions.length-1)finish(a);else{setTimeout(()=>{setIndex(x=>Math.min(x+1,questions.length-1));lock.current=false;},110);}};
const share=async()=>{const url=window.location.href;try{if(navigator.share){await navigator.share({title:"UTILWISE 감성지능 EQ 테스트 결과",text:"나의 EQ 테스트 결과를 확인해 보세요.",url});return;}}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;}try{await navigator.clipboard.writeText(url);setNotice("결과 링크가 복사되었습니다.");}catch{setNotice("주소창의 결과 링크를 복사해 공유해 주세요.");}};
if(mode==="intro")return <main className="eq-page"><header className="eq-header"><Link href="/" className="eq-logo">UTIL<span>WISE</span>.</Link><Link href="/">전체 도구 둘러보기</Link></header><section className="eq-hero"><div className="eq-eyebrow">EMOTIONAL INTELLIGENCE · SELF REFLECTION</div><h1>나의 감성지능(EQ)을<br/>6가지 영역으로 살펴보세요</h1><p>감정을 알아차리고 조절하는 능력부터 공감, 소통, 갈등 대응까지. 36개 문항으로 나의 감정 사용 습관을 돌아봅니다.</p><div className="eq-facts"><span>36문항</span><span>약 5~7분</span><span>6개 평가 영역</span><span>무료 · 비회원</span></div><Link className="eq-primary" href="/eq/test">EQ 테스트 시작하기 →</Link><small>자기이해를 위한 자체 제작 참고 테스트이며, 표준화된 심리검사나 임상 진단이 아닙니다.</small></section><section className="eq-area-grid">{areas.map((a,i)=><article key={a.id}><b>0{i+1}</b><h2>{a.name}</h2><p>{a.desc}</p></article>)}</section><section className="eq-method"><h2>어떻게 결과를 해석하나요?</h2><p>6개 영역별 점수와 함께 응답 패턴을 바탕으로 강점, 주의할 습관, 관계와 업무에서의 활용 포인트, 실천 가이드를 제공합니다.</p><p>점수는 정답률이나 타인과의 순위를 뜻하지 않습니다. 최근의 상태와 응답 경향을 이해하기 위한 참고 지표입니다.</p><Link className="eq-primary" href="/eq/test">내 감성지능 살펴보기 →</Link></section><footer className="eq-footer"><Link href="/">UTILWISE</Link> · © 2026</footer></main>;
if(mode==="test"){const q=questions[index];return <main className="eq-page"><header className="eq-header"><Link href="/" className="eq-logo">UTIL<span>WISE</span>.</Link><span>감성지능(EQ) 테스트</span><Link href="/eq">나가기</Link></header><section className="eq-test"><div className="eq-progress-label"><span>문항 {index+1} / {questions.length}</span><b>{Math.round((index+1)/questions.length*100)}%</b></div><div className="eq-progress"><i style={{width:((index+1)/questions.length*100)+"%"}}/></div><div className="eq-question"><small>{areas[q.area].name}</small><h1>{q.ko}</h1><p>평소의 나와 얼마나 가까운지 선택해 주세요.</p></div><div className="eq-options">{scale.map((s,i)=><button key={s} onClick={()=>choose(i+1)}><b>{i+1}</b>{s}</button>)}</div><button className="eq-back" disabled={index===0} onClick={()=>setIndex(x=>Math.max(0,x-1))}>← 이전 문항</button><p className="eq-privacy">응답은 브라우저에서 계산되며 서버에 저장되지 않습니다.</p></section></main>;}
if(!scores)return <main className="eq-page"><section className="eq-report"><h1>결과를 찾을 수 없어요</h1><p>검사를 완료한 뒤 결과를 확인해 주세요.</p><Link className="eq-primary" href="/eq/test">EQ 테스트 시작하기</Link></section></main>;
const avg=Math.round(scores.reduce((a,b)=>a+b,0)/6);const sorted=scores.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);const strongest=sorted[0],growth=sorted[5];
return <main className="eq-page"><header className="eq-header"><Link href="/" className="eq-logo">UTIL<span>WISE</span>.</Link><nav><Link href="/">홈으로</Link><Link href="/eq">테스트 소개</Link></nav></header><section className="eq-report"><div className="eq-eyebrow">YOUR EQ REFLECTION REPORT</div><h1>나의 감성지능(EQ)<br/>심층 분석 리포트</h1><p className="eq-report-lead">응답에서 나타난 6개 영역의 상대적인 패턴과 일상에서 활용할 수 있는 자기이해·성장 가이드를 정리했어요.</p><div className="eq-score-hero"><span>6개 영역 종합 참고 점수</span><strong>{avg}<small>/100</small></strong><b>{avg>=75?"전반적으로 강점이 잘 나타남":avg>=60?"균형 있게 발휘되는 편":avg>=45?"영역별 차이를 살펴볼 시기":"기초 습관부터 천천히 살펴보기"}</b><p>모집단 백분위나 표준화된 EQ 지수가 아닌 자체 문항의 환산 점수입니다.</p></div>
<div className="eq-section-title"><small>01 · PROFILE</small><h2>나의 감성지능 프로필</h2><p>높고 낮음은 우열이 아니라 현재 응답에서 나타난 상대적 경향입니다.</p></div>
<div className="eq-score-list">{areas.map((a,i)=><article key={a.id}><div className="eq-score-head"><div><h3>{a.name}</h3><p>{a.desc}</p></div><strong>{scores[i]}<small>/100</small></strong></div><div className="eq-track"><i style={{width:scores[i]+"%"}}/></div><b className="eq-level">{levels(scores[i])}</b></article>)}</div>
<div className="eq-insight-grid"><article><small>현재 가장 두드러진 영역</small><h3>{areas[strongest.i].name}</h3><p>{intros[strongest.i][0]}</p><p>{intros[strongest.i][1]}</p></article><article><small>먼저 살펴볼 성장 영역</small><h3>{areas[growth.i].name}</h3><p>{lowTips[growth.i][0]}</p><p>낮은 점수는 능력의 결함이나 고정된 특성을 뜻하지 않아요. 경험과 상황에 따라 달라질 수 있습니다.</p></article></div>
<div className="eq-section-title"><small>02 · SIX DIMENSIONS</small><h2>영역별 심층 해석</h2><p>각 영역에서 나타날 수 있는 강점과 놓치기 쉬운 부분, 일상에서 시도할 행동을 확인해 보세요.</p></div>
<div className="eq-detail-grid">{areas.map((a,i)=><article key={a.id} className="eq-detail"><div className="eq-detail-head"><div><small>0{i+1} · {levels(scores[i])}</small><h3>{a.name}</h3></div><strong>{scores[i]}점</strong></div><div className="eq-track"><i style={{width:scores[i]+"%"}}/></div><p className="eq-detail-intro">{scores[i]>=65?intros[i][0]:scores[i]>=40?intros[i][1]:lowTips[i][0]}</p><section><b>이 영역이 의미하는 것</b><p>{a.desc}. {intros[i][1]}</p></section><section><b>강점으로 활용하는 방법</b><p>{scores[i]>=65?intros[i][2]:highTips[i%3]}</p></section><section><b>주의해서 살펴볼 습관</b><p>{scores[i]>=65?highTips[i%3]:lowTips[i][1]}</p></section><section className="eq-action"><b>실천 아이디어</b><ul>{(scores[i]>=65?[intros[i][2],highTips[(i+1)%3]]:lowTips[i]).map(t=><li key={t}>{t}</li>)}</ul></section></article>)}</div>
<div className="eq-section-title"><small>03 · REAL LIFE</small><h2>생활 장면에서 활용하기</h2><p>점수는 실제 행동을 확정하지 않으므로, 아래 내용은 자기점검을 위한 질문과 가능성으로 읽어주세요.</p></div>
<div className="eq-life-grid"><article><h3>연애·가까운 관계</h3><p>가까운 사이일수록 상대가 내 마음을 알아주길 기대하거나 감정이 쌓인 뒤 표현하기 쉽습니다. 불편함이 작을 때 구체적으로 말하고, 상대의 의도를 단정하기 전에 확인해 보세요.</p><b>점검 질문</b><p>나는 원하는 것을 분명히 말하고 있나요, 아니면 상대가 알아차리길 기다리고 있나요?</p></article><article><h3>가족·친구 관계</h3><p>익숙한 관계에서는 역할과 기대가 굳어질 수 있습니다. 공감과 배려를 하되 모든 감정을 책임지려 하지 말고, 서로 가능한 도움의 범위를 확인해 보세요.</p><b>점검 질문</b><p>상대의 감정을 존중하면서 내 시간과 에너지도 지키고 있나요?</p></article><article><h3>직장·협업</h3><p>업무 갈등에서는 성격 평가보다 사실, 영향, 요청을 분리하면 대화가 구체적이 됩니다. 상대의 관점을 확인한 뒤 역할과 다음 행동을 합의해 보세요.</p><b>점검 질문</b><p>문제를 사람의 태도로만 해석하지 않고 바꿀 수 있는 과정으로 보고 있나요?</p></article><article><h3>스트레스·압박 상황</h3><p>피로와 시간 압박은 평소의 감정 조절과 공감 능력에도 영향을 줍니다. 중요한 대화 전 회복 시간을 확보하고, 감정이 격해지면 다시 이야기할 시점을 정해 잠시 멈추세요.</p><b>점검 질문</b><p>내가 예민해지는 초기 신호와 회복에 도움이 되는 조건을 알고 있나요?</p></article></div>
<div className="eq-section-title"><small>04 · PERSONAL PRACTICE</small><h2>나를 위한 7일 실천 가이드</h2><p>모든 것을 한 번에 바꾸기보다 작은 행동 하나를 반복해 보세요.</p></div><div className="eq-week">{["1일차 · 하루 세 번 감정 단어와 강도를 기록하기","2일차 · 감정이 올라올 때 몸의 신호 한 가지 알아차리기","3일차 · 조언 전에 상대가 원하는 도움의 종류 물어보기","4일차 · 필요한 부탁이나 거절을 짧고 구체적으로 표현하기","5일차 · 미뤄둔 목표를 10분짜리 첫 행동으로 바꾸기","6일차 · 갈등의 쟁점과 각자의 요구를 따로 적어보기","7일차 · 가장 도움이 된 행동 하나를 다음 주에도 이어가기"].map((x,i)=><div key={x}><b>{i+1}</b><p>{x}</p></div>)}</div>
<div className="eq-note"><h3>결과를 해석할 때 기억할 점</h3><p>이 검사는 감성지능의 일부 측면을 살펴보기 위해 자체 제작한 자기보고식 문항입니다. 응답 당시의 기분, 최근 경험, 문화적 맥락과 문항 해석에 따라 결과가 달라질 수 있으며, 전문적으로 표준화·타당화된 심리검사나 임상적 평가가 아닙니다.</p><p>감정 조절에 지속적인 어려움이 있거나 일상생활과 관계에 큰 고통이 이어진다면 이 점수만으로 판단하지 말고 자격을 갖춘 전문가와 상의하는 것이 좋습니다.</p></div>
<div className="eq-actions"><button className="eq-primary" onClick={share}>결과 공유하기</button><Link className="eq-secondary" href="/eq/test">다시 테스트하기</Link><Link className="eq-secondary" href="/eq">EQ 테스트 소개</Link></div>{notice&&<p className="eq-notice">{notice}</p>}</section><footer className="eq-footer"><Link href="/">UTILWISE</Link> · © 2026</footer></main>;
}
