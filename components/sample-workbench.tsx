"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowRight, Check, FileText, FolderOpen, Laptop, RotateCcw, ScanLine, Sprout } from "lucide-react";
import { salesSample, tenderSample, tenderSampleResult, tenderSampleRows } from "@/lib/demo-samples";
import "./sample-workbench.css";

type SampleKind = "sales" | "tender";
type SalesTab = "profile" | "needs" | "actions";
type TenderTab = "fields" | "json";

function useSampleDrag(onDrop: () => void) {
  const sourceRef = useRef<HTMLButtonElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [overTarget, setOverTarget] = useState(false);
  const attachSource = useCallback((node: HTMLButtonElement | null) => { sourceRef.current = node; }, []);
  const attachTarget = useCallback((node: HTMLDivElement | null) => { targetRef.current = node; }, []);

  const clearGesture = useCallback(() => {
    const active = gesture.current;
    gesture.current = null;
    if (sourceRef.current) {
      sourceRef.current.style.transform = "";
      if (active && sourceRef.current.hasPointerCapture(active.pointerId)) {
        sourceRef.current.releasePointerCapture(active.pointerId);
      }
    }
    setDragging(false);
    setOverTarget(false);
  }, []);

  const cancel = useCallback(() => {
    if (!gesture.current) return;
    suppressClick.current = true;
    clearGesture();
  }, [clearGesture]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && gesture.current) {
        event.preventDefault();
        cancel();
      }
    };
    const onVisibility = () => { if (document.hidden) cancel(); };
    window.addEventListener("blur", cancel);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", cancel);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cancel]);

  const containsPointer = (x: number, y: number) => {
    const box = targetRef.current?.getBoundingClientRect();
    return Boolean(box && x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
  };

  return {
    attachSource, attachTarget, dragging, overTarget,
    sourceHandlers: {
      onPointerDown(event: PointerEvent<HTMLButtonElement>) {
        if (event.button !== 0 || !event.isPrimary) return;
        event.stopPropagation();
        suppressClick.current = false;
        gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event: PointerEvent<HTMLButtonElement>) {
        const active = gesture.current;
        if (!active || active.pointerId !== event.pointerId) return;
        event.stopPropagation();
        const x = event.clientX - active.x;
        const y = event.clientY - active.y;
        if (!active.moved && Math.hypot(x, y) < 6) return;
        if (!active.moved) {
          active.moved = true;
          setDragging(true);
        }
        event.preventDefault();
        event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
        setOverTarget(containsPointer(event.clientX, event.clientY));
      },
      onPointerUp(event: PointerEvent<HTMLButtonElement>) {
        const active = gesture.current;
        if (!active || active.pointerId !== event.pointerId) return;
        event.stopPropagation();
        const accepted = active.moved && containsPointer(event.clientX, event.clientY);
        suppressClick.current = active.moved;
        clearGesture();
        if (accepted) onDrop();
      },
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
      onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (event.key === "Enter" || event.key === " ") suppressClick.current = false;
      },
      onClick() {
        if (suppressClick.current) return;
        onDrop();
      },
    },
  };
}

function tabKeys<T extends string>(event: KeyboardEvent<HTMLButtonElement>, tabs: readonly T[], current: T, select: (value: T) => void) {
  const index = tabs.indexOf(current);
  const nextIndex = event.key === "ArrowRight" ? (index + 1) % tabs.length
    : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length
      : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
  if (nextIndex === null) return;
  event.preventDefault();
  select(tabs[nextIndex]);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
}

function SalesResults({ id, tab, setTab }: { id: string; tab: SalesTab; setTab: (tab: SalesTab) => void }) {
  const labels = { profile: "客户画像", needs: "需求判断", actions: "下一步" };
  const tabs = Object.keys(labels) as SalesTab[];
  return <>
    <div className="sample-tabs" role="tablist" aria-label="客户分析结果">
      {tabs.map(value => <button key={value} type="button" role="tab" id={`${id}-${value}`} aria-selected={tab === value}
        aria-controls={`${id}-sales-panel`} tabIndex={tab === value ? 0 : -1}
        onClick={() => setTab(value)} onKeyDown={event => tabKeys(event, tabs, tab, setTab)}>{labels[value]}</button>)}
    </div>
    <div className="sample-sales-results" role="tabpanel" id={`${id}-sales-panel`} aria-labelledby={`${id}-${tab}`} tabIndex={0}>
      {salesSample[tab].map(item => <article key={item.label}>
        <div><h4>{item.label}</h4><span className="sample-evidence-type" data-kind={item.kind}>
          {item.kind === "fact" ? "原文事实" : item.kind === "unknown" ? "尚未确认" : "推断 / 建议"}
        </span></div>
        <p>{item.value}</p><small>{item.evidence}</small>
      </article>)}
    </div>
  </>;
}

