/* ============ 2b. GERADOR DO ACERVO (90 peças) ============ */
const DEFAULT_PJ={
 1:'Floodlit community football stadium at night, young players walking out of the tunnel, green pitch glow, cinematic sports documentary',
 2:'Two hands exchanging a football sticker card over a training-ground fence, evening light, shallow depth of field',
 3:'Printed sticker album page being filled with cards on a wooden table, warm lamp light, tactile paper texture',
 4:'Small club grandstand under floodlights, officials shaking hands on the pitch, dusk, wide documentary shot',
 5:'Three generations of a family looking at a phone together at a kitchen table, warm light, joyful documentary',
 6:'Rare gold-foil football card under a hard spotlight on dark velvet, dust in the air, macro studio shot'
};
const PALETTE_BRIEF={
 volt:'deep navy background #080B11, electric pitch-green #00E676 highlights, cyan rim light',
 noir:'near-black background, warm gold foil #F59E0B, ivory type, luxury trading-card lighting',
 chalk:'saturated grass-green field, chalk-white lines, flat daylight, sports-broadcast minimalism',
 night:'midnight blue stadium, cold cyan floodlight, hard shadows, high contrast',
 ember:'oxblood and charcoal, amber floodlight haze, matchday tension, grain',
 concrete:'brutalist concrete grey, acid lime accents, Swiss grid, high contrast type',
 paper:'warm editorial paper #F3EEE2, black ink, one green accent, magazine art-direction',
 mint:'pale mint white, deep green ink, soft domestic light, family warmth'
};
function safeStr(v,fb){return (v==null||v==='')?(fb||''):String(v)}
function buildPosts(){
 const posts=[];let n=1;
 const usedCta=[],usedFirst=[];
 const pickFrom=(pool,stride,recent)=>{let j=((n-1)*stride)%pool.length,g=0;
  while(g++<pool.length&&recent.indexOf(j)>=0)j=(j+1)%pool.length;
  recent.push(j);if(recent.length>7)recent.shift();return j};
 const r0=mulberry32(77);
 const pool=ROSTER.map(p=>({name:p[0],num:p[1],pos:p[2]}));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(r0()*(i+1));const t=pool[i];pool[i]=pool[j];pool[j]=t}
 const used=new Set();
 const takePlayer=wanted=>{
  let idx=pool.findIndex((p,i)=>!used.has(i)&&(!wanted||p.pos===wanted));
  if(idx<0)idx=pool.findIndex((p,i)=>!used.has(i));
  if(idx<0)idx=n%pool.length;else used.add(idx);
  return pool[idx];
 };
 for(const pil of PIL_ORDER){
  const list=DATA[pil]||[];
  for(const e of list){
   const r=mulberry32(n*7919+313);
   const club=CLUBS[e.club!=null?((e.club%CLUBS.length)+CLUBS.length)%CLUBS.length:(n*5+pil)%CLUBS.length];
   const esc=e.esc||ESC[Math.floor(r()*ESC.length)];
   const player=e.lay==='hero'?takePlayer(e.pos):pool[Math.floor(r()*pool.length)];
   const stats=()=>[68+Math.floor(r()*30),66+Math.floor(r()*32),74+Math.floor(r()*25)];
   const s=stats();
   /* ------- payloads por layout, com defaults ------- */
   const hero=Object.assign({line:'',foot:'CADERNETA OFICIAL '+club.short+' · ESCALÕES DE FORMAÇÃO',
    stats:[['RITMO',s[0]],['TÉCNICA',s[1]],['MORAL',s[2]]]},e.hero||{});
   const metric=Object.assign({kicker:club.short,tag:'EXME',val:'100%',lab:e.t,items:[[pil===4?'CLUBE':'COMUNIDADE','EXME']],foot:''},e.metric||{});
   const albumPct=e.album&&e.album.pct!=null?e.album.pct:(0.3+r()*.6);
   const slots=21;const filledCount=Math.round(albumPct*slots);
   const ar=mulberry32(n*131+7);
   const pattern=new Array(slots).fill(0);
   const order=[...Array(slots).keys()];
   for(let i=order.length-1;i>0;i--){const j=Math.floor(ar()*(i+1));const t=order[i];order[i]=order[j];order[j]=t}
   order.slice(0,filledCount).forEach(i=>pattern[i]=1);
   const spIdx=e.album&&e.album.special!=null?clamp((e.album.special|0)+1,1,slots-2):Math.floor(slots*.7);
   pattern[spIdx]=2;
   const album=Object.assign({kicker:'CADERNETA '+club.short,pct:albumPct,need:Math.max(0,Math.round((1-albumPct)*120)),
    total:120,blocks:Math.max(1,Math.ceil(albumPct*4))+'/4',pattern,special:spIdx,note:'',line:''},e.album||{},{pattern});
   const quote=Object.assign({q:'',who:'',role:'COMUNIDADE · '+club.short,strap:'',strapKicker:'COMUNIDADE'},e.quote||{});
   const kinetic=Object.assign({lines:[e.t],band:'EXME · CROMOS · TROCAS · CADERNETAS',band2:'APP STORE & GOOGLE PLAY · EXME.CLUB',sub:'',chip:''},e.kinetic||{});
   kinetic.lines=(kinetic.lines||[]).slice(0,4);
   const steps=Object.assign({kicker:'COMO FUNCIONA',items:[],foot:''},e.steps||{});
   steps.items=(steps.items||[]).map(it=>Array.isArray(it)?[String(it[0]),String(it[1])]:[it.h,it.d]);
   if(!steps.items.length)steps.items=[['Instala a app','Grátis na App Store e no Google Play'],['Escolhe o teu clube','Caderneta oficial por escalão'],['Abre a tua saqueta','O primeiro cromo é oferecido']];
   const vs=Object.assign({kicker:'COMPARA',a:{h:'ANTES',rows:[]},b:{h:'AGORA',rows:[]},badge:'⇄',foot:''},e.vs||{});
   vs.a=Object.assign({h:'ANTES',rows:[]},vs.a);vs.b=Object.assign({h:'AGORA',rows:[]},vs.b);
   const norm=r=>(r||[]).map(x=>Array.isArray(x)?[String(x[0]),x[1]==null?'':String(x[1])]:[String(x),'']);
   vs.a.rows=norm(vs.a.rows);vs.b.rows=norm(vs.b.rows);
   const match=Object.assign({league:'ESCALÕES DE FORMAÇÃO',line:club.short,away:'',time:'10:00',venue:club.venue,
    listTitle:'À PORTA DO ESTÁDIO',list:[],stub:'APRESENTA A APP À ENTRADA',date:'SÁB · '+club.city.toUpperCase(),foot:''},e.match||{});
   match.list=(match.list||[]).map(x=>Array.isArray(x)?[String(x[0]),x[1]==null?'':String(x[1])]:[String(x),'']);
   if(match.awayClub)match.awayCrest=CLUBS[match.awayClub];
   const lineup=Object.assign({kicker:'BOLETIM · '+club.short,deck:'',rows:[],note:'',foot:''},e.lineup||{});
   lineup.rows=(lineup.rows||[]).map(rw=>Array.isArray(rw)?[rw[0],rw[1],rw[2]]:[rw.num,rw.name,rw.pos]);
   if(!lineup.rows.length)lineup.rows=pool.slice(0,5).map(p=>[p.num,p.name,POSK[p.pos]]);
   const series=Object.assign({kicker:'SÉRIE 26/27',count:'',deck:'',items:[],foot:''},e.series||{});
   series.items=(series.items||[]).map(it=>it.length>=4?[it[0],it[1],it[2],it[3]]:[it[0],it[1],it[2],'']);
   const poster=Object.assign({kicker:'EXME · '+club.short,lines:String(e.t||'').toUpperCase().split(' '),note:e.sub||'',rail:'',data:''},e.poster||{});
   poster.lines=(poster.lines||[]).filter(Boolean).slice(0,5);
   poster.rail=String(poster.rail||'').replace(/\s+/g,' ').replace(/\b([A-ZÁÂÃÉÊÍÓÔÕÚ])[a-záâãéêíóôõú]/g,(m,c,i)=>i===0?c.toUpperCase():c).toUpperCase();
   poster.data=String(poster.data||'');
   const faq=Object.assign({kicker:'PERGUNTAS',items:[],foot:''},e.faq||{});
   faq.items=(faq.items||[]).map(x=>[String(x[0]),String(x[1])]);
   if(!faq.items.length)faq.items=[['É grátis?','A app e a caderneta digital são grátis.'],['Como recebo o álbum?','Depois dos 100%, em sete dias úteis.']];
   const pack=Object.assign({kicker:'SAQUETA DIGITAL',unit:'5 CROMOS',rows:[],note:''},e.pack||{});
   pack.rows=(pack.rows||[]).map(x=>[String(x[0]),x[1]?String(x[1]):'',x[2]?String(x[2]):'']);
   if(!pack.rows.length)pack.rows=[['Cromo do escalão','GARANTIDO','1 em 1'],['Foil do clube','RARO','1 em 24'],['Cromo prata','PRATA','1 em 8']];
   /* ------- texto ------- */
   const rep=v=>String(v).replace(/\{club\}/g,club.name).replace(/\{short\}/g,club.short).replace(/\{city\}/g,club.city);
   const cta=rep(e.cta||CTA_POOL[pickFrom(CTA_POOL,7,usedCta)]);
   const tags=[...new Set([...(e.tags||[]),...PILLARS[pil].tags,club.tag].concat(BASE_TAGS))].slice(0,9);
   const title=rep(e.t), sub=rep(e.sub||'');
   const caption=[rep(e.h||''),rep(e.b||''),cta,tags.join(' ')].filter(Boolean).join('\n\n');
   const photoDesc=rep(e.pj||DEFAULT_PJ[pil]);
   const alt=rep(e.alt||`${title}. Arte da campanha ExMe para ${club.name} (${esc}) — cromo e caderneta digital com álbum físico em casa.`);
   const first=e.first||FIRST_POOL[pickFrom(FIRST_POOL,5,usedFirst)];
   const prompt=[
    '# EXME · BRIEF DE IMAGEM — '+title.toUpperCase(),
    'PEÇA: '+idOf(n)+' · '+LAYOUTS[e.lay].name.toUpperCase()+' · PILAR '+pil+' — '+PILLARS[pil].label.toUpperCase()+' · CLUBE: '+club.name+' · ESCALÃO: '+esc,
    '',
    '## FOTOGRAFIA (Midjourney v6 · FLUX.1 dev)',
    photoDesc+'. Enquadramento documental, 35mm f/1.4, profundidade de campo curta, pele e tecido reais, zero pose publicitária.',
    '## GRADE DE COR — PALETA '+PALS[e.pal].name.toUpperCase()+'',
    PALETTE_BRIEF[e.pal]+'. Sombras densas, luz dura de holofote, grão fino.',
    '## NEGATIVO',
    'sem texto na imagem, sem marca d’água, sem logótipos de clubes ou marcas reais, sem números de camisola legíveis, sem sangue nem lesões, sem jogadores adultos de elite.',
    '## FORMATOS E LUVARES',
    'FEED 1080×1350 → --ar 4:5 --style raw --v 6  |  STORY 1080×1920 → --ar 9:16 --style raw --v 6',
    'Story: deixa 214 px no topo e 286 px na faixa inferior livres de rosto e de informação (UI do Instagram).',
    'O ponto focal deve coincidir com o recorte do layout (fotografia usada com zoom '+(0.9+(n%4)*.06).toFixed(2)+' e viés vertical '+(e.pos?e.pos[1].toFixed(2):'0.42')+').',
    '## TIPOGRAFIA COMPOSTA PELO ESTÚDIO (não gerar texto)',
    'Manchete Unbounded 800/900 · citação Instrument Serif itálico · corpo Outfit 500 · etiquetas JetBrains Mono 700.'
   ].join('\n');
   posts.push({
    n,id:idOf(n),pillar:pil,lay:e.lay,pal:e.pal,seg:e.seg,v:e.v!=null?e.v:0,
    club,esc,player,season:e.season||'ÉPOCA 26/27',img:e.img||'action',pos:e.pos||null,rarity:e.rarity||null,
    t:title,title,sub,caption,alt,first,prompt,tags,cta,
    hero,metric,album,quote,kinetic,steps,vs,match,lineup,series,poster,faq,pack,
    userImg:null,anim:['kinetic','pack','hero','poster'].includes(e.lay)
   });
   n++;
  }
 }
 return posts;
}
const FIRST_POOL=[
 '📲 Descarrega aqui → exme.club · App Store & Google Play',
 '🔗 Link na bio: app grátis e primeira saqueta oferecida',
 'ℹ️ Dúvidas? ajuda@exme.club — respondemos no próprio dia',
 '🔎 Procura “ExMe” na loja e ativa hoje a caderneta do teu clube',
 '📦 Álbuns impressos enviados em sete dias úteis depois dos 100%',
 '🏁 Abrimos uma caderneta nova por semana. Sugere o teu clube nos comentários',
 '🖨️ Cromos em papel 350 g, com o emblema do clube em relevo',
 '🧒 Serve para todos os escalões: Sub-7 a Sub-17',
 '🔁 Cada repetido vira automaticamente uma proposta de troca',
 '📣 Este post vive também no portal do clube, com o boletim em PDF',
 '🎯 Meta da semana: fechar o bloco 3 do escalão. Conta connosco para isso',
 '‍‍👧 Um adulto por criança cria a conta — e o álbum fica para os irmãos',
 '🏷️ Selo do clube em cada cromo: nada de ficheiros piratas',
 '📊 Estatísticas de troca da tua região, todas as semanas, na app',
 '🖨️ O teu nome sai impresso ao lado do cromo, tal como na caderneta de 1998',
 '💶 Grátis até ao fim da época. O clube recebe 30% de cada saqueta vendida'
];
function idOf(n){return 'exme-'+String(n).padStart(2,'0')}
function promptText(p){return p.prompt}
