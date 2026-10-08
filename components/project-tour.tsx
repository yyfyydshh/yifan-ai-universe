"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, BookOpen, Building2, CalendarDays, Check, ChevronDown, FileText, Link2, LockKeyhole, MessageCircle, Newspaper, Quote, Search, ShieldCheck, Sprout, CheckCircle2 } from "lucide-react";
import { publicPath } from "@/lib/site-config";
import { projectTours, type ProjectTourData, type TourStep } from "@/lib/project-tour-data";
import type { Project } from "@/lib/site-data";
import { SampleWorkbench } from "./sample-workbench";
import "./project-tour.css";

const objects = [
  { label: "输入", hint: "打开资料夹", asset: "/world/folder-v2.webp" },
  { label: "处理", hint: "看看怎么做", asset: "/world/tour-computer.webp" },
  { label: "结果", hint: "翻开结果手册", asset: "/world/tour-notebook.webp" },
];

function Scene({ kind, step, data }: { kind: ProjectTourData["kind"]; step: number; data: TourStep }) {
  if (kind === "conversation") {
    return <div className={`tour-scene tour-scene--conversation tour-scene--step-${step}`} aria-label="客户需求梳理示意">
      <div className="tour-chat"><MessageCircle size={24} /><p>{step === 0 ? "希望持续采集公开网页中的业务数据，目前主要依靠人工整理。" : step === 1 ? "从哪里采？多久更新？需要自动完成哪些环节？" : "先确认缺口，再带着适用方案继续沟通。"}</p><small>{step === 0 ? "原项目中的脱敏机制示例" : "梳理与沟通"}</small></div>
      <div className="tour-conversation-notes">{data.labels.map((label, i) => <div key={label}><span>{i + 1}</span><b>{label}</b>{step === 2 ? <Check size={18} /> : <span className="tour-blank-line" />}</div>)}</div>
    </div>;
  }
  if (kind === "library") {
    return <div className={`tour-scene tour-scene--library tour-scene--step-${step}`} aria-label="文档组织示意">
      <div className="tour-library-title"><BookOpen size={26} /><b>{["资料待整理", "把阅读路径接起来", "可以继续维护的文档站"][step]}</b></div>
      <div className="tour-book-shelf">{data.labels.map((label, i) => <div className="tour-book" key={label}><span>{String(i + 1).padStart(2, "0")}</span><strong>{label}</strong><i /><i /></div>)}</div>
      <p className="tour-scene-caption">{["先有信息架构，再逐步填充内容", "正文、媒体和链接一起验收", "站点交付后，方法也能被复用"][step]}</p>
    </div>;
  }
  if (kind === "matching") {
    return <div className={`tour-scene tour-scene--matching tour-scene--step-${step}`} aria-label="企业与监管信息匹配示意">
      <div className="tour-match-pair"><div><Building2 size={34} /><b>企业情况</b></div><span><Link2 size={25} /><small>逐项对照</small></span><div><ShieldCheck size={34} /><b>监管信息</b></div></div>
      <div className="tour-match-checks">{data.labels.map(label => <p key={label}><Search size={17} />{label}</p>)}</div>
      <p className="tour-scene-caption">{step === 2 ? "风险结论旁边，始终保留依据" : "相关性需要判断，不能只看关键词"}</p>
    </div>;
  }
  if (kind === "fields") {
    return <div className={`tour-scene tour-scene--fields tour-scene--step-${step}`} aria-label="公告整理为固定字段的示意">
      <div className="tour-notice"><FileText size={25} /><b>{step === 0 ? "原始公告" : "正文依据"}</b><i /><i /><i /><span>{step === 0 ? "不同格式，同一份事实" : "未披露的信息保留为空"}</span></div>
      <ArrowRight className="tour-flow-arrow" size={24} />
      <div className="tour-field-sheet"><header><strong>29</strong><span>固定字段</span></header>{data.labels.map(label => <div key={label}><b>{label}</b><span className="tour-blank-line" /></div>)}<p>{step === 2 ? "CSV · JSON · 异常清单" : "找到原文，才能填写"}</p></div>
    </div>;
  }
  if (kind === "writing") {
    return <div className={`tour-scene tour-scene--writing tour-scene--step-${step}`} aria-label="保护作者声音的编辑示意">
      <div className="tour-manuscript"><Quote size={28} /><strong>{["作者的声音", "需要保护的内容", "留得下改动，也留得住自己"][step]}</strong><i /><i /><i /><div className="tour-manuscript-stamp"><LockKeyhole size={16} /><span>{step === 0 ? "先确认画像" : "内容完整性优先"}</span></div></div>
      <div className="tour-writing-notes">{data.labels.map(label => <p key={label}><span />{label}</p>)}</div>
    </div>;
  }
  if (kind === "news") {
    return <div className={`tour-scene tour-scene--news tour-scene--step-${step}`} aria-label="新闻证据快报示意">
      <div className="tour-calendar"><CalendarDays size={22} /><strong>7</strong><span>日窗口</span></div>
      <div className="tour-newspaper"><header><Newspaper size={24} /><b>{["公开信息收件箱", "筛选证据", "有来源的快报"][step]}</b></header>{data.labels.map((label, i) => <div key={label}><span>{i + 1}</span><p><b>{label}</b><i /></p><Link2 size={16} /></div>)}</div>
    </div>;
  }
  return <div className={`tour-scene tour-scene--sources tour-scene--step-${step}`} aria-label="公开信息与证据报告示意">
    <div className="tour-source-fan">{data.labels.map((label, i) => <div key={label}><span>{step === 2 ? <BookOpen size={22} /> : <FileText size={22} />}</span><strong>{label}</strong><i /><i /><small>{step === 0 ? "收集范围" : step === 1 ? "保留出处" : "可复核交付"} · {i + 1}</small></div>)}</div>
    <div className="tour-evidence-thread"><Link2 size={20} /><p>{step === 2 ? "结论 ← 来源 ← 原始记录" : "每条信息，都有可追溯的来源"}</p></div>
  </div>;
}

