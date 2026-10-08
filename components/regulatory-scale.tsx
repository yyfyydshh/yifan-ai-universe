"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, Building2, Check, FileSearch, HelpCircle, Scale, X } from "lucide-react";
import { cleanRegulatoryDemoBatch, regulatoryBatchFinding, regulatoryDemoProfiles, regulatoryMatchChecks, type BusinessAnswer, type RegulatoryDemoRecord } from "@/lib/regulatory-balance-demo";

const papers = cleanRegulatoryDemoBatch();
type Props = {
  business: BusinessAnswer; selected: RegulatoryDemoRecord; placed: boolean; cast: ReactNode;
  onPlace: (record: RegulatoryDemoRecord) => void; onProfile: (business: BusinessAnswer) => void;
  onSource: () => void; onAction: () => void;
};
type Drag = { record: RegulatoryDemoRecord; startX: number; startY: number; x: number; y: number; moving: boolean; over: boolean };

export function RegulatoryScale({ business, selected, placed, cast, onPlace, onProfile, onSource, onAction }: Props) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const target = useRef<HTMLButtonElement>(null);
  const profile = regulatoryDemoProfiles.find(item => item.business === business)!;
  const finding = regulatoryBatchFinding(business, selected);
  const checks = regulatoryMatchChecks(business, selected);
  const angle = !placed ? 0 : finding.bucket === "excluded" ? -10 : finding.bucket === "pending" ? -5 : 0;
  const radians = angle * Math.PI / 180;
  const anchor = { x: 240 - 150 * Math.cos(radians), y: 60 - 150 * Math.sin(radians) };
  const title = finding.bucket === "obligation" ? "条件对上了，继续核验" : finding.bucket === "signal" ? "同类业务，参考执法信号" : finding.bucket === "pending" ? "还不能下判断，先补证" : "条件没对上，这条不适用";
  const over = Boolean(drag?.over);
  const down = (event: PointerEvent<HTMLButtonElement>, record: RegulatoryDemoRecord) => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    dragRef.current = { record, startX:event.clientX, startY:event.clientY, x:event.clientX, y:event.clientY, moving:false, over:false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current; if (!current) return;
    const rect = target.current?.getBoundingClientRect();
    const over = Boolean(rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom);
    const next = { ...current, over, x:event.clientX, y:event.clientY, moving: current.moving || Math.hypot(event.clientX-current.startX,event.clientY-current.startY)>8 };
    dragRef.current = next; if (next.moving) setDrag(next);
  };
  const finish = (event: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (current?.moving) {
      suppressClick.current = true;
      const rect = target.current?.getBoundingClientRect();
      if (rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) onPlace(current.record);
    }
    dragRef.current = null; setDrag(null);
  };

  return <div className="rs-layout">
    <aside className="rs-left">
      <div className="rs-rack"><h3>拿一张消息试试</h3><p>拖到左盘，也可以直接点击。</p>
        <div className="rs-papers" role="group" aria-label="选择消息放上天平">{papers.map(item => <button key={item.id} type="button" className="rs-paper" aria-label={`放上天平：${item.label}`} aria-pressed={placed && selected.id === item.id} data-dragging={drag?.moving && drag.record.id === item.id} onPointerDown={event => down(event,item)} onPointerMove={move} onPointerUp={finish} onPointerCancel={() => {suppressClick.current=true; dragRef.current=null; setDrag(null);}} onClick={event => {if (event.detail > 0 && suppressClick.current) {suppressClick.current=false; return;} onPlace(item);}}><FileSearch size={23} aria-hidden="true"/><span><b>{item.label}</b><small>{item.status === "draft" ? "尚未生效" : item.status === "expired" ? "已经失效" : item.region === "乙" ? "地区乙的要求" : item.kind === "enforcement" ? "别家机构的案例" : "线上业务的要求"}</small></span><ArrowRight size={16} aria-hidden="true"/></button>)}</div>
        <small className="rs-dedupe">固定样本 · 6 条原始资料已去重为 5 条</small>
      </div>{cast}
    </aside>
    <div className="rs-work">
      <div className="rs-enterprise"><span><Building2 size={18} aria-hidden="true"/>右盘放哪家企业？</span><div role="group" aria-label="切换企业样本">{regulatoryDemoProfiles.map(item => <button key={item.business} type="button" aria-label={`切换企业样本：${item.label}`} aria-pressed={business===item.business} onClick={() => onProfile(item.business)}>{item.label}</button>)}</div></div>
      <div className="rs-instrument" data-angle={angle} data-state={placed ? finding.bucket : "idle"} aria-label="消息要求与企业条件的适用性天平">
        <svg className="rs-balance" viewBox="0 0 480 300" aria-hidden="true">
          <ellipse className="rs-ground" cx="240" cy="280" rx="193" ry="10"/>
          <path className="rs-wood" d="M227 70Q219 150 226 245H254Q261 150 253 70Z"/>
          <path className="rs-metal" d="M240 82V238"/>
          <path className="rs-wood" d="M192 250Q205 234 228 240H252Q275 234 288 250L301 269H179Z"/>
          <path className="rs-metal" d="M197 252H283"/>
          <g className="rs-beam" style={{transform:`rotate(${angle}deg)`}}>
            <path className="rs-wood" d="M79 55Q151 45 240 53Q329 45 401 55L399 67Q328 59 240 64Q152 59 81 67Z"/>
            {[90,390].map((x,index) => <g key={x} transform={`translate(${x} 60)`}><g className="rs-pan" style={{transform:`rotate(${-angle}deg)`}}>
              <path className="rs-chains" d="M0 0L-58 142M0 0L58 142"/>
              {index===0 ? <g className="rs-load" data-placed={placed}><rect className="rs-page" x="-52" y="62" width="104" height="77" rx="4"/><path className="rs-page-lines" d="M-23 79H23M-23 121H23M-23 130H8"/></g> : <g><path className="rs-building" d="M-30 138V74L0 60L30 74V138Z"/><path className="rs-windows" d="M-18 89H-9M9 89H18M-18 105H-9M9 105H18M-7 137V120H7V137"/>{checks.map((check,i) => <rect key={check.key} className="rs-weight" data-state={placed ? check.state : "idle"} x={-42+i*23} y="124" width="16" height="13" rx="2"/>)}</g>}
              <path className="rs-pan-bowl" d="M-66 142Q-55 171 0 174Q55 171 66 142Z"/>
              <path className="rs-pan-rim" d="M-66 142H66"/>
              <circle className="rs-hinge" r="5"/>
            </g></g>)}
          </g>
          <circle className="rs-pivot" cx="240" cy="60" r="13"/><circle className="rs-hinge" cx="240" cy="60" r="5"/>
        </svg>
        <button ref={target} type="button" className="rs-drop" data-over={over} aria-label="左盘：放入消息" style={{left:"5%",top:"36%",transform:`translate(${(anchor.x-90)/132*100}%,${(anchor.y-60)/128*100}%)`}} onClick={() => onPlace(selected)}><span>{placed ? selected.label : "放入消息"}</span></button>
      </div>
      <div className="rs-pan-labels"><span><FileSearch size={15} aria-hidden="true"/>{placed ? selected.title : "左盘 · 消息要求"}</span><span><Building2 size={15} aria-hidden="true"/>右盘 · {profile.name}</span></div>
      <p className="rs-business-fact">地区甲 · 持牌主体 · {profile.fact}</p>
      <div className="rs-checks" aria-label="四项适用条件">{checks.map(item => <div key={item.key} data-check={item.key} data-state={placed ? item.state : "idle"}><span>{!placed ? <Scale size={16} aria-hidden="true"/> : item.state === "match" ? <Check size={16} aria-hidden="true"/> : item.state === "missing" ? <HelpCircle size={16} aria-hidden="true"/> : <X size={16} aria-hidden="true"/>}{item.label}</span><small>{placed ? item.detail : "等待核对"}</small></div>)}</div>
      <div className="rs-result" role="status" data-state={placed ? finding.bucket : "idle"}><h3>{placed ? title : "这条消息，和企业有关吗？"}</h3><p>{placed ? finding.reason : "放入一张消息，看看四项条件能不能对上。"}</p></div>
      <div className="rs-actions"><button type="button" className="rb-source-link" disabled={!placed} onClick={onSource}><FileSearch size={16} aria-hidden="true"/>回看这条原文</button><button type="button" className="rb-primary" disabled={!placed} onClick={onAction}>看看下一步 <ArrowRight size={16} aria-hidden="true"/></button></div>
      <small className="rs-meaning">天平只表示适用条件能否对上，不表示风险高低或违法认定。</small>
    </div>
    {drag?.moving && <div className="rs-drag-paper" aria-hidden="true" style={{left:drag.x,top:drag.y}}><FileSearch size={24}/>{drag.record.label}</div>}
  </div>;
}
