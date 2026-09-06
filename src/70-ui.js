/* ============ 5. INTERFACE ============ */
let POSTS=[];const PIN=new Set();
const state={pillar:'all',lay:'all',seg:'all',fmt:'feed',q:'',dens:'comfort'};
const sceneCache=new Map();let animT=0;
function getScene(post,fmt,t=0){
 const key=post.id+'|'+fmt+'|'+(post.palKey||'')+'|'+(post.userImg?'u':'o');
 let e=sceneCache.get(key);
 if(!e){const S=buildScene(post,fmt,t);e={post,S};sceneCache.set(key,e);if(sceneCache.size>140)sceneCache.clear()}
 return e.S;
}
function invalidate(post){for(const k of [...sceneCache.keys()])if(k.startsWith(post.id+'|'))sceneCache.delete(k)}
/* --- loop de animação --- */
const anims=new Set();
function loop(ts){
 requestAnimationFrame(loop);
 animT=(ts%16000)/16000;
 for(const a of [...anims]){
  if(!a.cv||!a.cv.isConnected){anims.delete(a);continue}
  if(!a.vis||!a.post.anim)continue;
  const S=getScene(a.post,a.getFmt(),animT);
  tickAnim(S,animT);
  drawScene(a.cv,S,a.getScale(S));
 }
}
/* --- filtros --- */
function counts(key){const m={};for(const p of POSTS)m[p[key]]=(m[p[key]]||0)+1;return m}
function buildChips(){
 const pc=$('#chipsPillar');pc.innerHTML='';const cm=counts('pillar');
 const mk=(parent,id,label,icon,accent,on,title,count)=>{
  const b=document.createElement('button');b.className='chip'+(on?' on':'');b.dataset.id=id;
  if(title)b.title=title;
  b.innerHTML=(accent?'<span class="dot" style="background:'+accent+'"></span>':'')+
   (icon?`<i class="ic" data-icon="${icon}"></i>`:'')+`<span>${label}</span>`+(count!=null?`<small>${count}</small>`:'');
  parent.appendChild(b);return b};
 mk(pc,'all','TODOS','layers',null,state.pillar==='all',null,POSTS.length);
 for(const k of PIL_ORDER){const P=PILLARS[k];
  mk(pc,k,P.short,P.icon,P.accent,String(state.pillar)===String(k),P.label,cm[k]||0)}
 const lc=$('#chipsLay');lc.innerHTML='';const lm=counts('lay');
 mk(lc,'all','TODOS OS LAYOUTS',null,null,state.lay==='all',null,POSTS.length);
 for(const k of LAY_ORDER)mk(lc,k,LAYOUTS[k].name.toUpperCase(),LAYOUTS[k].icon,null,state.lay===k,LAYOUTS[k].desc,lm[k]||0);
 const sc=$('#chipsSeg');sc.innerHTML='';const sm=counts('seg');
 mk(sc,'all','TODOS OS TONS',null,null,state.seg==='all',null,POSTS.length);
 for(const k of SEG_ORDER)mk(sc,k,SEGS[k].name.toUpperCase(),SEGS[k].icon,null,state.seg===k,SEGS[k].desc,sm[k]||0);
 paintIcons();
}
function filtered(){
 const q=state.q.trim().toLowerCase();
 return POSTS.filter(p=>(state.pillar==='all'||p.pillar==state.pillar)
  &&(state.lay==='all'||p.lay===state.lay)
  &&(state.seg==='all'||p.seg===state.seg)
  &&(!q||(p.title+' '+p.sub+' '+p.caption+' '+p.club.name+' '+p.club.city+' '+p.tags.join(' ')+' '+LAYOUTS[p.lay].name+' '+p.seg).toLowerCase().includes(q)));
}
/* --- grelha --- */
const io=new IntersectionObserver(es=>{for(const e of es){const a=e.target.__a;
 if(a){a.vis=e.isIntersecting;if(a.vis)drawCard(a)}}},{rootMargin:'180px'});
