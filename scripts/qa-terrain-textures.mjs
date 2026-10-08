import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const dir=process.env.QA_OUT||'qa/world/home-v6.6';
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
try{
  await page.goto('http://127.0.0.1:3010/');
  await page.waitForFunction(()=>window.islandReview?.getReady());
  await page.locator('#breeze').click();
  const result=await page.evaluate(async()=>{
    const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});
    const pieces=islandReview.pieces;
    const images=await Promise.all(pieces.map(b=>load('/world/v6-native-'+b.id+(['work','thoughts'].includes(b.id)?'-clean':'')+'.webp')));
    const bodies=pieces.map((b,i)=>({...b,rect:[0,0,images[i].naturalWidth,images[i].naturalHeight]}));
    const source=await load('/world/island-complete-v4.png');
    const canvas=document.createElement('canvas');
    canvas.style.cssText='position:fixed;left:-2000px;top:0';document.body.append(canvas);
    const renderer=await window.createTerrainRenderer(canvas,bodies,source,images),records=[];
    try{
      // Render real islands at source pixel density, then compare GPU output
      // with their clean native artwork. Old source overlays and downsampling
      // both fail this check, even if all layout/interaction tests still pass.
      for(const id of ['central','films','games']){
        const i=bodies.findIndex(b=>b.id===id),image=images[i],w=image.naturalWidth,h=image.naturalHeight;
        canvas.style.width=w+'px';canvas.style.height=h+'px';
        renderer.render(bodies[i].rect,1,bodies.map((_,n)=>n===i?[0,0]:[-10000,-10000]),0);
        const gl=canvas.getContext('webgl'),actual=new Uint8Array(w*h*4);
        gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,actual);
        const reference=document.createElement('canvas');reference.width=w;reference.height=h;
        const ctx=reference.getContext('2d');ctx.drawImage(image,0,0);
        const expected=ctx.getImageData(0,0,w,h).data;
        let colorError=0,samples=0,extraPixels=0,alphaError=0;
        for(let y=0;y<h;y++)for(let x=0;x<w;x++){
          const p=(y*w+x)*4,q=((h-1-y)*w+x)*4,a=expected[p+3];
          alphaError=Math.max(alphaError,Math.abs(actual[q+3]-a));
          if(a===0&&actual[q+3]>8)extraPixels++;
          if(a>240)for(let c=0;c<3;c++){colorError+=Math.abs(actual[q+c]-Math.round(expected[p+c]*a/255));samples++;}
        }
        records.push({id,sourcePixels:[w,h],meanColorError:colorError/samples,maxAlphaError:alphaError,extraPixels});
      }
      return{records,textures:renderer.getBounds(),dpr:devicePixelRatio};
    }finally{renderer.dispose();canvas.remove();}
  });
  await fs.writeFile(dir+'/texture-fidelity.json',JSON.stringify(result,null,2));
  for(const r of result.records){
    assert.equal(r.extraPixels,0,`${r.id}: no foreign silhouette fragments`);
    assert.ok(r.maxAlphaError<=4,`${r.id}: preserve native alpha (${r.maxAlphaError})`);
    assert.ok(r.meanColorError<1,`${r.id}: native detail (${r.meanColorError})`);
  }
  console.log(JSON.stringify(result.records));
}finally{await browser.close();}