function SalesSimulation({ project }: { project: Project }) {
  const [turn, setTurn] = useState(0);
  const study = project.caseStudy;
  if (study?.visualKind !== "sales-conversion") return null;
  const current = study.turns[turn];
  return <div className="tour-simulator sales-simulator"><div className="sim-input"><p className="sim-instruction">点一次客户补充，看需求如何逐渐清楚。</p><div className="sim-replies">{study.turns.map((item, index) => <button key={item.id} type="button" aria-pressed={turn === index} onClick={() => setTurn(index)}><span>0{index + 1}</span><p><b>{item.label}</b>{item.reply}</p></button>)}</div></div><div className="sim-result sim-customer-card" aria-live="polite"><header><MessageCircle size={30} /><div><small>当前需求成熟度</small><strong>{current.mql.level} <span>{current.mql.label}</span></strong></div></header><h4>现在了解了什么</h4><p>{current.contextSummary}</p><h4>接下来做什么</h4><p>{turn === 0 ? "继续确认行业、目标数据、字段和更新频率。" : turn === 1 ? "进一步确认自动化程度，以及如何进入现有系统。" : "进入样例验证和方案评估，预算、采购与合规边界仍需人工确认。"}</p><div className="sim-small-note">来自原项目的固定三轮脱敏示例，不是实时客户分析。</div></div></div>;
}

function DocsSimulation() {
  const [task, setTask] = useState(0);
  const [checked, setChecked] = useState<string[]>([]);
  const tasks = [
    { name:"从零搭建", checks:["检查栏目", "检查页面", "检查入口"], before:"栏目尚未接通", after:"阅读路径已连通" },
    { name:"旧站迁移", checks:["检查正文", "检查图片", "检查旧链接"], before:"迁移后的页面待复核", after:"正文、图片和链接已核对" },
    { name:"日常维护", checks:["检查改动", "检查关联页", "检查线上入口"], before:"影响范围待检查", after:"变更与关联路径已核对" },
  ];
  const current = tasks[task]; const ready = checked.length === 3;
  return <div className="tour-simulator docs-simulator"><div className="sim-input"><p className="sim-instruction">选一个任务，再点检查把站点接起来。</p><div className="sim-pills">{tasks.map((item,index)=><button key={item.name} type="button" aria-pressed={task===index} onClick={()=>{setTask(index);setChecked([]);}}>{item.name}</button>)}</div><div className="sim-checklist">{current.checks.map(label=><button key={label} type="button" aria-pressed={checked.includes(label)} onClick={()=>setChecked(value=>value.includes(label)?value.filter(item=>item!==label):[...value,label])}><span>{checked.includes(label)?<Check size={20}/>:<Search size={20}/>}</span><b>{label}</b><small>{checked.includes(label)?"样本检查通过":"点一下检查"}</small></button>)}</div></div><div className="sim-result sim-site-preview" aria-live="polite"><header><i/><i/><i/><span>文档站预览 · 预设样本</span></header><div className="sim-sitemap"><div><BookOpen/><b>文档首页</b></div><span className="sim-map-stem"/><div className="sim-map-pages">{["指南","操作说明","常见问题"].map((label,index)=><div key={label} data-checked={checked.includes(current.checks[index])}><FileText/><span>{label}</span>{checked.includes(current.checks[index])?<Check size={16}/>:<Link2 size={16}/>}</div>)}</div></div><div className="sim-verdict" data-pass={ready}><div><b>{ready?current.after:current.before}</b><p>{ready?"本轮检查完成。正式发布还需要托管验收和明确授权。":`还剩 ${3-checked.length} 项未检查，页面存在不等于可以发布。`}</p></div></div></div></div>;
}