function drawCard(a){
 const S=getScene(a.post,state.fmt,animT);
 if(a.post.anim)tickAnim(S,animT);
 const wpx=Math.max(160,(a.cv.parentElement||{}).clientWidth||240);
 drawScene(a.cv,S,wpx/S.W);
 a.cv.classList.add('ready');
 preloadScene(S).then(()=>{if(a.vis&&!a.post.anim)drawScene(a.cv,getScene(a.post,state.fmt,animT),wpx/S.W)});
}
function renderGrid(){
 io.disconnect();anims.clear();
 const g=$('#grid');g.innerHTML='';
 const list=filtered();
 const dens=state.dens==='compact';
 g.classList.toggle('compact',dens);
 $('#count').innerHTML=`${list.length} DE ${POSTS.length} PEÇAS<br>${state.pillar==='all'?'6 PILARES':'PILAR '+state.pillar} · ${state.lay==='all'?'13 LAYOUTS':LAYOUTS[state.lay].name.toUpperCase()} · ${state.seg==='all'?'10 TONS':SEGS[state.seg].name.toUpperCase()} · ${state.fmt.toUpperCase()}`;
 if(!list.length){g.innerHTML='<div class="card-empty">NADA CORRESPONDE A ESTES FILTROS — TENTA LIMPAR A PROCURA</div>';return}
 for(const post of list){
  const d=document.createElement('article');d.className='card'+(PIN.has(post.id)?' is-pinned':'');
  if(post.anim)d.dataset.anim='1';
  const P=PILLARS[post.pillar];
  d.innerHTML=`
   <div class="card-top">
    <span class="card-id">${post.id.toUpperCase()}</span>
    <span class="card-pillar"><span class="dot" style="background:${P.accent}"></span>${P.short}</span>
    <span class="card-tags"><span class="tag lay">${LAYOUTS[post.lay].name}</span><span class="tag">${PALS[post.pal].name}</span></span>
   </div>
   <div class="card-stage"><canvas></canvas><span class="loop-tag">LOOP</span><span class="pinned"><i class="ic" data-icon="pin"></i></span></div>
   <h3 class="card-title">${post.title}</h3>
   <p class="card-sub">${post.club.short} · ${post.esc} · ${SEGS[post.seg].name}</p>
   <div class="card-actions">
    <button class="btn" data-act="png" title="PNG 2× (${state.fmt})"><i class="ic" data-icon="download"></i>PNG</button>
    <button class="btn" data-act="svg" title="SVG semântico"><i class="ic" data-icon="vector"></i>SVG</button>
    <button class="btn" data-act="zip" title="ZIP (feed+story+legenda+prompt)"><i class="ic" data-icon="archive"></i>ZIP</button>
    <button class="btn btn-icon" data-act="pin" title="Selecionar para ZIP"><i class="ic" data-icon="pin"></i></button>
    <button class="btn btn-icon" data-act="open" title="Abrir detalhe"><i class="ic" data-icon="layers"></i></button>
   </div>`;
  const cv=d.querySelector('canvas');
  const a={el:d,cv,post,vis:false,getFmt:()=>state.fmt,getScale:S=>Math.max(.1,((cv.parentElement||{clientWidth:240}).clientWidth||240)/S.W)};
  d.__a=a;anims.add(a);io.observe(d);
  d.addEventListener('click',ev=>{
   const b=ev.target.closest('button[data-act]');
   if(!b){openModal(post);return}
   const act=b.dataset.act;
   if(act==='open')openModal(post);
   else if(act==='pin'){togglePin(post,d)}
   else if(act==='png')exportPNG(post,state.fmt);
   else if(act==='svg')exportSVG(post,state.fmt);
   else if(act==='zip')exportPostZIP(post);
  });
  g.appendChild(d);
 }
 paintIcons();
}
function togglePin(post,el){
 if(PIN.has(post.id))PIN.delete(post.id);else PIN.add(post.id);
 (el||null)&&el.classList.toggle('is-pinned',PIN.has(post.id));
 updatePinBar();savePrefs();
}
function updatePinBar(){
 const bar=$('#pinnedBar');bar.classList.toggle('show',PIN.size>0);
 $('#pinnedCount').textContent=PIN.size+' SELECIONAD'+(PIN.size===1?'O':'OS');
}
/* --- persistência --- */
function savePrefs(){try{localStorage.setItem('exme-studio',JSON.stringify({s:state,p:[...PIN]}))}catch(e){}}
function loadPrefs(){try{const j=JSON.parse(localStorage.getItem('exme-studio')||'{}');
 if(j.s)Object.assign(state,j.s);if(j.p)j.p.forEach(id=>PIN.add(id))}catch(e){}}
