"use client";

import { ArrowRight, BookOpenText, Check, CircleCheckBig, CircleX, FileCheck2, LockKeyhole, PenLine, RotateCcw, ShieldCheck, SquareStop, Undo2, UserRoundCheck } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { HumanizerCaseStudy } from "@/lib/site-data";
import { CaseStudyHeading, StageDepthPanel } from "./case-study-shared";

type EditPath = "allowed" | "blocked";

type EditExample = {
  label: string;
  intent: string;
  status: "allowed" | "blocked";
  originalLead: string;
  protectedText: string;
  originalTail: string;
  proposedLead: string;
  proposedProtected: string;
  proposedTail: string;
  reason: string;
};

type LockExample = {
  fragment: string;
  rule: string;
  explanation: string;
  allowed: EditExample;
  blocked: EditExample;
};

const lockExamples: Record<string, LockExample> = {
  people: {
    fragment: "她把伞留给了妹妹。",
    rule: "不新增人物动机，不改变关系与行为归因。",
    explanation: "这句同时交代两人的关系和行为归因；可以删掉重复解释，不能替换行为对象或补造动机。",
    allowed: { label: "删解释性回声", intent: "保留人物关系，只删重复判断", status: "allowed", originalLead: "雨敲着屋檐。", protectedText: "她把伞留给了妹妹。", originalTail: "她想让妹妹一个人先走。", proposedLead: "雨敲着屋檐。", proposedProtected: "她把伞留给了妹妹。", proposedTail: "", reason: "只移除了重复说明，人物关系、行为和留白仍由原稿决定。" },
    blocked: { label: "替换行为对象", intent: "把“妹妹”改成陌生人", status: "blocked", originalLead: "雨敲着屋檐。", protectedText: "她把伞留给了妹妹。", originalTail: "", proposedLead: "雨敲着屋檐。", proposedProtected: "她把伞递给了陌生人。", proposedTail: "", reason: "改写了人物关系和行为归因，即使句子更简洁也必须撤销。" },
  },
  voice: {
    fragment: "我在楼道里听见雨。",
    rule: "不切换人称、时态、信息权限或叙述距离。",
    explanation: "“我”决定读者只能接触叙述者当下知道的内容；润色可以收紧句子，不能把第一人称改成旁观者。",
    allowed: { label: "收紧重复感受", intent: "保留第一人称，只删解释", status: "allowed", originalLead: "", protectedText: "我在楼道里听见雨。我没有开灯。", originalTail: "我知道自己不想被谁看见。", proposedLead: "", proposedProtected: "我在楼道里听见雨。我没有开灯。", proposedTail: "", reason: "叙述人称、信息权限和读者距离保持不变，只移除了重复解释。" },
    blocked: { label: "切换叙述视角", intent: "把“我”改成“她”", status: "blocked", originalLead: "", protectedText: "我在楼道里听见雨。我没有开灯。", originalTail: "", proposedLead: "", proposedProtected: "她在楼道里听见雨。她没有开灯。", proposedTail: "", reason: "第一人称被改成旁观者叙述，读者获得信息的方式已经改变。" },
  },
  timeline: {
    fragment: "火车开走后，她才合上信。",
    rule: "不重排场景、事件与因果先后。",
    explanation: "事件先后承载叙事因果；可以压缩描述，不能把“火车开走后”调换成另一种发生顺序。",
    allowed: { label: "压缩时间描写", intent: "保留先后顺序，删去重复修饰", status: "allowed", originalLead: "", protectedText: "火车开走后，她才慢慢合上信。", originalTail: "那一刻，她终于明白自己错过了什么。", proposedLead: "", proposedProtected: "火车开走后，她才合上信。", proposedTail: "", reason: "火车先开走、人物后合信的顺序未变，只删除了重复解释和修饰。" },
    blocked: { label: "调换事件顺序", intent: "让人物先合信、火车后开走", status: "blocked", originalLead: "", protectedText: "火车开走后，她才合上信。", originalTail: "", proposedLead: "", proposedProtected: "她合上信后，火车才开走。", proposedTail: "", reason: "因果顺序被改写，人物动作的意义也随之改变，因此阻断。" },
  },
  dialogue: {
    fragment: "“别等我。”",
    rule: "不改写表层信息、潜台词与对话意图。",
    explanation: "对白不仅是字面内容，也包含人物当下的意图；可删除重复说明，不能替人物换一句更圆满的话。",
    allowed: { label: "删除对白后的解释", intent: "保留原句与潜台词", status: "allowed", originalLead: "", protectedText: "“别等我。”", originalTail: "她说完，意思是自己一定不会回来。", proposedLead: "", proposedProtected: "“别等我。”", proposedTail: "", reason: "用户指定对白完整保留，只删除了替人物解释潜台词的句子。" },
    blocked: { label: "改写关键对白", intent: "把拒绝改成承诺", status: "blocked", originalLead: "", protectedText: "“别等我。”", originalTail: "", proposedLead: "", proposedProtected: "“我会回来。”", proposedTail: "", reason: "对白的表层信息和人物意图均被替换，不能以润色名义通过。" },
  },
  image: {
    fragment: "窗台上的薄荷叶向里卷。",
    rule: "不新增象征解释，不替换核心物件与伏笔。",
    explanation: "意象可以保持含混，让读者自己感受；允许减去解释，不能改掉核心物件或替作者宣布象征含义。",
    allowed: { label: "删除象征解释", intent: "保留物件与意象，删去说明", status: "allowed", originalLead: "灯泡在雨里摇。", protectedText: "窗台上的薄荷叶向里卷。", originalTail: "这预示着她即将放弃旧日生活。", proposedLead: "灯泡在雨里摇。", proposedProtected: "窗台上的薄荷叶向里卷。", proposedTail: "", reason: "核心物件和意象仍在，只移除了替读者下结论的解释。" },
    blocked: { label: "替换核心意象", intent: "用霓虹灯替换薄荷叶", status: "blocked", originalLead: "灯泡在雨里摇。", protectedText: "窗台上的薄荷叶向里卷。", originalTail: "", proposedLead: "灯泡在雨里摇。", proposedProtected: "窗外的霓虹灯亮了起来。", proposedTail: "", reason: "核心物件与意象被换掉，可能抹去原稿伏笔和叙事回声。" },
  },
  emotion: {
    fragment: "他笑了一下，手却没有松开行李箱。",
    rule: "不抹平情绪累积、高潮和结尾余韵。",
    explanation: "情绪不只靠“开心、难过”这些词，也藏在动作的矛盾里；可以减少解释，不能替人物把复杂情绪说死。",
    allowed: { label: "减去情绪结论", intent: "保留矛盾动作与情绪张力", status: "allowed", originalLead: "", protectedText: "他笑了一下，手却没有松开行李箱。", originalTail: "他显然还没有准备好离开。", proposedLead: "", proposedProtected: "他笑了一下，手却没有松开行李箱。", proposedTail: "", reason: "动作中的犹豫和情绪张力被保留，只删去直白结论。" },
    blocked: { label: "替人物下情绪结论", intent: "把犹豫写成彻底释然", status: "blocked", originalLead: "", protectedText: "他笑了一下，手却没有松开行李箱。", originalTail: "", proposedLead: "", proposedProtected: "他终于释然地笑了，松开了行李箱。", proposedTail: "", reason: "改写了人物动作与情绪走向，把原有的矛盾和余味抹平。" },
  },
  ending: {
    fragment: "她把钥匙放回桌上，门没有再响。",
    rule: "不补结论，不替作者确定立场或结局。",
    explanation: "结尾可以保留停顿和不确定性；可收紧语言，不能补一句“答案”替作者盖章。",
    allowed: { label: "收紧结尾句子", intent: "保留停顿与开放余味", status: "allowed", originalLead: "", protectedText: "她把钥匙放回桌上，门没有再响。", originalTail: "故事到这里结束了，她做出了最正确的选择。", proposedLead: "", proposedProtected: "她把钥匙放回桌上，门没有再响。", proposedTail: "", reason: "开放结尾与人物立场保持原样，只删除了替作者作结的说明。" },
    blocked: { label: "补写结局答案", intent: "替人物确定最终立场", status: "blocked", originalLead: "", protectedText: "她把钥匙放回桌上，门没有再响。", originalTail: "", proposedLead: "", proposedProtected: "她把钥匙放回桌上，门没有再响。", proposedTail: "她终于明白，离开才是唯一答案。", reason: "新增句替作者确定了人物判断和结局立场，破坏原稿保留的余味。" },
  },
};