function RegulatorySimulation() {
  const [business,setBusiness]=useState("unknown"); const [subject,setSubject]=useState("yes"); const [evidence,setEvidence]=useState(false);
  const excluded=business==="no"||subject==="no"; const pending=business==="unknown"||subject==="unknown"; const ready=!excluded&&!pending&&evidence;
  return <div className="tour-simulator regulatory-simulator"><div className="sim-input"><p className="sim-instruction">改一项企业情况，观察同一条信息是否还适用。</p><div className="sim-enterprise"><Building2 size={36}/><b>示例企业画像</b><span>地域与时间已匹配 · 预设场景</span></div><label className="sim-select">对应业务是否存在<select value={business} onChange={event=>setBusiness(event.target.value)}><option value="unknown">还不知道</option><option value="yes">存在对应业务</option><option value="no">不涉及这项业务</option></select></label><label className="sim-select">主体条件是否符合<select value={subject} onChange={event=>setSubject(event.target.value)}><option value="yes">主体条件符合</option><option value="no">主体条件不符</option><option value="unknown">仍需补充资料</option></select></label><button className="sim-evidence-toggle" type="button" aria-pressed={evidence} onClick={()=>setEvidence(!evidence)}>{evidence?<CheckCircle2 size={20}/>:<Search size={20}/>} {evidence?"已核对这条样本的完整依据":"核对这条样本的完整依据"}</button></div><div className="sim-result sim-risk-paper" aria-live="polite"><ShieldCheck size={52}/><span className="sim-status" data-pass={ready}>{excluded?"不适用":pending?"待补证":ready?"进入候选风险":"待核对证据"}</span><h4>{excluded?"这条信息不直接套用到企业":pending?"条件还不完整，先提出问题":ready?"适用条件与证据都已满足":"条件匹配，还要检查原文"}</h4><p>{excluded?"有一项条件明确不匹配，保留排除理由。":pending?"未知项保持待定，不生成正式风险判断。":ready?"这代表值得继续审阅的风险信号，不等于企业已经违法。":"只有关键词或业务相似还不够，报告暂不放行。"}</p><div className="sim-small-note">适用性机制示意，不构成法律意见；没有发送任何报告。</div></div></div>;
}

const newsCandidates = [
  {title:"产品更新",detail:"2天前 · 有原链",valid:true,reason:"在七日窗口内，标题、原链和日期齐全。"},
  {title:"行业观察",detail:"9天前 · 有原链",valid:false,reason:"超过七日窗口，因此排除。"},
  {title:"社区线索",detail:"1天前 · 缺原链",valid:false,reason:"缺少可核对的原始链接，不进入证据集合。"},
  {title:"企业动态",detail:"3天前 · 有原链",valid:true,reason:"来自另一来源，记录完整，可以作为预设证据。"},
];
function NewsSimulation() {
  const [selected,setSelected]=useState(0); const [mode,setMode]=useState(0); const [included,setIncluded]=useState<number[]>([0]); const candidate=newsCandidates[selected];
  return <div className="tour-simulator news-simulator"><div className="sim-input"><p className="sim-instruction">点一条新闻，检查它能否进入快报。</p><div className="sim-news-list">{newsCandidates.map((item,index)=><button type="button" key={item.title} aria-pressed={selected===index} onClick={()=>setSelected(index)}><Newspaper size={22}/><span><b>{item.title} <small>· 样本</small></b><small>{item.detail}</small></span>{included.includes(index)&&<Check size={18}/>}</button>)}</div><div className="sim-news-inspector" aria-live="polite"><b>{candidate.valid?"符合记录要求":"排除这条记录"}</b><p>{candidate.reason}</p>{candidate.valid&&<button type="button" onClick={()=>setIncluded(items=>items.includes(selected)?items.filter(item=>item!==selected):[...items,selected])}>{included.includes(selected)?"从快报移除":"加入快报"}</button>}</div></div><div className="sim-result sim-brief-paper" aria-live="polite"><div className="sim-pills">{["新闻清单","决策简报","选题雷达"].map((label,index)=><button key={label} type="button" aria-pressed={mode===index} onClick={()=>setMode(index)}>{label}</button>)}</div><header><Newspaper size={36}/><strong>{included.length}</strong><span>条合格样本</span></header>{included.length===0?<p>没有合格样本，不生成无依据的摘要。</p>:included.map(index=><div className="sim-brief-item" key={index}><b>{mode===0?newsCandidates[index].title:mode===1?`${newsCandidates[index].title} · 变化与影响`:`围绕${newsCandidates[index].title}的选题`}</b><p>{mode===0?newsCandidates[index].detail:mode===1?"先看证据说明了什么，再判断需要跟进什么。":"从同一份证据出发，选择受众与内容角度。"}</p></div>)}<div className="sim-small-note">标题与记录均为虚构样本，用于说明筛选规则，不是实时新闻。</div></div></div>;
}