/* --- modal --- */
let modalPost=null,modalFmt='feed',modalAnimOn=false,modalPal='keep';
const modalAnim={cv:null,post:null,vis:true,getFmt:()=>modalFmt,getScale:S=>{
 const st=$('#mCanvas').parentElement;const mw=(st.clientWidth||620)-40,mh=Math.max(320,innerHeight*.72);
 return Math.min(mw/S.W,mh/S.H)}};
function openModal(post){
 modalPost=post;modalFmt=state.fmt;modalPal='keep';
 $('#mId').textContent=post.id.toUpperCase()+' · '+(POSTS.indexOf(post)+1)+'/'+POSTS.length;
 $('#mLay').textContent=LAYOUTS[post.lay].name+' · '+LAYOUTS[post.lay].desc;
 $('#mPillar').textContent='PILAR '+post.pillar+' · '+PILLARS[post.pillar].short;
 $('#mSeg').textContent='TOM: '+SEGS[post.seg].name;
 $('#mPal').textContent='PALETA: '+PALS[post.pal].name;
 $('#mTitle').textContent=post.title;
 $('#mSub').textContent=post.club.name+' · '+post.esc+' · '+post.club.city;
 $('#mCap').textContent=post.caption;
 $('#mAlt').textContent='ALT → '+post.alt+'\n\nPRIMEIRO COMENTÁRIO → '+post.first;
 $('#mPr').textContent=promptText(post);
 $$('#mSegFmt button').forEach(b=>b.classList.toggle('on',b.dataset.fmt===modalFmt));
 $$('#mSegPal button').forEach(b=>b.classList.toggle('on',b.dataset.pal==='keep'));
 modalAnim.post=post;modalAnim.cv=$('#mCanvas');
 if(modalAnimOn)anims.add(modalAnim);else anims.delete(modalAnim);
 $('#modal').classList.add('open');document.body.style.overflow='hidden';
 paintIcons();requestAnimationFrame(drawModal);
}
function drawModal(){
 if(!modalPost||!$('#modal').classList.contains('open'))return;
 const S=getScene(modalPost,modalFmt,animT);
 if(modalPost.anim&&modalAnimOn)tickAnim(S,animT);
 drawScene($('#mCanvas'),S,modalAnim.getScale(S));
 preloadScene(S).then(()=>{if($('#modal').classList.contains('open')&&!(modalPost.anim&&modalAnimOn))
  drawScene($('#mCanvas'),getScene(modalPost,modalFmt,animT),modalAnim.getScale(S))});
}
function closeModal(){$('#modal').classList.remove('open');document.body.style.overflow='';
 anims.delete(modalAnim);modalAnimOn=false;$('#mAnim').classList.remove('on')}
