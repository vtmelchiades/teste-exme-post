/* ============ 4. LAYOUTS DE ARTE (13) ============ */
/* Regras: nada sai da caixa; nenhuma etiqueta interna (id, pilar, arquétipo, segmento) aparece na arte. */
function zBox(S){const M=S.M;const top=S.fmt==='story'?246:M.top,bot=S.fmt==='story'?300:M.bot;
 return {x:M.left,y:top,w:S.W-M.left-M.right,h:S.H-top-bot,cx:S.W/2,cy:top+(S.H-top-bot)/2}}
function eyebrow(S,left,right,o={}){
 const P=S.P,y=o.y!=null?o.y:(S.fmt==='story'?244:80);
 if(o.label)pill(S,left,y,o.label,{s:13,h:30,pad:14,bg:hexA(P.a1,.12),bd:hexA(P.a1,.36),fg:P.a1,upper:true});
 if(right)S.add(N.txt({x:S.W-S.M.right-2,y:y+20,text:right,f:'mono',w:700,s:13,fill:S.dim,align:'right',ls:2,upper:true,gid:'meta'}));
 return y+46;
}
function headline(S,text,zone,o={}){
 const b=fitBlock(text,{f:o.f||'disp',w:o.w||900,maxW:zone.w,maxH:zone.h,min:o.min||40,start:o.start||168,lhF:o.lhF||.94,
  upper:o.upper!==false,ls:o.ls==null?-2.4:o.ls});
 const y=zone.y+(zone.h-b.h)*(o.anchor==='start'?0:o.anchor==='end'?1:.5);
 S.add(N.txt({x:o.align==='left'?zone.x:o.align==='right'?zone.x+zone.w:zone.x+zone.w/2,y:y+b.lh,lines:b.lines,f:b.f,w:b.w,s:b.s,
  fill:o.fill||'#fff',align:o.align||'center',lh:b.lh,ls:o.ls,upper:true,gid:'typography'}));
 return {h:b.h,y,b};
}
function insetPill(S,into,x,y,text,o={}){
 const P=S.P,s=o.s||13,tx=String(text).toUpperCase();
 const w=textW(tx,'mono',700,s,1.8)+26;
 const X=o.align==='end'?x-w:x;
 const push=n=>into?into.push(n):S.add(n);
 push(N.rect({x:X,y,w,h:26,rx:13,fill:o.bg||hexA(P.a1,.14),stroke:o.bd||'transparent',sw:1}));
 push(N.txt({x:X+13,y:y+18,text:tx,f:'mono',w:700,s,fill:o.fg||P.a1,ls:1.8,upper:true,gid:'branding'}));
 return w;
}