function WritingSimulation() {
  const [proposal,setProposal]=useState(0);
  const original="雨停了。她把那封没有寄出的信，重新放回抽屉。";
  const proposals=[{label:"整理标点",text:"雨停了，她把那封没有寄出的信重新放回抽屉。",pass:true,reason:"调整停顿，保留信未寄出、放回抽屉的情节。"},{label:"改写情节",text:"雨停了。她终于把信寄了出去。",pass:false,reason:"把未寄出的信改成寄出，改变了事件与结局，必须撤回。"}];
  const current=proposals[proposal];
  return <div className="tour-simulator writing-simulator"><div className="sim-input"><p className="sim-instruction">选一个修改提案，看看内容保护会不会放行。</p><div className="sim-manuscript-original"><Quote size={28}/><small>原稿 · 本页虚构短样本</small><p>{original}</p><span><LockKeyhole size={16}/> 保护项：信未寄出，放回抽屉</span></div><div className="sim-pills">{proposals.map((item,index)=><button key={item.label} type="button" aria-pressed={proposal===index} onClick={()=>setProposal(index)}>{item.label}</button>)}</div></div><div className="sim-result sim-edited-paper" aria-live="polite"><span className="sim-paper-label">修改提案</span><p className="sim-edited-text">{current.text}</p><div className="sim-verdict" data-pass={current.pass}>{current.pass?<CheckCircle2/>:<LockKeyhole/>}<div><b>{current.pass?"内容保护通过":"阻断：需要撤回这处改动"}</b><p>{current.reason}</p></div></div><div className="sim-small-note">仅演示内容锁定这一项。完整交付仍需要作者确认画像与完整性复核。</div></div></div>;
}

function CapabilitySimulation({ project }: { project: Project }) {
  switch(project.slug) {
    case "sales-copilot": return <SalesSimulation project={project}/>;
    case "docs-system": return <DocsSimulation/>;
    case "regulatory-risk": return <RegulatorySimulation/>;
    case "tender-cleaner": return <SampleWorkbench kind="tender"/>;
    case "hot-news-brief": return <NewsSimulation/>;
    case "humanizer": return <WritingSimulation/>;
    default: return null;
  }
}

export function ProjectTour({ project }: { project: Project }) {
  const [step, setStep] = useState(1);
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const tour = projectTours[project.slug];
  if (!tour) return null;
  const current = tour.steps[step];

  const navigate = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = event.key === "ArrowRight" ? (step + 1) % 3 : event.key === "ArrowLeft" ? (step + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : -1;
    if (next === -1) return;
    event.preventDefault();
    setStep(next);
    tabs.current[next]?.focus();
  };

  return <section className={`project-tour project-tour--${tour.kind}`} aria-labelledby={`${id}-title`}>
    <header className="project-tour-heading"><div><p><Sprout size={18} /> 三步看懂这个项目</p><h2 id={`${id}-title`}>{tour.heading}</h2></div><span>点开桌上的物件，跟着任务走一遍</span></header>
    <div className="tour-desk">
      <div className="tour-objects" role="tablist" aria-label="项目介绍步骤" onKeyDown={navigate}>
        {objects.map((object, index) => <button key={object.label} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={step === index} aria-controls={`${id}-panel`} tabIndex={step === index ? 0 : -1} onClick={() => setStep(index)}>
          <Image src={publicPath(object.asset)} alt="" width={240} height={240} sizes="(max-width: 48rem) 80px, 124px" />
          <span className="tour-object-label"><small>0{index + 1}</small><strong>{object.label}</strong></span><span className="tour-object-hint">{object.hint}</span>
        </button>)}
      </div>
      <div className={`tour-panel ${step===1?"tour-panel--simulate":""}`} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${step}`} tabIndex={0}>
        {step===1?<CapabilitySimulation project={project}/>:<Scene kind={tour.kind} step={step} data={current} />}
        <div className="tour-step-copy" aria-live="polite"><span className="tour-step-number">0{step + 1} / {objects[step].label}</span><h3>{current.title}</h3><p>{current.copy}</p><details key={step} className="tour-note"><summary>这一步，要留意什么？<ChevronDown size={18} /></summary><p>{current.note}</p></details></div>
      </div>
      <p className="tour-disclosure">流程示意 · 根据真实项目整理，不连接在线服务</p>
    </div>
  </section>;
}

export function ProjectDisclosure({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <details className="project-disclosure" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary><span><b>{title}</b><small>{caption}</small></span><ChevronDown size={22} /></summary>
    {open && <div className="project-disclosure-content">{children}</div>}
  </details>;
}