function navModal(dir){
 const list=filtered();if(!list.length)return;
 let i=list.findIndex(p=>p.id===(modalPost&&modalPost.id));
 if(i<0)i=0;
 openModal(list[(i+dir+list.length)%list.length]);
}
function applyPalAlt(){
 if(!modalPost)return;
 const alt=PAL_ALT[modalPost.pal]||modalPost.pal;
 if(modalPal==='alt'){modalPost.palKey=modalPost.pal;modalPost.pal=alt}
 else if(modalPost.palKey){modalPost.pal=modalPost.palKey;modalPost.palKey=null}
 invalidate(modalPost);drawModal();
}
function bindUI(){
 $('#chipsPillar').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
  state.pillar=b.dataset.id;savePrefs();buildChips();renderGrid()});
 $('#chipsLay').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
  state.lay=b.dataset.id;savePrefs();buildChips();renderGrid()});
 $('#chipsSeg').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
  state.seg=b.dataset.id;savePrefs();buildChips();renderGrid()});
 $('#segFmt').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  state.fmt=b.dataset.fmt;$$('#segFmt button').forEach(x=>x.classList.toggle('on',x===b));savePrefs();renderGrid()});
 $('#segDens').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  state.dens=b.dataset.dens;$$('#segDens button').forEach(x=>x.classList.toggle('on',x===b));savePrefs();renderGrid()});
 $('#q').addEventListener('input',e=>{state.q=e.target.value;renderGrid()});
 $('#btnMaster').addEventListener('click',()=>exportMasterZIP());
 $('#btnPillarZip').addEventListener('click',()=>exportPillarZIP());
 $('#btnCalendar').addEventListener('click',()=>exportCalendar(filtered()));
 $('#btnPinZip').addEventListener('click',()=>exportSelectionZIP());
 $('#btnPinClear').addEventListener('click',()=>{PIN.clear();savePrefs();updatePinBar();renderGrid()});
 $('#mClose').addEventListener('click',closeModal);
 $('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
 $('#mPrev').addEventListener('click',()=>navModal(-1));
 $('#mNext').addEventListener('click',()=>navModal(1));
 addEventListener('keydown',e=>{
  if(e.key==='Escape')closeModal();
  if($('#modal').classList.contains('open')){
   if(e.key==='ArrowLeft')navModal(-1);
   if(e.key==='ArrowRight')navModal(1);
   if(e.key==='a'||e.key==='A')$('#mAnim').click();
   if(e.key==='p'||e.key==='P')$('#mSegPal').querySelector('[data-pal="alt"]').click();
   if(e.key==='e'||e.key==='E')modalPost&&exportPNG(modalPost,modalFmt);
  }else{
   if(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();$('#q').focus()}
   if(e.key==='d'||e.key==='D'){state.dens=state.dens==='comfort'?'compact':'comfort';
    $$('#segDens button').forEach(x=>x.classList.toggle('on',x.dataset.dens===state.dens));renderGrid()}
  }
 });
 $('#mSegFmt').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  modalFmt=b.dataset.fmt;$$('#mSegFmt button').forEach(x=>x.classList.toggle('on',x===b));drawModal()});
 $('#mSegPal').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  modalPal=b.dataset.pal;$$('#mSegPal button').forEach(x=>x.classList.toggle('on',x===b));
  if(modalPal==='alt'&&modalPost.palKey==null)applyPalAlt();
  else if(modalPal==='keep')applyPalAlt()});
 $('#mAnim').addEventListener('click',()=>{
  modalAnimOn=!modalAnimOn;$('#mAnim').classList.toggle('on',modalAnimOn);
  if(modalAnimOn&&!modalPost.anim)toast('Este layout é estático — ativa a animação nos de tipografia cinética, saqueta, cromo e pôster','!');
  if(modalAnimOn)anims.add(modalAnim);else{anims.delete(modalAnim);drawModal()}
 });
 $('#mPng').addEventListener('click',()=>modalPost&&exportPNG(modalPost,modalFmt));
 $('#mSvg').addEventListener('click',()=>modalPost&&exportSVG(modalPost,modalFmt));
 $('#mZip').addEventListener('click',()=>modalPost&&exportPostZIP(modalPost));
 $('#mCopyCap').addEventListener('click',()=>modalPost&&copyText(modalPost.caption,'Legenda'));
 $('#mCopyAlt').addEventListener('click',()=>modalPost&&copyText('ALT: '+modalPost.alt+'\n\n'+modalPost.first,'Alt + primeiro comentário'));
 $('#mCopyPr').addEventListener('click',()=>modalPost&&copyText(promptText(modalPost),'Prompt'));
 const drop=$('#drop'),file=$('#file');
 drop.addEventListener('click',()=>file.click());
 drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();file.click()}});
 ['dragover','dragenter'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));
 ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over')}));
 drop.addEventListener('drop',e=>{const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)readFile(f)});
 file.addEventListener('change',()=>{if(file.files&&file.files[0])readFile(file.files[0]);file.value=''});
 $('#mReset').addEventListener('click',()=>{
  if(!modalPost)return;
  if(modalPost.palKey){modalPal='keep';applyPalAlt();$('#mSegPal').querySelector('[data-pal="keep"]').classList.add('on');
   $$('#mSegPal button').forEach(x=>x.classList.toggle('on',x.dataset.pal==='keep'))}
  modalPost.userImg=null;invalidate(modalPost);drawModal();renderGrid();toast('Arte reposta no estado original');
 });
 addEventListener('resize',()=>{if($('#modal').classList.contains('open'))drawModal()});
}
function readFile(f){
 if(!f.type.startsWith('image/')){toast('Escolhe um ficheiro de imagem (JPG/PNG)','!');return}
 const fr=new FileReader();
 fr.onload=()=>{modalPost.userImg=fr.result;invalidate(modalPost);drawModal();renderGrid();
  toast('Foto aplicada a '+modalPost.id+' — a arte redesenhou-se à volta dela')};
 fr.readAsDataURL(f);
}
function heroStats(){
 const el=$('#heroStats');
 const uniq=new Set(POSTS.map(p=>p.title.toLowerCase())).size;
 el.innerHTML=[['90','PEÇAS ÚNICAS','acc'],[Object.keys(LAYOUTS).length,'LAYOUTS DE ARTE',''],
  [Object.keys(PALS).length,'PALETAS','cy'],[uniq,'MANCHETES DISTINTAS','gold']]
  .map(([n,l,c])=>`<div class="stat ${c}"><b>${n}</b><span>${l}</span></div>`).join('');
}

