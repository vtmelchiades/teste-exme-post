# ExMe Post Studio

Acervo de 90 peças prontas a publicar para o lançamento do **ExMe** — a caderneta de cromos
digital dos clubes de formação (Sub-7 → Sub-17) — com gerador de arte vetorial em SVG animado.

Abrir `index.html` no browser. Sem build, sem dependências instaladas: o ficheiro é
auto-suficiente (Google Fonts e JSZip via CDN; os exports PNG/SVG funcionam offline).

## O acervo

| Pilar | Peças |
|---|---|
| Prova Social | 15 |
| Educativo / Como Funciona | 15 |
| Colecionismo & Raridade | 15 |
| Transação & Confiança | 15 |
| Comunidade & Clube | 15 |
| Família & Relacionamento | 15 |

**90 peças**, todas com manchete, sub, corpo de legenda, primeiro comentário, prompt de imagem
e tags próprios — não há duas peças iguais (90 manchetes únicas, 90 corpos únicos).

- **13 layouts** de arte: `hero`, `metric`, `poster`, `quote`, `pack`, `album`, `kinetic`,
  `lineup`, `matchday`, `series`, `steps`, `vs`, `faq` — cada um com 3 variantes (`post.v`).
- **8 paletas** (volt, noir, night, ember, concrete, chalk, paper, mint) com rotação
  automática de tom: 88 em 89 pares de peças consecutivas mudam de paleta.
- **Dois formatos**: feed 1080×1350 (4:5) e story/reels 1080×1920 (9:16), com zonas seguras
  próprias para a UI do TikTok/Instagram.

## Regras de arte

A peça vai para redes sociais, por isso **não leva nada de uso interno**:

- sem identificador de post (`EXM-001 / 90`);
- sem nome de arquétipo nem de segmentação (`nostalgia`, `ritual`, `cultura`…);
- sem pillar, slug, contadores de pipeline ou campos de produção.

Esses metadados vivem só na interface, no `catalogo.json` e nos nomes de ficheiro dos exports
(`exme-07-<slug-da-manchete>_story.png`). O que aparece na arte é conteúdo: marca ExMe, clube,
escalão, época, data/hora, dorsal, raridade e a manchete editorial.

A arte usa a **manchete** (`post.t`); o **gancho** (`post.h`) vive na legenda — nunca os dois
na mesma peça.

## Exportar

Cada peça: **PNG** (2×), **SVG** animado, **ZIP** (dois formatos), legenda, primeiro
comentário e prompt. Em lote: ZIP por pilar (com `calendario.csv`, `legenda.txt`,
`prompts.txt` e `README.txt`) e um ZIP master com o catálogo completo. Os SVG exportados
ficam no frame estático (t = 0,42) para o texto nunca sair cortado.

## Atalhos

Dentro do modal: `←` / `→` mudar de peça · `a` animação on/off · `p` paleta alternativa ·
`e` exportar PNG · `Esc` fechar. Na grelha: `/` procura · `d` densidade.
Filtros, procura e seleção ficam guardados em `localStorage`.

## Estrutura

```
index.html        ← ficheiro final (o que se abre)
build.sh          ← concatena src/* em index.html e valida o JS
src/10-head.html  ← <head>, CSS, markup do shell
src/20-brand.js   ← sistema: paletas, clubes, plantel, pilares, layouts, segmentações, unsplash
src/30..32-*.js   ← corpus dos 90 posts (15 por pilar, 2 pilares por ficheiro)
src/35-generate.js← buildPosts(): normaliza, preenche defaults, atribui tom/variante
src/40-engine.js  ← métricas de texto (wrap/fit), utilitários, scene()
src/42-render.js  ← drawScene → SVG, animações, raster para PNG
src/50-parts.js   ← fundo, selos, pills, rails, marcas, cartões de cromo
src/60-layouts.js ← os 13 layouts + fallback
src/70-ui.js      ← grelha, filtros, modal, exports, calendário, atalhos
```

Para reconstruir depois de editar `src/`:

```sh
./build.sh
```
