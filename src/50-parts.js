/* ============ 3a. PEÇAS PARTILHADAS (arte) ============ */
/* Regra de ouro: nada de identificadores internos na arte — só marca, clube, época e mensagem. */
function addBg(S,o={}){
 const{W,H}=S;const{imgKey=null,imgOp=null,pos=null,zoom=1.05,glow=.17,grid=null,duo=true,grad=false,shade=.0}=o;
 S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.P.bg}));
 if(grad)S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.vg([[0,S.P.bg2],[.55,S.P.bg],[1,S.P.bg2]],0,0,0,H)}));
 if(grid)addGrid(S,grid);
 if(imgKey){
  const src=S.post.userImg||imgSrc(S.post,imgKey);S.imgs.push(src);
  const op=imgOp==null?S.P.photoOp:imgOp;
  const d=(duo===true)?S.P.photoDuo:null;
  S.add(N.img({src,x:0,y:0,w:W,h:H,op,pos:pos||[.5,.42],zoom,duo:S.duo(d&&d[0],d&&d[1])}));
 }
 if(glow)addGlow(S,{op:glow});
 if(shade)S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.vg([[0,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${shade})`]],0,H*.3,0,H)}));
 if(o.pitch)pitchLines(S,{cx:o.pitch.cx??W*.5,cy:o.pitch.cy??H*.74,r:o.pitch.r??W*.58,op:o.pitch.op??.13,rot:o.pitch.rot});
 if(o.halftone)addHalftone(S,{x:0,y:o.halftone.y||0,w:W,h:o.halftone.h||Math.round(H*.3),
  op:o.halftone.op==null?.3:o.halftone.op,gap:o.halftone.gap||22,r:o.halftone.r||2.6});
 if(o.tint)S.add(N.rect({x:0,y:0,w:W,h:H,fill:hexA(S.P.bg,o.tint)}));
 if(o.fade)S.add(N.rect({x:0,y:0,w:W,h:o.fade.to,fill:S.vg([[0,'rgba(0,0,0,0)'],[1,hexA(S.P.bg,o.fade.a==null?.8:o.fade.a)]],0,o.fade.from||0,0,o.fade.to)}));
 if(o.veil)S.add(N.rect({x:0,y:0,w:W,h:H,fill:hexA(S.P.bg,o.veil)}));
 if(o.overlay)S.add(N.rect({x:0,y:0,w:W,h:H,fill:o.overlay}));
 if(o.vig!==false)addVign(S);
 if(o.grain!==false)addGrain(S);
}
function addGlow(S,{cx,cy,r,op=.17}={}){
 const a1=S.P.mode==='l'?S.P.a2:S.P.a1;
 S.add(N.rect({x:0,y:0,w:S.W,h:S.H,fill:S.rad({cx:cx??S.W*.5,cy:cy??S.H*.32,r:r??S.W*1.05,
  stops:[[0,hexA(a1,op)],[.42,hexA(a1,op*.34)],[1,'rgba(0,0,0,0)']]})}));
}
function addGrid(S,{gap=90,op=.55,both=false}={}){
 const{W,H}=S,c=S.P.grid;
 for(let x=gap;x<W-1;x+=gap)S.add(N.line({x1:x,y1:0,x2:x,y2:H,stroke:c,sw:1.4,op}));
 if(both)for(let y=gap;y<H-1;y+=gap)S.add(N.line({x1:0,y1:y,x2:W,y2:y,stroke:c,sw:1.4,op}));
}
function addHalftone(S,{x,y,w,h,gap=22,r=3,fill,op=.42,dot='round'}={}){
 S.add(N.dots({x,y,w,h,gap,r,fill:fill||S.P.a1,op,dot}));
}
function addVign(S,op){
 const{W,H}=S;const o=op==null?S.fx.vig:op;
 if(o>0)S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.rad({cx:W*.5,cy:H*.46,r:Math.max(W,H)*.76,
  stops:[[0,'rgba(0,0,0,0)'],[.52,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${o})`]]})}));
 if(S.fx.warm)S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.rad({cx:W*.8,cy:H*.12,r:Math.max(W,H)*.72,
  stops:[[0,`rgba(255,182,86,${S.fx.warm})`],[1,'rgba(255,182,86,0)']]})}));
 if(S.fx.soft)S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.rad({cx:W*.5,cy:H*.5,r:Math.max(W,H)*.6,
  stops:[[0,`rgba(255,255,255,${S.fx.soft*.45})`],[1,'rgba(255,255,255,0)']]})}));
}
function addGrain(S,op){S.add({t:'noise',op:op==null?S.fx.grain:op})}

