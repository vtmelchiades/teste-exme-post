/* ============ 1. UNIVERSO DE MARCA ============ */
const BRAND={green:'#00E676',green2:'#10E868',cyan:'#00F0FF',gold:'#F59E0B',navy:'#080B11',ink:'#EAF9F1',url:'exme.club',handle:'@exme.club'};

/* Fotografia: IDs Unsplash verificados; se falharem é usado um fallback determinístico
   (Lorem Picsum, com CORS) para que a arte nunca apareça partida. */
const UNSPLASH={
 stadium:'photo-1522778119026-d647f0596c20', stadium2:'photo-14899444440615-453fc2b6a9a9', dusk:'photo-1431324155629-1a6deb1dec8d',
 seats:'photo-1518091043644-c1d4457512c6', tunnel:'photo-1511886929837-354d827aae26', lights:'photo-1502904550040-7534597429ae',
 nightPitch:'photo-1531415074968-036ba1b575da', pitch:'photo-1574629810360-7efbbe195018', grass:'photo-1518604666860-9ed391f76460',
 fog:'photo-1487956382158-bb926046304a', net:'photo-1486286701208-1d58e9338013', goalball:'photo-1459865264687-595d652de67e',
 action:'photo-1579952363873-27f3bade9f55', action2:'photo-1553778263-73a83bab9b0c', nightAction:'photo-1529900748604-07564a03e7a6',
 huddle:'photo-1517466787929-bc90951d0974', kids:'photo-1543351611-58f69d7c1781', kids2:'photo-1551958219-acbc608c6377',
 crowd:'photo-1493711662062-fa541adb3fc8', crowd2:'photo-1471295253337-3ceaaedca402', trophy:'photo-1560012057-4372e14c5085'
};
const IMG_KEYS=Object.keys(UNSPLASH);
const imgUrl=(k,w=1400)=>`https://images.unsplash.com/${UNSPLASH[k]||UNSPLASH.pitch}?auto=format&fit=crop&w=${w}&q=80`;
const imgFallback=k=>`https://picsum.photos/seed/exme-${k}/1080/1350`;

