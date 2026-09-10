# Guia de Incorporação (Embed) - Cathlabflix Sessions

Este guia ensina como integrar o player e a grade de aulas do **Cathlabflix Sessions** dentro de qualquer site (WordPress, Elementor, Webflow, Wix, HubSpot, Shopify, React ou HTML puro).

---

## 🚀 Método 1: Script Embed de 1 Linha (Recomendado)

O método mais rápido, limpo e automático. Insere o player, auto-ajusta a altura dinamicamente sem barras de rolagem e mantém o fundo transparente.

Cole este código no editor HTML do seu site:

```html
<div id="cathlabflix-sessions"></div>
<script src="https://cathlabflix-sessions.vercel.app/embed.js" async></script>
```

### Por que usar este método?
- ✅ **Auto-Redimensionamento Dinâmico**: Conforme você abre ou fecha as aulas, a altura se ajusta sozinha sem criar barra de rolagem dupla.
- ✅ **Fundo 100% Transparente**: O fundo azul do seu próprio site aparece perfeitamente.
- ✅ **Zero Manutenção**: Quando as aulas ou o design forem atualizados na Vercel, o seu site receberá a atualização automaticamente.

---

## 📱 Método 2: Iframe HTML Direto com Auto-Ajuste de Altura

Caso a sua plataforma (ex: alguns blocos de CMS) não permita scripts externos, use o `<iframe>` direto acompanhado do script ouvinte de altura:

```html
<!-- Contêiner do Iframe Cathlabflix -->
<iframe 
  id="cathlabflix-frame"
  src="https://cathlabflix-sessions.vercel.app" 
  width="100%" 
  height="750" 
  frameborder="0" 
  scrolling="no"
  allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
  allowtransparency="true"
  style="background: transparent; border: none; max-width: 980px; width: 100%; margin: 0 auto; display: block; overflow: hidden; transition: height 0.25s ease-out;"
></iframe>

<!-- Script de Sincronização Dinâmica de Altura -->
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

## 🎨 Como Inserir em Diferentes Plataformas

### 1. WordPress / Elementor
1. No Elementor, arraste o widget **HTML** (Código HTML).
2. Cole o código do **Método 1** ou **Método 2**.
3. Clique em **Atualizar**.

### 2. Webflow
1. Adicione um elemento **Embed** (HTML Embed Code).
2. Cole o código.
3. Salve e publique as alterações.

### 3. HTML Puro ou PHP
Cole o código na seção onde você deseja que o player apareça, por exemplo:
```html
<section class="aulas-section" style="background-color: #0b1a4a; padding: 60px 20px;">
  <!-- Embed Cathlabflix Sessions -->
  <div id="cathlabflix-sessions"></div>
  <script src="https://cathlabflix-sessions.vercel.app/embed.js" async></script>
</section>
```
