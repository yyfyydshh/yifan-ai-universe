"use client";
import Image from "next/image";
import { Camera, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { publicPath } from "@/lib/site-config";
import { useWorldStore } from "@/lib/world-store";

export function WorldPostcard() {
  const theme=useWorldStore(s=>s.theme);
  const [taken,setTaken]=useState(false),[url,setUrl]=useState("");
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  const take=async()=>{
    setBusy(true);setError("");
    try {
      const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=900;
      const context=canvas.getContext("2d");if(!context)throw Error("canvas");
      const load=(name:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const img=new window.Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=publicPath(`/world/${name}.webp`);});
      const [sky,ground,person,cat]=await Promise.all([load(theme==="night"?"sky-night-v3":"sky-v3"),load("mobile-ground"),load("yifan-cartoon-v2"),load("cat-cartoon")]);
      context.drawImage(sky,0,0,1200,800);
      // The same 440×410 contact geometry as the responsive journey portrait.
      context.save();context.translate(200,60);context.scale(1.8,1.8);
      context.drawImage(ground,0,143,440,440*533/800);
      context.drawImage(person,55,0,290,290);context.drawImage(cat,260,170,125,125);
      context.restore();
      context.fillStyle="#fffdf5";context.fillRect(0,790,1200,110);context.fillStyle="#253c3b";context.font="32px sans-serif";context.textAlign="center";context.fillText("杨逸凡的世界 · 保持好奇，持续探索",600,855);
      setUrl(canvas.toDataURL("image/png"));setTaken(true);
    } catch {setError("这次没拍好，再按一次快门试试。");} finally {setBusy(false);}
  };
  return <div className="world-postcard"><p>把小岛上的片刻，拍成一张插画明信片。</p><div className={`postcard-scene ${taken?"is-developed":""}`}>
    {url?<Image src={url} width={1200} height={900} unoptimized alt="杨逸凡和小牛的插画明信片"/>:<div className="postcard-viewfinder" style={{backgroundImage:`url('${publicPath(`/world/${theme==="night"?"sky-night-v3":"sky-v3"}.webp`)}')`}}><div className="postcard-portrait"><Image className="postcard-ground" src={publicPath("/world/mobile-ground.webp")} width={800} height={533} alt="" unoptimized/><Image className="postcard-person" src={publicPath("/world/yifan-cartoon-v2.webp")} width={800} height={800} alt="杨逸凡" unoptimized/><Image className="postcard-cat" src={publicPath("/world/cat-cartoon.webp")} width={800} height={800} alt="小牛" unoptimized/></div><span className="viewfinder-corner" aria-hidden="true"/></div>}
    <span>{taken?"今日的小岛，收藏好了。":"取景完成，按一下快门。"}</span>
  </div><div className="dialog-actions"><button className="paper-button paper-button--primary" onClick={take} disabled={busy}>{taken?<RotateCcw size={18}/>:<Camera size={18}/>} {busy?"正在冲印…":taken?"重新拍一张":"按下快门"}</button>{url&&<a className="paper-button" href={url} download="杨逸凡的世界-插画明信片.png"><Download size={18}/>保存明信片</a>}</div><p className="world-status" role="status">{error||(taken?"已生成插画明信片，可保存到你的设备。":"小岛插画留念，在你的浏览器里完成。")}</p></div>;
}