/* ---- 8 paletas: a arte não é só escura + verde ---- */
const PALS={
 volt:{name:'Volt',mode:'d',
   bg:'#080B11',bg2:'#0F1521',panel:'#131B29',panelInk:'#EAF9F1',ink:'#EAF9F1',
   mut:'rgba(234,249,241,.72)',dim:'rgba(234,249,241,.42)',line:'rgba(234,249,241,.13)',
   a1:'#00E676',a1ink:'#04170D',a2:'#00F0FF',a3:'#F59E0B',
   glow:'rgba(0,230,118,.16)',grid:'rgba(0,230,118,.09)',foil:['#F59E0B','#FFE9B8','#00E676','#7CFFD4','#00F0FF'],
   photoOp:.2,photoDuo:['#080B11','#10E868'],photoTint:.14},
 noir:{name:'Noir Foil',mode:'d',
   bg:'#0A0A0D',bg2:'#131318',panel:'#1A1A21',panelInk:'#F6F2E7',ink:'#F6F2E7',
   mut:'rgba(246,242,231,.72)',dim:'rgba(246,242,231,.4)',line:'rgba(246,242,231,.13)',
   a1:'#F59E0B',a1ink:'#191000',a2:'#FFE9B8',a3:'#00E676',
   glow:'rgba(245,158,11,.15)',grid:'rgba(245,158,11,.08)',foil:['#F59E0B','#FFF3D0','#C97E06','#FFE9B8','#00E676'],
   photoOp:.26,photoDuo:['#0A0A0D','#F59E0B'],photoTint:.1},
 chalk:{name:'chalk · relvado',mode:'d',
   bg:'#06301D',bg2:'#0A4227',panel:'#0C4B2C',panelInk:'#F1FFF6',ink:'#F1FFF6',
   mut:'rgba(241,255,246,.76)',dim:'rgba(241,255,246,.44)',line:'rgba(241,255,246,.2)',
   a1:'#FFFFFF',a1ink:'#06301D',a2:'#9CFFDA',a3:'#F5FF4B',
   glow:'rgba(156,255,218,.14)',grid:'rgba(255,255,255,.14)',foil:['#FFFFFF','#9CFFDA','#F5FF4B','#FFFFFF','#9CFFDA'],
   photoOp:.3,photoDuo:['#06301D','#9CFFDA'],photoTint:.06},
 night:{name:'Night Floodlight',mode:'d',
   bg:'#070C18',bg2:'#0C1424',panel:'#101A2E',panelInk:'#E6F1FF',ink:'#E6F1FF',
   mut:'rgba(230,241,255,.72)',dim:'rgba(230,241,255,.42)',line:'rgba(230,241,255,.13)',
   a1:'#00F0FF',a1ink:'#02141A',a2:'#7CFFD4',a3:'#F59E0B',
   glow:'rgba(0,240,255,.14)',grid:'rgba(0,240,255,.08)',foil:['#00F0FF','#B8FBFF','#00E676','#FFFFFF','#00F0FF'],
   photoOp:.24,photoDuo:['#070C18','#00F0FF'],photoTint:.1},
 ember:{name:'Ember Matchday',mode:'d',
   bg:'#160608',bg2:'#220A0C',panel:'#2C0F12',panelInk:'#FFEDE4',ink:'#FFEDE4',
   mut:'rgba(255,237,228,.72)',dim:'rgba(255,237,228,.42)',line:'rgba(255,237,228,.14)',
   a1:'#FF6A3D',a1ink:'#1A0500',a2:'#F59E0B',a3:'#FFE9B8',
   glow:'rgba(255,106,61,.16)',grid:'rgba(255,106,61,.08)',foil:['#F59E0B','#FFD27A','#FF6A3D','#FFE9B8','#FF6A3D'],
   photoOp:.26,photoDuo:['#160608','#FF6A3D'],photoTint:.08},
 concrete:{name:'Concrete Brut',mode:'d',
   bg:'#14161A',bg2:'#1C1F25',panel:'#23272F',panelInk:'#F2F1EC',ink:'#F2F1EC',
   mut:'rgba(242,241,236,.7)',dim:'rgba(242,241,236,.4)',line:'rgba(242,241,236,.14)',
   a1:'#D8FF3A',a1ink:'#12160B',a2:'#00E676',a3:'#9AA3B2',
   glow:'rgba(216,255,58,.1)',grid:'rgba(242,241,236,.07)',foil:['#D8FF3A','#F2F1EC','#9AA3B2','#D8FF3A','#F2F1EC'],
   photoOp:.22,photoDuo:['#14161A','#D8FF3A'],photoTint:.12},
 paper:{name:'Paper Editorial',mode:'l',
   bg:'#F3EEE2',bg2:'#E8E1D1',panel:'#FBF8F0',panelInk:'#101913',ink:'#0F1712',
   mut:'rgba(15,23,18,.74)',dim:'rgba(15,23,18,.5)',line:'rgba(15,23,18,.16)',
   a1:'#0B0E14',a1ink:'#F7F4EC',a2:'#00A35B',a3:'#B4650A',
   glow:'rgba(0,163,91,.1)',grid:'rgba(15,23,18,.07)',foil:['#0F1712','#B4650A','#00A35B','#F7F4EC','#0F1712'],
   photoOp:.92,photoDuo:null,photoTint:0},
 mint:{name:'Mint Family',mode:'l',
   bg:'#EFF7EF',bg2:'#E2EEE5',panel:'#FAFDF8',panelInk:'#0C1A12',ink:'#0C1A12',
   mut:'rgba(12,26,18,.74)',dim:'rgba(12,26,18,.5)',line:'rgba(12,26,18,.14)',
   a1:'#00A35B',a1ink:'#F4FFF9',a2:'#0B7A45',a3:'#C97E06',
   glow:'rgba(0,163,91,.1)',grid:'rgba(12,26,18,.06)',foil:['#00A35B','#7CFFD4','#C97E06','#0B7A45','#7CFFD4'],
   photoOp:.9,photoDuo:null,photoTint:0}
};
const PAL_ALT={volt:'paper',paper:'volt',noir:'mint',mint:'noir',chalk:'concrete',concrete:'chalk',night:'ember',ember:'night'};
const PAL_ORDER=['volt','noir','chalk','night','ember','concrete','paper','mint'];