function TenderResults({ id, tab, setTab, ready }: { id: string; tab: TenderTab; setTab: (tab: TenderTab) => void; ready: boolean }) {
  const missingCount = tenderSampleRows.filter(row => !row.value).length;
  return <>
    <div className="sample-result-heading"><h3>结构化结果</h3><div className="sample-tabs" role="tablist" aria-label="公告结果格式">
      {(["fields", "json"] as const).map(value => <button key={value} type="button" role="tab" id={`${id}-${value}`} aria-selected={tab === value}
        aria-controls={`${id}-tender-panel`} tabIndex={tab === value ? 0 : -1}
        onClick={() => setTab(value)} onKeyDown={event => tabKeys(event, ["fields", "json"], tab, setTab)}>{value === "fields" ? "字段" : "JSON"}</button>)}
    </div></div>
    <div className="sample-tender-results" role="tabpanel" id={`${id}-tender-panel`} aria-labelledby={`${id}-${tab}`} tabIndex={0}>
      {!ready ? <div className="sample-empty"><ScanLine size={38} aria-hidden="true" /><p>将示例公告放到扫描区，或点击「开始字段提取」。</p><small>查看字段、原文依据与缺失项</small></div>
        : tab === "json" ? <pre className="sample-json"><code>{JSON.stringify(tenderSampleResult, null, 2)}</code></pre>
          : <><p className="sample-field-summary">29 个字段 · {29 - missingCount} 项有依据 · {missingCount} 项留空</p>
            <p className="sample-scroll-hint">在结果区上下滚动，可查看全部 29 个字段 ↓</p>
            <div className="sample-table-scroll" role="region" aria-label="29 字段列表" tabIndex={0}><table><caption className="sample-sr-only">演示公告的 29 个字段及原文依据</caption>
              <thead><tr><th scope="col">字段</th><th scope="col">结果与依据</th></tr></thead>
              <tbody>{tenderSampleRows.map(row => <tr key={row.field} data-missing={!row.value}>
                <th scope="row">{row.field}</th><td>{row.value ? <span>{row.value}</span> : <span className="sample-missing">留空</span>}<small>{row.evidence}</small></td>
              </tr>)}</tbody>
            </table></div></>}
    </div>
  </>;
}

export function SampleWorkbench({ kind }: { kind: SampleKind }) {
  const id = useId();
  const [ready, setReady] = useState(false);
  const [salesTab, setSalesTab] = useState<SalesTab>("profile");
  const [tenderTab, setTenderTab] = useState<TenderTab>("fields");
  const run = useCallback(() => setReady(true), []);
  const { attachSource, attachTarget, dragging, overTarget, sourceHandlers } = useSampleDrag(run);
  const isTender = kind === "tender";
  const sample = isTender ? tenderSample : salesSample;
  const action = isTender ? "开始字段提取" : "查看客户分析";
  const reset = () => { setReady(false); setSalesTab("profile"); setTenderTab("fields"); };

  return <section className="sample-workbench" data-kind={kind} data-ready={ready} aria-labelledby={`${id}-title`}>
    <header className="sample-workbench-heading"><div><Sprout aria-hidden="true" /><h2 id={`${id}-title`}>交互示例 · 使用演示样本</h2></div>
      <button className="sample-reset" type="button" onClick={reset} disabled={!ready}><RotateCcw size={17} aria-hidden="true" />重新开始</button>
    </header>
    <p className="sample-disclosure">以下资料完全虚构。结果为预设示例，不调用 AI 服务，也不会上传或保存资料。</p>
    <div className="sample-workbench-columns">
      <div className="sample-source">
        <h3>{isTender ? "原始公告" : "客户资料"}</h3>
        <div className="sample-source-text"><h4>{sample.title}</h4><ol>{sample.source.map(line => <li key={line}>{line}</li>)}</ol></div>
        <div className="sample-source-actions">
          <button type="button" ref={attachSource} className="sample-document" data-dragging={dragging}
            aria-label={isTender ? "载入示例公告" : "载入示例客户资料"} aria-describedby={`${id}-drag-hint`} {...sourceHandlers}>
            {isTender ? <FileText aria-hidden="true" /> : <FolderOpen aria-hidden="true" />}<span>{sample.fileName}</span>
          </button>
          <button type="button" className="sample-run" onClick={run}>{ready ? <Check size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}{action}</button>
        </div>
        <p className="sample-drag-hint" id={`${id}-drag-hint`}>点击文件或按钮即可体验；也可将文件拖到{isTender ? "扫描区" : "电脑区"}，按 Esc 取消。</p>
      </div>
      <div className="sample-output" ref={attachTarget} data-sample-drop data-over={overTarget} role="group" aria-label={isTender ? "扫描区" : "电脑区"}>
        <div className="sample-drop-label">{isTender ? <ScanLine size={17} aria-hidden="true" /> : <Laptop size={17} aria-hidden="true" />}<span>{isTender ? "扫描区" : "电脑区"}</span><span>{overTarget ? "松开文件，查看结果" : ready ? "样本已载入" : "可将示例文件拖到这里"}</span></div>
        {isTender ? <TenderResults id={id} tab={tenderTab} setTab={setTenderTab} ready={ready} /> : ready
          ? <SalesResults id={id} tab={salesTab} setTab={setSalesTab} />
          : <div className="sample-empty"><Laptop size={38} aria-hidden="true" /><p>将客户资料放到电脑区，或点击「查看客户分析」。</p><small>区分已知事实、需求判断和下一步建议</small></div>}
      </div>
    </div>
    <p className="sample-sr-only" role="status">{ready ? isTender ? "示例已载入，共 29 个字段，18 项留空。" : "示例已载入，可查看客户画像、需求判断和下一步。" : "等待载入演示样本。"}</p>
  </section>;
}
