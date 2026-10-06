# Guia de Incorporação (Embed) - Cathlabflix Sessions

Este guia ensina como integrar o player de **Gravação** e a grade de **Aulas** do **Cathlabflix Sessions** dentro de qualquer site (WordPress, Elementor, Webflow, Wix, HubSpot, Shopify, React ou HTML puro).

---

## 🎯 Escolha o Conteúdo que Deseja Incorporar:

1. **[Embed de Gravação (Vídeos & Player Vimeo)](#1-embed-de-gravação-vídeos--player-vimeo)**
2. **[Embed de Aulas (Apresentações PPTX & Dias)](#2-embed-de-aulas-apresentações-pptx--dias)**

---

## 1. Embed de Gravação (Vídeos & Player Vimeo)

### 🚀 Opção A: Script de 1 Linha (Recomendado)
Insere o player de gravações com auto-ajuste de altura e fundo 100% transparente.

```html
<div id="cathlabflix-sessions"></div>
<script src="https://cathlabflix-sessions.vercel.app/embed.js" async></script>
```

### 📱 Opção B: Iframe HTML Direto
```html
<iframe 
  id="cathlabflix-frame"
  src="https://cathlabflix-sessions.vercel.app/solaci/gravação" 
  width="100%" 
  height="750" 
  frameborder="0" 
  scrolling="no" 
  allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
  allowtransparency="true" 
  style="background: transparent; border: none; max-width: 980px; width: 100%; margin: 0 auto; display: block; overflow: hidden; transition: height 0.25s ease-out;"
></iframe>

<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'cathlabflix-sessions-resize') {
      var iframe = document.getElementById('cathlabflix-frame');
      if (iframe && event.data.height) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>
```

---

## 2. Embed de Aulas (Apresentações PPTX & Dias)

### 🚀 Opção A: Script de 1 Linha (Recomendado)
Insere a grade de aulas/apresentações PPTX com auto-redimensionamento dinâmico.

```html
<div id="cathlabflix-aulas"></div>
<script src="https://cathlabflix-sessions.vercel.app/embed-aulas.js" async></script>
```

*(Você também pode usar `<script src="https://cathlabflix-sessions.vercel.app/embed.js" data-view="aulas" async></script>`)*

### 📱 Opção B: Iframe HTML Direto
```html
<iframe 
  id="cathlabflix-aulas-frame"
  src="https://cathlabflix-sessions.vercel.app/solaci/aulas" 
  width="100%" 
  height="350" 
  frameborder="0" 
  scrolling="no" 
  allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
  allowtransparency="true" 
  style="background: transparent; border: none; max-width: 980px; width: 100%; margin: 0 auto; display: block; overflow: hidden; transition: height 0.25s ease-out;"
></iframe>

<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'cathlabflix-sessions-resize') {
      var iframe = document.getElementById('cathlabflix-aulas-frame');
      if (iframe && event.data.height) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>
```

---

## 🎨 Como Inserir em Diferentes Plataformas

### 1. WordPress / Elementor
1. No Elementor, arraste o widget **HTML** (Código HTML).
2. Cole o código da Opção A ou B.
3. Clique em **Atualizar**.

### 2. Webflow
1. Adicione um elemento **Embed** (HTML Embed Code).
2. Cole o código.
3. Salve e publique as alterações.

### 3. Wix / Shopify
1. Adicione uma seção de **HTML Embed** ou **Custom Liquid / Code**.
2. Cole o código e publique.