/* ============ 6. EXPORTAÇÃO ============ */
const EXPORT_T=0.42;
const needZip=()=>{if(typeof JSZip==='undefined'){toast('O ZIP precisa da biblioteca JSZip (carregada por CDN) — liga a internet e recarrega. O PNG e o SVG funcionam offline.','!',6000);return false}return true}
function sceneFor(post,fmt){const S=buildScene(post,fmt,EXPORT_T);S.static=true;tickAnim(S,EXPORT_T);return S}
async function pngBlob(post,fmt,scale=2){
 const S=sceneFor(post,fmt);
 await preloadScene(S);
 const c=document.createElement('canvas');
 drawScene(c,S,scale);
 const b=await new Promise(res=>c.toBlob(bb=>res(bb),'image/png'));
 c.width=c.height=1;
 return b;
}
async function svgBlob(post,fmt){
 const S=sceneFor(post,fmt);
 await preloadScene(S);
 return new Blob([await svgString(S)],{type:'image/svg+xml'});
}
const txtBlob=t=>new Blob([t],{type:'text/plain;charset=utf-8'});
const baseName=post=>`${post.n?String(post.n).padStart(2,'0'):post.id}-${slugify(post.title)}`;
async function exportPNG(post,fmt){
 try{toast(`A gerar ${fmt.toUpperCase()} 2× de ${post.id}…`)
  const b=await pngBlob(post,fmt,2);
  saveBlob(b,`exme-${baseName(post)}_${fmt}_2x.png`);
  toast(`${post.id} · ${fmt.toUpperCase()} 2× exportado (${fmtBytes(b.size)}) ✓`);
 }catch(e){toast('Falha no PNG: '+e.message,'!')}
}
async function exportSVG(post,fmt){
 try{toast('A gerar SVG semântico…')
  const b=await svgBlob(post,fmt);
  saveBlob(b,`exme-${baseName(post)}_${fmt}.svg`);
  toast('SVG exportado — texto editável no Illustrator ✓');
 }catch(e){toast('Falha no SVG: '+e.message,'!')}
}
async function addPostToZip(folder,post,scale,prog){
 const dir=folder.folder(baseName(post));
 for(const fmt of ['feed','story']){
  dir.file(fmt+'.png',await pngBlob(post,fmt,scale));
  if(prog)prog(`${post.id} · ${fmt}.png`);
  dir.file(fmt+'.svg',await svgBlob(post,fmt));
  if(prog)prog(`${post.id} · ${fmt}.svg`);
 }
 dir.file('legenda.txt',txtBlob(post.caption+'\n'));
 dir.file('alt-e-primeiro-comentario.txt',txtBlob(`ALT TEXT\n${post.alt}\n\nPRIMEIRO COMENTÁRIO\n${post.first}\n`));
 dir.file('image_prompt.txt',txtBlob(promptText(post)+'\n'));
}
function progShow(label){$('#progLabel').textContent=label;$('#prog').classList.add('open');setProg(0,'')}
function setProg(frac,item){$('#progBar').style.width=(frac*100).toFixed(1)+'%';
 $('#progPct').textContent=Math.round(frac*100)+'%';if(item)$('#progItem').textContent=item}