export function HumanizerVoiceChamber({ study }: { study: HumanizerCaseStudy }) {
  const [modeId, setModeId] = useState<"steady" | "single">("steady");
  const [activeStageIndex, setActiveStageIndex] = useState(2);
  const [lockId, setLockId] = useState("people");
  const [editPath, setEditPath] = useState<EditPath>("allowed");
  const [reviewerId, setReviewerId] = useState("style");
  const activeMode = study.modes.find(mode => mode.id === modeId) ?? study.modes[0];
  const activeStage = study.stages[activeStageIndex] ?? study.stages[0];
  const activeLock = study.locks.find(lock => lock.id === lockId) ?? study.locks[0];
  const activeLockExample = lockExamples[activeLock.id] ?? lockExamples.people;
  const activeEdit = activeLockExample[editPath];
  const reviewer = study.reviewers.find(item => item.id === reviewerId) ?? study.reviewers[0];
  const nextStage = study.stages[activeStageIndex + 1];

  const selectLock = (nextLockId: string) => {
    setLockId(nextLockId);
    setEditPath("allowed");
  };

  const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const next = (activeStageIndex + direction + study.stages.length) % study.stages.length;
    setActiveStageIndex(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-stage]")[next]?.focus();
  };

  return (
    <section id="case-study" className="case-study case-study--humanizer" aria-labelledby="case-study-title">
      <CaseStudyHeading eyebrow="VOICE CHAMBER / 作者声音保护舱" title={study.title} intro={study.intro} evidenceStatus={study.evidenceStatus} summary={study.summary} />

      <div className="humanizer-scope-gate" aria-label="适用范围">
        <div data-allowed><BookOpenText aria-hidden="true" /><p><span>SCOPE PASS / 允许进入</span><b>文学文本</b><small>小说、散文、叙事文学、文学化非虚构</small></p></div>
        <ArrowRight aria-hidden="true" />
        <div><SquareStop aria-hidden="true" /><p><span>SCOPE STOP / 直接停止</span><b>非文学文本</b><small>营销、职场、科普、学术与一般知识文本</small></p></div>
      </div>

      <div className="humanizer-mode-switch" role="group" aria-label="画像模式">
        {study.modes.map(mode => <button key={mode.id} type="button" aria-pressed={modeId === mode.id} onClick={() => setModeId(mode.id)}><UserRoundCheck aria-hidden="true" /><p><b>{mode.label}</b><small>{mode.note}</small></p></button>)}
        <div aria-live="polite"><span>ACTIVE MODE / 当前模式</span><b>{activeMode.label}</b><ul>{activeMode.requirements.map(item => <li key={item}>{item}</li>)}</ul></div>
      </div>

      <div className="case-workbench case-workbench--humanizer">
        <div className="humanizer-process-pair">
          <div className="humanizer-stage-map" role="list" aria-label="文学编辑保护流程" onKeyDown={onStageKeyDown}>
            <header><span>PROTECTION LOOP / 保护回路</span><p>点击阶段，查看它保护了什么，以及何时必须停止。</p></header>
            {study.stages.map((stage, index) => <div key={stage.id} role="listitem" data-active={activeStageIndex === index} data-passed={index < activeStageIndex}><button data-stage type="button" aria-pressed={activeStageIndex === index} onClick={() => setActiveStageIndex(index)} onFocus={() => setActiveStageIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.title}</b><small>{stage.short}</small></button>{index < study.stages.length - 1 ? <i aria-hidden="true" /> : null}</div>)}
            <p><RotateCcw aria-hidden="true" size={17} /><span>复核未通过时只返修证据片段，再回到完整性审计；最多三轮。</span></p>
          </div>

          <StageDepthPanel stage={activeStage} index={activeStageIndex} total={study.stages.length} nextStage={nextStage} onNext={() => setActiveStageIndex(index => Math.min(index + 1, study.stages.length - 1))} />
        </div>

        <section className="humanizer-mechanism" aria-labelledby="humanizer-mechanism-title">
          <header className="humanizer-mechanism-heading">
            <div><span>EDITING MECHANISM / 独立机制演示</span><h3 id="humanizer-mechanism-title">编辑保护机制</h3></div>
            <p>选择一种编辑提案，观察内容锁如何允许、阻断或要求返修；这里不模拟当前阶段正在实时运行。</p>
          </header>

          <div className="humanizer-main-stage">
            <section className="humanizer-lock-map">
              <header><div><LockKeyhole aria-hidden="true" size={21} /><span>CONTENT LOCK / 内容锁定地图</span></div><p aria-live="polite"><b>{activeLock.label}</b>{activeLock.protects}</p></header>
              <div role="group" aria-label="锁定内容">{study.locks.map(lock => <button key={lock.id} type="button" aria-pressed={lockId === lock.id} onClick={() => selectLock(lock.id)}><LockKeyhole aria-hidden="true" size={15} /><span>{lock.label}</span></button>)}</div>
              <aside className="humanizer-lock-inspector" aria-live="polite"><div><span>CURRENT PROTECTION / 当前保护</span><b>{activeLockExample.fragment}</b></div><p>{activeLockExample.rule}</p><small><strong>为什么锁定：</strong>{activeLockExample.explanation}</small></aside>
            </section>

            <section className="humanizer-diff" data-outcome={activeEdit.status}>
              <header><div><span>EDIT PROPOSAL / 编辑提案审阅台</span><p>抽象片段 · 非真实作者文本</p></div><p>当前围绕“{activeLock.label}”给出一组允许与阻断案例；点击上方锁定项可切换案例。</p></header>
              <div className="humanizer-proposals" role="group" aria-label="选择编辑提案">
                {(["allowed", "blocked"] as const).map(path => { const proposal = activeLockExample[path]; return <button key={path} type="button" aria-pressed={path === editPath} data-status={proposal.status} onClick={() => setEditPath(path)}><span>{proposal.status === "allowed" ? <CircleCheckBig /> : <CircleX />}</span><p><b>{proposal.label}</b><small>{proposal.intent}</small></p><i>{proposal.status === "allowed" ? "可审阅" : "触碰保护项"}</i></button>; })}
              </div>
              <div className="humanizer-diff-compare" aria-live="polite">
                <article><span>原稿</span><p>{activeEdit.originalLead}<mark data-lock>{activeEdit.protectedText}</mark>{activeEdit.originalTail ? <mark data-remove={activeEdit.status === "allowed"}>{activeEdit.originalTail}</mark> : null}</p></article>
                <ArrowRight aria-hidden="true" />
                <article><span>{activeEdit.status === "allowed" ? "允许修改稿" : "拟修改稿 · 未采用"}</span><p>{activeEdit.proposedLead}<mark data-lock data-conflict={activeEdit.status === "blocked"}>{activeEdit.proposedProtected}</mark>{activeEdit.proposedTail ? <mark data-edit data-conflict={activeEdit.status === "blocked"}>{activeEdit.proposedTail}</mark> : null}</p></article>
              </div>
              <div className="humanizer-verdict" data-status={activeEdit.status}>
                <span>{activeEdit.status === "allowed" ? <CircleCheckBig aria-hidden="true" /> : <Undo2 aria-hidden="true" />}</span>
                <p><small>MECHANISM VERDICT / 机制裁决</small><b>{activeEdit.status === "allowed" ? "允许进入完整性审计" : `已阻断：${activeLock.label}`}</b><em>{activeEdit.reason}</em></p>
              </div>
              <footer><ShieldCheck aria-hidden="true" size={17} /><span>允许：有证据、未触碰锁定项的最小改动</span><i /><LockKeyhole aria-hidden="true" size={17} /><span>禁止：改变叙事事实或作者立场</span></footer>
            </section>

            <section className="humanizer-reviewers">
              <header><span>FOUR-CORNER REVIEW / 四角独立复核</span><p aria-live="polite"><b>{reviewer.label}</b>{reviewer.focus}</p></header>
              <div>{study.reviewers.map(item => <button key={item.id} type="button" aria-pressed={reviewerId === item.id} onClick={() => setReviewerId(item.id)}><span>{item.id === "style" ? <PenLine /> : item.id === "language" ? <FileCheck2 /> : item.id === "integrity" ? <ShieldCheck /> : <BookOpenText />}</span><b>{item.label}</b><small>查看复核焦点</small></button>)}</div>
              <p><span>HEURISTIC GATE / 启发式风险门槛</span><b>≤ 20</b><small>不是 AI 比例；完整性失败仍然阻断。</small></p>
            </section>

            <section className="humanizer-deliverables">{study.deliverables.map((item, index) => <article key={item.label}>{index === 0 ? <PenLine /> : index === 1 ? <FileCheck2 /> : <Check />}<p><b>{item.label}</b><small>{item.detail}</small></p></article>)}</section>
          </div>
        </section>
      </div>
      <p className="case-boundary"><span>BOUNDARY / 边界</span>{study.boundary}</p>
    </section>
  );
}