/* ---------- 1 · CROMO EM DESTAQUE ---------- */
function layHero(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{imgKey:Y?post.img:null,tint:.06,glow:.15,grid:{gap:110,op:.25,both:true}});
 const x=M.left,w=W-M.left-M.right;
 const top=eyebrow(S,x,post.season||'ÉPOCA 26/27',{label:(post.club.short+' · '+post.esc).toUpperCase(),y:M.top});
 const strapTxt=post.hero.line||post.t||'';
 const hookB=strapTxt?fitBlock(strapTxt,{f:'ui',w:600,maxW:w-40,maxH:Y?104:120,min:18,start:27,lhF:1.48,upper:true}):null;
 const hookH=hookB?hookB.h+30:0;
 const ch=Math.max(500,Math.min(w*1.34,H-top-40-hookH-(Y?300:M.bot+34)));
 const cw=Math.min(w,840),cx=(W-cw)/2,cy=top;
 const pad=Y?26:34;
 const nameB=fitBlock(post.player.name,{f:'disp',w:800,maxW:cw-pad*2,maxH:110,min:32,start:Math.round(cw*.1),lhF:1.02,ls:-2,upper:true});
 let hasStats=post.hero.stats&&post.hero.stats.length===3;
 let hasFoot=true;
 const rowsH=30+22+nameB.h+16+1+52+(hasStats?22+70:0)+20+14;
 const ph=Math.max(140,ch-pad*2-rowsH);
 const card=[],tilt=post.v%3===1?-2.1:post.v%3===2?1.5:0;
 card.push(N.rect({x:cx,y:cy,w:cw,h:ch,rx:30,fill:S.lin({x1:cx,y1:cy,x2:cx+cw,y2:cy+ch,stops:[[0,P.a2],[.42,P.a3],[1,P.a1]]}),op:.96}));
 card.push(N.rect({x:cx+8,y:cy+8,w:cw-16,h:ch-16,rx:24,fill:S.vg([[0,hexA(P.bg,.32)],[.5,hexA(P.bg,.06)],[1,hexA(P.bg,.5)]],0,cy,0,cy+ch)}));
 card.push(N.rect({x:cx+8,y:cy+8,w:cw-16,h:ch-16,rx:24,fill:P.panel,op:.9,stroke:hexA('#FFFFFF',.16),sw:1}));
 card.push(N.txt({x:cx+pad,y:cy+pad+18,text:post.club.short.toUpperCase(),f:'mono',w:700,s:16,fill:P.a1ink||P.a1,ls:2.2,upper:true,gid:'branding'}));
 card.push(N.txt({x:cx+cw-pad,y:cy+pad+18,text:'Nº '+post.player.num,f:'mono',w:700,s:16,fill:S.mut,align:'right',ls:1.6,upper:true,gid:'branding'}));
 let iy=cy+pad+40;
 photoBox(S,{into:card,x:cx+pad,y:iy,w:cw-pad*2,h:ph,rx:Y?18:24,mask:'arch',src:post.userImg||imgSrc(S.post,post.img),
  pos:post.pos||[.5,.34],zoom:1.1,tint:hexA(P.bg,.1),border:false});
 if(post.rarity)insetPill(S,card,cx+pad+14,iy+14,post.rarity,{bg:hexA(P.bg,.74),fg:P.a1,bd:hexA(P.a1,.5)});
 iy+=ph+22;
 card.push(N.txt({x:cx+pad,y:iy+nameB.lh,lines:nameB.lines,f:'disp',w:800,s:nameB.s,fill:P.ink,align:'left',lh:nameB.lh,ls:-2,upper:true,gid:'typography'}));
 iy+=nameB.h+16;
 card.push(N.line({x1:cx+pad,y1:iy,x2:cx+cw-pad,y2:iy,stroke:hexA(P.ink,.16),sw:1}));iy+=1+14;
 const mw=(cw-pad*2)/3;
 [['POSIÇÃO',POSK[post.player.pos]||post.player.pos],['ESCALÃO',post.esc],['CLUBE',post.club.city]].forEach((kv,i)=>{
  card.push(N.txt({x:cx+pad+i*mw,y:iy+12,text:kv[0],f:'mono',w:700,s:11,fill:S.dim,ls:2,upper:true,gid:'meta'}));
  const v=fit1(kv[1],{f:'ui',w:800,maxW:mw-14,start:25,min:15});
  card.push(N.txt({x:cx+pad+i*mw,y:iy+12+v.h+10,text:v.text,f:'ui',w:800,s:v.s,fill:P.ink,gid:'meta'}))});
 iy+=52;
 if(hasStats&&iy+22+70>cy+ch-pad-14)hasStatsNow=false;
 if(hasStats){iy+=22;
  post.hero.stats.forEach((kv,i)=>{
   const bx=cx+pad+i*mw;
   card.push(N.rect({x:bx,y:iy,w:mw-14,h:70,rx:10,fill:hexA(P.a1,.08),stroke:hexA(P.a1,.22),sw:1}));
   card.push(N.txt({x:bx+12,y:iy+24,text:String(kv[0]).toUpperCase(),f:'mono',w:700,s:10.5,fill:S.mut,ls:1.8,upper:true,gid:'meta'}));
   card.push(N.txt({x:bx+12,y:iy+57,text:String(kv[1]),f:'disp',w:800,s:26,fill:P.a1ink||P.a1,gid:'meta'}));
   card.push(N.rect({x:bx+mw-92,y:iy+44,w:66,h:5,rx:3,fill:hexA(P.ink,.16)}));
   card.push(N.rect({x:bx+mw-92,y:iy+44,w:66*(clamp(parseInt(kv[1],10)||0,0,100)/100),h:5,rx:3,fill:P.a1}))});
  iy+=70}
 if(hasStats&&iy+16>cy+ch-pad-18)hasFoot=false;
 if(hasFoot){iy+=20;
  card.push(N.txt({x:cx+cw/2,y:Math.min(iy+4,cy+ch-pad+4),text:(post.hero.foot||('CADERNETA '+post.club.short)).toUpperCase(),f:'mono',w:600,s:11,
   fill:S.dim,align:'center',ls:2.4,upper:true,gid:'meta'}))}
 foilSweep(S,{x:cx+8,y:cy+8,w:cw-16,h:ch-16},{op:.42,rx:24});
 card.push(N.rect({x:cx,y:cy,w:cw,h:ch,rx:30,fill:'none',stroke:hexA(P.ink,.18),sw:1.5}));
 S.add(N.g('hero-card',card,{rotate:tilt,px:cx+cw/2,py:cy+ch/2}));
 if(hookB&&!Y)S.add(N.txt({x:W/2,y:cy+ch+44,lines:hookB.lines,f:'ui',w:600,s:hookB.s,fill:S.mut,align:'center',lh:hookB.lh,upper:true,gid:'typography'}));
 if(Y&&post.t){const f=fitBlock(post.t,{f:'disp',w:800,maxW:w-20,maxH:120,min:26,start:44,lhF:1.05,upper:true});
  S.add(N.txt({x:W/2,y:cy+ch+44,lines:f.lines,f:'disp',w:800,s:f.s,fill:S.ink,align:'center',lh:f.lh,ls:-1.5,gid:'typography'}))}
 signature(S,post,{variant:'none'});
 if(!Y)appBadges(S,M.left,H-56,{scale:.55});
}
/* ---------- 2 · SAQUETA DIGITAL ---------- */
function layPack(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{glow:.22,grid:{gap:76,op:.4},tint:.1});
 const x=M.left,w=W-M.left-M.right;
 const top=eyebrow(S,x,'1 POR FAMÍLIA · PRIMEIRA SEMANA',{label:(post.pack.kicker||'SAQUETA DIGITAL').toUpperCase(),y:Y?244:M.top});
 const bagW=Math.round(Math.min(w*.42,306)),bagH=Math.round(bagW*1.42);
 const bx=W-M.left-bagW,by=top+8;
 const bag=[];
 bag.push(N.rect({x:bx,y:by,w:bagW,h:bagH,rx:20,fill:S.lin({x1:bx,y1:by,x2:bx+bagW,y2:by+bagH,stops:[[0,P.a2],[.5,P.a1],[1,P.a3]]})}));
 bag.push(N.rect({x:bx+11,y:by+11,w:bagW-22,h:bagH-22,rx:14,fill:hexA(P.bg,.82)}));
 bag.push(N.rect({x:bx+16,y:by+16,w:bagW-32,h:22,rx:8,fill:hexA('#fff',.16)}));
 bag.push(N.txt({x:bx+bagW/2,y:by+78,text:'ExMe',f:'disp',w:900,s:Math.round(bagW*.2),fill:'#fff',align:'center',gid:'branding'}));
 bag.push(N.txt({x:bx+bagW/2,y:by+104,text:(post.pack.unit||'5 CROMOS').toUpperCase(),f:'mono',w:700,s:12,fill:S.mut,align:'center',ls:2,upper:true,gid:'branding'}));
 const winH=Math.round(bagH*.34),winY=by+bagH-winH-58;
 bag.push(N.rect({x:bx+22,y:winY,w:bagW-44,h:winH,rx:12,fill:hexA(P.a1,.1),stroke:hexA(P.a1,.34),sw:1}));
 bag.push(N.rect({x:bx+22,y:by+bagH-70,w:Math.min(bagW-44,textW('TROCA NO PORTAL','mono',700,10,1.6)+20),h:20,rx:10,fill:hexA(P.a1,.14)}));
 bag.push(N.txt({x:bx+bagW/2,y:winY+winH/2+5,text:(post.pack.kicker||'CROMO À SORTE').toUpperCase(),f:'mono',w:600,s:12,fill:P.a1,align:'center',ls:2.2,upper:true,gid:'branding'}));
 bag.push(N.rect({x:bx+22,y:by+bagH-40,w:bagW-44,h:2,rx:1,fill:hexA(P.ink,.18)}));
 bag.push(N.txt({x:bx+bagW/2,y:by+bagH-18,text:'5 CROMOS · 1 RARO GARANTIDO',f:'mono',w:600,s:10.5,fill:S.mut,align:'center',ls:1.8,upper:true,gid:'meta'}));
 foilSweep(S,{x:bx+11,y:by+11,w:bagW-22,h:bagH-22},{op:.34,rx:14});
 bag.push(N.rect({x:bx,y:by,w:bagW,h:bagH,rx:20,fill:'none',stroke:hexA('#fff',.3),sw:1.5}));
 S.add(N.g('pack-bag',bag,{rotate:-4.5,px:bx+bagW/2,py:by+bagH/2}));
 const lw=w-bagW-46;
 const st=stack(top+6,by+bagH);
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:lw,maxH:Math.min(260,st.rest*.55),min:44,start:Y?82:88,lhF:.95,upper:true,ls:-2});
 S.add(N.txt({x,y:st.take(t1.h,0)+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,align:'left',ls:-2,upper:true,gid:'typography'}));
 st.space(14);
 const sub=fitBlock(post.sub||post.pack.note||'',{f:'ui',w:500,maxW:lw,maxH:120,min:16,start:22,lhF:1.42});
 if(sub.lines.length)S.add(N.txt({x,y:st.take(sub.h,0)+sub.lh,lines:sub.lines,f:'ui',w:500,s:sub.s,fill:S.mut,lh:sub.lh,align:'left',gid:'typography'}));
 st.space(18);
 const rows=(post.pack.rows||[]).slice(0,Y?5:4),rh=Math.min(66,Math.max(48,(st.rest-16)/rows.length));
 rows.forEach((rw,i)=>{
  const y=st.y+i*(rh+9);
  S.add(N.rect({x,y,w:lw,h:rh,rx:12,fill:hexA(P.ink,.05),stroke:hexA(P.ink,.13),sw:1}));
  S.add(N.rect({x,y:y+11,w:4,h:rh-22,rx:2,fill:i===0?P.a1:hexA(P.a1,.45)}));
  const nm=fit1(rw[0],{f:'ui',w:800,maxW:lw*.5,start:21,min:13});
  S.add(N.txt({x:x+18,y:y+rh/2+nm.h/2-2,text:nm.text,f:'ui',w:800,s:nm.s,fill:S.ink,gid:'typography'}));
  S.add(N.txt({x:x+18+lw*.54,y:y+rh/2+7,text:String(rw[1]||'').toUpperCase(),f:'mono',w:700,s:11.5,fill:P.a1,ls:1.6,upper:true,gid:'meta'}));
  S.add(N.txt({x:x+lw-16,y:y+rh/2+7,text:String(rw[2]||'').toUpperCase(),f:'mono',w:600,s:12.5,fill:S.mut,align:'right',ls:1.4,upper:true,gid:'meta'}))});
 st.take(rows.length*(rh+9),0);
 if(post.pack.note&&Y)S.add(N.txt({x,y:Math.min(st.take(40,0)+18,H-M.bot-40),text:post.pack.note,f:'ui',w:500,s:18,fill:S.mut,gid:'typography'}));
 const bandY=Math.max(st.y+20,H-M.bot-(Y?120:110));
 S.add(N.rect({x:0,y:bandY,w:W,h:Y?92:56,fill:S.lin({x1:0,y1:bandY,x2:W,y2:bandY+(Y?92:56),stops:[[0,P.a2],[.45,P.a1],[1,P.a3]]})}));
 {const bt=fit1((post.pack.note||'ABRE NA APP · TROCA NO PORTAL DO CLUBE'),{f:'disp',w:800,maxW:W-72,start:Y?30:20,min:14,upper:true});
  S.add(N.txt({x:W/2,y:bandY+(Y?56:34),text:bt.text,f:'disp',w:800,s:bt.s,fill:hexA(P.bg,.94),align:'center',ls:1,upper:true,gid:'typography'}));}
}
/* ---------- 3 · PROGRESSO DA CADERNETA ---------- */
function layAlbum(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{tint:.08,grid:{gap:96,op:.32,both:true},glow:.1});
 const box=zBox(S);
 const pct=clamp(post.album.pct,0,1);
 const head=eyebrow(S,box.x,post.club.short+' · '+post.esc,{label:'CADERNETA · '+Math.round(pct*100)+'%',y:box.y-6});
 if(Y){
  const st=stack(head,box.y+box.h);
  const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:190,min:40,start:62,lhF:.96,upper:true,ls:-2});
  S.add(N.txt({x:box.x,y:st.take(t1.h,0)+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
  st.space(10);
  const d=fitBlock(post.sub,{f:'ui',w:500,maxW:box.w,maxH:88,min:16,start:20,lhF:1.4});
  S.add(N.txt({x:box.x,y:st.take(d.h,0)+d.lh,lines:d.lines,f:'ui',w:500,s:d.s,fill:S.mut,lh:d.lh,gid:'typography'}));
  st.space(16);
  const cols=4,rows=4,gap=10,gw=(box.w-gap*(cols-1))/cols;
  const gh=Math.round(Math.min(gw*1.3,Math.max(64,(st.rest-150-(post.album.line||post.album.note?46:0))/rows-(rows-1)*gap/rows)));
  const gy=st.take(rows*(gh+gap)-gap,14);
  drawAlbumGrid(S,box.x,gy,cols,rows,gw,gh,gap,post);
  progressBar(S,box.x,st.take(16,14),box.w,16,pct,{ticks:4});
  const nf=fit1('PÁGINA 07 · BLOCO 2 · FALTAM '+post.album.need+' CROMOS',{f:'mono',maxW:box.w,start:12,min:9});
  S.add(N.txt({x:box.x,y:st.take(nf.h,0)+10,text:nf.text,f:'mono',w:700,s:nf.s,fill:S.dim,ls:1.8,upper:true,gid:'meta'}));
  if(post.album.line)S.add(N.txt({x:box.x,y:Math.min(st.y+30,box.y+box.h+20),text:post.album.line,f:'ui',w:600,s:18,fill:P.a1,gid:'typography'}));
 }else{
  const pw=Math.round(box.w*.47),px=box.x+box.w-pw,ph=Math.min(box.h,Math.round(pw*1.62)),py=box.y+(box.h-ph)/2;
  S.add(N.rect({x:px-14,y:py-14,w:pw+28,h:ph+28,rx:22,fill:hexA(P.ink,.05),stroke:hexA(P.ink,.14),sw:1}));
  S.add(N.rect({x:px,y:py,w:pw,h:ph,rx:10,fill:hexA('#fff',.94)}));
  S.add(N.txt({x:px+16,y:py+30,text:post.album.kicker||('CADERNETA '+post.club.short),f:'mono',w:800,s:10.5,fill:hexA('#0B0E14',.55),ls:1.8,upper:true,gid:'meta'}));
  S.add(N.line({x1:px+16,y1:py+40,x2:px+pw-16,y2:py+40,stroke:hexA('#0B0E14',.16),sw:1}));
  const cols=3,rows=7,gap=7,gw=(pw-32-gap*2)/cols,gh=Math.min(gw*1.26,(ph-92-gap*(rows-1))/rows);
  drawAlbumGrid(S,px+16,py+52,cols,rows,gw,gh,gap,post,'paper');
  const lw=px-34-box.x;
  const st2=stack(box.y,box.y+box.h);
  const t2=fitBlock(post.t,{f:'disp',w:900,maxW:lw,maxH:Math.round(ph*.4),min:32,start:60,lhF:.98,upper:true,ls:-2});
  S.add(N.txt({x:box.x,y:st2.take(t2.h,0)+t2.lh,lines:t2.lines,f:'disp',w:900,s:t2.s,fill:S.ink,lh:t2.lh,upper:true,ls:-2,gid:'typography'}));
  st2.space(12);
  const d=fitBlock(post.sub,{f:'ui',w:500,maxW:lw,maxH:100,min:15,start:20,lhF:1.42});
  S.add(N.txt({x:box.x,y:st2.take(d.h,0)+d.lh,lines:d.lines,f:'ui',w:500,s:d.s,fill:S.mut,lh:d.lh,gid:'typography'}));
  st2.space(20);
  S.add(N.txt({x:box.x,y:st2.take(46,0)+42,text:Math.round(pct*100)+'%',f:'disp',w:900,s:44,fill:P.a1,gid:'data'}));
  progressBar(S,box.x,st2.take(14,14),lw,14,pct,{ticks:4});
  dataRow(S,box.x,st2.take(44,0),[['TOTAL DA SÉRIE',post.album.total],['BLOCOS',post.album.blocks||'3/4'],['ÁLBUM EM CASA','7 DIAS']],{w:lw,h:44,gap:14,vs:20,ks:10});
  {const ny=H-M.bot-72;
   const nb=fitBlock(post.album.note||'',{f:'ui',w:500,maxW:lw,maxH:66,min:13,start:17,lhF:1.36});
   if(nb.lines[0]!=='')S.add(N.txt({x:box.x,y:ny+nb.lh,lines:nb.lines,f:'ui',w:500,s:nb.s,fill:S.mut,lh:nb.lh,gid:'typography'}));}
  if(post.album.line){const ln=fit1(post.album.line,{f:'mono',maxW:lw,start:11,min:8.5,upper:true});
   S.add(N.txt({x:box.x,y:Math.min(st2.y+10,box.y+box.h),text:ln.text,f:'mono',w:700,s:ln.s,fill:P.a1,ls:2,upper:true,gid:'meta'}))}
 }
 signature(S,post,{variant:'none',note:Y?'':''});
}
function drawAlbumGrid(S,ox,oy,cols,rows,gw,gh,gap,post,skin){
 const P=S.P,pat=post.album.pattern,paper=skin==='paper';
 const inkC=paper?'#0B0E14':P.ink;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  const i=r*cols+c,x=ox+c*(gw+gap),y=oy+r*(gh+gap),v=pat[i%pat.length];
  if(v===2){
   S.add(N.rect({x,y,w:gw,h:gh,rx:6,fill:S.lin({x1:x,y1:y,x2:x+gw,y2:y+gh,stops:[[0,P.a3],[.45,P.a1],[1,P.a2]]})}));
   S.add(N.rect({x:x+3,y:y+3,w:gw-6,h:gh-6,rx:4,fill:hexA(P.bg,.78)}));
   S.add(N.txt({x:x+gw/2,y:y+gh/2+4,text:post.club.short,f:'mono',w:700,s:Math.min(10.5,gw*.09),fill:P.a1,align:'center',upper:true,gid:'meta'}));
  }else if(v===1){
   S.add(N.img({src:post.userImg||imgSrc(S.post,post.img),x,y,w:gw,h:gh,rx:6,op:1,pos:[.5,.3+((i*11)%6)*.08],zoom:1.18}));
  }else{
   S.add(N.rect({x,y,w:gw,h:gh,rx:6,fill:hexA(inkC,.05),stroke:hexA(inkC,.22),sw:1}));
   S.add(N.txt({x:x+gw/2,y:y+gh/2+5,text:String(i+1).padStart(2,'0'),f:'mono',w:600,s:Math.min(14,gw*.13),fill:hexA(inkC,.34),align:'center',gid:'meta'}));
  }
 }
}
/* ---------- 4 · NÚMERO DE IMPACTO ---------- */
function layMetric(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{imgKey:post.img,imgOp:Y?.2:.24,tint:.26,fade:{to:Math.round(H*.72),a:.88}});
 const box=zBox(S);
 const top=eyebrow(S,M.left,post.metric.tag||post.club.short.toUpperCase(),
  {label:(post.metric.kicker||post.season||'').toUpperCase(),y:Y?244:M.top});
 const items=(post.metric.items||[]).slice(0,3);
 const footH=post.metric.foot?70:0;
 const bot=H-(Y?300:M.bot)-footH;
 const numTxt=String(post.metric.val||'');
 const len=Math.max(2,numTxt.replace(/[^0-9A-Za-zÀ-ú]/g,'').length||2);
 const vsMax=Math.min(box.w*.94/len*1.28,(bot-top)*.44,340);
 const numS=fitSize(numTxt,'disp',900,box.w-6,Math.round(vsMax),56);
 const numH=Math.round(numS*.76);
 const lab=fitBlock(post.metric.lab||post.t,{f:'disp',w:800,maxW:box.w*.82,maxH:140,min:18,start:36,lhF:1.24,upper:true,ls:-1});
 const ih=items.length?Math.min(88,Math.max(56,Math.round((bot-top)*.13))):0;
 const total=numH+12+lab.h+18+4+22+ih;
 let y=top+14+Math.max(0,(bot-top-footH-total)/2);
 S.add(N.txt({x:W/2,y:y+numH,lines:[numTxt],f:'disp',w:900,s:numS,fill:P.a1,align:'center',upper:true,gid:'typography'}));
 y+=numH+12;
 S.add(N.txt({x:W/2,y:y+lab.lh,lines:lab.lines,f:'disp',w:800,s:lab.s,fill:S.ink,align:'center',lh:lab.lh,upper:true,ls:-1,gid:'typography'}));
 y+=lab.h+18;
 S.add(N.rect({x:W/2-70,y,w:140,h:4,rx:2,fill:P.a1}));
 y+=26;
 if(items.length){
  const iw=(box.w-18*(items.length-1))/items.length;
  items.forEach((kv,i)=>{
   const x=M.left+i*(iw+18);
   S.add(N.rect({x,y,w:iw,h:ih,rx:12,fill:hexA(P.bg,P.mode==='l'?.05:.34),stroke:hexA(P.ink,.16),sw:1}));
   const kt=fit1(kv[0],{f:'mono',maxW:iw-24,start:11,min:8,upper:true});
   S.add(N.txt({x:x+13,y:y+24,text:kt.text,f:'mono',w:700,s:kt.s,fill:S.dim,ls:1.6,upper:true,gid:'data'}));
   const vw=fit1(String(kv[1]),{f:'disp',w:800,maxW:iw-26,start:Math.min(30,ih-38),min:15,upper:true});
   S.add(N.txt({x:x+13,y:y+ih-14,text:vw.text,f:'disp',w:800,s:vw.s,fill:S.ink,upper:true,gid:'data'}))});
  y+=ih;
 }
 if(post.metric.foot){const ft=fitBlock(post.metric.foot,{f:'ui',w:600,maxW:box.w,maxH:64,min:15,start:20,lhF:1.35});
  S.add(N.txt({x:W/2,y:bot+34,lines:ft.lines,f:'ui',w:600,s:ft.s,fill:S.mut,align:'center',lh:ft.lh,gid:'typography'}))}
 signature(S,post,{variant:'none'});
}
/* ---------- 5 · CITAÇÃO ---------- */
function layQuote(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{imgKey:post.img,tint:.24,fade:{to:Math.round(H*.4),a:.5},vig:true});
 const box=zBox(S);
 if(post.quote.strapKicker)S.add(N.txt({x:box.x,y:box.y+4,text:String(post.quote.strapKicker).toUpperCase(),f:'mono',w:800,s:12,
  fill:P.a1,ls:2.6,upper:true,gid:'meta'}));
 S.add(N.line({x1:box.x,y1:box.y+18,x2:box.x+120,y2:box.y+18,stroke:hexA(P.a1,.6),sw:2}));
 const q=String(post.quote.q||post.t);
 const qs=fitSize(q,'serif',400,box.w-4,Y?112:124,Y?54:60);
 const qh=Math.round(qs*1.14);
 const qLines=wrapLines(q,'serif',400,qs,box.w-4);
 const qBlock=qLines.length*qh;
 const attH=26+24+22;
 const strapH=post.quote.strap?(Y?150:120):0;
 const avail=box.h-attH-strapH-40;
 const qy=box.y+40+Math.max(0,(avail-qBlock)/2);
 S.add(N.txt({x:box.x,y:qy+qs,lines:qLines,f:'serif',w:400,s:qs,fill:S.ink,lh:qh,gid:'typography'}));
 let iy=qy+qBlock+30;
 S.add(N.line({x1:box.x,y1:iy,x2:box.x+64,y2:iy,stroke:P.a1,sw:4}));iy+=16;
 const who=fit1(post.quote.who,{f:'disp',w:800,maxW:box.w*.72,start:28,min:18,upper:true});
 S.add(N.txt({x:box.x,y:iy+who.h,text:who.text,f:'disp',w:800,s:who.s,fill:S.ink,upper:true,gid:'typography'}));
 S.add(N.txt({x:box.x,y:iy+who.h+24,text:String(post.quote.role).toUpperCase(),f:'mono',w:600,s:12,fill:S.dim,ls:2,upper:true,gid:'meta'}));
 if(post.quote.strap){
  const sy=H-M.bot-(Y?214:96)-strapH+10;
  const sz=fitSize(post.quote.strap,'disp',900,box.w-48,Y?92:104,30);
  S.add(N.rect({x:box.x,y:sy,w:box.w,h:strapH-16,rx:20,fill:S.lin({x1:box.x,y1:sy,x2:box.x+box.w,y2:sy+strapH,stops:[[0,P.a2],[.5,P.a1],[1,P.a3]]})}));
  S.add(N.txt({x:box.x+box.w/2,y:sy+(strapH-16)/2+sz*.34,text:post.quote.strap,f:'disp',w:900,s:sz,fill:hexA(P.bg,.94),
   align:'center',upper:true,gid:'typography'}));
 }
 signature(S,post,{variant:'none'});
}
/* ---------- 6 · TIPOGRAFIA CINÉTICA ---------- */
function layKinetic(S,post){
 const Y=S.Y,P=S.P,W=S.W,H=S.H;
 addBg(S,{imgKey:post.img,imgOp:.16,tint:.1,grid:{gap:68,op:.34}});
 const x=72,w=W-144;
 const lines=(post.kinetic.lines||[post.t]).map(l=>String(l).toUpperCase()).slice(0,4);
 const chip=post.kinetic.chip;
 const bandH=Y?104:58,bandH2=Y?54:0;
 const topPad=Y?244:86;
 const avail=H-topPad-bandH-bandH2-(chip?64:0)-(Y?120:96)-40;
 const txt=lines.map(String);
 let fs=Math.floor(Math.min(Y?126:116,avail/Math.max(1,txt.length)));
 let sz=txt.map(l=>fitSize(l,'disp',900,w,fs,34));
 while(txt.reduce((a,b,i)=>a+sz[i],0)>avail&&fs>40){fs-=4;sz=txt.map(l=>fitSize(l,'disp',900,w,fs,34))}
 const blockH=sz.reduce((a,b)=>a+b,0);
 let ly=topPad+Math.max(0,(avail-blockH)/2)+sz[0]*.8;
 txt.forEach((line,i)=>{
  const s=sz[i],outline=(post.v%3===2?i%2===0:i%2===1);
  S.add(N.txt({x,y:ly,text:line,f:'disp',w:900,s,fill:outline?'none':S.ink,ls:-2,upper:true,
   st:outline?{color:hexA(P.ink,.72),lw:Math.max(1.6,s/26)}:null,gid:'typography'}));
  ly+=s*1.02});
 if(chip){const cw2=textW(chip,'mono',700,15,2)+40;
  S.add(N.rect({x:x,y:ly+22,w:cw2,h:40,rx:20,fill:P.a1}));
  S.add(N.txt({x:x+20,y:ly+47,text:chip,f:'mono',w:700,s:15,fill:hexA(P.bg,.96),ls:2,upper:true,gid:'typography'}));
  ly+=62}
 if(Y&&post.kinetic.sub){const sw=fit1(post.kinetic.sub,{f:'ui',w:500,maxW:w,start:19,min:15});
  S.add(N.txt({x,y:ly+18,text:sw.text,f:'ui',w:500,s:sw.s,fill:S.mut,gid:'typography'}))}
 const by=H-(Y?300:58)-bandH-(bandH2?bandH2+8:0);
 S.add(N.rect({x:0,y:by,w:W,h:bandH,fill:S.lin({x1:0,y1:by,x2:W,y2:by+bandH,stops:[[0,P.a2],[.45,P.a1],[1,P.a3]]})}));
 ticker(S,{y:by+bandH/2,words:post.kinetic.band||'EXME · CROMOS · TROCAS · CADERNETAS',s:Y?38:24,fg:hexA(P.bg,.94),
  bg:'rgba(0,0,0,0)',rot:0,h:bandH-8,x0:0});
 if(bandH2){const by2=by+bandH+8;
  S.add(N.rect({x:0,y:by2,w:W,h:bandH2,fill:hexA(P.a1,.16),stroke:hexA(P.a1,.4),sw:1}));
  ticker(S,{y:by2+bandH2/2,words:post.kinetic.band2||'APP STORE & GOOGLE PLAY · EXME.CLUB',s:15,fg:S.ink,bg:'rgba(0,0,0,0)',rot:0,h:bandH2-8,x0:0})}
}
/* ---------- 7 · PASSOS ---------- */
function laySteps(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{tint:.12,grid:{gap:104,op:.3},glow:.14});
 const box=zBox(S);
 const st=stack(box.y,box.y+box.h);
 const top=eyebrow(S,box.x,(post.steps.kicker||'COMO FUNCIONA')+' · '+post.club.short,{label:(post.season||'').toUpperCase(),y:st.y});
 st.y=top;
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:Y?170:120,min:34,start:Y?58:52,lhF:.98,upper:true,ls:-2});
 S.add(N.txt({x:box.x,y:st.take(t1.h,0)+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
 st.space(12);
 if(post.sub){const d=fitBlock(post.sub,{f:'ui',w:500,maxW:box.w*.82,maxH:80,min:15,start:20,lhF:1.42});
  S.add(N.txt({x:box.x,y:st.take(d.h,0)+d.lh,lines:d.lines,f:'ui',w:500,s:d.s,fill:S.mut,lh:d.lh,gid:'typography'}));st.space(10)}
 const items=(post.steps.items||[]).slice(0,3);
 const footH=post.steps.foot?42:0;
 const gap=16,cardH=Math.min(Y?250:208,(st.rest-footH-gap*(items.length-1))/items.length);
 const blockH=items.length*cardH+(items.length-1)*gap;
 st.y+=Math.max(0,(st.rest-footH-blockH)/2);
 items.forEach((kv,i)=>{
  const y=st.y+i*(cardH+gap);
  S.add(N.rect({x:box.x,y,w:box.w,h:cardH,rx:18,fill:hexA(P.ink,P.mode==='l'?.05:.07),stroke:hexA(P.ink,.15),sw:1}));
  S.add(N.rect({x:box.x,y,w:5,h:cardH,rx:3,fill:i===0?P.a1:hexA(P.a1,.45)}));
  const numS=Math.min(60,cardH*.46);
  S.add(N.txt({x:box.x+26,y:y+cardH/2+numS*.36,text:String(i+1).padStart(2,'0'),f:'disp',w:900,s:numS,fill:hexA(P.a1,.9),gid:'typography'}));
  const cx=box.x+26+numS+24;
  const nt=fitBlock(kv[0],{f:'disp',w:800,maxW:box.w-(cx-box.x)-26,maxH:cardH*.42,min:16,start:29,lhF:1.02,upper:true});
  const dh=cardH>104?fitBlock(kv[1],{f:'ui',w:500,maxW:box.w-(cx-box.x)-26,maxH:cardH*.44,min:13,start:19,lhF:1.34}):null;
  const blk=nt.h+(dh?dh.h+8:0);
  const by2=y+(cardH-blk)/2;
  S.add(N.txt({x:cx,y:by2+nt.lh,lines:nt.lines,f:'disp',w:800,s:nt.s,fill:S.ink,lh:nt.lh,upper:true,gid:'typography'}));
  if(dh)S.add(N.txt({x:cx,y:by2+nt.h+8+dh.lh,lines:dh.lines,f:'ui',w:500,s:dh.s,fill:S.mut,lh:dh.lh,gid:'typography'}))});
 st.take(items.length*(cardH+gap),0);
 if(post.steps.foot){const fy=Math.min(st.take(38,0),H-M.bot-42);
  S.add(N.rect({x:box.x,y:fy,w:box.w,h:36,rx:18,fill:hexA(P.a1,.12),stroke:hexA(P.a1,.28),sw:1}));
  const ft=fit1(post.steps.foot,{f:'mono',maxW:box.w-36,start:12,min:9,upper:true});
  S.add(N.txt({x:box.x+18,y:fy+24,text:ft.text,f:'mono',w:600,s:ft.s,fill:P.a1,ls:1.8,upper:true,gid:'meta'}))}
}
/* ---------- 8 · ANTES / DEPOIS ---------- */
function layVs(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{tint:.16,grid:{gap:84,op:.24,both:true}});
 const box=zBox(S);
 const st=stack(box.y,box.y+box.h);
 const top=eyebrow(S,box.x,(post.vs.kicker||'ANTES × DEPOIS')+' · '+post.club.short,{label:(post.season||'').toUpperCase(),y:st.y});
 st.y=top;
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:Y?140:96,min:34,start:Y?54:50,lhF:.98,upper:true,ls:-2});
 S.add(N.txt({x:box.x,y:st.take(t1.h,0)+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
 st.space(16);
 const footH=post.vs.foot?40:0;
 const gap=Y?18:32,bw=(box.w-gap)/2,bh=st.rest-footH;
 const sides=[['a',post.vs.a||{},{fill:hexA(P.ink,.05),ink:S.ink,mark:hexA(P.ink,.42)}],
  ['b',post.vs.b||{},{fill:P.a1,ink:P.a1ink||P.bg,mark:hexA(P.bg,.6)}]];
 sides.forEach((sd,k)=>{
  const x=box.x+k*(bw+gap),side=sd[1]||{},o=sd[2];
  S.add(N.rect({x,y:st.y,w:bw,h:bh,rx:22,fill:o.fill,stroke:hexA(P.ink,.14),sw:1}));
  const kt=fit1(side.h||'',{f:'disp',w:900,maxW:bw-48,start:32,min:18,upper:true});
  S.add(N.txt({x:x+24,y:st.y+44,text:kt.text,f:'disp',w:900,s:kt.s,fill:o.ink,upper:true,gid:'typography'}));
  S.add(N.line({x1:x+24,y1:st.y+60,x2:x+bw-24,y2:st.y+60,stroke:o.mark,sw:1.6}));
  const rows=(side.rows||[]).slice(0,4),top2=st.y+76,rh=(bh-92)/Math.max(1,rows.length);
  rows.forEach((rw,i)=>{
   const ry=top2+i*rh,hasVal=!!String(rw[1]||'').trim();
   const nm=fit1(rw[0],{f:'ui',w:k?600:500,maxW:bw-(hasVal?104:48),start:Math.min(20,rh*.42),min:13});
   S.add(N.txt({x:x+24,y:ry+rh/2+nm.h/2-1,text:nm.text,f:'ui',w:k?600:500,s:nm.s,fill:o.ink,gid:'typography'}));
   if(!hasVal){S.add(N.rect({x:x+12,y:ry+rh/2-3,w:6,h:6,rx:3,fill:k?o.ink:P.a1}));return}
   const vw=fit1(String(rw[1]),{f:'disp',w:800,maxW:84,start:Math.min(26,rh*.52),min:14,upper:true});
   S.add(N.txt({x:x+bw-24,y:ry+rh/2+vw.h/2-1,text:vw.text,f:'disp',w:800,s:vw.s,fill:k?o.ink:P.a1,align:'right',upper:true,gid:'data'}));
   if(i<rows.length-1)S.add(N.line({x1:x+24,y1:ry+rh,x2:x+bw-24,y2:ry+rh,stroke:o.mark,sw:1,op:.5}))});
 });
 const badge=String(post.vs.badge||'×').toUpperCase(),bmid=box.x+bw+gap/2,bmy=st.y+bh*.42;
 if(textW(badge,'mono',800,13,2)>86){
  S.add(N.rect({x:bmid-8,y:bmy-38,w:16,h:76,fill:'transparent'}));
  pill(S,bmid,bmy-15,badge,{s:12.5,h:30,pad:13,bg:P.bg,bd:P.a1,fg:P.a1,align:'center',upper:true});
 }else{
  const br=Math.min(38,(bw*.14)+18);
  S.add(N.circ({cx:bmid,cy:bmy,r:br,fill:P.bg,stroke:P.a1,sw:3}));
  S.add(N.txt({x:bmid,y:bmy+br*.36,text:badge,f:'mono',w:800,s:br*.82,fill:P.a1,align:'center',gid:'typography'}));
 }
 st.take(bh,0);
 if(post.vs.foot){const ft=fit1(post.vs.foot,{f:'mono',maxW:box.w,start:12,min:9,upper:true});
  S.add(N.txt({x:box.x,y:st.take(ft.h,0)+24,text:ft.text,f:'mono',w:600,s:ft.s,fill:S.dim,ls:2,upper:true,gid:'meta'}))}
}
/* ---------- 9 · DIA DE JOGO ---------- */
function layMatch(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{imgKey:post.img,imgOp:Y?.3:.34,tint:.22,fade:{to:Math.round(H*.55),a:.7},pitch:{r:W*.5,op:.1},vig:true});
 const box=zBox(S);
 const top=eyebrow(S,box.x,(post.match.league||'ESCALÕES DE FORMAÇÃO')+' · '+(post.match.date||''),
  {label:(post.season||'').toUpperCase(),y:box.y-8});
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:Y?150:112,min:36,start:Y?60:56,lhF:.98,upper:true,ls:-2});
 S.add(N.txt({x:box.x,y:top+4+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
 const tw=Math.min(box.w,880),tx=(W-tw)/2;
 const list=(post.match.list||[]).slice(0,Y?6:4);
 const headH=100,metaH=64,listHeadH=44,stubH=94,pad=26,rowH=Y?60:54;
 const th=headH+metaH+listHeadH+list.length*(rowH+8)+stubH+pad;
 const ty0=top+t1.h+26,tyBot=box.y+box.h-(post.match.foot?46:14)-(Y?40:0);
 const ty=ty0+Math.max(0,(tyBot-ty0-th)/2);
 S.add(N.rect({x:tx,y:ty,w:tw,h:th,rx:22,fill:S.vg([[0,hexA(P.panel,.99)],[1,hexA(P.panel,.9)]],0,ty,0,ty+th),
  stroke:hexA(P.ink,.16),sw:1.5}));
 S.add(N.rect({x:tx,y:ty,w:tw,h:headH,rx:22,fill:hexA(P.a1,.09)}));
 S.add(N.rect({x:tx,y:ty+headH-2,w:tw,h:2,fill:hexA(P.ink,.14)}));
 crest(S,tx+86,ty+headH/2+4,44,post.club);
 crest(S,tx+tw-86,ty+headH/2+4,44,post.match.awayCrest||post.club);
 const mid=oneLine(post.match.line||post.club.short+' · '+post.esc,{f:'disp',w:900,maxW:tw-360,start:36,min:18,ls:-1});
 S.add(N.txt({x:tx+tw/2,y:ty+48,lines:mid.lines,f:'disp',w:900,s:mid.s,fill:S.ink,align:'center',upper:true,gid:'typography'}));
 S.add(N.txt({x:tx+tw/2,y:ty+76,text:'DIA DE JOGO · '+(post.match.date||''),f:'mono',w:700,s:12,fill:S.mut,align:'center',ls:2.2,upper:true,gid:'meta'}));
 const my=ty+headH+12;
 const cols=[['HORA',post.match.time],['LOCAL',post.match.venue||post.club.venue],['ESCALÃO',post.esc]];
 const cw3=(tw-70)/3;
 cols.forEach((kv,i)=>{const cx=tx+24+i*cw3;
  S.add(N.txt({x:cx,y:my+16,text:kv[0],f:'mono',w:700,s:10.5,fill:S.dim,ls:2.2,upper:true,gid:'data'}));
  const v=fit1(kv[1],{f:'ui',w:700,maxW:cw3-22,start:21,min:12});
  S.add(N.txt({x:cx,y:my+16+v.h+8,text:v.text,f:'ui',w:700,s:v.s,fill:S.ink,gid:'data'}));
  if(i)S.add(N.line({x1:cx-14,y1:my+4,x2:cx-14,y2:my+metaH-18,stroke:hexA(P.ink,.14),sw:1}))});
 const ly=my+metaH;
 S.add(N.txt({x:tx+24,y:ly+26,text:(post.match.listTitle||'À PORTA DO ESTÁDIO').toUpperCase(),f:'mono',w:700,s:11,fill:P.a1,ls:2.4,upper:true,gid:'meta'}));
 list.forEach((it,i)=>{
  const ry=ly+listHeadH+i*(rowH+8);
  S.add(N.rect({x:tx+24,y:ry,w:tw-48,h:rowH,rx:10,fill:hexA(P.ink,.05)}));
  const lt=fitBlock(it[0],{f:'ui',w:500,maxW:(tw-48)*.66,maxH:rowH,min:13,start:Math.min(20,rowH*.42),lhF:1.1});
  S.add(N.txt({x:tx+40,y:ry+(rowH-(lt.h-lt.lh))/2+lt.lh*.82,lines:lt.lines,f:'ui',w:500,s:lt.s,fill:S.ink,lh:lt.lh,gid:'typography'}));
  if(it[1]){const rt=fit1(it[1],{f:'mono',maxW:(tw-48)*.26,start:13,min:9,upper:true});
   S.add(N.txt({x:tx+tw-40,y:ry+rowH/2+5,text:rt.text,f:'mono',w:600,s:rt.s,fill:hexA(P.ink,.62),align:'right',ls:1.4,upper:true,gid:'meta'}))}});
 const sy=ty+th-stubH;
 perfLine(S,{x:tx+10,y:sy,w:tw-20,notch:18,bg:S.P.bg});
 exMark(S,tx+28,sy+stubH/2-20,40,{});
 const stt=fit1(post.match.stub||'',{f:'ui',w:700,maxW:tw-400,start:19,min:13});
 S.add(N.txt({x:tx+82,y:sy+stubH/2+2,text:stt.text,f:'ui',w:700,s:stt.s,fill:S.ink,gid:'typography'}));
 S.add(N.txt({x:tx+82,y:sy+stubH/2+22,text:BRAND.url.toUpperCase(),f:'mono',w:700,s:10.5,fill:S.dim,ls:2,upper:true,gid:'branding'}));
 barcode(S,{x:tx+tw-196,y:sy+22,w:170,h:stubH-46,op:.6});
 if(post.match.foot)S.add(N.txt({x:tx,y:ty+th+32,text:post.match.foot.toUpperCase(),f:'mono',w:600,s:11.5,fill:S.dim,ls:2,upper:true,gid:'meta'}));
}
/* ---------- 10 · BOLETIM / ONZE ---------- */
function layLineup(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{tint:.06,pitch:{r:W*.62,op:.16},grid:{gap:120,op:.18}});
 const box=zBox(S);
 S.add(N.rect({x:box.x-16,y:box.y-16,w:box.w+32,h:box.h+32,rx:28,fill:hexA(P.bg,P.mode==='l'?.62:.5),stroke:hexA(P.a1,.3),sw:1.5}));
 const st=stack(box.y,box.y+box.h);
 const top=eyebrow(S,box.x,(post.lineup.kicker||'BOLETIM')+' · '+post.esc,{label:(post.season||'').toUpperCase(),y:st.y});
 st.y=top;
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:Y?120:84,min:32,start:Y?46:44,lhF:.98,upper:true,ls:-2});
 S.add(N.txt({x:box.x,y:st.take(t1.h,0)+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
 st.space(10);
 if(post.lineup.deck){const d=fitBlock(post.lineup.deck,{f:'ui',w:500,maxW:box.w,maxH:76,min:15,start:19,lhF:1.38});
  S.add(N.txt({x:box.x,y:st.take(d.h,0)+d.lh,lines:d.lines,f:'ui',w:500,s:d.s,fill:S.mut,lh:d.lh,gid:'typography'}));st.space(10)}
 const rows=(post.lineup.rows||[]).slice(0,Y?11:8);
 const noteH=post.lineup.note?40:0;
 const rowH=(st.rest-noteH)/Math.max(1,rows.length);
 rows.forEach((rw,i)=>{
  const y=st.y+i*rowH;
  if(i)S.add(N.line({x1:box.x,y1:y,x2:box.x+box.w,y2:y,stroke:hexA(P.ink,.11),sw:1}));
  S.add(N.rect({x:box.x,y:y+4,w:4,h:rowH-10,rx:2,fill:i===0?P.a1:hexA(P.a1,.3)}));
  S.add(N.txt({x:box.x+20,y:y+rowH/2+10,text:String(rw[0]).padStart(2,'0'),f:'disp',w:900,s:Math.min(rowH*.52,28),fill:hexA(P.a1,.92),gid:'data'}));
  const nm=oneLine(rw[1],{f:'disp',w:800,maxW:box.w-250,start:Math.min(26,rowH*.52),min:14,ls:-1});
  S.add(N.txt({x:box.x+72,y:y+rowH/2+nm.s*.36,lines:nm.lines,f:'disp',w:800,s:nm.s,fill:S.ink,upper:true,gid:'typography'}));
  const ptxt=String(rw[2]||'').toUpperCase();
  const pw=textW(ptxt,'mono',700,11,1.8)+24;
  S.add(N.rect({x:box.x+box.w-pw,y:y+(rowH-24)/2,w:pw,h:24,rx:12,fill:hexA(P.a1,.14)}));
  S.add(N.txt({x:box.x+box.w-pw+12,y:y+(rowH-24)/2+16,text:ptxt,f:'mono',w:700,s:11,fill:P.a1,ls:1.8,upper:true,gid:'meta'}))});
 st.take(rows.length*rowH,0);
 if(post.lineup.note){const ny=st.take(38,0);
  S.add(N.rect({x:box.x,y:ny,w:box.w,h:34,rx:12,fill:hexA(P.a1,.1)}));
  const nt=fit1(post.lineup.note,{f:'ui',w:500,maxW:box.w-30,start:15,min:11});
  S.add(N.txt({x:box.x+15,y:ny+22,text:nt.text,f:'ui',w:500,s:nt.s,fill:P.a1,gid:'meta'}));st.take(34,0)}
 if(post.lineup.foot){const ft=fit1(post.lineup.foot,{f:'mono',maxW:box.w,start:11,min:8,upper:true});
  S.add(N.txt({x:box.x,y:Math.min(st.y+18,box.y+box.h+34),text:ft.text,f:'mono',w:600,s:ft.s,fill:S.dim,ls:2,upper:true,gid:'meta'}))}
}
/* ---------- 11 · SÉRIE DE CROMOS ---------- */
function laySeries(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{tint:.14,glow:.2,grid:{gap:92,op:.22}});
 const box=zBox(S);
 const top=eyebrow(S,box.x,((post.series.count||'')+' '+(post.club.short||'')).trim().toUpperCase(),
  {label:(post.series.kicker||'SÉRIE').toUpperCase(),y:box.y-6});
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:Y?140:92,min:32,start:Y?50:46,lhF:.98,upper:true,ls:-2});
 S.add(N.txt({x:box.x,y:top+4+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
 let y=top+t1.h+22;
 if(post.series.deck){const d=fit1(post.series.deck,{f:'ui',w:500,maxW:box.w,start:19,min:14});
  S.add(N.txt({x:box.x,y:y+d.h,text:d.text,f:'ui',w:500,s:d.s,fill:S.mut,gid:'typography'}));y+=d.h+16}
 const items=(post.series.items||[]).slice(0,Y?6:4);
 const cols=Y?2:4,gw=(box.w-(cols-1)*16)/cols,rowsN=Math.ceil(items.length/cols);
 const footH=post.series.foot?40:0;
 const gh=Math.max(96,Math.min(Y?520:gw*1.66,(box.y+box.h-y-footH-(rowsN-1)*16)/rowsN));
 const blkH=rowsN*gh+(rowsN-1)*16;
 y+=Math.max(0,((box.y+box.h-footH)-y-blkH)/2);
 items.forEach((it,i)=>{
  const col=i%cols,row=Math.floor(i/cols),x=box.x+col*(gw+16),yy=y+row*(gh+16);
  S.add(N.rect({x:x-3,y:yy-3,w:gw+6,h:gh+6,rx:14,fill:S.lin({x1:x,y1:yy,x2:x+gw,y2:yy+gh,stops:[[0,P.a2],[.5,P.a1],[1,P.a3]]}),op:.92}));
  S.add(N.rect({x,y:yy,w:gw,h:gh,rx:12,fill:P.panel}));
  const imgH=Math.round(gh*.42);
  S.add(N.img({src:post.userImg||imgSrc(S.post,it[1]),x:x+7,y:yy+7,w:gw-14,h:imgH,rx:8,op:1,pos:[.5,.3],zoom:1.22}));
  if(/FOIL|OURO|GOLD|PRATA/.test(String(it[2]||'')))S.add(N.rect({x:x+7,y:yy+7,w:gw-14,h:imgH,rx:8,
   fill:S.ang([[0,hexA('#fff',.3)],[.5,'rgba(255,255,255,0)']],[.2,0],x+gw/2,yy+imgH/2,gw*1.4)}));
  const lb=fitBlock(String(it[0]),{f:'disp',w:800,maxW:gw-22,maxH:gh*.26,min:14,start:24,lhF:1.02,upper:true});
  S.add(N.txt({x:x+11,y:yy+imgH+16+lb.lh,lines:lb.lines,f:'disp',w:800,s:lb.s,fill:S.ink,lh:lb.lh,upper:true,gid:'typography'}));
  if(gh>150&&it[3]){const sb=fit1(it[3],{f:'ui',w:500,maxW:gw-22,start:15,min:12});
   S.add(N.txt({x:x+11,y:yy+gh-56,text:sb.text,f:'ui',w:500,s:sb.s,fill:S.mut,gid:'typography'}))}
  const rr=String(it[2]||'').toUpperCase(),fo=/FOIL|OURO|GOLD|PRATA/.test(rr);
  const rw=Math.min(gw-22,textW(rr,'mono',700,10.5,1.8)+20);
  S.add(N.rect({x:x+11,y:yy+gh-32,w:rw,h:22,rx:11,fill:fo?P.a3:hexA(P.a1,.16)}));
  S.add(N.txt({x:x+21,y:yy+gh-17,text:rr,f:'mono',w:700,s:10.5,fill:fo?hexA(P.bg,.94):P.a1,ls:1.6,upper:true,gid:'meta'}))});
 y+=rowsN*(gh+16);
 if(post.series.foot){const ft=fit1(post.series.foot,{f:'mono',maxW:box.w,start:12,min:9,upper:true});
  S.add(N.txt({x:box.x,y:Math.min(y+16,box.y+box.h+30),text:ft.text,f:'mono',w:600,s:ft.s,fill:S.dim,ls:2,upper:true,gid:'meta'}))}
}
/* ---------- 12 · PÔSTER DE CLUBE ---------- */
function layPoster(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 const V=post.v%3;
 const img=post.userImg||imgSrc(S.post,post.img);
 const light=P.mode==='l';
 const inkC=light?'#0F1712':'#FFFFFF';
 let split=H*.52;
 if(V===1){
  photoBox(S,{x:0,y:0,w:W,h:H,rx:0,mask:'rect',src:img,border:false,pos:post.pos||[.5,.32],zoom:1.06,tint:hexA(P.bg,.16)});
  split=Math.round(H*.46);
  S.add(N.rect({x:0,y:0,w:W,h:split,fill:S.vg([[0,hexA(P.bg,.72)],[1,'rgba(0,0,0,0)']],0,0,0,split)}));
 }else if(V===2){
  S.add(N.rect({x:0,y:0,w:W,h:H,fill:P.bg,gid:'background'}));
  floodRays(S,{cx:W*.5,cy:-H*.06,op:.16,n:11,spread:96});
  split=Math.round(H*.44);
  photoBox(S,{x:52,y:52,w:W-104,h:split,rx:6,mask:'rect',src:img,border:false,pos:post.pos||[.5,.3],zoom:1.14,tint:hexA(P.bg,.1)});
  S.add(N.rect({x:52,y:52,w:W-104,h:split,rx:6,fill:S.vg([[0,'rgba(0,0,0,0)'],[1,hexA(P.bg,.66)]],0,52,0,52+split)}));
 }else{
  photoBox(S,{x:0,y:0,w:W,h:H,rx:0,mask:'rect',src:img,border:false,pos:post.pos||[.5,.34],zoom:1.05,tint:hexA(P.bg,.1)});
  S.add(N.rect({x:0,y:0,w:W,h:H,fill:S.vg([[0,hexA(P.bg,.1)],[.4,'rgba(0,0,0,0)'],[1,hexA(P.bg,.86)]],0,0,0,H)}));
  addGrid(S,{gap:64,op:.3,both:true});
 }
 const by=H-(Y?214:M.bot);
 const st=stack(split+(V===1?30:V===2?56:44),by-56);
 if(post.poster.rail)sideRail(S,String(post.poster.rail).toUpperCase(),{x:W-30,y:H*.46,s:12,fill:light?hexA('#0F1712',.55):hexA('#fff',.6),rot:-90});
 if(post.poster.kicker){pill(S,M.left,st.y,post.poster.kicker,{s:12,h:26,pad:12,bg:light?hexA('#0F1712',.08):hexA(P.a1,.16),
  bd:hexA(P.a1,.5),fg:P.a1,upper:true});st.take(30,4)}
 const lines=(post.poster.lines&&post.poster.lines.length?post.poster.lines:[post.t]).map(l=>String(l).toUpperCase());
 const lb=fitBlock(lines.join(' '),{f:'disp',w:900,maxW:W-M.left-M.right,maxH:Math.max(120,st.rest-(post.poster.note?76:0)-8),
  min:Y?38:42,start:Y?92:100,lhF:.94,ls:-3,upper:true});
 S.add(N.txt({x:M.left,y:st.take(lb.h,0)+lb.lh,lines:lb.lines,f:'disp',w:900,s:lb.s,fill:inkC,lh:lb.lh,align:'left',ls:-3,upper:true,gid:'typography'}));
 if(post.poster.note){st.space(12);
  const nt=fitBlock(post.poster.note,{f:'ui',w:600,maxW:(W-M.left-M.right)*.82,maxH:70,min:15,start:21,lhF:1.36});
  S.add(N.txt({x:M.left,y:st.take(nt.h,0)+nt.lh,lines:nt.lines,f:'ui',w:500,s:nt.s,fill:light?hexA('#0F1712',.72):hexA('#fff',.74),lh:nt.lh,gid:'typography'}))}
 if(post.poster.data){const items=String(post.poster.data).split(/[|]/).map(s=>{const p=s.split(':');return [(p[0]||'').trim(),(p[1]||'').trim()]}).filter(x=>x[0]);
  const withVal=items.filter(x=>x[1]);
  if(withVal.length===items.length&&items.length>1)dataRow(S,M.left,by-(Y?62:6),items,{w:W-M.left-M.right,h:52,gap:16,ks:10.5,vs:24,vfg:inkC});
  else{const dt=fit1(String(post.poster.data).toUpperCase(),{f:'mono',maxW:W-M.left-M.right,start:12.5,min:9});
   S.add(N.txt({x:M.left,y:by-14,text:dt.text,f:'mono',w:700,s:dt.s,fill:light?hexA('#0F1712',.72):hexA('#fff',.72),ls:2.2,upper:true,gid:'meta'}))}}
 exMark(S,W-M.side-40,by+8,34,{});
 S.add(N.txt({x:M.left,y:by+34,text:'APP STORE & GOOGLE PLAY · '+BRAND.handle.toUpperCase(),f:'mono',w:700,s:11.5,
  fill:light?hexA('#0F1712',.6):hexA('#fff',.55),ls:2,upper:true,gid:'branding'}));
}
/* ---------- 13 · TIRAS DE FAQ ---------- */
function layFaq(S,post){
 const Y=S.Y,P=S.P,M=S.M,W=S.W,H=S.H;
 addBg(S,{tint:.14,grid:{gap:100,op:.24}});
 const box=zBox(S);
 S.add(N.rect({x:box.x-14,y:box.y-14,w:box.w+28,h:box.h+28,rx:26,fill:hexA(P.bg,P.mode==='l'?.55:.45),stroke:hexA(P.ink,.14),sw:1}));
 const st=stack(box.y,box.y+box.h);
 const top=eyebrow(S,box.x,(post.faq.kicker||'PERGUNTAS FREQUENTES').toUpperCase()+' · '+post.club.short,{label:(post.season||'').toUpperCase(),y:st.y-2});
 st.y=top;
 const t1=fitBlock(post.t,{f:'disp',w:900,maxW:box.w,maxH:Y?130:92,min:32,start:Y?46:44,lhF:.98,upper:true,ls:-2});
 S.add(N.txt({x:box.x,y:st.take(t1.h,0)+t1.lh,lines:t1.lines,f:'disp',w:900,s:t1.s,fill:S.ink,lh:t1.lh,upper:true,ls:-2,gid:'typography'}));
 st.space(12);
 const items=(post.faq.items||[]).slice(0,Y?6:4);
 const footH=post.faq.foot?32:0;
 const qh=(st.rest-footH-(items.length-1)*12)/Math.max(1,items.length);
 items.forEach((qa,i)=>{
  const y=st.y+i*(qh+12);
  S.add(N.rect({x:box.x,y,w:box.w,h:qh,rx:16,fill:hexA(P.ink,P.mode==='l'?.05:.07),stroke:hexA(P.ink,.13),sw:1}));
  S.add(N.circ({cx:box.x+31,cy:y+31,r:15,fill:P.a1}));
  S.add(N.txt({x:box.x+31,y:y+36,text:String(i+1),f:'mono',w:700,s:14,fill:hexA(P.bg,.95),align:'center',gid:'typography'}));
  const q=oneLine(qa[0],{f:'disp',w:800,maxW:box.w-92,start:23,min:15,ls:-1});
  S.add(N.txt({x:box.x+60,y:y+37,lines:q.lines,f:'disp',w:800,s:q.s,fill:S.ink,upper:true,gid:'typography'}));
  if(qh>92){
   const a=fitBlock(qa[1],{f:'ui',w:500,maxW:box.w-100,maxH:qh-64,min:13,start:18,lhF:1.36});
   S.add(N.txt({x:box.x+60,y:y+62+a.lh,lines:a.lines,f:'ui',w:500,s:a.s,fill:S.mut,lh:a.lh,gid:'typography'}))}
 });
 st.take(items.length*(qh+12),0);
 if(post.faq.foot){const ft=fit1(post.faq.foot,{f:'mono',maxW:box.w,start:11.5,min:9,upper:true});
  S.add(N.txt({x:box.x,y:Math.min(st.take(ft.h,0)+16,box.y+box.h+26),text:ft.text,f:'mono',w:600,s:ft.s,fill:S.dim,ls:2,upper:true,gid:'meta'}))}
}
const BUILD={hero:layHero,pack:layPack,album:layAlbum,matchday:layMatch,metric:layMetric,quote:layQuote,kinetic:layKinetic,
 steps:laySteps,vs:layVs,lineup:layLineup,series:laySeries,poster:layPoster,faq:layFaq};
function buildFallback(S,err){
 try{S.nodes.length=0;
  S.add(N.rect({x:0,y:0,w:S.W,h:S.H,fill:S.P.bg,gid:'background'}));
  S.add(N.txt({x:S.M.left,y:S.H/2,text:(S.post.lay||'layout').toUpperCase(),f:'disp',w:900,s:64,fill:S.P.ink,lh:70,upper:true,gid:'typography'}));
  S.add(N.txt({x:S.M.left,y:S.H/2+44,text:String(err&&err.message||'').slice(0,60),f:'mono',w:600,s:15,fill:S.P.a1,upper:true,gid:'meta'}))}
 catch(e){}
}
function buildScene(post,fmt,t){
 const S=scene(post,fmt);
 try{(BUILD[post.lay]||buildFallback)(S,post)}catch(e){console.warn('[layout '+post.lay+']',e.message,'\n',e.stack.split('\n')[1]);buildFallback(S,e)}
 if(t!=null)tickAnim(S,t);
 return S;
}