/* --- moldura de fotografia --- */
function photoBox(S,b={}){
 const{x,y,w,h,rx=22,mask='rect',op=1,tint=.06,zoom=b.zoom||1.06,border=b.border!==false,duo=b.duo===true}=b;
 const src=b.src||(S.post.userImg||imgSrc(S.post,S.post.img));
 S.imgs.push(src);
 const push=n=>b.into?b.into.push(n):S.add(n);
 const d=(duo===true)?S.P.photoDuo:null;
 push(N.img({src,x,y,w,h,rx,mask,op,pos:b.pos||[.5,.42],zoom,tint:tint&&hexA(S.P.bg,tint),
  duo:S.duo(d&&d[0],d&&d[1])}));
 if(border)push(N.path(maskD({x,y,w,h,rx,mask}),{stroke:b.stroke||S.P.line,sw:b.sw||2,fill:'none'}));
 if(b.fade)push(N.rect({x,y,w,h,rx,mask,fill:S.vg([[0,'rgba(0,0,0,0)'],[1,hexA(S.P.bg,.86)]],0,y,0,y+h),op:b.fade}));
 if(b.tick){const k=Math.min(w,h)*.1;
  const corners=[[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]];
  for(const [cx,cy,sx,sy] of corners){
   S.add(N.line({x1:cx+10*sx,y1:cy+10*sy,x2:cx+(10+k)*sx,y2:cy+10*sy,stroke:S.P.a1,sw:3,op:.9}));
   S.add(N.line({x1:cx+10*sx,y1:cy+10*sy,x2:cx+10*sx,y2:cy+(10+k)*sy,stroke:S.P.a1,sw:3,op:.9}));
  }}
 if(b.cap)push(N.txt({x:x+16,y:y+h-14,text:b.cap,f:'mono',w:600,s:12.5,fill:S.dim,ls:1.6}));
 return src;
}

/* --- pílulas, etiquetas e selos --- */
function pill(S,x,y,text,o={}){
 const{fg=S.P.a1,bg=hexA(S.P.a1,.1),bd=hexA(S.P.a1,.42),s=19,align='left',ls=1.6,pad=15,f='mono',weight=700}=o;
 const t=String(text);const est=oneLine(t,{f,w:weight,maxW:1e5,start:s,min:8,ls,upper:o.upper!==false});
 const h=o.h||(s+21),w=o.w||est.w+pad*2;
 const X=align==='center'?x-w/2:align==='right'?x-w:x;
 S.add(N.g('pill',[
  N.rect({x:X,y,w,h,rx:o.rx==null?h/2:o.rx,fill:bg,stroke:bd,sw:o.sw==null?1.4:o.sw}),
  N.txt({x:X+pad,y:y+h/2+s*.35,text:t,s,f,w:weight,fill:fg,ls,upper:o.upper!==false})
 ]));
 return w;
}
function tagRow(S,x,y,items,o={}){
 const{s=o.s||16,gap=o.gap??9,maxW=o.maxW??1e5,fg=o.fg||S.P.a1,bg=o.bg||'transparent',bd=o.bd||S.P.line,align=o.align||'left'}=o;
 const est=items.map(t=>({t,w:oneLine(t,{f:'mono',maxW,start:s,min:8,ls:1.4}).w+24,s:oneLine(t,{f:'mono',maxW,start:s,min:8,ls:1.4}).s}));
 const tot=est.reduce((a,b)=>a+b.w,0)+gap*(items.length-1);
 let X=align==='center'?x-tot/2:x;
 est.forEach(e=>{
  S.add(N.rect({x:X,y,w:e.w,h:s+19,rx:(s+19)/2,fill:bg,stroke:bd,sw:1.3}));
  S.add(N.txt({x:X+12,y:y+Math.round((s+19)/2)+5.5,text:e.t,f:'mono',w:700,s:e.s,fill:fg,ls:1.4}));
  X+=e.w+gap;});
 return tot;
}
function stampSeal(S,x,y,label='VERIFICADO',o={}){
 const s=o.s||15;const est=oneLine(label,{maxW:1e5,start:s,min:8});const w=est.w+62,h=44;
 const X=o.align==='right'?x-w:x;
 S.add(N.g('seal',[
  N.rect({x:X,y,w,h,rx:h/2,fill:o.fill||S.P.a1,shadow:{color:'rgba(0,0,0,.32)',blur:22,dy:6}}),
  N.path(`M${pt2(X+17)} ${pt2(y+h/2)} l7 8 l13 -15`,{stroke:o.ink||S.P.a1ink,sw:3.4,fill:'none'}),
  N.txt({x:X+44,y:y+h/2+5.5,text:label,f:'mono',w:800,s:15,fill:o.ink||S.P.a1ink,ls:2})
 ]));
 return w;
}

