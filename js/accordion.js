/**
 * Cathlabflix Sessions - Controlador do Accordion de Vídeos
 * 
 * Regras Obrigatórias e Melhores Práticas:
 * 1. Apenas um item aberto por vez (Single-Open Accordion). Ao abrir a "Aula B", a "Aula A" fecha automaticamente.
 * 2. Estado fechado: Barra azul escura com título/palestrante e chevron para baixo.
 * 3. Estado aberto: Expande suavemente revelando o iframe 16:9 (padding-bottom: 56.25%) e chevron gira 180°.
 * 4. Lazy-Loading do Player: O iframe é injetado sob demanda apenas ao abrir para otimizar performance.
 * 5. Pausa/Destruição de Áudio: Ao fechar ou trocar de aula, o iframe é desmontado para não continuar tocando áudio em background.
 */

class VideoAccordionManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentlyOpenItem = null;
    this._handleHeaderClick = this._handleHeaderClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  /**
   * Inicializa os event listeners do container via Event Delegation
   */
  init() {
    if (!this.container) return;
    this.container.addEventListener('click', this._handleHeaderClick);
    this.container.addEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Destrói listeners e libera memória
   */
  destroy() {
    if (!this.container) return;
    this.closeAll();
    this.container.removeEventListener('click', this._handleHeaderClick);
    this.container.removeEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Manipulador de cliques via delegação de eventos
   */
  _handleHeaderClick(event) {
    const headerBtn = event.target.closest('.accordion-header');
    if (!headerBtn) return;

    event.preventDefault();
    const item = headerBtn.closest('.accordion-item');
    if (!item) return;

    this.toggleItem(item);
  }

  /**
   * Acessibilidade de teclado: Enter e Barra de Espaço
   */
  _handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      const headerBtn = event.target.closest('.accordion-header');
      if (headerBtn) {
        event.preventDefault();
        const item = headerBtn.closest('.accordion-item');
        if (item) this.toggleItem(item);
      }
    }
  }

  /**
   * Alterna estado do item: Se estiver aberto, fecha. Se estiver fechado, fecha o anterior e abre este.
   * @param {HTMLElement} itemElement 
   */
  toggleItem(itemElement) {
    const isOpen = itemElement.classList.contains('is-open');

    if (isOpen) {
      this.closeItem(itemElement);
    } else {
      // Regra estrita: Fechar qualquer outro accordion aberto antes de abrir o novo
      if (this.currentlyOpenItem && this.currentlyOpenItem !== itemElement) {
        this.closeItem(this.currentlyOpenItem);
      }
      this.openItem(itemElement);
    }
  }

  /**
   * Abre o accordion, injeta o iframe do Vimeo no container 16:9 e rotaciona o chevron
   * @param {HTMLElement} itemElement 
   */
  openItem(itemElement) {
    const headerBtn = itemElement.querySelector('.accordion-header');
    const panel = itemElement.querySelector('.accordion-body');
    const playerContainer = itemElement.querySelector('.video-responsive-wrapper');

    // 1. Atualiza classes e estados ARIA
    itemElement.classList.add('is-open');
    if (headerBtn) headerBtn.setAttribute('aria-expanded', 'true');
    if (panel) panel.setAttribute('aria-hidden', 'false');

    // 2. Injeta o iframe sob demanda (Lazy Loading) caso ainda não esteja presente
    if (playerContainer && !playerContainer.querySelector('iframe')) {
      const embedUrl = playerContainer.dataset.embedUrl;
      const videoTitle = playerContainer.dataset.videoTitle || "Aula Vimeo";

      if (embedUrl) {
        // Exibe feedback visual breve de carregamento
        playerContainer.innerHTML = `
          <div class="video-placeholder">
            <div class="video-placeholder-spinner"></div>
            <span style="font-size: 0.85rem; font-weight: 500;">Carregando player Vimeo...</span>
          </div>
        `;

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('title', videoTitle);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media');
        iframe.setAttribute('allowfullscreen', 'true');

        // Quando o iframe carregar, remove o placeholder
        iframe.addEventListener('load', () => {
          const placeholder = playerContainer.querySelector('.video-placeholder');
          if (placeholder) placeholder.remove();
        });

        playerContainer.appendChild(iframe);
      }
    }

    this.currentlyOpenItem = itemElement;

    // Scroll sutil e inteligente caso o item esteja fora da área visível superior
    setTimeout(() => {
      const rect = itemElement.getBoundingClientRect();
      if (rect.top < 80) {
        window.scrollBy({
          top: rect.top - 90,
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  /**
   * Fecha o accordion e remove o iframe para interromper imediatamente a reprodução de áudio
   * @param {HTMLElement} itemElement 
   */
  closeItem(itemElement) {
    if (!itemElement) return;

    const headerBtn = itemElement.querySelector('.accordion-header');
    const panel = itemElement.querySelector('.accordion-body');
    const playerContainer = itemElement.querySelector('.video-responsive-wrapper');

    // 1. Atualiza classes e ARIA
    itemElement.classList.remove('is-open');
    if (headerBtn) headerBtn.setAttribute('aria-expanded', 'false');
    if (panel) panel.setAttribute('aria-hidden', 'true');

    // 2. Limpa o iframe para cessar reprodução de vídeo/áudio imediatamente
    if (playerContainer) {
      // Um pequeno delay de 250ms acompanha o término da animação CSS antes de desmontar o DOM
      setTimeout(() => {
        if (!itemElement.classList.contains('is-open')) {
          playerContainer.innerHTML = '';
        }
      }, 250);
    }

    if (this.currentlyOpenItem === itemElement) {
      this.currentlyOpenItem = null;
    }
  }

  /**
   * Fecha todos os accordions ativos
   */
  closeAll() {
    if (this.currentlyOpenItem) {
      this.closeItem(this.currentlyOpenItem);
    }
    const openItems = this.container.querySelectorAll('.accordion-item.is-open');
    openItems.forEach(item => this.closeItem(item));
  }
}

// Exporta globalmente
window.VideoAccordionManager = VideoAccordionManager;
