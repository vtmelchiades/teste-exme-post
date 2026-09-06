/* ================================================================
   EXME POST STUDIO — motor
   0 utilitários · 1-2 dados e acervo · 3 motor de cena + 13 layouts
   4 renderers (canvas + SVG) · 5 interface · 6 exportação · 7 ambiente · 8 boot
   ================================================================ */

/* ============ 0. UTILITÁRIOS ============ */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(arr,r)=>arr[Math.floor(r()*arr.length)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const escXml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const slugify=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,46);
const fmtBytes=n=>n>1048576?(n/1048576).toFixed(1)+' MB':(n/1024).toFixed(0)+' KB';
const nextFrame=()=>new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)));
const pt2=n=>Math.round(n*100)/100;
/* hex + alpha → rgba() (aceita já rgba/hsl) */
function hexA(c,a=1){
 if(c==null)return `rgba(255,255,255,${a})`;
 const s=String(c).trim();
 if(s.startsWith('rgb')){const n=s.match(/[\d.]+/g)||[255,255,255];return `rgba(${n[0]},${n[1]},${n[2]},${a})`}
 const h=s.replace('#','');const v=h.length===3?h.split('').map(x=>x+x).join(''):h;
 const r=parseInt(v.slice(0,2),16)||0,g=parseInt(v.slice(2,4),16)||0,b=parseInt(v.slice(4,6),16)||0;
 return `rgba(${r},${g},${b},${a})`;
}
function copyText(t,label){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject())
  .then(()=>toast((label||'Texto')+' copiado ✓'))
  .catch(()=>toast('Não consegui copiar — seleciona o texto à mão','!'));}
function toast(msg,mark){const t=document.createElement('div');t.className='toast'+(mark==='!'?' warn':'');
  t.innerHTML=`<span class="tk">${mark||'✓'}</span><span>${msg}</span>`;$('#toasts').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),340)},3600);}
const saveBlob=(blob,name)=>{try{saveAs(blob,name)}catch(e){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000)}};