/* --- marca --- */
function exMark(S,x,y,size,o={}){
 const light=S.P.mode==='l';
 const fill=o.fill||(light?S.P.a1:S.ang([[0,S.P.a1],[1,S.P.a2]],135,x+size/2,y+size/2,size*1.4));
 S.add(N.rect({x,y,w:size,h:size,rx:size*.28,fill}));
 S.add(N.path(`M${pt2(x+size*.29)} ${pt2(y+size*.3)}h${pt2(size*.42)}M${pt2(x+size*.29)} ${pt2(y+size*.5)}h${pt2(size*.3)}M${pt2(x+size*.29)} ${pt2(y+size*.7)}h${pt2(size*.42)}`,
  {stroke:o.ink||(light?'#F7F4EC':'#07100A'),sw:size*.1,fill:'none'}));
}
function brandLock(S,x,y,o={}){
 const{size=42,align='left',variant='full',sub=true,note=null}=o;
 if(variant==='none')return{w:0};
 const nameW=textW('ExMe','disp',800,size*.58,.4);
 const urlTxt=(note||BRAND.url.toUpperCase());
 const subTxt=(sub?'EXCHANGE MADE EASY · ':'')+urlTxt;
 const totW=size+16+Math.max(nameW,textW(subTxt,'mono',600,size*.26,2));
 const X=align==='center'?x-totW/2:align==='right'?x-totW:x;
 exMark(S,X,y,size);
 const nx=X+size+16;
 S.add(N.txt({x:nx,y:y+size*.5,text:'ExMe',f:'disp',w:800,s:size*.58,fill:S.ink,ls:.4}));
 S.add(N.txt({x:nx,y:y+size*.5+22,text:subTxt,f:'mono',w:600,s:size*.26,fill:S.dim,ls:2}));
 return{w:totW,x:X};
}
/* assinatura de rodapé */
function signature(S,post,o={}){
 const{W,H,M}=S;if(o.variant==='none')return;
 const y=H-M.bot+(o.dy||0);
 if(o.variant==='corner'){brandLock(S,W-M.side,y,{size:32,align:'right',variant:'mini',note:'@exme.club',sub:false});
  if(o.note)S.add(N.txt({x:M.side,y:y+24,text:o.note,f:'mono',w:700,s:14,fill:S.dim,ls:2}));return}
 if(o.rule!==false)S.add(N.line({x1:M.side,y1:y-24,x2:W-M.side,y2:y-24,stroke:S.line,sw:1.5}));
 brandLock(S,M.side,y,{size:o.size||38});
 S.add(N.txt({x:W-M.side,y:y+14,text:o.right||'APP STORE & GOOGLE PLAY · EXME.CLUB',f:'mono',w:700,s:14,fill:S.P.a1,align:'right',ls:1.8}));
 if(o.sub!==false)S.add(N.txt({x:W-M.side,y:y+38,text:o.sub||'CROMOS · CADERNETAS · SAQUETAS · TROCAS',f:'mono',w:500,s:11,fill:S.dim,align:'right',ls:2.2}));
}
function sideRail(S,text,o={}){
 const{H}=S;const s=o.s||15;const y=o.y||H*.5;const x=o.x;
 S.add(N.g('rail',[N.txt({x,y,text,f:'mono',w:700,s,fill:o.fill||S.dim,ls:3.6})],
  {rotate:o.rot==null?-90:o.rot,px:x,py:y}));
}