function progHide(){$('#prog').classList.remove('open')}
async function exportPostZIP(post){
 if(!needZip())return;
 try{progShow('A COMPILAR O ZIP DA PEÇA '+post.id.toUpperCase());
  const zip=new JSZip();
  await addPostToZip(zip,post,2,itm=>setProg(.5,itm));
  setProg(.94,'a comprimir…');
  const b=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
  saveBlob(b,`exme-${baseName(post)}.zip`);
  progHide();
  toast(`ZIP pronto: feed+story em PNG 2× e SVG, legenda, alt e prompt (${fmtBytes(b.size)}) ✓`);
 }catch(e){progHide();toast('Falha no ZIP: '+e.message,'!')}
}
function catalogJSON(list){
 return JSON.stringify({
  brand:'ExMe — Exchange Made Easy',domain:BRAND.url,generated:new Date().toISOString(),
  formats:{feed:'1080x1350 (4:5)',story:'1080x1920 (9:16)'},
  pillars:PILLARS,layouts:LAYOUTS,segments:SEGS,palettes:Object.fromEntries(Object.entries(PALS).map(([k,v])=>[k,{name:v.name,mode:v.mode,a1:v.a1,a2:v.a2}])),
  artPolicy:'Sem identificadores de post, sem nomes de pilar/arquétipo/segmento na arte. Metadados apenas em ficheiros e filenames.',
  total:list.length,
  pieces:list.map(p=>({n:p.n,id:p.id,pillar:p.pillar,layout:p.lay,segment:p.seg,palette:p.pal,club:p.club.name,
   competition:p.esc,title:p.title,sub:p.sub,caption:p.caption,alt:p.alt,firstComment:p.first,tags:p.tags,
   image:{unsplash:imgUrl(p.img),prompt:p.prompt.split('\n')[3]||''}}))
 },null,2);
}
function calendarCSV(list){
 const days=['SEG','TER','QUI'];
 const rows=[['semana','data','peca','pilar','layout','tom','titulo','clube','escalao','formatos','cta']];
 const start=new Date();start.setHours(0,0,0,0);
 list.forEach((p,i)=>{
  const d=new Date(start.getTime());
  d.setDate(d.getDate()+Math.floor(i/3)*7+days.indexOf(['SEG','TER','QUI'][i%3]));
  rows.push([Math.floor(i/3)+1,d.toISOString().slice(0,10),p.id,'P'+p.pillar+' '+PILLARS[p.pillar].short,LAYOUTS[p.lay].name,
   SEGS[p.seg].name,p.title.replace(/;/g,','),p.club.name,p.esc,'feed 4:5 + story 9:16',(p.ctaLine||'').replace(/\n/g,' ')]);
 });
 return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(';')).join('\n');
}
async function exportCalendar(list){
 try{
  const csv=calendarCSV(list);
  saveBlob(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'exme-calendario-editorial.csv');
  toast(`Calendário sugerido exportado — ${list.length} peças a 3 por semana (${Math.ceil(list.length/3)} semanas) ✓`);
 }catch(e){toast('Falha no calendário: '+e.message,'!')}
}
async function zipOut(zip,filename,label,total){
 setProg(.96,'a comprimir (pode demorar 1-2 minutos)…');
 const b=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}},
  md=>setProg(.96+md.percent/100*.04,'a comprimir…'));
 saveBlob(b,filename);progHide();
 toast(`${label} exportado — ${total} peças · PNG 2× + SVG + legendas + prompts ✓ (${fmtBytes(b.size)})`);
}
async function exportPillarZIP(){
 if(!needZip())return;
 if(state.pillar==='all'){toast('Escolhe primeiro um pilar nos filtros','!');return}
 const list=POSTS.filter(p=>p.pillar==state.pillar);
 try{progShow(`A COMPILAR O PILAR ${state.pillar} · ${PILLARS[state.pillar].short} — ${list.length} PEÇAS`);
  const zip=new JSZip();
  zip.file('README.txt',txtBlob(README_TXT));
  const root=zip.folder(`pilar-${state.pillar}-${slugify(PILLARS[state.pillar].label)}`);
  let i=0;
  for(const p of list){setProg(i/list.length*.94,`${p.id} — ${p.title}`);await addPostToZip(root,p,2);i++;await nextFrame()}
  await zipOut(zip,`exme-pilar-${state.pillar}-${slugify(PILLARS[state.pillar].label)}.zip`,'Pilar '+state.pillar,list.length);
 }catch(e){progHide();toast('Falha no ZIP do pilar: '+e.message,'!')}
}
async function exportSelectionZIP(){
 if(!needZip())return;
 const list=POSTS.filter(p=>PIN.has(p.id));
 if(!list.length){toast('Seleciona peças com o pino dos cartões','!');return}
 try{progShow(`A COMPILAR A SELEÇÃO — ${list.length} PEÇAS`);
  const zip=new JSZip();
  zip.file('calendario.csv',txtBlob(calendarCSV(list)));
  let i=0;
  for(const p of list){setProg(i/list.length*.94,`${p.id} — ${p.title}`);await addPostToZip(zip,p,2);i++;await nextFrame()}
  await zipOut(zip,'exme-selecao-'+list.length+'-pecas.zip','Seleção',list.length);
 }catch(e){progHide();toast('Falha no ZIP da seleção: '+e.message,'!')}
}
const README_TXT=`EXME POST STUDIO — ACERVO DE 90 PUBLICAÇÕES PHYGITAL
============================================================
ExMe · Exchange Made Easy · exme.club

ESTRUTURA
  peca-NN-slug/
    feed.png   2160x2700 (2x do feed 4:5)
    feed.svg   vetor semântico (grupos + texto editável no Illustrator)
    story.png  2160x3840 (2x do story 9:16, com luvares de UI respeitados)
    story.svg  idem
    legenda.txt                    copy PT-PT: gancho + corpo + CTA + hashtags
    alt-e-primeiro-comentario.txt  texto alternativo + 1.º comentário
    image_prompt.txt               brief fotográfico para Midjourney v6 / FLUX.1
  catalogo.json  metadados de todas as peças (pilar, layout, tom, paleta, clube)
  calendario.csv plano de publicação sugerido (3 peças/semana)

POLÍTICA DE ARTE
  - nenhum identificador de post (EXM-001, 01/90, "Nº 001") dentro da arte
  - nenhum nome de pilar, arquétipo, layout ou segmento dentro da arte
  - metadados vivem só em ficheiros e nomes de ficheiro
  - na arte entram apenas: marca ExMe, clube, escalão, época e a mensagem

6 PILARES · 13 LAYOUTS · 8 PALETAS · 10 TONS DE COMUNICAÇÃO
`;
async function exportMasterZIP(){
 if(!needZip())return;
 try{progShow('A COMPILAR O ACERVO MASTER · '+POSTS.length+' PEÇAS');
  const zip=new JSZip();
  zip.file('README.txt',txtBlob(README_TXT));
  zip.file('catalogo.json',txtBlob(catalogJSON(POSTS)));
  zip.file('calendario.csv',txtBlob(calendarCSV(POSTS)));
  const folders={};
  let i=0;
  for(const p of POSTS){
   const k=`pilar-${p.pillar}-${slugify(PILLARS[p.pillar].label)}`;
   folders[k]=folders[k]||zip.folder(k);
   setProg(i/POSTS.length*.94,`${p.id} — ${p.title}`);
   await addPostToZip(folders[k],p,2);
   i++;await nextFrame();
  }
  await zipOut(zip,'exme-90-posts-master.zip','Acervo master',POSTS.length);
 }catch(e){progHide();toast('Falha no master: '+e.message,'!')}
}