/* ícones do estúdio (SVG inline, sem dependências) */
const ICONS={
 bolt:'M13 2 4 14h6l-1 8 9-12h-6z',
 sparkles:'M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9zM18.5 15l.9 2.2 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z',
 shuffle:'M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 3l4 4-4 4M18 13l4 4-4 4',
 package:'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10',
 building:'M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M14 10h4a2 2 0 0 1 2 2v9M7 8h4M7 12h4M7 16h4M3 21h18',
 users:'M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-2a4 4 0 0 0-3-3.9M15.5 3.1a4 4 0 0 1 0 7.8',
 gem:'M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l3 6 3-6M12 21l-3-12M12 21l3-12',
 card:'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM7 9h4v6H7zM14 10h4M14 14h4',
 pack:'M8 3h8l1 4H7zM7 7h10l1 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM9 12h6',
 grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
 hash:'M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16',
 quote:'M9 11c0-3 2-5 5-6v3c-1.5.5-2.5 1.5-2.5 3H14v6H9zM16 11c0-3 1.5-5 4-6v3c-1 .5-1.5 1.5-1.5 3H21v6h-5z',
 zap:'M13 2 4 14h6l-1 8 9-12h-6z',
 steps:'M6 20V10M12 20V4M18 20v-6M3 20h18',
 ticket:'M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2 2 2 0 0 0 0 4v4a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2 2 2 0 0 0 0-4zM12 7v2M12 11v2M12 15v2',
 list:'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
 layers:'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 17.5 12 22l9-4.5',
 type:'M4 6V4h16v2M12 4v16M9 20h6',
 chat:'M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zM9 9h6M9 12.5h4',
 moon:'M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10z',
 film:'M3 5h18v14H3zM3 9h3M3 15h3M18 9h3M18 15h3M8 5v14M16 5v14',
 book:'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13',
 check:'M20 6 9 17l-5-5',
 flag:'M5 21V4M5 4h11l-1.5 4L16 12H5',
 camera:'M20 8h-3l-1.5-2h-7L7 8H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
 download:'M12 4v11M7 11l5 5 5-5M5 20h14',
 upload:'M12 16V5M7 9l5-5 5 5M5 20h14',
 archive:'M4 5h16v4H4zM5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4',
 folder:'M4 6a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM12 11v5M9.5 13.5 12 16l2.5-2.5',
 vector:'M12 3 3 20h18zM12 3v17M6 12h12',
 copy:'M9 9h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM5 15H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1',
 x:'M6 6l12 12M18 6 6 18',
 close:'M6 6l12 12M18 6 6 18',
 play:'M7 4l13 8-13 8z',
 rotate:'M4 12a8 8 0 1 1 3 6.2M4 12V7M4 12h5',
 chevL:'M15 5l-7 7 7 7',
 chevR:'M9 5l7 7-7 7',
 search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4',
 pin:'M12 21v-7M8 4h8l-1 6 3 3H6l3-3z'
};
function iconSvg(name,size){
 const d=ICONS[name]||ICONS.bolt;
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${size<15?2:1.9}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
function paintIcons(){for(const i of document.querySelectorAll('i.ic:not([data-done])')){
  i.innerHTML=iconSvg(i.dataset.icon||'bolt',16);i.dataset.done='1';}}

/* ============ 3. MOTOR DE CENA ============ */
const mCan=typeof document!=='undefined'?document.createElement('canvas'):null;
const mCtx=mCan?mCan.getContext('2d'):null;
const FAMS={disp:'Unbounded',ui:'Outfit',mono:'JetBrains Mono',serif:'Instrument Serif'};
const fontStr=(f,w,s,it)=>`${it?'italic ':''}${w} ${s}px ${FAMS[f]||FAMS.ui}, sans-serif`;
const W_PAD=1.09; /* margem de segurança entre motores de texto (canvas ↔ SVG) */
function textW(t,f,w,s,ls=0){if(!mCtx)return String(t).length*s*.58;
  mCtx.font=fontStr(f,w,s);return (mCtx.measureText(String(t)).width+Math.max(0,String(t).length-1)*ls)*W_PAD}
function wrapLines(t,f,w,s,maxW,ls=0){
  const words=String(t).replace(/\n/g,' ⏎ ').split(/\s+/).filter(Boolean);const out=[];let cur='';
  for(const wd of words){const test=cur?cur+' '+wd:wd;
    if(textW(test,f,w,s,ls)>maxW&&cur){out.push(cur);cur=wd}else cur=test}
  if(cur)out.push(cur);return out.length?out:[''];}
function fitSize(t,f,w,maxW,start,min=26,ls=0){let s=start;
  while(s>min&&textW(t,f,w,s,ls)>maxW)s-=Math.max(1,Math.round(s/40));return s}
/* Escolhe o maior corpo cujo bloco caiba numa zona: garante que nada transborda. */
function fitBlock(text,opt){
 const{f='ui',w=500,maxW=600,maxH=200,min=14,start=48,lhF=1.18,ls=0,upper=false,hard=64}=opt;
 const raw=upper?String(text).toUpperCase():String(text);
 for(let s=start;s>=min;s-=Math.max(1,Math.round(s/26))){
  const lh=Math.round(s*lhF);const lines=wrapLines(raw,f,w,s,maxW,ls);
  if(lines.length*lh<=maxH&&lines.length<=hard)return{s,lh,lines,h:lines.length*lh,n:lines.length};
 }
 const s=min,lh=Math.round(s*lhF);let lines=wrapLines(raw,f,w,s,maxW,ls).slice(0,hard);
 if(lines.length===hard)lines=lines.map((l,i)=>i===hard-1?l.replace(/\s*\S*$/,'…'):l);
 return{s,lh,lines,h:lines.length*lh,n:lines.length};
}
/* Uma linha com tamanho auto: {s,text,h,lh,w} — para rótulos que nunca podem quebrar. */
function fit1(text,o={}){
 const{f='ui',w=500,maxW=600,start=28,min=13,lhF=1.3,ls=0,upper=false}=o;
 const raw=upper?String(text).toUpperCase():String(text);
 const s=fitSize(raw,f,w,maxW,start,min,ls);const lh=Math.round(s*lhF);
 return{s,text:raw,h:lh,lh,w:textW(raw,f,w,s,ls)};
}
function oneLine(t,opt){
 const{f='mono',w=700,maxW=600,start=20,min=9,ls=1.5,upper=true}=opt||{};
 let s=start;const raw=upper?String(t).toUpperCase():String(t);
 while(s>min&&textW(raw,f,w,s,ls)>maxW)s-=1;
 let lines=[raw];
 if(textW(raw,f,w,s,ls)>maxW){let k=raw.length;while(k>2&&textW(raw.slice(0,k)+'…',f,w,s,ls)>maxW)k--;lines=[raw.slice(0,k)+'…']}
 return{s,lines,text:lines[0],w:textW(lines[0],f,w,s,ls)};
}

/* --- nós --- */
function roundD(x,y,w,h,r){r=Math.min(r||0,Math.abs(w)/2,Math.abs(h)/2);
 if(r<1)return `M${pt2(x)} ${pt2(y)}H${pt2(x+w)}V${pt2(y+h)}H${pt2(x)}Z`;
 return `M${pt2(x+r)} ${pt2(y)}H${pt2(x+w-r)}A${pt2(r)} ${pt2(r)} 0 0 1 ${pt2(x+w)} ${pt2(y+r)}V${pt2(y+h-r)}A${pt2(r)} ${pt2(r)} 0 0 1 ${pt2(x+w-r)} ${pt2(y+h)}H${pt2(x+r)}A${pt2(r)} ${pt2(r)} 0 0 1 ${pt2(x)} ${pt2(y+h-r)}V${pt2(y+r)}A${pt2(r)} ${pt2(r)} 0 0 1 ${pt2(x+r)} ${pt2(y)}Z`}
function maskD(n){
 const x=n.x,y=n.y,w=n.w,h=n.h,rx=n.rx||0,m=n.mask||'rect';
 if(m==='rect'||m==null)return roundD(x,y,w,h,rx);
 if(m==='arch'){const r=w/2;return `M${pt2(x)} ${pt2(y+h)}V${pt2(y+r)}A${pt2(r)} ${pt2(r)} 0 0 1 ${pt2(x+w)} ${pt2(y+r)}V${pt2(y+h)}Z`}
 if(m==='circle'){const rw=w/2,rh=h/2,cy=y+rh;
  return `M${pt2(x)} ${pt2(cy)}A${pt2(rw)} ${pt2(rh)} 0 1 0 ${pt2(x+w)} ${pt2(cy)}A${pt2(rw)} ${pt2(rh)} 0 1 0 ${pt2(x)} ${pt2(cy)}Z`}
 if(m==='cut'){const k=Math.min(w,h)*.22;
  return `M${pt2(x+k)} ${pt2(y)}H${pt2(x+w)}V${pt2(y+h-k)}L${pt2(x+w-k)} ${pt2(y+h)}H${pt2(x)}V${pt2(y+k)}Z`}
 if(m==='wave'){const q=h*.16;
  return `M${pt2(x)} ${pt2(y)}H${pt2(x+w)}V${pt2(y+h-q)}Q${pt2(x+w*.75)} ${pt2(y+h+q*.5)} ${pt2(x+w*.5)} ${pt2(y+h)}T${pt2(x)} ${pt2(y+h-q)}Z`}
 return roundD(x,y,w,h,rx);
}
const N={
 g:(id,children,o={})=>Object.assign({t:'g',id,children},o),
 rect:o=>Object.assign({t:'rect',rx:0,op:1},o),
 circ:o=>Object.assign({t:'circ',op:1},o),
 line:o=>Object.assign({t:'line',sw:2,op:1},o),
 path:(d,o={})=>Object.assign({t:'path',d,op:1},o),
 poly:(pts,o={})=>Object.assign({t:'path',d:'M'+pts.map(p=>pt2(p[0])+' '+pt2(p[1])).join('L')+'Z',op:1},o),
 arcPath:(cx,cy,r,a0,a1,o={})=>{const p0=[cx+Math.cos(a0*Math.PI/180)*r,cy+Math.sin(a0*Math.PI/180)*r],
   p1=[cx+Math.cos(a1*Math.PI/180)*r,cy+Math.sin(a1*Math.PI/180)*r],large=(a1-a0)%360>180?1:0;
   return Object.assign({t:'path',d:`M${pt2(p0[0])} ${pt2(p0[1])}A${pt2(r)} ${pt2(r)} 0 ${large} 1 ${pt2(p1[0])} ${pt2(p1[1])}`,op:1},o)},
 img:o=>Object.assign({t:'img',rx:0,op:1,mask:'rect',pos:[.5,.5],zoom:1},o),
 dots:o=>Object.assign({t:'dots',op:1,gap:18,r:2.4},o),
 sweep:o=>Object.assign({t:'sweep',op:1,rx:0,sw2:.42},o),
 txt(o){const f=o.f||'ui',w=o.w||700,s=o.s;
  const raw=o.upper?String(o.text).toUpperCase():String(o.text);
  const lines=o.lines||(o.maxW?wrapLines(raw,f,w,s,o.maxW,o.ls||0):[raw]);
  return{t:'text',x:o.x,y:o.y,f,w,s,fill:o.fill,align:o.align||'left',ls:o.ls||0,
    lh:o.lh||Math.round(s*1.16),lines,op:o.op??1,st:o.st||null,it:o.it||false,gid:o.gid||null};}
};
/* --- cena --- */
function scene(post,fmt,t=0){
 const W=1080,H=fmt==='story'?1920:1350;
 const P=PALS[post.pal]||PALS.volt;const fx=SEG_FX[post.seg]||SEG_FX.cultura;
 const M=fmt==='story'?{side:88,left:88,right:88,top:214,bot:286}:{side:76,left:76,right:76,top:78,bot:78};
 const S={W,H,fmt,Y:fmt==='story',t,post,P,fx,M,defs:[],nodes:[],imgs:[],anims:[],uid:0,
  ink:P.ink,mut:P.mut,dim:P.dim,line:P.line,a1:P.a1,a2:P.a2,a3:P.a3};
 S.uidn=pre=>pre+(++S.uid);
 S.lin=o=>{const id='g'+(++S.uid);S.defs.push(Object.assign({t:'lin',id},o));return{grad:id}};
 S.rad=o=>{const id='g'+(++S.uid);S.defs.push(Object.assign({t:'rad',id},o));return{grad:id}};
 S.duo=(dark,light)=>{if(!dark||!light)return null;const id='du'+(++S.uid);S.defs.push({t:'duo',id,d:dark,l:light});return id};
 S.add=n=>{S.nodes.push(n);return n};
 S.clip=d=>{const id='cp'+(++S.uid);S.defs.push({t:'clip',id,d});return id};
 /* gradiente em ângulo (graus) */
 S.ang=(stops,deg=135,cx,cy,len)=>{const r=deg*Math.PI/180,L=len||Math.max(S.W,S.H);
  const px=cx==null?S.W/2:cx,py=cy==null?S.H/2:cy;
  return S.lin({x1:px-Math.cos(r)*L/2,y1:py-Math.sin(r)*L/2,x2:px+Math.cos(r)*L/2,y2:py+Math.sin(r)*L/2,stops})};
 S.vg=(stops,x0=0,y0=0,x1=0,y1=S.H)=>S.lin({x1:x0,y1:y0,x2:x1,y2:y1,stops});
 S.anim=(node,kind,o={})=>{const ph=((post.n||1)*.11)%1;S.anims.push(Object.assign({node,kind,ph},o));node._ph=ph;return node};
 return S;
}
const imgSrc=(post,key)=>key==='user'?(post.userImg||imgUrl(post.img)):imgUrl(key);