/* ---- clubes: cores reais de emblema → a arte muda de clube a clube ---- */
const CLUBS=[
 {name:'Portimonense SC',short:'PORTIMONENSE',city:'Portimão',tag:'#PortimonenseSC',ini:'PSC',venue:'Estádio Municipal de Portimão',c1:'#12161C',c2:'#F4F4F2',kit:'stripes'},
 {name:'AC Marinhense',short:'AC MARINHENSE',city:'Marinha Grande',tag:'#ACMarinhense',ini:'ACM',venue:'Estádio Municipal da Marinha Grande',c1:'#0B7A45',c2:'#F4F4F2',kit:'halves'},
 {name:'SC Cruz',short:'SC CRUZ',city:'Odivelas',tag:'#SCCruz',ini:'SCC',venue:'Campo da Cruz',c1:'#C4283C',c2:'#F4F4F2',kit:'sash'},
 {name:'Oriental RC',short:'ORIENTAL RC',city:'Lisboa',tag:'#OrientalRC',ini:'ORC',venue:'Campo do Oriental',c1:'#12161C',c2:'#F59E0B',kit:'halves'},
 {name:'União de Leiria',short:'UNIÃO DE LEIRIA',city:'Leiria',tag:'#UniaoDeLeiria',ini:'UDL',venue:'Estádio Municipal de Leiria',c1:'#C0263A',c2:'#F4F4F2',kit:'stripes'},
 {name:'Catujalense',short:'CATUJALENSE',city:'Unhais da Serra',tag:'#Catujalense',ini:'CAT',venue:'Campo de Unhais',c1:'#1D4ED8',c2:'#F4F4F2',kit:'sash'}
];
const ESC=['Sub-7','Sub-9','Sub-11','Sub-13','Sub-15','Sub-17'];
const ROSTER=[
 ['Tomás Ferraz',7,'MED'],['Afonso Cunha',4,'DEF'],['Martim Leal',9,'AV'],['Duarte Palma',10,'MED'],['Gonçalo Vilar',1,'GR'],
 ['Francisco Barros',3,'DEF'],['Rafael Mouta',8,'MED'],['Bernardo Seixas',11,'AV'],['Vicente Rocha',6,'MED'],['Gabriel Tavares',5,'DEF'],
 ['Henrique Casaca',2,'DEF'],['Lourenço Baeta',14,'AV'],['Simão Antunes',16,'MED'],['Rodrigo Vale',23,'DEF'],['Miguel Saraiva',19,'AV'],
 ['Leonardo Cruz',17,'MED'],['Ariel Nogueira',21,'GR'],['Dinis Faria',13,'DEF'],['Salvado Pinto',22,'MED'],['Tristão Coelho',20,'AV'],
 ['Baltasar Reis',15,'DEF'],['Nuno Ferramento',18,'AV'],['Tiago Sottomaior',12,'GR'],['Manuel Vasques',24,'MED'],['Guimarães Louro',25,'DEF'],
 ['Álvaro Buescas',26,'AV'],['Natanael Rocha',27,'MED'],['Estêvão Carreira',28,'DEF'],['Joaquim Sério',29,'AV'],['Olívio Marques',30,'GR']
];
const POSK={GR:'Guarda-redes',DEF:'Defesa',MED:'Médio',AV:'Avançado'};

