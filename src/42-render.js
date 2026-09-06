/* ============ 4. RENDERIZADORES ============ */
/* --- imagens (com fallback determinístico para nunca haver arte partida) --- */
const _imgPromise=new Map(),_imgObj=new Map(),_dims=new Map();
const DEFAULT_DIM={w:1400,h:933};
function imgDims(src){return _dims.get(src)||DEFAULT_DIM}
function _bindImage(src,alt,onDone){
 const im=new Image();
 if(src&&!src.startsWith('data:')){try{im.crossOrigin='anonymous'}catch(e){}}
 let settled=false;
 im.onload=()=>{if(settled)return;settled=true;_imgObj.set(src,im);_dims.set(src,{w:im.naturalWidth||1400,h:im.naturalHeight||933});onDone(im)};
 im.onerror=()=>{
  if(alt&&!settled){settled=true;const b=_bindImage(alt,null,r=>onDone(r));return}
  if(!settled){settled=true;onDone(null)}
 };
 im.src=src;return im;
}
function loadImage(src){
 if(_imgPromise.has(src))return _imgPromise.get(src);
 const alt=src.includes('images.unsplash.com')?imgFallback((src.match(/photo-[0-9a-z]+-[0-9a-z]+/)||['x'])[0]):null;
 const p=new Promise(res=>_bindImage(src,alt,res));
 _imgPromise.set(src,p);return p;
}
const getImg=src=>_imgObj.get(src)||null;
async function preloadScene(S){await Promise.all([...new Set(S.imgs)].map(loadImage))}

/* --- recorte cover com ponto focal --- */
function coverRect(w,h,iw,ih,zoom,pos){
 const s=Math.max(w/(iw||1400),h/(ih||933))*(zoom||1);
 const dw=iw*s,dh=ih*s;
 const fx=clamp((pos&&pos[0]!=null)?pos[0]:.5,0,1),fy=clamp((pos&&pos[1]!=null)?pos[1]:.5,0,1);
 return{dx:(w-dw)*fx,dy:(h-dh)*fy,dw,dh};
}