/* --- emblema do clube --- */
function crest(S,x,y,r,club,o={}){
 const c=club||S.post.club;
 const d=`M${pt2(x)} ${pt2(y-r)}L${pt2(x+r*.86)} ${pt2(y-r*.48)}L${pt2(x+r*.86)} ${pt2(y+r*.36)}Q${pt2(x+r*.86)} ${pt2(y+r*.94)} ${pt2(x)} ${pt2(y+r*1.14)}Q${pt2(x-r*.86)} ${pt2(y+r*.94)} ${pt2(x-r*.86)} ${pt2(y+r*.36)}L${pt2(x-r*.86)} ${pt2(y-r*.48)}Z`;
 const cid=S.clip(d);
 const kids=[N.rect({x:x-r,y:y-r,w:r*2,h:r*2.3,fill:c.c2})];
 if(c.kit==='stripes'){for(let i=-3;i<=3;i++)kids.push(N.rect({x:x-r*.62+i*r*.36,y:y-r,w:r*.16,h:r*2.3,fill:c.c1}))}
 else if(c.kit==='halves')kids.push(N.rect({x:x-r,y:y-r,w:r,h:r*2.3,fill:c.c1}));
 else kids.push(N.path(`M${pt2(x-r)} ${pt2(y-r*.3)}L${pt2(x+r)} ${pt2(y+r*.66)}L${pt2(x+r)} ${pt2(y+r*1.3)}L${pt2(x-r)} ${pt2(y+r*1.3)}Z`,{fill:c.c1}));
 kids.push(N.txt({x,y:y+r*.32,text:c.ini,f:'disp',w:900,s:r*.5,fill:c.c1==='#F4F4F2'?c.c1:'#FFF',align:'center',op:.98,
  st:{color:hexA('#000000',.35),lw:2}}));
 S.add(N.g('crest',kids,{clip:cid}));
 if(o.rim!==false)S.add(N.path(d,{stroke:o.rim||S.P.line,sw:o.rimSw||2.2,fill:'none'}));
 return{d,cid};
}

/* --- campo, holofotes --- */
function pitchLines(S,{cx,cy,r,op=.1,rot=-14}={}){
 S.add(N.g('pitch',[
  N.circ({cx:0,cy:0,r,stroke:S.P.a1,sw:2.4,fill:'none',op}),
  N.line({x1:-r*2,y1:0,x2:r*2,y2:0,stroke:S.P.a1,sw:2.4,op:op*.8}),
  N.circ({cx:0,cy:0,r:r*.13,fill:S.P.a1,op:op}),
  N.rect({x:-r*.86,y:r*.6,w:r*1.72,h:r*.44,stroke:S.P.a1,sw:2,fill:'none',op:op*.66})
 ],{rotate:rot,px:cx,py:cy}));
}
function floodRays(S,{cx,cy,op=.14,n=9,spread=70}={}){
 const kids=[];for(let i=0;i<n;i++){
  const a=(spread/n)*i-spread/2-90,rad=a*Math.PI/180,L=S.H*1.6;
  kids.push(N.line({x1:0,y1:0,x2:Math.cos(rad)*L,y2:Math.sin(rad)*L,stroke:S.P.a2,sw:i%2?20:7,op:op*(i%2?.45:1)}));
 }
 S.add(N.g('rays',kids,{px:cx,py:cy}));
}

