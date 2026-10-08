"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FileSearch, HelpCircle, Mail, MessageSquare, RotateCcw, ShieldCheck, X } from "lucide-react";
import type { Project } from "@/lib/site-data";
import { publicPath } from "@/lib/site-config";
import { regulatoryBatchFinding, regulatoryBuckets, regulatoryDemoAction, regulatoryDemoBatch, regulatoryDemoProfiles, type BusinessAnswer, type RegulatoryBucket, type RegulatoryDemoRecord } from "@/lib/regulatory-balance-demo";
import { ProjectDisclosure } from "./project-tour";
import { ProjectCaseStudyView } from "./project-case-study";
import { RegulatoryScale } from "./regulatory-scale";
import { DemoSlot } from "./demo-slot";
import "./regulatory-balance-detail.css";

type View = "source" | "report" | "delivery" | null;

export function RegulatoryBalanceDetail({ project }: { project: Project }) {
  const [business, setBusiness] = useState<BusinessAnswer>("yes");
  const [collected, setCollected] = useState(false);
  const [petted, setPetted] = useState(false);
  const [view, setView] = useState<View>(null);
  const [selectedId, setSelectedId] = useState(regulatoryDemoBatch[0].id);
  const [sourceId, setSourceId] = useState(regulatoryDemoBatch[0].id);
  const [backTo, setBackTo] = useState<"report" | null>(null);
  const [channel, setChannel] = useState<"message" | "mail">("message");
  const [demoReceipts, setDemoReceipts] = useState<string[]>([]);
  const [deliveryResult, setDeliveryResult] = useState<"simulated" | "duplicate" | null>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const dialogBody = useRef<HTMLDivElement>(null);
  const cutout = `regulatory-${useId().replace(/:/g, "")}`;
  const profile = regulatoryDemoProfiles.find(item => item.business === business)!;
  const selected = regulatoryDemoBatch.find(item => item.id === selectedId)!;
  const selectedFinding = regulatoryBatchFinding(business, selected);
  const reviews = [{ record: selected, ...selectedFinding }];
  const counts = Object.fromEntries(regulatoryBuckets.map(item => [item.id, reviews.filter(review => review.bucket === item.id).length])) as Record<RegulatoryBucket, number>;
  const actions = reviews.filter(item => item.bucket === "obligation" || item.bucket === "signal");
  const record = regulatoryDemoBatch.find(item => item.id === sourceId)!;
  const sourceFinding = regulatoryBatchFinding(business, record);
  const receiptKey = `scale-v4:${selectedId}:${business}:${channel}`;
  const pose = !collected ? "hold" : view === "report" || view === "delivery" ? "guide" : "read";
  const actor = pose === "hold" ? "/world/tender-yifan-receive-v1.webp" : pose === "guide" ? "/world/tender-yifan-guide-v1.webp" : "/world/docs-yifan-reader-v1.png";
  const cat = petted ? "/world/cat-stretch.webp" : collected ? "/world/cat-awake.webp" : "/world/cat-idle.webp";

  useEffect(() => {
    if (view) {
      if (!sheet.current?.open) sheet.current?.showModal();
      if (sheet.current) sheet.current.scrollTop = 0;
      dialogBody.current?.focus({ preventScroll: true });
    } else sheet.current?.close();
  }, [view]);

  const reset = () => {setBusiness("yes"); setCollected(false); setPetted(false); setView(null); setSelectedId(regulatoryDemoBatch[0].id); setSourceId(regulatoryDemoBatch[0].id); setBackTo(null); setChannel("message"); setDemoReceipts([]); setDeliveryResult(null);};
  const place = (item: RegulatoryDemoRecord) => {setSelectedId(item.id); setCollected(true); setDeliveryResult(null);};
  const openSource = (item: RegulatoryDemoRecord, from: "report" | null = null) => {setSourceId(item.id); setBackTo(from); setView("source");};
  const simulateDelivery = () => {
    if (!actions.length) return;
    if (demoReceipts.includes(receiptKey)) setDeliveryResult("duplicate");
    else {setDemoReceipts(items => [...items, receiptKey]); setDeliveryResult("simulated");}
  };
  const title = view === "source" ? "这条消息的原文" : view === "delivery" ? "先检查，再投递" : "企业跟进清单";

  return <main className="regulatory-balance-page">
    <header className="rb-intro">
      <Link href="/work" className="back-link"><ArrowLeft size={16} aria-hidden="true"/>回到工作室</Link>
      <h1>{project.title}</h1><p>把监管消息，变成企业该跟进的事。</p>
    </header>
    <section className="rb-demo rb-scale-demo regulatory-simulator" data-phase={collected ? "review" : "inbox"} data-business={business} aria-labelledby="rb-heading">
      <div className="rb-toolbar"><h2 id="rb-heading">消息要求 ↔ 企业条件，对得上才跟进。</h2><button type="button" onClick={reset} aria-label="重新核对样本"><RotateCcw size={15} aria-hidden="true"/>重来</button></div>
      <RegulatoryScale business={business} selected={selected} placed={collected} onPlace={place} onProfile={value => {setBusiness(value); setDeliveryResult(null);}} onSource={() => openSource(selected)} onAction={() => setView("report")} cast={<div className="rb-cast">
          <svg className="rb-setting" viewBox="0 0 360 275" preserveAspectRatio="none" aria-hidden="true"><defs><filter id={cutout} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 1 1"/></feComponentTransfer></filter></defs><path className="rb-ground" d="M12 256Q79 239 147 251T341 252Q364 271 220 270H67Q0 271 12 256Z"/><path className="rb-ground-line" d="M25 260Q70 255 104 260M242 263Q292 257 327 263"/><g className="rb-sprig" transform="translate(-275 35)"><path d="M333 230Q307 206 316 172M316 202L332 187"/><path className="rb-leaf" d="M316 202Q297 199 295 184Q313 185 316 202ZM321 201Q330 185 344 189Q338 204 321 201Z"/></g></svg>
          <div className="rb-person" data-pose={pose} aria-hidden="true"><Image key={actor} src={publicPath(actor)} alt="" width={512} height={768} sizes="(max-width: 700px) 180px, 260px" unoptimized style={{filter:`url(#${cutout})`}}/><span>{!collected ? "拿一张，放上天平。" : view === "report" ? "把行动写清楚。" : view === "source" ? "看看原文。" : view === "delivery" ? "先检查，再投递。" : selectedFinding.bucket === "pending" ? "还缺条件，先核实。" : selectedFinding.bucket === "excluded" ? "这条条件没对上。" : "对上了，还要核验证据。"}</span></div>
          <button type="button" className="rb-cat" onClick={() => setPetted(!petted)} aria-label="摸摸小牛" aria-pressed={petted}><Image key={cat} src={publicPath(cat)} alt="" width={197} height={197} sizes="110px" unoptimized style={{filter:`url(#${cutout})`}}/>{petted && <span>呼噜～</span>}</button>
        </div>}/>
      <p className="rb-boundary">固定虚构演示 · 不真实采集或投递；相关不等于违法。</p>
      <dialog ref={sheet} className="rb-dialog" aria-labelledby="rb-dialog-heading" onClose={() => setView(null)}>
        <header><h2 id="rb-dialog-heading">{title}</h2><button type="button" onClick={() => setView(null)} aria-label="关闭演示纸页"><X size={21} aria-hidden="true"/></button></header>
        {view && <div ref={dialogBody} tabIndex={-1} className="rb-dialog-body">
          {view === "source" && <div className="rb-source">
            {backTo && <button className="rb-back-note" type="button" onClick={() => setView(backTo)}><ArrowLeft size={15} aria-hidden="true"/>回到跟进清单</button>}
            <span className="rb-sample-mark">虚构演示资料 · {record.id}</span><h3>{record.title}</h3><p className="rb-source-meta">{record.source}<br/>{record.time}</p><p className="rb-full-body">{record.body}</p>
            {collected && <div className="rb-source-decision"><strong>{record.duplicateOf ? "重复资料已合并" : regulatoryBuckets.find(item => item.id === sourceFinding.bucket)!.label}</strong><p>{record.duplicateOf ? `正文相同，合并到 ${record.duplicateOf}；本条采集身份仍保留。` : sourceFinding.reason}</p></div>}
            <small>保留来源、时间、正文和处理理由。本页不是正式风险报告或法律意见。</small>
          </div>}
          {view === "report" && <div className="rb-report">
            <p className="rb-sample-mark">演示跟进页 · {profile.name} · {selected.label}</p><h3>{actions.length ? "把这一条，变成可跟进的行动" : selectedFinding.bucket === "pending" ? "先核实，再下判断" : "留下这条的排除理由"}</h3>
            <p className="rb-report-summary">{actions.length ? "每个行动都能回到这条消息的原文。" : selectedFinding.bucket === "pending" ? "条件尚未确认，不生成正式风险判断。" : "只排除这条消息，不代表企业没有其他风险。"}</p>
            {actions.length > 0 && <section className="rb-action-list" aria-label="演示行动安排"><p className="rb-sample-mark">负责人、期限为演示建议安排，非监管法定期限。</p>{actions.map(item => {const action = regulatoryDemoAction(item.record); return <article key={item.record.id}><span className="rb-action-kind">{regulatoryBuckets.find(bucket => bucket.id === item.bucket)!.label}</span><h4>{item.record.title}</h4><p>{item.next}</p><dl><div><dt>负责人</dt><dd>{action.owner}</dd></div><div><dt>建议安排</dt><dd>{action.due}</dd></div><div><dt>交付物</dt><dd>{action.deliverable}</dd></div></dl><button type="button" className="rb-source-link" onClick={() => openSource(item.record, "report")} aria-label={`清单依据：${item.record.id}`}><FileSearch size={15} aria-hidden="true"/>依据 {item.record.id} <ArrowRight size={14} aria-hidden="true"/></button></article>;})}</section>}
            {reviews.filter(item => item.bucket === "pending" || item.bucket === "excluded").map(item => <div key={item.record.id} className="rb-report-reason"><span>{regulatoryBuckets.find(bucket => bucket.id === item.bucket)!.label}</span><b>{item.record.title}</b><p>{item.reason}</p><button className="rb-back-note" type="button" onClick={() => openSource(item.record, "report")} aria-label={`清单依据：${item.record.id}`}>{item.record.id} · 原文 <ArrowRight size={14} aria-hidden="true"/></button></div>)}
            <button className="rb-primary" type="button" onClick={() => {setDeliveryResult(null); setView("delivery");}}><Mail size={17} aria-hidden="true"/>看看投递前的检查 <ArrowRight size={16} aria-hidden="true"/></button>
            <small>真实项目在全量审阅与校验通过后生成 HTML 风险报告；本页仅预览固定演示清单。</small>
          </div>}
          {view === "delivery" && <div className="rb-delivery">
            <button className="rb-back-note" type="button" onClick={() => setView("report")}><ArrowLeft size={15} aria-hidden="true"/>回到跟进清单</button>
            <p className="rb-sample-mark">本地模拟 · 没有真实收件地址</p>
            <div className="rb-channels" role="group" aria-label="选择演示投递渠道"><button type="button" aria-pressed={channel === "message"} onClick={() => {setChannel("message"); setDeliveryResult(null);}}><MessageSquare size={17} aria-hidden="true"/>工作群</button><button type="button" aria-pressed={channel === "mail"} onClick={() => {setChannel("mail"); setDeliveryResult(null);}}><Mail size={17} aria-hidden="true"/>邮件</button></div>
            <div className="rb-delivery-preview"><span>{channel === "message" ? "示例工作群 · 摘要预览" : "示例邮箱 · 正文预览"}</span><h3>{profile.name}的跟进清单</h3><p>监管要求 {counts.obligation} · 执法信号 {counts.signal}<br/>待核实 {counts.pending} · 不适用 {counts.excluded}</p><small>附：演示 HTML 清单（页内预览）</small></div>
            {!actions.length && <p className="rb-delivery-blocked" role="status"><HelpCircle size={19} aria-hidden="true"/>{selectedFinding.bucket === "pending" ? "条件待核实，先补证；不走正式投递。" : "这条不适用，先留档。"}</p>}
            <button className="rb-primary" type="button" disabled={!actions.length} onClick={simulateDelivery}><ShieldCheck size={17} aria-hidden="true"/>模拟投递（不发送）</button>
            {deliveryResult && <p className="rb-delivery-result" data-result={deliveryResult} role="status">{deliveryResult === "duplicate" ? "模拟防重拦截：同一报告与示例目标已有本地演示回执。" : "模拟检查通过，已记录本地演示回执。没有实际发送。"}</p>}
            <small>再点一次可体验重复拦截。真实投递还需报告校验、固定目标和安全认证。</small>
          </div>}
        </div>}
      </dialog>
    </section>
    <div className="rb-more"><ProjectDisclosure title="这个 Skill 做什么" caption="简要介绍"><div className="rb-method"><p>从本次确认的采集任务读取全量监管通知与处罚信息，保留来源快照，与企业画像逐项匹配。</p><p>区分直接监管要求、执法信号、待核实事项和不适用项。证据与报告校验通过后，生成 HTML 风险报告，列出行动、负责人、期限和交付物；按已确认渠道投递前再检查防重。</p></div></ProjectDisclosure><ProjectDisclosure title="观看项目演示" caption="视频"><DemoSlot title={project.title} demo={project.demo}/></ProjectDisclosure><ProjectDisclosure title="展开完整方法与证据" caption="按需展开"><dl className="project-mast-facts"><div><dt>任务入口</dt><dd>{project.mastFacts.input}</dd></div><div><dt>关键判断</dt><dd>{project.mastFacts.judgment}</dd></div><div><dt>交付结果</dt><dd>{project.mastFacts.output}</dd></div></dl>{project.caseStudy && <ProjectCaseStudyView caseStudy={project.caseStudy}/>}</ProjectDisclosure></div>
    <nav className="project-actions rb-exits" aria-label="金融监管项目链接"><a href={project.github} target="_blank" rel="noreferrer">查看 GitHub ↗</a><Link href="/work">回到工作室</Link></nav>
  </main>;
}