/* ---- 6 pilares editoriais ---- */
const PILLARS={
 1:{label:'Lançamentos & Cadernetas de Clube',short:'LANÇAMENTOS',icon:'sparkles',accent:'#00E676',
    tags:['#CadernetaExMe','#LançamentoOficial']},
 2:{label:'Trocas & Smart Match',short:'TROCAS',icon:'shuffle',accent:'#00F0FF',
    tags:['#SmartMatch','#ZeroRepetidos','#TradeJennie']},
 3:{label:'A Experiência Phygital',short:'PHYGITAL',icon:'package',accent:'#F59E0B',
    tags:['#ExperiênciaPhygital','#SaquetasDigitais','#ÁlbumFísico']},
 4:{label:'Clubes & Parceiros (B2B)',short:'CLUBES',icon:'building',accent:'#D8FF3A',
    tags:['#ClubesDeFormação','#ReceitaPartilhada','#TalentoPortuguês']},
 5:{label:'Comunidade, Família & Cultura',short:'COMUNIDADE',icon:'users',accent:'#10E868',
    tags:['#CulturaColecionador','#Balneário','#FamíliaColecionadora']},
 6:{label:'Raridades, Séries & Colecionismo',short:'RARIDADES',icon:'gem',accent:'#F59E0B',
    tags:['#RaridadesExMe','#FoilDourado','#SérieLimitada']}
};
const PIL_ORDER=[1,2,3,4,5,6];

/* ---- 13 layouts de arte ---- */
const LAYOUTS={
 hero:{name:'Cromo Hero',icon:'card',desc:'Cartão de cromo em destaque, com moldura foil e estatísticas.'},
 pack:{name:'Saqueta',icon:'pack',desc:'Saqueta rasgada com o que cai dentro e probabilidades de raridade.'},
 album:{name:'Página de Caderneta',icon:'grid',desc:'Grelha de slots preenchidos com anel de progresso.'},
 metric:{name:'Métrica Gigante',icon:'hash',desc:'Número gigante + três dados de apoio.'},
 quote:{name:'Testemunho',icon:'quote',desc:'Citação em serifa com autor e selo verificado.'},
 kinetic:{name:'Tipografia Cinética',icon:'zap',desc:'Manchete empilhada com faixas a rolar (loop).'},
 steps:{name:'Três Passos',icon:'steps',desc:'Guia numerado em cartões, com ícones.'},
 vs:{name:'Confronto A ⇄ B',icon:'shuffle',desc:'Duas metades em contraste: antes/depois, app/papel.'},
 matchday:{name:'Bilhete de Jogo',icon:'ticket',desc:'Bilhete fenado com hora, casa e lista de ritual.'},
 lineup:{name:'Boletim de Escalação',icon:'list',desc:'Folha de jornal com dorsal, nome e posição.'},
 series:{name:'Grelha de Série',icon:'layers',desc:'Seis cromos miniatura com etiquetas de raridade.'},
 poster:{name:'Pôster Editorial',icon:'type',desc:'Foto sangrada com tipografia a peso total.'},
 faq:{name:'Perguntas Frequentes',icon:'chat',desc:'Pares pergunta/resposta em cartões.'}
};
const LAY_ORDER=['hero','pack','album','metric','quote','kinetic','steps','vs','matchday','lineup','series','poster','faq'];