/* --- foil a brilhar (animado) --- */
function foilSweep(S,box,o={}){
 const{W}=S;const op=o.op==null?.5:o.op;
 const fill=S.lin({x1:box.x,y1:box.y,x2:box.x+box.w,y2:box.y+box.h,
  stops:[[0,'rgba(255,255,255,0)'],[.34,hexA('#FFFFFF',op*.22)],[.5,hexA('#FFFFFF',op)],[.66,hexA('#FFFFFF',op*.22)],[1,'rgba(255,255,255,0)']]});
 const n=N.rect({x:box.x,y:box.y,w:box.w,h:box.h,rx:o.rx??18,fill,op:o.boxOp==null?1:o.boxOp,gid:'sheen'});
 S.anim(n,'sweep',{box});
 S.add(n);
}
/* --- ticker a rolar --- */
function ticker(S,{y,words,s=23,fg,bg,rot=-7,op=1,h=null,x0=-320}={}){
 const{W}=S;const txt=String(words).replace(/\s+$/,'')+' · ';
 const unit=textW(txt,'mono',700,s,10)+0;
 const copies=Math.ceil((W+720)/unit)+1;const hh=h==null?s+30:h;
 const kids=[N.rect({x:x0,y:y-hh/2,w:W-x0*2,h:hh,fill:bg||'rgba(0,0,0,.2)'})];
 for(let i=-1;i<copies;i++){
  const n=N.txt({x:x0+i*unit,y:y+s*.36,text:txt,f:'mono',w:700,s,fill:fg||S.P.a1,ls:10,upper:true});
  n._mq=true;n._baseX=x0+i*unit;kids.push(n);
 }
 const g=N.g('mq',kids,{rotate:rot,px:W/2,py:y});
 g._mqg=true;g._unit=unit;S.anim(g,'marquee',{unit,x0});
 S.add(g);
}
/* --- bilhete --- */
function perfLine(S,{x,y,w,notch=20,bg}={}){
 S.add(N.line({x1:x+notch*1.6,y1:y,x2:x+w-notch*1.6,y2:y,stroke:S.P.line,sw:2,dash:[9,11]}));
 S.add(N.circ({cx:x,cy:y,r:notch*.7,fill:bg||S.P.bg}));
 S.add(N.circ({cx:x+w,cy:y,r:notch*.7,fill:bg||S.P.bg}));
}
function barcode(S,{x,y,w,h,op=.75}={}){
 const r=mulberry32(Math.round(x*7.3+y*13.7+w));let cx=x;const kids=[];
 while(cx<x+w-3){const bw=1+r()*3.6;
  if(r()>.3)kids.push(N.rect({x:cx,y,w:bw,h,fill:S.ink,op}));
  cx+=bw+1.3+r()*2.8}
 S.add(N.g('bar',kids));
}
function appBadges(S,x,y,o={}){
 const{align='left',scale=1}=o;
 const w=206*scale,h=56*scale,gap=11*scale,tot=w*2+gap;
 const X=align==='center'?x-w-gap/2:align==='right'?x-tot:x;
 const dark=S.P.mode==='l';
 [['DESCARREGA NA','App Store',true],['DISPONÍVEL NO','Google Play',false]].forEach(([up,name,filled],i)=>{
  const bx=X+i*(w+gap);
  const fg=filled?(dark?'#0F1712':'#F7F4EC'):(S.P.mode==='l'?'#0F1712':'#F7F4EC');
  S.add(N.g('badge',[
   N.rect({x:bx,y,w,h,rx:13*scale,fill:filled?fg:'transparent',stroke:fg,sw:1.6}),
   N.txt({x:bx+16*scale,y:y+h*.66,text:name,f:'ui',w:700,s:20*scale,fill:filled?(dark?'#F7F4EC':'#0B0E14'):fg}),
   N.txt({x:bx+16*scale,y:y+h*.31,text:up,f:'mono',w:600,s:10*scale,fill:filled?hexA(dark?'#F7F4EC':'#0B0E14',.72):S.dim,ls:1.3})
  ]));
 });
 return tot;
}
/* --- anel / barra de progresso --- */
function ring(S,{cx,cy,r,pct,s=13,label,sub,bold=true}={}){
 const a0=-90,a1=a0+360*clamp(pct,0,1);
 S.add(N.arcPath(cx,cy,r,a0,a0+359.9,{stroke:S.P.line,sw:s,fill:'none'}));
 S.add(N.arcPath(cx,cy,r,a0,a1,{stroke:S.P.a1,sw:s,fill:'none'}));
 S.add(N.txt({x:cx,y:cy+r*.24,text:label||Math.round(pct*100)+'%',f:'disp',w:900,s:r*.8,fill:S.ink,align:'center'}));
 if(sub)S.add(N.txt({x:cx,y:cy+r*.72+14,text:sub,f:'mono',w:700,s:10.5,fill:S.dim,align:'center',ls:1.6}));
}
function progressBar(S,x,y,w,h,pct,o={}){
 S.add(N.rect({x,y,w,h,rx:h/2,fill:o.bg||S.P.line}));
 S.add(N.rect({x,y,w:Math.max(h,clamp(pct,0,1)*w),h,rx:h/2,fill:o.fill||S.P.a1}));
 if(o.ticks)for(let i=1;i<o.ticks;i++)S.add(N.line({x1:x+w/o.ticks*i,y1:y-4,x2:x+w/o.ticks*i,y2:y+h+4,stroke:S.P.bg,sw:2,op:.5}));
}
function dataRow(S,x,y,items,o={}){
 const{gap=0,totalW=null,ks=12.5,vs=28,vfg=S.ink,rule=true}=o;
 const cols=items.length,cw=(o.w-(gap*(cols-1)))/cols;
 items.forEach(([k,v],i)=>{
  const cx=x+i*(cw+gap);
  if(i&&rule)S.add(N.line({x1:cx-gap/2,y1:y-2,x2:cx-gap/2,y2:y+o.h-14,stroke:S.P.line,sw:1.5}));
  S.add(N.txt({x:cx,y,text:k,f:'mono',w:700,s:ks,fill:S.dim,ls:2}));
  const vt=String(v);const s=fitSize(vt,'disp',o.vw||800,cw,o.big?vs+16:vs,16);
  S.add(N.txt({x:cx,y:y+(o.h*.62),text:vt,f:o.f||'disp',w:o.vw||800,s,fill:vfg}));
 });
}
/* --- moldura de jornal (paletas claras) --- */
function paperFrame(S,o={}){
 const{W,H}=S;const inset=o.inset??26;
 S.add(N.rect({x:inset,y:inset,w:W-inset*2,h:H-inset*2,rx:o.rx??8,fill:'none',stroke:hexA(S.ink,.2),sw:1.8}));
 if(o.masthead){
  S.add(N.line({x1:inset,y1:inset+86,x2:W-inset,y2:inset+86,stroke:hexA(S.ink,.2),sw:1.6}));
  S.add(N.txt({x:inset+22,y:inset+56,text:o.kicker||'EXME · CADERNETA OFICIAL',f:'mono',w:800,s:15,fill:S.ink,ls:2.8}));
  S.add(N.txt({x:W-inset-22,y:inset+56,text:o.right||'ÉPOCA 26/27',f:'mono',w:700,s:13,fill:S.dim,align:'right',ls:2}));
 }
 if(o.fold)S.add(N.path(`M${W-inset} ${inset}L${W-inset-42} ${inset}L${W-inset} ${inset+42}Z`,{fill:hexA(S.ink,.07)}));
 if(o.rules)for(let i=0;i<o.rules;i++)S.add(N.line({x1:inset+22,y1:H-inset-24-i*11,x2:W-inset-22,y2:H-inset-24-i*11,stroke:hexA(S.ink,.09),sw:1.2}));
}
/* --- coluna de fluxo vertical: garante que nada transborda do painel --- */
function stack(y,y1){return {y:y,y1:y1,
 get rest(){return Math.max(0,this.y1-this.y)},
 take(h,gap){const t=this.y;this.y+=Math.max(0,h)+(gap||0);return t},
 space(g){this.y+=g||0}}}
