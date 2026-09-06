# ExMe Post Studio

Estúdio browser-first para criar, visualizar e exportar **100 publicações phygital** da ExMe em feed 4:5 e story 9:16.

## O que mudou

- IDs internos e nomes de arquétipos/segmentações foram retirados da composição das artes exportadas. Continuam disponíveis apenas como metadados de organização dentro do estúdio.
- Foram acrescentados 40 posts novos: 10 arquétipos × 5 pilares × 2 variações.
- Os novos layouts incluem Liquid Chrome/SDF, Fluid Bloom/Domain Warp, CRT Halftone/Pixel Signal e Orbital Data Sculpture.
- Cada post tem copy PT-PT, imagem de referência, prompt para Midjourney/Flux, PNG 2×, SVG semântico, legenda e exportação ZIP.

## Motor gráfico progressivo

1. **WebGPU + WGSL**: background procedural com compute shader de partículas, domain warping e FBM quando o navegador suporta WebGPU.
2. **Three.js/WebGL**: fallback de partículas para browsers sem WebGPU.
3. **Canvas 2D + OffscreenCanvas**: renderização determinística e exportação raster compatível.
4. **SVG híbrido**: filtros `feTurbulence` + `feDisplacementMap` nos layouts procedurais, mantendo texto vetorial e editável.

O projecto funciona como um único `index.html`; basta servi-lo por HTTP para permitir o carregamento das fontes e imagens remotas. O botão **ZIP Master · 100 posts** compila o acervo completo.
