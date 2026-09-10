/**
 * Cathlabflix Sessions - Embed Script Loader
 * 
 * Permite incorporar o exibidor dinâmico do Cathlabflix Sessions em qualquer
 * website (WordPress, Elementor, Webflow, Wix, HTML puro) com uma única tag de script.
 * 
 * Características:
 * - Fundo 100% transparente (integração visual nativa)
 * - Largura máxima centralizada em 980px
 * - Auto-redimensionamento fluido de altura via postMessage (zero barras de rolagem duplas)
 * - Suporte total a autoplay e tela cheia para o player Vimeo
 */
(function() {
  var currentScript = document.currentScript;
  var container = document.getElementById('cathlabflix-sessions') || (currentScript && currentScript.parentElement);

  if (!container) {
    container = document.createElement('div');
    container.id = 'cathlabflix-sessions';
    document.body.appendChild(container);
  }

  // Cria o iframe com estilos de transparência e largura máxima de 980px
  var iframe = document.createElement('iframe');
  iframe.id = 'cathlabflix-embed-frame-' + Math.floor(Math.random() * 10000);
  iframe.src = 'https://cathlabflix-sessions.vercel.app';
  iframe.title = 'Cathlabflix Sessions';
  iframe.scrolling = 'no';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
  
  // Estilização isolada e responsiva
  iframe.style.width = '100%';
  iframe.style.maxWidth = '980px';
  iframe.style.minHeight = '480px';
  iframe.style.height = '750px';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.style.margin = '0 auto';
  iframe.style.background = 'transparent';
  iframe.style.overflow = 'hidden';
  iframe.style.transition = 'height 0.25s ease-out';

  // Listener dinâmico para auto-redimensionamento de altura
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'cathlabflix-sessions-resize' && e.data.height) {
      iframe.style.height = e.data.height + 'px';
    }
  });

  container.appendChild(iframe);
})();
