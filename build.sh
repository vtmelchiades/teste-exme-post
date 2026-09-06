#!/usr/bin/env bash
# Constrói o index.html final a partir de src/ (studio = 1 ficheiro, sem build-time deps)
set -euo pipefail
cd "$(dirname "$0")"
PARTS=(src/10-head.html src/20-brand.js src/30-corpus12.js src/31-corpus34.js src/32-corpus56.js src/35-generate.js src/40-engine.js src/42-render.js src/50-parts.js src/60-layouts.js src/70-ui.js src/99-tail.html)
cat "${PARTS[@]}" > index.html
node -e "
const fs=require('fs');const h=fs.readFileSync('index.html','utf8');
const i=h.lastIndexOf('<script>'),j=h.lastIndexOf('</script>');
try{new Function(h.slice(i+8,j));console.log('index.html OK —',h.length,'bytes,',h.split('\n').length,'linhas');}
catch(e){console.error('ERRO DE SINTAXE:',e.message);process.exit(1)}
"