/* ============ 7. AMBIENTE (fundo de partículas) ============ */
function initBG(){
 const cv=$('#bgfx');
 if(!cv)return;
 if(window.THREE){
  try{
   const renderer=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
   renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight);
   const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,1,420);cam.position.z=95;
   const NP=700,pos=new Float32Array(NP*3),col=new Float32Array(NP*3);
   const c1=new THREE.Color('#00E676'),c2=new THREE.Color('#00F0FF'),c3=new THREE.Color('#F59E0B'),c4=new THREE.Color('#10E868');
   const r=mulberry32(99);
   for(let i=0;i<NP;i++){pos[i*3]=(r()-.5)*300;pos[i*3+1]=(r()-.5)*180;pos[i*3+2]=(r()-.5)*140;
    const k=r(),c=k<.58?c1:k<.8?c4:k<.94?c2:c3;col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
   const geo=new THREE.BufferGeometry();
   geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
   geo.setAttribute('color',new THREE.BufferAttribute(col,3));
   const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:1.9,vertexColors:true,transparent:true,opacity:.62,
    blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true}));
   sc.add(pts);
   let mx=0,my=0,run=true;
   addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});
   addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
   document.addEventListener('visibilitychange',()=>run=!document.hidden);
   (function tick(){requestAnimationFrame(tick);if(!run)return;
    const tt=performance.now()*.00012;
    pts.rotation.y=tt*.5+mx*.3;pts.rotation.x=Math.sin(tt*.5)*.1-my*.2;pts.position.y=Math.sin(tt*1.3)*2.4;
    renderer.render(sc,cam)})();
   return;
  }catch(e){}
 }
 /* fallback 2D — mesmo efeito, sem WebGL */
 const ctx=cv.getContext('2d');const dpr=Math.min(devicePixelRatio||1,1.6);let W=0,Hh=0,pts=[];
 function size(){W=cv.width=innerWidth*dpr;Hh=cv.height=innerHeight*dpr;
  const r=mulberry32(7);pts=[];for(let i=0;i<140;i++)pts.push({x:r()*W,y:r()*Hh,z:.3+r()*1.2,c:r()<.7?'#00E676':(r()<.6?'#00F0FF':'#F59E0B')});}
 size();addEventListener('resize',size);
 (function tick(){requestAnimationFrame(tick);
  if(document.hidden)return;
  ctx.clearRect(0,0,W,Hh);const t=performance.now()*.00006;
  for(const p of pts){const y=(p.y+Math.sin(t*3+p.x*.002)*22*p.z)%Hh;
   ctx.globalAlpha=.5*(1/Math.abs(p.z));ctx.fillStyle=p.c;
   ctx.beginPath();ctx.arc((p.x+t*400*p.z)%W,y,1.5*p.z*dpr,0,6.283);ctx.fill()}
 })();
}
/* ============ 8. BOOT ============ */
async function boot(){
 POSTS=buildPosts();
 loadPrefs();
 $('#q').value=state.q||'';
 try{
  await Promise.all([
   document.fonts.load('900 100px Unbounded'),document.fonts.load('800 100px Unbounded'),document.fonts.load('500 60px Unbounded'),
   document.fonts.load('800 40px Outfit'),document.fonts.load('700 40px Outfit'),document.fonts.load('500 40px Outfit'),
   document.fonts.load('800 40px "JetBrains Mono"'),document.fonts.load('700 40px "JetBrains Mono"'),
   document.fonts.load('italic 400px "Instrument Serif"'),document.fonts.load('400 40px "Instrument Serif"')
  ]);
  await document.fonts.ready;
 }catch(e){}
 heroStats();buildChips();renderGrid();bindUI();updatePinBar();initBG();
 requestAnimationFrame(loop);
 $$('#segDens button').forEach(x=>x.classList.toggle('on',x.dataset.dens===state.dens));
 $$('#segFmt button').forEach(x=>x.classList.toggle('on',x.dataset.fmt===state.fmt));
 setTimeout(()=>{
  const dup=POSTS.length-new Set(POSTS.map(p=>p.title.toLowerCase())).size;
  toast(`Acervo pronto: ${POSTS.length} peças · ${Object.keys(LAYOUTS).length} layouts · ${dup===0?'0 repetições':dup}`);
 },700);
}
if(typeof window!=='undefined'&&typeof document!=='undefined'&&document.getElementById&&document.getElementById('app')){
 (document.fonts&&document.fonts.ready?document.fonts.ready.then(boot,boot):boot());
}
if(typeof window!=='undefined'){
 window.__EXME={buildPosts,buildScene,drawScene,tickAnim,svgString,promptText,posts:()=>POSTS,BUILD,PILLARS,LAYOUTS,PALS,SEGS,LAY_ORDER,buildChips,renderGrid,textW,wrapLines,fitBlock,fitSize,fit1,oneLine,stack,scene}
}