/* ---- 10 segmentos de tom (só metadados: nunca entram na arte) ---- */
const SEGS={
 ritual:{name:'Ritual',icon:'moon',desc:'Gestos repetidos: a saqueta, o domingo, o balneário.'},
 nostalgia:{name:'Nostalgia',icon:'film',desc:'Anos 90, papel, cheiro a cromo, avós e netos.'},
 cultura:{name:'Cultura',icon:'book',desc:'O colecionismo como cultura popular portuguesa.'},
 prova:{name:'Prova social',icon:'check',desc:'Testemunhos, números e resultados de quem já usa.'},
 autoridade:{name:'Autoridade',icon:'building',desc:'Discurso institucional: clubes, parceiros, B2B.'},
 comunidade:{name:'Comunidade',icon:'users',desc:'Trocas, desafios, família, balneário.'},
 didatico:{name:'Didático',icon:'steps',desc:'Como se faz: passo a passo, dicas, FAQ.'},
 urgencia:{name:'Urgência',icon:'zap',desc:'Prazos, séries curtas, contas atrás — só esta semana.'},
 orgulho:{name:'Orgulho local',icon:'flag',desc:'A terra, o emblema, a bancada, a cidade.'},
 bastidor:{name:'Bastidor',icon:'camera',desc:'O que se passa fora do relvado: balneário, treinadores, pais.'}
};
const SEG_ORDER=['ritual','nostalgia','cultura','prova','autoridade','comunidade','didatico','urgencia','orgulho','bastidor'];
/* Tratamentos discretos por segmento (grão, inclinação, vinheta) — sem rótulos na arte. */
const SEG_FX={
 ritual:{grain:.055,tilt:-1.6,vig:.5,warm:0,soft:0},
 nostalgia:{grain:.12,tilt:.8,vig:.6,warm:.14,soft:.16},
 cultura:{grain:.07,tilt:0,vig:.42,warm:.05,soft:0},
 prova:{grain:.04,tilt:0,vig:.36,warm:0,soft:0},
 autoridade:{grain:.03,tilt:0,vig:.3,warm:0,soft:0},
 comunidade:{grain:.06,tilt:1.2,vig:.42,warm:.06,soft:0},
 didatico:{grain:.03,tilt:0,vig:.28,warm:0,soft:0},
 urgencia:{grain:.06,tilt:-2.4,vig:.55,warm:0,soft:0},
 orgulho:{grain:.07,tilt:.6,vig:.46,warm:.08,soft:0},
 bastidor:{grain:.14,tilt:0,vig:.62,warm:.1,soft:.22}
};

const BASE_TAGS=['#ExMe','#CromosDigitais','#FutebolDeFormação','#CadernetaDeCromos'];
const CTA_POOL=[
 '📲 App Store e Google Play — a primeira saqueta é por nossa conta.',
 '🔎 Procura “ExMe” na loja, escolhe o teu clube e ativa a caderneta.',
 '💬 Comenta “GUIA” e enviamos-te o passo a passo em menos de um minuto.',
 '🏟️ Dia de jogo: mostra o ecrã à entrada e leva um cromo de oferta.',
 '📦 Fechaste os 100%? O álbum impresso bate-te à porta em sete dias úteis.',
 '🔁 Tens repetidos? A app transforma-os em propostas de troca sozinha.',
 '🤝 Marca, fotógrafo, sócio ou pai de banco: a caderneta do teu clube abre em dois minutos.',
 '🎟️ Partilha este post com quem ainda guarda repetidos numa gaveta.',
 '⏳ A série 26/27 fecha a 31 de agosto; o que não sair agora só volta no próximo lançamento.',
 '👀 Espreita a ficha técnica do teu escalão na app antes do próximo treino.',
 '📣 Clubes: escrevam para parcerias@exme.club e pomos a vossa caderneta no ar.',
 '🧒 Jogas em que escalão? Diz nos comentários e abrimos-te a página.',
 '🖼️ Cola, fotografa e marca @exme.club — publicamos os melhores ângulos.',
 '🎯 Faltam-te quantos? O contador da app diz exatamente o que pedir.',
 '📩 Dúvidas? ajuda@exme.club responde no próprio dia, sem robôs.',
 '🔖 Guarda este post: é o mapa das trocas do teu clube nesta época.',
 '👪 Vai com os teus filhos abrir a primeira saqueta e depois conta-nos como correu.',
 '📍 A tua terra ainda não tem caderneta? Diz-nos o clube e tratamos disso.',
 '🏷️ As saquetas de lançamento são limitadas por clube — estão a sair depressa.',
 '✨ Procura “foil” na app e vê o que a tua região já trocou esta semana.',
 '📈 O ranking de escassez atualiza todas as noites, às 23h.',
 '📝 Escreve “FOIL” nos comentários e recebe o guia de raridades em PDF.',
 '🔒 Sem letras pequenas: a troca é 1:1, sempre, e o clube fica com parte da receita.',
 '🎁 As três primeiras famílias de cada escalão recebem álbum de oferta.',
 '🗓️ Próxima afixagem no portal do clube: sexta, 18h. Chega cedo.',
 '📷 Fotografa a tua página, marca o clube e entra na galeria da app.'
];