/* --- ruído --- */
let _noiseTile=null;
function noiseTile(){
 if(_noiseTile)return _noiseTile;
 const c=document.createElement('canvas');c.width=c.height=150;
 const x=c.getContext('2d');const id=x.createImageData(150,150);const r=mulberry32(7);
 for(let i=0;i<id.data.length;i+=4){const v=Math.floor(r()*255);id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=34}
 x.putImageData(id,0,0);_noiseTile=c;return c;
}
function roundPath(ctx,x,y,w,h,r){r=Math.min(r||0,Math.abs(w)/2,Math.abs(h)/2);
 if(r<1){ctx.beginPath();ctx.rect(x,y,w,h);return}
 ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
 ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function clipNode(ctx,n){
 if(n.mask&&n.mask!=='rect'){ctx.clip(new Path2D(maskD(n)));return}
 roundPath(ctx,n.x,n.y,n.w,n.h,n.rx||0);ctx.clip();
}
function resolveFill(ctx,fill,S,gc){
 if(typeof fill==='string'||fill==null)return fill||'#fff';
 if(fill&&fill.grad){
  if(gc.has(fill.grad))return gc.get(fill.grad);
  const d=S.defs.find(x=>x.id===fill.grad);if(!d)return '#fff';
  let g;
  if(d.t==='lin')g=ctx.createLinearGradient(d.x1,d.y1,d.x2,d.y2);
  else g=ctx.createRadialGradient(d.cx,d.cy,0,d.cx,d.cy,d.r);
  (d.stops||[]).forEach(([o,c])=>g.addColorStop(o,c));
  gc.set(fill.grad,g);return g;
 }
 return '#fff';
}
/* --- canvas --- */
const _offPool=new Map();
function getOff(w,h){
 const key=w+'x'+h;let e=_offPool.get(key);
 if(!e){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*2));c.height=Math.max(1,Math.round(h*2));
  e={c,x:c.getContext('2d')};_offPool.set(key,e);if(_offPool.size>36)_offPool.clear()}
 return e;
}
function paintText(ctx,n,S,gc){
 ctx.font=fontStr(n.f,n.w,n.s,n.it);
 try{ctx.letterSpacing=(n.ls||0)+'px'}catch(e){}
 ctx.textAlign=n.align==='center'?'center':n.align==='right'?'right':'left';
 const fill=n.fill==null?null:resolveFill(ctx,n.fill,S,gc);
 let y=n.y;
 for(const ln of n.lines){
  if(n.st){ctx.strokeStyle=n.st.color;ctx.lineWidth=n.st.lw;ctx.lineJoin='round';ctx.strokeText(ln,n.x,y)}
  if(fill!==null){ctx.fillStyle=fill;ctx.fillText(ln,n.x,y)}
  y+=n.lh;
 }
 try{ctx.letterSpacing='0px'}catch(e){}
}
function paintImg(ctx,n,S){
 const im=getImg(n.src);const{x,y,w,h}=n;
 if(!im){
  /* nada de buracos: placeholder com riscas + glifos */
  ctx.save();clipNode(ctx,n);
  ctx.fillStyle=hexA(S.P.a1,.06);ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=hexA(S.P.a1,.16);ctx.lineWidth=1.2;
  for(let i=-h;i<w;i+=26){ctx.beginPath();ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);ctx.stroke()}
  ctx.restore();return;
 }
 const dm={w:im.naturalWidth||1400,h:im.naturalHeight||933};
 const rc=coverRect(w,h,dm.w,dm.h,n.zoom,n.pos);
 if(!n.duo&&!n.tint&&!n.filter&&!n.rx&&(!n.mask||n.mask==='rect')){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  ctx.drawImage(im,0,0,dm.w,dm.h,x+rc.dx,y+rc.dy,rc.dw,rc.dh);ctx.restore();return;
 }
 const off=getOff(w,h),o=off.x;
 o.save();o.setTransform(2,0,0,2,0,0);o.clearRect(0,0,w,h);
 o.save();
 if(n.mask&&n.mask!=='rect'){o.clip(new Path2D(maskD(n)))}else{roundPath(o,0,0,w,h,n.rx||0);o.clip()}
 o.filter='none';
 if(n.duo){
  const dk=S.defs.find(d=>d.id===n.duo);
  o.filter='grayscale(1) contrast(1.08) brightness(.98)';
  o.drawImage(im,0,0,dm.w,dm.h,rc.dx,rc.dy,rc.dw,rc.dh);
  o.filter='none';
  o.globalCompositeOperation='multiply';o.fillStyle=dk?dk.l:'#10E868';o.fillRect(0,0,w,h);
  o.globalCompositeOperation='lighten';o.fillStyle=dk?dk.d:'#080B11';o.fillRect(0,0,w,h);
  o.globalCompositeOperation='source-over';
 }else{
  if(n.filter)o.filter=n.filter;
  o.drawImage(im,0,0,dm.w,dm.h,rc.dx,rc.dy,rc.dw,rc.dh);
  o.filter='none';
  if(n.tint){o.fillStyle=n.tint;o.fillRect(0,0,w,h)}
 }
 o.restore();o.restore();
 ctx.drawImage(off.c,x,y,w,h);
}
function paintDots(ctx,n,S){
 ctx.save();
 if(n.mask&&n.mask!=='rect')ctx.clip(new Path2D(maskD(n)));
 ctx.globalAlpha*=n.op==null?1:n.op;
 ctx.fillStyle=typeof n.fill==='string'?n.fill:S.P.a1;
 const gap=n.gap||18,r=n.r||2.2;
 for(let yy=n.y+r;yy<=n.y+n.h;yy+=gap){
  const rowOff=(n.stagger===false)?0:(Math.round((yy-n.y)/gap)%2)*gap/2;
  for(let xx=n.x+r+rowOff;xx<=n.x+n.w;xx+=gap){
   if(n.dot==='square'){ctx.fillRect(xx-r,yy-r,r*2,r*2)}
   else{ctx.beginPath();ctx.arc(xx,yy,r,0,Math.PI*2);ctx.fill()}}
 }
 ctx.restore();
}
function paint(ctx,nodes,S,gc){
 for(const n of nodes){
  if(n.t==='g'){
   ctx.save();
   if(n.clip)ctx.clip(new Path2D(n.clip));
   if(n.rotate){const px=n.px||0,py=n.py||0;ctx.translate(px,py);ctx.rotate(n.rotate*Math.PI/180);ctx.translate(-px,-py)}
   if(n.x||n.y)ctx.translate(n.x||0,n.y||0);
   paint(ctx,n.children||[],S,gc);
   ctx.restore();continue;
  }
  const al=n.op==null?1:n.op;if(al<=0)continue;
  ctx.save();ctx.globalAlpha*=Math.min(1,Math.max(0,al));
  switch(n.t){
   case 'rect':{
    if(n.shadow){ctx.shadowColor=n.shadow.color;ctx.shadowBlur=n.shadow.blur;ctx.shadowOffsetY=n.shadow.dy||0;ctx.shadowOffsetX=n.shadow.dx||0}
    ctx.fillStyle=resolveFill(ctx,n.fill,S,gc);
    if(n.mask&&n.mask!=='rect'){const p=new Path2D(maskD(n));ctx.fill(p);ctx.shadowColor='transparent';
     if(n.stroke){ctx.strokeStyle=n.stroke;ctx.lineWidth=n.sw||1;ctx.stroke(p)}}
    else{
     roundPath(ctx,n.x,n.y,n.w,n.h,n.rx);ctx.fill();
     ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.shadowOffsetX=0;
     if(n.stroke){ctx.strokeStyle=n.stroke;ctx.lineWidth=n.sw||1;roundPath(ctx,n.x,n.y,n.w,n.h,n.rx);ctx.stroke()}
    }
    break}
   case 'circ':{
    if(n.shadow){ctx.shadowColor=n.shadow.color;ctx.shadowBlur=n.shadow.blur;ctx.shadowOffsetY=n.shadow.dy||0}
    ctx.fillStyle=resolveFill(ctx,n.fill,S,gc);
    ctx.beginPath();ctx.arc(n.cx,n.cy,n.r,0,Math.PI*2);ctx.fill();
    ctx.shadowColor='transparent';ctx.shadowBlur=0;
    if(n.stroke){ctx.strokeStyle=n.stroke;ctx.lineWidth=n.sw||1;ctx.beginPath();ctx.arc(n.cx,n.cy,n.r,0,Math.PI*2);ctx.stroke()}
    break}
   case 'line':{
    ctx.strokeStyle=resolveFill(ctx,n.stroke,S,gc);ctx.lineWidth=n.sw||2;ctx.lineCap=n.linecap||'round';
    if(n.dash){ctx.setLineDash(n.dash);if(n.dashOffset)ctx.lineDashOffset=n.dashOffset}
    ctx.beginPath();ctx.moveTo(n.x1,n.y1);ctx.lineTo(n.x2,n.y2);ctx.stroke();break}
   case 'path':{
    const p=new Path2D(n.d);
    if(n.fill){ctx.fillStyle=resolveFill(ctx,n.fill,S,gc);ctx.fill(p)}
    if(n.stroke){ctx.strokeStyle=n.stroke;ctx.lineWidth=n.sw||2;ctx.lineJoin='round';ctx.lineCap=n.linecap||'butt';ctx.stroke(p)}
    break}
   case 'text':paintText(ctx,n,S,gc);break;
   case 'img':paintImg(ctx,n,S);break;
   case 'dots':paintDots(ctx,n,S);break;
   case 'noise':{ctx.fillStyle=ctx.createPattern(noiseTile(),'repeat');ctx.fillRect(0,0,S.W,S.H);break}
  }
  ctx.restore();
 }
}
function drawScene(canvas,S,scale=1){
 const w=Math.max(2,Math.round(S.W*scale)),h=Math.max(2,Math.round(S.H*scale));
 if(canvas.width!==w)canvas.width=w;
 if(canvas.height!==h)canvas.height=h;
 const ctx=canvas.getContext('2d');
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.scale(scale,scale);
 try{paint(ctx,S.nodes,S,new Map())}catch(e){if(typeof console!=='undefined')console.error('drawScene',e)}
 ctx.restore();
}
/* --- animação (stories/reels e pré-visualização) --- */
function tickAnim(S,t){
 for(const a of S.anims){
  const n=a.node;
  if(a.kind==='marquee'){
   if(S.static)continue;
   const unit=a.unit||1,dir=a.dir||1,off=(((t*(a.speed||.34)+n._ph)%1)+1)%1*unit*dir;
   for(const ch of (n.children||[]))if(ch._mq)ch.x=ch._baseX+off;
  }else if(a.kind==='sweep'&&n.fill&&n.fill.grad){
   const d=S.defs.find(x=>x.id===n.fill.grad);if(!d)continue;
   const b=a.box,p=(((t*(a.speed||.5)+(a.ph||0))%1)+1)%1;
   const from=b.x-b.w*.8,to=b.x+b.w*1.8,cur=from+(to-from)*p;
   d.x1=cur-b.w*.5;d.x2=cur+b.w*.5;d.y1=b.y;d.y2=b.y+b.h;
  }else if(a.kind==='pulse'){
   const p=(Math.sin((t*(a.speed||1)+(a.ph||0))*Math.PI*2)+1)/2;
   n.op=(a.min==null?.35:a.min)+p*((a.max==null?1:a.max)-(a.min==null?.35:a.min));
  }else if(a.kind==='blink'){
   const p=((t*(a.speed||2)+(a.ph||0))%1);n.op=p<.55?1:.12;
  }else if(a.kind==='drift'){
   n.x=(a.baseX||0)+Math.sin((t*(a.speed||.5)+(a.ph||0))*Math.PI*2)*(a.amp||10);
   n.y=(a.baseY||0)-t*(a.rise||0)*100;
  }
 }
}
/* ============ 4b. SVG semântico (grupos + <text> editáveis no Illustrator) ============ */
function hexChan(hex){
 const h=String(hex).replace('#','');const v=h.length===3?h.split('').map(c=>c+c).join(''):h;
 return [parseInt(v.slice(0,2),16)||0,parseInt(v.slice(2,4),16)||0,parseInt(v.slice(4,6),16)||0].map(x=>x.toFixed(3));
}
const _duCache=new Map();
async function dataUrl(src){
 if(src.startsWith('data:'))return src;
 if(_duCache.has(src))return _duCache.get(src);
 try{
  const b=await(await fetch(src,{mode:'cors'})).blob();
  const d=await new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=()=>res('');fr.readAsDataURL(b)});
  _duCache.set(src,d);return d;
 }catch(e){_duCache.set(src,'');return ''}
}
function svgFill(f){return typeof f==='string'?f:(f&&f.grad?`url(#${f.grad})`:'none')}
function svgFont(n){const fam=FAMS[n.f]||FAMS.ui;return `font-family="${fam}, sans-serif" font-size="${pt2(n.s)}" font-weight="${n.w}"${n.it?' font-style="italic"':''}`}
function svgText(n){
 const anchor=n.align==='center'?'middle':n.align==='right'?'end':'start';
 const st=n.st?` stroke="${n.st.color}" stroke-width="${pt2(n.st.lw)}" stroke-linejoin="round" paint-order="stroke"`:'';
 const fill=n.fill==null?'none':svgFill(n.fill);
 let y=n.y,s='';
 for(const ln of n.lines){
  s+=`<text x="${pt2(n.x)}" y="${pt2(y)}" ${svgFont(n)} letter-spacing="${pt2(n.ls||0)}" fill="${fill}"${st} text-anchor="${anchor}" xml:space="preserve">${escXml(ln)}</text>`;
  y+=n.lh;
 }
 return n.gid?`<g id="${n.gid}">${s}</g>`:s;
}
async function svgImg(n,idc){
 const href=await dataUrl(n.src);
 const{x,y,w,h}=n;
 const clipId='c'+(++idc.n);
 idc.defs.push(`<clipPath id="${clipId}"><path d="${maskD(n)}"/></clipPath>`);
 const al=(n.op==null||n.op===1)?'':` opacity="${pt2(n.op)}"`;
 if(!href)return `<g clip-path="url(#${clipId})"${al}><rect x="${pt2(x)}" y="${pt2(y)}" width="${pt2(w)}" height="${pt2(h)}" fill="${hexA(n.duo?'#10E676':'#00E676',.07)}"/></g>`;
 const dm=await imgSize(href,n.src);
 const rc=coverRect(w,h,dm.w,dm.h,n.zoom,n.pos);
 const flt=n.duo?` filter="url(#${n.duo})"`:'';
 return `<g clip-path="url(#${clipId})"${flt}${al}><image href="${href}" xlink:href="${href}" x="${pt2(x+rc.dx)}" y="${pt2(y+rc.dy)}" width="${pt2(rc.dw)}" height="${pt2(rc.dh)}" preserveAspectRatio="none"/></g>`;
}
const _szCache=new Map();
async function imgSize(href,src){
 if(_szCache.has(src))return _szCache.get(src);
 let d=getImg(src)?{w:getImg(src).naturalWidth,h:getImg(src).naturalHeight}:null;
 if(!d||!d.w)d=await new Promise(res=>{if(typeof Image==='undefined')return res(null);
  const im=new Image();im.onload=()=>res({w:im.naturalWidth,h:im.naturalHeight});im.onerror=()=>res(null);im.src=href});
 const out=d&&d.w?d:{w:1400,h:933};_szCache.set(src,out);return out;
}
function svgDots(n,idc){
 const pid='p'+(++idc.n);
 const fill=typeof n.fill==='string'?n.fill:'#00E676';
 const gap=pt2(n.gap||18),r=pt2(n.r||2.2);
 idc.defs.push(`<pattern id="${pid}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">`+
  (n.dot==='square'?`<rect x="0" y="0" width="${r*2}" height="${r*2}" fill="${fill}"/>`:`<circle cx="${r}" cy="${r}" r="${r}" fill="${fill}"/>`)+`</pattern>`);
 return `<rect x="${pt2(n.x)}" y="${pt2(n.y)}" width="${pt2(n.w)}" height="${pt2(n.h)}" fill="url(#${pid})"/>`;
}
async function svgString(S){
 const idc={n:0,defs:[]};
 const walk=async(nodes)=>{let s='';for(const n of nodes)s+=await svgNode(n,S,idc,walk);return s};
 const content=await walk(S.nodes);
 const gdefs=S.defs.map(d=>{
  if(d.t==='lin')return `<linearGradient id="${d.id}" gradientUnits="userSpaceOnUse" x1="${pt2(d.x1)}" y1="${pt2(d.y1)}" x2="${pt2(d.x2)}" y2="${pt2(d.y2)}">`+
   (d.stops||[]).map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')+`</linearGradient>`;
  if(d.t==='rad')return `<radialGradient id="${d.id}" gradientUnits="userSpaceOnUse" cx="${pt2(d.cx)}" cy="${pt2(d.cy)}" r="${pt2(d.r)}">`+
   (d.stops||[]).map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')+`</radialGradient>`;
  if(d.t==='clip')return `<clipPath id="${d.id}"><path d="${d.d}"/></clipPath>`;
  if(d.t==='duo'){const[dr,dg,db]=hexChan(d.d),[lr,lg,lb]=hexChan(d.l);
   return `<filter id="${d.id}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>`+
    `<feFuncR type="table" tableValues="${dr} ${lr}"/><feFuncG type="table" tableValues="${dg} ${lg}"/><feFuncB type="table" tableValues="${db} ${lb}"/>`+
    `</feComponentTransfer></filter>`}
  return '';}).filter(Boolean).join('');
 const gf="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700;800;900&amp;family=Outfit:wght@300;400;500;600;700;800;900&amp;family=JetBrains+Mono:wght@400;500;600;700;800&amp;family=Instrument+Serif:ital@0;1&amp;display=swap";
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${S.W}" height="${S.H}" viewBox="0 0 ${S.W} ${S.H}" role="img" aria-label="${escXml(S.post.alt||S.post.title)}"><defs><style>@import url('${gf}');</style>${gdefs}${idc.defs.join('')}<filter id="exnoise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/></filter></defs>${content}</svg>`;
}
async function svgNode(n,S,idc,walk){
 const al=(n.op==null||n.op===1)?'':` opacity="${pt2(n.op)}"`;
 switch(n.t){
  case 'g':{
   let tr='';
   if(n.x||n.y)tr+=` translate(${pt2(n.x||0)} ${pt2(n.y||0)})`;
   if(n.rotate)tr+=` rotate(${pt2(n.rotate)} ${pt2(n.px||0)} ${pt2(n.py||0)})`;
   const cp=n.clip?` clip-path="url(#${n.clip})"`:'';
   return `<g${n.id?` id="${n.id}"`:''}${tr?` transform="${tr.trim()}"`:''}${cp}${al}>${await walk(n.children||[])}</g>`}
  case 'rect':{
   const stroke=n.stroke?` stroke="${n.stroke}" stroke-width="${pt2(n.sw||1)}"`:'';
   if(n.mask&&n.mask!=='rect')return `<path d="${maskD(n)}" fill="${svgFill(n.fill)}"${stroke}${al}/>`;
   return `<rect x="${pt2(n.x)}" y="${pt2(n.y)}" width="${pt2(n.w)}" height="${pt2(n.h)}" rx="${pt2(n.rx||0)}" fill="${svgFill(n.fill)}"${stroke}${al}/>`}
  case 'circ':return `<circle cx="${pt2(n.cx)}" cy="${pt2(n.cy)}" r="${pt2(n.r)}" fill="${svgFill(n.fill)}"${n.stroke?` stroke="${n.stroke}" stroke-width="${pt2(n.sw||1)}"`:''}${al}/>`;
  case 'line':return `<line x1="${pt2(n.x1)}" y1="${pt2(n.y1)}" x2="${pt2(n.x2)}" y2="${pt2(n.y2)}" stroke="${typeof n.stroke==='string'?n.stroke:'#fff'}" stroke-width="${pt2(n.sw||2)}" stroke-linecap="${n.linecap||'round'}"${n.dash?` stroke-dasharray="${n.dash.join(' ')}"`:''}${al}/>`;
  case 'path':return `<path d="${n.d}" fill="${n.fill?svgFill(n.fill):'none'}"${n.stroke?` stroke="${n.stroke}" stroke-width="${pt2(n.sw||2)}" stroke-linecap="round" stroke-linejoin="round"`:''}${al}/>`;
  case 'text':return svgText(n);
  case 'img':return await svgImg(n,idc);
  case 'dots':return svgDots(n,idc);
  case 'noise':return `<rect width="${S.W}" height="${S.H}" filter="url(#exnoise)" opacity="${pt2(n.op??.05)}"/>`;
 }
 return '';
}
