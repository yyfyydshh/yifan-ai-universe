/* Rigid, scroll-driven terrain handoff. World coordinates describe placement;
 * each independent island keeps its native texture pixels and clean alpha.
 * The complete source is used only for the assembled view, never as patches.
 */
window.createTerrainRenderer = async function(canvas, bodies, source, images,hitmask) {
  performance.mark('island-terrain-start');
  const W=1309,H=1201;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});
  if(!gl)throw new Error('WebGL unavailable');
  performance.mark('island-terrain-context');
  const polygons={
    central:[[0,0],[W,0],[W,H],[0,H]],
    writing:[[238,0],[678,0],[675,192],[625,273],[588,345],[510,349],[472,403],[414,407],[355,378],[335,312],[270,280],[224,260]],
    music:[[700,0],[1075,0],[1060,174],[1030,246],[1000,285],[980,352],[918,399],[832,394],[757,369],[710,292]],
    work:[[70,230],[220,208],[290,249],[367,286],[390,341],[388,413],[361,443],[388,472],[426,536],[376,641],[170,658],[89,542],[54,409]],
    games:[[1040,162],[1309,135],[1309,530],[1198,560],[1098,512],[1022,490],[981,434],[943,408],[957,339],[1007,280]],
    films:[[819,347],[914,333],[1006,380],[1047,429],[1060,493],[1016,550],[977,580],[884,588],[834,558],[799,530],[786,481],[792,419]],
    thoughts:[[0,530],[130,516],[233,514],[322,527],[389,583],[421,642],[463,684],[540,682],[635,713],[696,785],[675,H],[0,H]],
    stuff:[[1070,440],[1309,440],[1309,H],[877,H],[885,875],[907,753],[932,655],[950,598],[982,554],[998,500]]
  };
  // Alpha bounds of the fixed v6-native assets, with a two-pixel safety edge.
  // Avoid reading and scanning eight full-resolution canvases on every visit.
  const nativeCrops={
    central:[1536,1024,79,85,1489,945],writing:[1225,1284,108,24,1145,1243],
    music:[1309,1201,197,25,1158,1167],work:[1254,1254,182,32,1050,1215],
    games:[1211,1299,100,43,1171,1264],films:[1309,1201,273,46,1048,1133],
    thoughts:[1254,1254,66,56,1182,1166],stuff:[1254,1254,295,12,1028,1245]
  };
  function surface(w=W,h=H){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  // The thresholded alpha was prepared from the fixed illustration at build
  // time. A missing mask falls back to the original pixel read, not a broken
  // interaction surface.
  let originalAlpha=null;
  if(!hitmask||hitmask.length!==Math.ceil(W*H/8)){
    const original=surface(),o=original.getContext('2d',{willReadFrequently:true});
    o.drawImage(source,0,0,W,H);
    const pixels=o.getImageData(0,0,W,H).data;
    originalAlpha=new Uint8Array(W*H);
    for(let p=0;p<originalAlpha.length;p++)originalAlpha[p]=pixels[p*4+3];
  }
  const sourceVisible=p=>hitmask&&hitmask.length===Math.ceil(W*H/8)?Boolean(hitmask[p>>3]&(1<<(p&7))):originalAlpha[p]>40;
  const inside=(x,y,points)=>{
    let hit=false;
    for(let a=0,b=points.length-1;a<points.length;b=a++){
      const [ax,ay]=points[a],[bx,by]=points[b];
      if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)hit=!hit;
    }
    return hit;
  };
  const ownerAt=(x,y)=>{
    for(let i=bodies.length-1;i>=0;i--)if(inside(x+.5,y+.5,polygons[bodies[i].id]))return bodies[i].id;
    return null;
  };
  performance.mark('island-terrain-owners');
  function texture(input){
    const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
    // Filter premultiplied pixels so transparent margins cannot tint the edge.
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,input);return t;
  }
  function textureLevels(crop){
    const levels=[texture(crop)],full=surface(crop.width,crop.height);
    full.getContext('2d').putImageData(crop,0,0);
    // WebGL 1 cannot mipmap these non-power-of-two cutouts. Keep native
    // detail for close-ups and filtered levels for small/mobile islands.
    for(let divisor=2;Math.max(crop.width,crop.height)/divisor>=64;divisor*=2){
      const small=surface(Math.max(1,Math.round(crop.width/divisor)),Math.max(1,Math.round(crop.height/divisor))),ctx=small.getContext('2d');
      ctx.imageSmoothingQuality='high';ctx.drawImage(full,0,0,small.width,small.height);
      levels.push(texture(small));
    }
    return levels;
  }
  const resources=[];
  for(let index=0;index<bodies.length;index++){
    const body=bodies[index],image=images[index];
    const iw=image.naturalWidth,ih=image.naturalHeight;
    // Cropping at native size retains detail. Drawing onto the 1309px world
    // canvas first used to throw away most building pixels before zooming.
    const native=surface(iw,ih),ctx=native.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(image,0,0);
    const known=nativeCrops[body.id];
    let x0,y0,x1,y1;
    if(known&&known[0]===iw&&known[1]===ih){[, ,x0,y0,x1,y1]=known;}
    else{
      // Newly replaced art still works until its bounds are added above.
      const data=ctx.getImageData(0,0,iw,ih).data;
      x0=iw;y0=ih;x1=-1;y1=-1;
      for(let y=0;y<ih;y++)for(let x=0;x<iw;x++)if(data[(y*iw+x)*4+3]>2){
        x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
      }
      x0=Math.max(0,x0-2);y0=Math.max(0,y0-2);x1=Math.min(iw-1,x1+2);y1=Math.min(ih-1,y1+2);
    }
    if(x1<0)throw new Error('Empty island texture: '+body.id);
    const w=x1-x0+1,h=y1-y0+1,crop=ctx.getImageData(x0,y0,w,h);
    const alpha=new Uint8Array(w*h);
    for(let p=0;p<alpha.length;p++)alpha[p]=crop.data[p*4+3];
    const [x,y,worldWidth,worldHeight]=body.rect,sx=worldWidth/iw,sy=worldHeight/ih;
    resources.push({body,rect:[x+x0*sx,y+y0*sy,w*sx,h*sy],alpha,textureSize:[w,h],textures:textureLevels(crop)});
    await new Promise(resolve=>setTimeout(resolve,0));
  }
  performance.mark('island-terrain-textures');
  function shader(type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,`
    attribute vec2 a_position;varying vec2 v_uv;
    uniform vec4 u_rect,u_camera;uniform vec2 u_offset,u_viewport;
    void main(){v_uv=a_position;vec2 p=u_rect.xy+a_position*u_rect.zw+u_offset;
      float scale=min(u_viewport.x/u_camera.z,u_viewport.y/u_camera.w);
      vec2 px=(p-u_camera.xy)*scale+(u_viewport-u_camera.zw*scale)*.5;
      gl_Position=vec4(px.x/u_viewport.x*2.-1.,1.-px.y/u_viewport.y*2.,0.,1.);
    }`));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`
    precision highp float;varying vec2 v_uv;
    uniform sampler2D u_new,u_small;uniform float u_opacity,u_detailMix;
    void main(){
      vec4 b=mix(texture2D(u_new,v_uv),texture2D(u_small,v_uv),u_detailMix);gl_FragColor=b*u_opacity;
    }`));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),gl.STATIC_DRAW);
  const attribute=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
  const uniforms={};for(const name of ['rect','camera','offset','viewport','new','small','detailMix','opacity'])uniforms[name]=gl.getUniformLocation(program,'u_'+name);
  gl.uniform1i(uniforms.new,0);gl.uniform1i(uniforms.small,1);
  const originalTexture=texture(source),sceneTexture=gl.createTexture(),framebuffer=gl.createFramebuffer();
  gl.bindTexture(gl.TEXTURE_2D,sceneTexture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const composite=gl.createProgram();
  gl.attachShader(composite,shader(gl.VERTEX_SHADER,`
    attribute vec2 a_position;varying vec2 v_uv;
    void main(){v_uv=a_position;gl_Position=vec4(a_position.x*2.-1.,1.-a_position.y*2.,0.,1.);}`));
  gl.attachShader(composite,shader(gl.FRAGMENT_SHADER,`
    precision highp float;varying vec2 v_uv;
    uniform sampler2D u_source,u_scene;uniform vec4 u_camera;
    uniform vec2 u_viewport;uniform float u_morph,u_shared;
    void main(){
      float scale=min(u_viewport.x/u_camera.z,u_viewport.y/u_camera.w);
      vec2 world=(v_uv*u_viewport-(u_viewport-u_camera.zw*scale)*.5)/scale+u_camera.xy;
      vec2 sourceUv=(world-vec2(0.,u_shared))/vec2(1309.,1201.);
      vec4 a=texture2D(u_source,sourceUv);
      if(min(sourceUv.x,sourceUv.y)<0.||max(sourceUv.x,sourceUv.y)>1.)a=vec4(0.);
      vec4 b=texture2D(u_scene,vec2(v_uv.x,1.-v_uv.y));
      float frontier=u_morph*1400.-90.;
      float aa=3.5/scale;
      float edge=(world.y-u_shared)+48.*sin(world.x*.012)+22.*sin(world.x*.029);
      float t=smoothstep(-aa,aa,frontier-edge);
      if(u_morph<=0.)t=0.;
      if(u_morph>=1.)t=1.;
      gl_FragColor=mix(a,b,t);
    }`));
  gl.linkProgram(composite);
  if(!gl.getProgramParameter(composite,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(composite));
  const compositeUniforms={};
  for(const name of ['source','scene','camera','viewport','morph','shared'])compositeUniforms[name]=gl.getUniformLocation(composite,'u_'+name);
  gl.useProgram(composite);gl.uniform1i(compositeUniforms.source,0);gl.uniform1i(compositeUniforms.scene,1);
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  let lost=false,bufferWidth=0,bufferHeight=0;canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.dispatchEvent(new Event('terrainlost'));});
  const drawOrder=['writing','music','games','films','work','thoughts','central','stuff'];
  performance.mark('island-terrain-ready');
  performance.measure('island-terrain-context-init','island-terrain-start','island-terrain-context');
  performance.measure('island-terrain-hitmask','island-terrain-context','island-terrain-owners');
  performance.measure('island-terrain-texture-prep','island-terrain-owners','island-terrain-textures');
  performance.measure('island-terrain-shaders','island-terrain-textures','island-terrain-ready');
  let lastFrame=[];
  return {
    hitTest(x,y,morph,positions,shared){
      // Match the visible handoff and alpha silhouettes, including bare cliffs.
      // Rectangular sprite bounds must never turn the empty sky into a button.
      const edge=y-shared+48*Math.sin(x*.012)+22*Math.sin(x*.029);
      if(morph<=0||(morph<1&&edge>morph*1400-90)){
        const px=Math.floor(x),py=Math.floor(y-shared),p=py*W+px;
        return px>=0&&px<W&&py>=0&&py<H&&sourceVisible(p)?ownerAt(px,py):null;
      }
      for(let n=drawOrder.length-1;n>=0;n--){
        const i=bodies.findIndex(b=>b.id===drawOrder[n]),r=resources[i],[rx,ry,w,h]=r.rect,[dx,dy]=positions[i];
        const [tw,th]=r.textureSize;
        const px=Math.floor((x-rx-dx)/w*tw),py=Math.floor((y-ry-dy)/h*th);
        if(px>=0&&px<tw&&py>=0&&py<th&&r.alpha[py*tw+px]>40)return r.body.id;
      }
      return null;
    },
    render(camera,morph,positions,shared,selected=null,focus=0){
      if(lost)return;
      const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
      const width=Math.max(1,Math.round(box.width*dpr)),height=Math.max(1,Math.round(box.height*dpr));
      if(bufferWidth!==width||bufferHeight!==height){
        bufferWidth=width;bufferHeight=height;
        canvas.width=width;canvas.height=height;
        gl.bindTexture(gl.TEXTURE_2D,sceneTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,sceneTexture,0);
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Incomplete scene framebuffer');
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER,morph<1?framebuffer:null);gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
      gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4fv(uniforms.camera,camera);gl.uniform2f(uniforms.viewport,width,height);
      // Every destination stays behind the foreground meadow in close-up.
      const order=[...drawOrder];
      if(selected){order.splice(order.indexOf('central'),1);order.push('central');}
      lastFrame=[];
      order.forEach(id=>{
        const i=bodies.findIndex(b=>b.id===id),r=resources[i];
        const[x,y,w,h]=r.rect;
        const opacity=selected&&id!==selected&&id!=='central'?1-focus:1;
        // Small destinations need a real close-up. Taller waterfall terrain
        // is capped independently so its lower rocks remain in the frame.
        const targetScale=Math.max(1.12,Math.min(1.85,620/w,800/h));
        const zoom=id===selected?1+(targetScale-1)*focus:1;
        const rect=[x+w*(1-zoom)/2,y+h*(1-zoom)/2,w*zoom,h*zoom];
        lastFrame.push({id,rect,opacity});
        gl.uniform1f(uniforms.opacity,opacity);
        gl.uniform4fv(uniforms.rect,rect);gl.uniform2fv(uniforms.offset,positions[i]);
        const screenWidth=rect[2]*Math.min(width/camera[2],height/camera[3]);
        // Keep one extra level of detail: ink outlines should remain crisp
        // beside the DOM-rendered characters, rather than looking softened.
        const level=Math.max(0,Math.min(r.textures.length-1,Math.log2(r.textureSize[0]/screenWidth)-1)),lower=Math.floor(level);
        gl.uniform1f(uniforms.detailMix,level-lower);
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,r.textures[lower]);
        gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,r.textures[Math.min(lower+1,r.textures.length-1)]);
        gl.drawArrays(gl.TRIANGLES,0,6);
      });
      if(morph>=1)return;
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.useProgram(composite);gl.clear(gl.COLOR_BUFFER_BIT);
      const postAttribute=gl.getAttribLocation(composite,'a_position');
      gl.enableVertexAttribArray(postAttribute);gl.vertexAttribPointer(postAttribute,2,gl.FLOAT,false,0,0);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,originalTexture);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,sceneTexture);
      gl.uniform4fv(compositeUniforms.camera,camera);gl.uniform2f(compositeUniforms.viewport,width,height);
      gl.uniform1f(compositeUniforms.morph,morph);gl.uniform1f(compositeUniforms.shared,shared);
      gl.drawArrays(gl.TRIANGLES,0,6);
    },
    getBounds:()=>resources.map(r=>({id:r.body.id,rect:r.rect,textureSize:r.textureSize})),
    getFrame:()=>lastFrame,
    dispose(){resources.forEach(r=>r.textures.forEach(t=>gl.deleteTexture(t)));gl.deleteTexture(originalTexture);gl.deleteTexture(sceneTexture);gl.deleteFramebuffer(framebuffer);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteProgram(composite);}
  };
};
