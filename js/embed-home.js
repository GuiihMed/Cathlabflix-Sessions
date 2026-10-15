/**
 * CathlabFlix - Embed Home Unified Controller & Router
 * Combina Home, Notícias (todas e individual), Agenda (mês e individual) e Busca em um único arquivo
 */

(function(global) {
  'use strict';

  let allNewsItems = [];
  let calendarInstance = null;
  let currentSearchQuery = '';
  let homeNewsPage = 1;
  const HOME_POSTS_PER_PAGE = 4;

  let allPostsPage = 1;
  const ALL_POSTS_PER_PAGE = 9;
  let activeCategoryFilter = 'all';

  let currentPost = null;
  let currentEvent = null;

  /**
   * Router do Embed SPA
   */
  const EmbedRouter = {
    currentView: 'home',

    init() {
      // Carrega rota inicial pela URL (hash ou query params)
      window.addEventListener('popstate', () => {
        this.resolveRouteFromLocation(false);
      });

      this.resolveRouteFromLocation(false);
    },

    resolveRouteFromLocation(pushState = true) {
      const hash = window.location.hash || '';
      const searchParams = new URLSearchParams(window.location.search);

      const viewParam = searchParams.get('view');
      const postId = searchParams.get('post') || searchParams.get('postId');
      const eventId = searchParams.get('event') || searchParams.get('eventId');

      if (postId) {
        this.navigateTo('post', { id: postId }, pushState);
        return;
      }

      if (eventId) {
        this.navigateTo('event', { id: eventId }, pushState);
        return;
      }

      if (hash.startsWith('#post')) {
        const id = hash.split('id=')[1] || hash.replace('#post-', '');
        this.navigateTo('post', { id }, pushState);
        return;
      }

      if (hash.startsWith('#evento') || hash.startsWith('#event')) {
        const id = hash.split('id=')[1] || hash.replace('#evento-', '');
        this.navigateTo('event', { id }, pushState);
        return;
      }

      if (hash === '#noticias' || hash === '#posts' || viewParam === 'posts') {
        this.navigateTo('posts', {}, pushState);
        return;
      }

      this.navigateTo('home', {}, pushState);
    },

    navigateTo(viewName, params = {}, pushState = true) {
      this.currentView = viewName;

      // Oculta todos os painéis e ativa o selecionado
      document.querySelectorAll('.embed-view-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`view${capitalize(viewName)}`) ||
                          document.getElementById(`view${capitalize(viewName)}Detail`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Atualiza tabs de navegação no topo se existirem
      document.querySelectorAll('.embed-nav-tab').forEach(tab => {
        const tabView = tab.getAttribute('data-view');
        if (viewName === 'post') {
          tab.classList.toggle('active', tabView === 'posts');
        } else {
          tab.classList.toggle('active', tabView === viewName);
        }
      });

      function safePushState(state, url) {
        if (!pushState) return;
        try {
          if (typeof window !== 'undefined' && window.history && typeof window.history.pushState === 'function') {
            window.history.pushState(state, '', url);
          }
        } catch (e) {
          // Em iframes sandboxed do Wix com restrições de mesma origem, ignora silenciosamente
        }
      }

      // Renderização específica de cada view
      if (viewName === 'home') {
        renderHomeNewsFeed();
        if (calendarInstance && typeof calendarInstance.renderContent === 'function') {
          calendarInstance.renderContent();
        }
        safePushState({ view: 'home' }, '#home');
      } else if (viewName === 'posts') {
        renderAllPostsView();
        safePushState({ view: 'posts' }, '#noticias');
      } else if (viewName === 'post') {
        renderPostDetailView(params.id);
        safePushState({ view: 'post', id: params.id }, `#post?id=${params.id}`);
      } else if (viewName === 'event') {
        renderEventDetailView(params.id);
        safePushState({ view: 'event', id: params.id }, `#evento?id=${params.id}`);
      }

      // Oculta a barra de busca superior na visualização interna de artigo ou evento
      const topBar = document.querySelector('.embed-top-bar-container');
      if (topBar) {
        if (viewName === 'post' || viewName === 'event') {
          topBar.style.display = 'none';
        } else {
          topBar.style.display = 'block';
        }
      }

      // Rola para o topo suavemente
      window.scrollTo({ top: 0, behavior: 'smooth' });
      notifyIframeHeight();
    }
  };

  global.EmbedRouter = EmbedRouter;

  /**
   * Inicialização Principal Instantânea (Compatível com Wix Embed e Sandboxes)
   */
  function startEmbedApp() {
    allNewsItems = getLocalFallbackNews();
    initCalendarComponent();
    initPersistentSearch();
    initNavPills();
    initIframeAutoResize();
    EmbedRouter.init();

    fetchWixNews().then(() => {
      if (EmbedRouter.currentView === 'home') renderHomeNewsFeed();
      if (EmbedRouter.currentView === 'posts') renderAllPostsView();
    }).catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEmbedApp);
  } else {
    startEmbedApp();
  }

  /**
   * 1. Busca e Normalização de Notícias do Wix
   */
  async function fetchWixNews() {
    try {
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const endpoint = isLocal ? '/api/wix-news' : 'https://cathlabflix-sessions.vercel.app/api/wix-news';
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        allNewsItems = data.items;
      } else {
        allNewsItems = getLocalFallbackNews();
      }
    } catch (e) {
      console.warn('[Embed News] Usando fallback local:', e);
      allNewsItems = getLocalFallbackNews();
    }
  }

  /**
   * 2. Renderização da View HOME: Notícias em Destaque
   */
  function renderHomeNewsFeed() {
    const container = document.getElementById('wixNewsContainer');
    const paginationContainer = document.getElementById('newsPaginationContainer');
    if (!container) return;

    let itemsToDisplay = allNewsItems;

    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      itemsToDisplay = allNewsItems.filter(item => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q);
      });
    }

    if (itemsToDisplay.length === 0) {
      container.innerHTML = `
        <div class="news-loading-state" style="padding: 40px 20px; text-align: center; color: var(--color-text-secondary);">
          <p>${currentSearchQuery ? `Nenhuma notícia encontrada para "${escapeHTML(currentSearchQuery)}".` : 'Nenhuma notícia disponível no momento.'}</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.style.display = 'none';
      notifyIframeHeight();
      return;
    }

    // Se estiver pesquisando, mostra até 6 resultados diretos
    if (currentSearchQuery) {
      const searchItems = itemsToDisplay.slice(0, 6);
      container.innerHTML = searchItems.map(item => generateNewsCardHtml(item)).join('');
      if (paginationContainer) paginationContainer.style.display = 'none';
      bindCardClicks(container);
      notifyIframeHeight();
      return;
    }

    // Paginação normal de 4 em 4
    const totalPages = Math.ceil(itemsToDisplay.length / HOME_POSTS_PER_PAGE);
    if (homeNewsPage < 1) homeNewsPage = 1;
    if (totalPages > 0 && homeNewsPage > totalPages) homeNewsPage = totalPages;

    const start = (homeNewsPage - 1) * HOME_POSTS_PER_PAGE;
    const pageItems = itemsToDisplay.slice(start, start + HOME_POSTS_PER_PAGE);

    container.innerHTML = pageItems.map(item => generateNewsCardHtml(item)).join('');
    renderHomePagination(paginationContainer, totalPages, homeNewsPage);
    bindCardClicks(container);
    notifyIframeHeight();
  }

  function generateNewsCardHtml(item) {
    const newsPageUrl = 'https://www.cathlabflix.org/noticias';
    return `
      <article class="wix-news-card" data-post-id="${item.id}">
        <a href="${newsPageUrl}" target="_top" class="news-card-thumb-wrapper" title="${escapeHTML(item.title)}">
          <img 
            src="${item.image}" 
            alt="${escapeHTML(item.title)}" 
            class="news-card-thumb" 
            loading="lazy"
            onerror="this.src='https://cathlabflix-sessions.vercel.app/assets/images/og-cathlabflix.png'"
          >
          <span class="news-category-badge">${escapeHTML(item.category || 'Notícia')}</span>
        </a>

        <div class="news-card-content">
          <div class="news-card-header">
            <span class="news-card-date">${escapeHTML(item.formattedDate || '')}</span>
          </div>

          <h3 class="news-card-title">
            <a href="${newsPageUrl}" target="_top" title="${escapeHTML(item.title)}">
              ${escapeHTML(item.title)}
            </a>
          </h3>

          <p class="news-card-excerpt">${escapeHTML(item.description)}</p>

          <div class="news-card-footer">
            <a href="${newsPageUrl}" target="_top" class="news-card-btn" title="Confira">
              <span>Confira</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderHomePagination(container, totalPages, currentPage) {
    if (!container) return;

    if (totalPages <= 1) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.style.display = 'flex';
    let html = '';

    const prevDisabled = currentPage === 1;
    html += `
      <button 
        type="button" 
        class="news-pagination-btn prev ${prevDisabled ? 'disabled' : ''}" 
        aria-label="Página anterior"
        ${prevDisabled ? 'disabled' : ''}
        data-page="${currentPage - 1}"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Anterior</span>
      </button>
    `;

    html += `<div class="news-pagination-numbers">`;
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      html += `
        <button 
          type="button" 
          class="news-pagination-num ${isActive ? 'active' : ''}" 
          aria-label="Página ${i}"
          aria-current="${isActive ? 'page' : 'false'}"
          data-page="${i}"
        >
          ${i}
        </button>
      `;
    }
    html += `</div>`;

    const nextDisabled = currentPage === totalPages;
    html += `
      <button 
        type="button" 
        class="news-pagination-btn next ${nextDisabled ? 'disabled' : ''}" 
        aria-label="Próxima página"
        ${nextDisabled ? 'disabled' : ''}
        data-page="${currentPage + 1}"
      >
        <span>Próximo</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;

    container.innerHTML = html;

    container.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage && targetPage !== homeNewsPage && targetPage >= 1 && targetPage <= totalPages) {
          homeNewsPage = targetPage;
          renderHomeNewsFeed();
        }
      });
    });
  }

  function bindCardClicks(container) {
    container.querySelectorAll('[data-nav-post]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = el.getAttribute('data-nav-post');
        EmbedRouter.navigateTo('post', { id: postId });
      });
    });
  }

  /**
   * 3. Inicialização e Interceptação do Calendário Moderno
   */
  function initCalendarComponent() {
    const calendarContainer = document.getElementById('agendaCalendarContainer');
    if (!calendarContainer) return;

    if (typeof ModernAgendaCalendar === 'function') {
      calendarInstance = new ModernAgendaCalendar('agendaCalendarContainer', {
        initialView: 'month'
      });

      // Intercepta cliques de "Confira" gerados pelo calendário para abrir o evento internamente
      calendarContainer.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="/new/evento"], a[href^="#evento"], .list-action-cta-btn, .event-detail-cta-btn');
        if (link) {
          const href = link.getAttribute('href') || '';
          let eventId = null;

          if (href.includes('id=')) {
            eventId = href.split('id=')[1].split('&')[0];
          } else {
            const card = link.closest('[data-event-id]');
            if (card) eventId = card.getAttribute('data-event-id');
          }

          if (eventId) {
            e.preventDefault();
            e.stopPropagation();
            EmbedRouter.navigateTo('event', { id: decodeURIComponent(eventId) });
          }
        }
      });
    }
  }

  /**
   * 4. Renderização da View de TODAS AS NOTÍCIAS (View Posts)
   */
  function renderAllPostsView() {
    const gridContainer = document.getElementById('allPostsGrid');
    const paginationContainer = document.getElementById('allPostsPagination');
    const categoryRow = document.getElementById('embedCategoryPillsRow');

    if (!gridContainer) return;

    // Categorias dinâmicas
    if (categoryRow && categoryRow.children.length <= 1) {
      const cats = new Set();
      allNewsItems.forEach(it => { if (it.category) cats.add(it.category.trim()); });

      let catHtml = `
        <button type="button" class="embed-category-pill ${activeCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">
          Todos (${allNewsItems.length})
        </button>
      `;

      Array.from(cats).forEach(cat => {
        const count = allNewsItems.filter(it => it.category === cat).length;
        catHtml += `
          <button type="button" class="embed-category-pill ${activeCategoryFilter === cat ? 'active' : ''}" data-cat="${escapeHTML(cat)}">
            ${escapeHTML(cat)} (${count})
          </button>
        `;
      });

      categoryRow.innerHTML = catHtml;

      categoryRow.querySelectorAll('.embed-category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategoryFilter = btn.getAttribute('data-cat');
          categoryRow.querySelectorAll('.embed-category-pill').forEach(b => b.classList.toggle('active', b === btn));
          allPostsPage = 1;
          renderAllPostsView();
        });
      });
    }

    // Filtragem por categoria e busca
    let list = allNewsItems;
    if (activeCategoryFilter !== 'all') {
      list = list.filter(it => it.category === activeCategoryFilter);
    }
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      list = list.filter(it => (it.title || '').toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q));
    }

    if (list.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; color: var(--color-text-secondary);">
          <p>Nenhuma publicação encontrada para os critérios selecionados.</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.style.display = 'none';
      notifyIframeHeight();
      return;
    }

    const totalPages = Math.ceil(list.length / ALL_POSTS_PER_PAGE);
    if (allPostsPage < 1) allPostsPage = 1;
    if (totalPages > 0 && allPostsPage > totalPages) allPostsPage = totalPages;

    const start = (allPostsPage - 1) * ALL_POSTS_PER_PAGE;
    const pageItems = list.slice(start, start + ALL_POSTS_PER_PAGE);

    gridContainer.innerHTML = pageItems.map(item => generateNewsCardHtml(item)).join('');
    renderHomePagination(paginationContainer, totalPages, allPostsPage);
    bindCardClicks(gridContainer);
    notifyIframeHeight();
  }

  /**
   * 5. Renderização da View de NOTÍCIA INDIVIDUAL (View Post Detail)
   */
  function renderPostDetailView(postId) {
    const container = document.getElementById('postDetailContent');
    if (!container) return;

    currentPost = allNewsItems.find(it => String(it.id) === String(postId) || it.slug === postId);
    if (!currentPost && allNewsItems.length > 0) {
      currentPost = allNewsItems[0];
    }

    if (!currentPost) {
      container.innerHTML = `
        <div style="padding: 60px 20px; text-align: center;">
          <h2>Artigo não encontrado</h2>
          <button type="button" class="embed-back-btn" onclick="EmbedRouter.navigateTo('posts')">Voltar para Notícias</button>
        </div>
      `;
      notifyIframeHeight();
      return;
    }

    const paragraphs = getDetailedParagraphs(currentPost);

    container.innerHTML = `
      <article class="embed-post-reader">
        <header class="embed-post-reader-header">
          <div class="embed-post-badges-row">
            <span class="embed-post-category-tag">${escapeHTML(currentPost.category || 'Notícia')}</span>
            <span class="embed-post-date-tag">${escapeHTML(currentPost.formattedDate || '')}</span>
          </div>

          <h1 class="embed-post-title">${escapeHTML(currentPost.title)}</h1>
          <p class="embed-post-summary">${escapeHTML(currentPost.description)}</p>
        </header>

        <div class="embed-post-featured-media">
          <img src="${currentPost.image}" alt="${escapeHTML(currentPost.title)}" onerror="this.src='https://cathlabflix-sessions.vercel.app/assets/images/og-cathlabflix.png'">
        </div>

        <div class="embed-post-content-body">
          ${paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>

        <div class="embed-post-share-bar">
          <span style="font-size: 0.8125rem; font-weight: 700; color: var(--color-text-secondary);">Compartilhar:</span>
          <button type="button" class="embed-share-btn" id="shareCopyBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copiar Link</span>
          </button>
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(currentPost.title + ' - ' + window.location.href)}" target="_blank" rel="noopener noreferrer" class="embed-share-btn">
            <span>WhatsApp</span>
          </a>
        </div>
      </article>
    `;

    const copyBtn = document.getElementById('shareCopyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          copyBtn.innerHTML = `<span>✓ Copiado!</span>`;
          setTimeout(() => { copyBtn.innerHTML = `<span>Copiar Link</span>`; }, 2000);
        });
      });
    }

    notifyIframeHeight();
  }

  /**
   * 6. Renderização da View de EVENTO INDIVIDUAL (View Event Detail)
   */
  function renderEventDetailView(eventId) {
    const container = document.getElementById('eventDetailContent');
    if (!container) return;

    let event = null;
    if (typeof EventsService !== 'undefined' && typeof EventsService.getEventById === 'function') {
      event = EventsService.getEventById(eventId);
    }
    if (!event && typeof INITIAL_EVENTS !== 'undefined' && Array.isArray(INITIAL_EVENTS)) {
      event = INITIAL_EVENTS.find(e => e.id === eventId) || null;
    }

    if (!event) {
      container.innerHTML = `
        <div class="event-not-found-card">
          <h2>Evento não encontrado</h2>
          <p>O evento solicitado não foi localizado.</p>
          <button type="button" class="embed-back-btn" onclick="EmbedRouter.navigateTo('home')" style="margin-top: 16px;">
            Voltar para Agenda
          </button>
        </div>
      `;
      notifyIframeHeight();
      return;
    }

    currentEvent = event;
    const isApoio = event.type === 'apoio_sbhci' || (event.badge && event.badge.includes('APOIO'));
    const typeBadgeLabel = isApoio ? 'Apoio SBHCI' : 'Evento Oficial';
    const typeBadgeClass = isApoio ? 'badge-apoio' : 'badge-oficial';

    const eventImg = event.image || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';

    container.innerHTML = `
      <div class="embed-event-reader">
        <div class="event-hero-banner">
          <img src="${eventImg}" alt="${escapeHTML(event.title)}" class="event-hero-img" onerror="this.src='https://cathlabflix-sessions.vercel.app/assets/images/og-cathlabflix.png'">
          <div class="event-hero-gradient"></div>
          <div class="event-hero-meta-overlay">
            <span class="event-hero-modality">${escapeHTML(event.modality || 'Evento SBHCI')}</span>
          </div>
        </div>

        <header class="event-header-section">
          <div class="event-meta-badges">
            <span class="event-type-badge ${typeBadgeClass}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${typeBadgeLabel}
            </span>
            ${event.category ? `<span class="event-cat-badge">${escapeHTML(event.category)}</span>` : ''}
          </div>

          <h1 class="event-main-title">${escapeHTML(event.title)}</h1>
          ${event.subtitle ? `<p class="event-lead-subtitle">${escapeHTML(event.subtitle)}</p>` : ''}
        </header>

        <section class="event-info-cards-grid" aria-label="Informações do Evento">
          <div class="event-info-card">
            <div class="info-card-icon red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="info-card-text">
              <span class="info-card-label">Data</span>
              <span class="info-card-val">${formatDate(event.date, event.endDate, event.dateRangeLabel)}</span>
            </div>
          </div>

          <div class="event-info-card">
            <div class="info-card-icon blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="info-card-text">
              <span class="info-card-label">Horário</span>
              <span class="info-card-val">${escapeHTML(event.time || 'A definir')}</span>
            </div>
          </div>

          <div class="event-info-card">
            <div class="info-card-icon amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="info-card-text">
              <span class="info-card-label">Local</span>
              <span class="info-card-val">${escapeHTML(event.location || 'CathlabFlix Streaming')}</span>
            </div>
          </div>
        </section>

        <section class="event-action-bar">
          <div class="event-action-buttons">
            <div class="agenda-export-dropdown-wrapper">
              <button type="button" class="event-primary-btn outline" id="eventDetailExportBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Salvar na Agenda</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="agenda-export-menu" id="eventDetailExportMenu">
                <a href="${EventsService.generateGoogleCalendarUrl(event)}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                  <span class="export-menu-icon google">G</span>
                  Google Calendar
                </a>
                <button type="button" class="export-menu-item" id="exportAppleDetailBtn">
                  <span class="export-menu-icon apple"></span>
                  Apple Agenda (.ics)
                </button>
                <button type="button" class="export-menu-item" id="exportOutlookDetailBtn">
                  <span class="export-menu-icon outlook">O</span>
                  Outlook (.ics)
                </button>
              </div>
            </div>

            ${(event.registrationUrl || (event.actionUrl && !event.actionUrl.includes('evento'))) ? `
              <a href="${event.registrationUrl || event.actionUrl}" class="event-primary-btn fill" target="_blank" rel="noopener noreferrer">
                <span>Inscrição no Site</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            ` : ''}
          </div>
        </section>

        <section class="event-content-section">
          <h2 class="section-title">Sobre este Evento</h2>
          <div class="event-description-text">
            <p>${escapeHTML(event.description || event.subtitle || 'Detalhes sobre a programação oficial da SBHCI.')}</p>
          </div>
        </section>
      </div>
    `;

    // Exportação de calendário
    const expBtn = document.getElementById('eventDetailExportBtn');
    const expMenu = document.getElementById('eventDetailExportMenu');
    if (expBtn && expMenu) {
      expBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        expMenu.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.agenda-export-dropdown-wrapper')) {
          expMenu.classList.remove('is-open');
        }
      });

      const appleBtn = document.getElementById('exportAppleDetailBtn');
      if (appleBtn) {
        appleBtn.addEventListener('click', () => {
          EventsService.downloadIcs(event, `${event.id}.ics`);
          expMenu.classList.remove('is-open');
        });
      }

      const outlookBtn = document.getElementById('exportOutlookDetailBtn');
      if (outlookBtn) {
        outlookBtn.addEventListener('click', () => {
          EventsService.downloadIcs(event, `${event.id}.ics`);
          expMenu.classList.remove('is-open');
        });
      }
    }

    notifyIframeHeight();
  }

  /**
   * 7. Busca Integrada ("Busque em Notícias e Eventos...")
   */
  function initPersistentSearch() {
    const searchInput = document.getElementById('embedSearchInput');
    const clearBtn = document.getElementById('embedSearchClearBtn');
    const statusBar = document.getElementById('embedSearchStatusBar');
    const badge = document.getElementById('embedSearchBadge');

    if (!searchInput) return;

    let debounceTimer = null;

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      currentSearchQuery = q;

      if (clearBtn) clearBtn.style.display = q ? 'inline-flex' : 'none';

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Se estiver em tela de detalhe e começar a buscar, retorna para a home com a busca ativa
        if (q && (EmbedRouter.currentView === 'post' || EmbedRouter.currentView === 'event')) {
          EmbedRouter.navigateTo('home', {}, true);
        } else if (EmbedRouter.currentView === 'posts') {
          renderAllPostsView();
        } else {
          renderHomeNewsFeed();
          if (calendarInstance && typeof calendarInstance.setSearchQuery === 'function') {
            calendarInstance.setSearchQuery(q);
          }
        }

        updateSearchStatus(statusBar, badge, q);
      }, 150);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchQuery = '';
        clearBtn.style.display = 'none';

        if (EmbedRouter.currentView === 'posts') {
          renderAllPostsView();
        } else {
          renderHomeNewsFeed();
          if (calendarInstance && typeof calendarInstance.setSearchQuery === 'function') {
            calendarInstance.setSearchQuery('');
          }
        }

        updateSearchStatus(statusBar, badge, '');
        searchInput.focus();
      });
    }
  }

  function updateSearchStatus(statusBar, badge, q) {
    if (!statusBar || !badge) return;

    if (!q) {
      statusBar.style.display = 'none';
      return;
    }

    statusBar.style.display = 'flex';
    const newsMatches = allNewsItems.filter(item => {
      const term = q.toLowerCase();
      return (item.title || '').toLowerCase().includes(term) || (item.description || '').toLowerCase().includes(term);
    }).length;

    const eventsList = (typeof EventsService !== 'undefined' ? EventsService.getAllEvents() : (window.INITIAL_EVENTS || []));
    const eventMatches = eventsList.filter(ev => {
      const term = q.toLowerCase();
      return (ev.title || '').toLowerCase().includes(term) || (ev.subtitle || '').toLowerCase().includes(term) || (ev.location || '').toLowerCase().includes(term);
    }).length;

    badge.textContent = `${newsMatches} notícia(s), ${eventMatches} evento(s) encontrados`;
    notifyIframeHeight();
  }

  /**
   * 8. Navegação por Abas no Topo
   */
  function initNavPills() {
    document.querySelectorAll('.embed-nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view === 'agenda') {
          EmbedRouter.navigateTo('home');
          setTimeout(() => {
            const agenda = document.getElementById('agendaSection');
            if (agenda) {
              agenda.scrollIntoView({ behavior: 'smooth' });
            }
          }, 80);
          return;
        }
        EmbedRouter.navigateTo(view);
      });
    });

    // Links de "Ver todas" e botões de voltar
    document.querySelectorAll('[data-route-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-route-view');
        EmbedRouter.navigateTo(targetView);
      });
    });
  }

  /**
   * 9. Comunicação Iframe Auto-Height
   */
  function initIframeAutoResize() {
    window.addEventListener('load', notifyIframeHeight);
    window.addEventListener('resize', notifyIframeHeight);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => notifyIframeHeight());
      observer.observe(document.body);
    }
  }

  function notifyIframeHeight() {
    try {
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.parent.postMessage({
        type: 'cathlabflix-embed-resize',
        height: height
      }, '*');
    } catch (e) {}
  }

  /**
   * Utilitários
   */
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(dateStr, endDateStr, dateRangeLabel) {
    if (dateRangeLabel) return dateRangeLabel;
    if (!dateStr) return 'Data a definir';

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const parts = dateStr.split('-');
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);

    if (endDateStr && endDateStr !== dateStr) {
      const endParts = endDateStr.split('-');
      const endDay = parseInt(endParts[2], 10);
      const endMonth = months[parseInt(endParts[1], 10) - 1];
      if (parts[1] === endParts[1]) {
        return `${day} a ${endDay} de ${month} de ${year}`;
      }
      return `${day} de ${month} a ${endDay} de ${endMonth} de ${year}`;
    }

    return `${day} de ${month} de ${year}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getDetailedParagraphs(post) {
    if (post.fullBody && Array.isArray(post.fullBody) && post.fullBody.length) {
      return post.fullBody;
    }

    const titleLower = (post.title || '').toLowerCase();

    if (titleLower.includes('solaci')) {
      return [
        `Já estão disponíveis no CathlabFlix os conteúdos e principais discussões do Congresso SOLACI-SBHCI 2026, um dos maiores encontros de Cardiologia Intervencionista da América Latina. O evento reuniu especialistas internacionais no World Trade Center, em São Paulo (SP).`,
        `A disponibilização do material foi pensada para apoiar a educação médica continuada, reunindo as sessões gravadas na íntegra, debates de ensaios clínicos e discussões de casos de alta complexidade.`,
        `O acervo reforça o compromisso do CathlabFlix em centralizar o conhecimento de ponta e facilitar o acesso à atualização científica de excelência para hemodinamicistas e cardiologistas de todo o Brasil.`
      ];
    }

    if (titleLower.includes('tct')) {
      return [
        `Acompanhe a cobertura dos clinical trials e principais inovações técnicas apresentadas no Transcatheter Cardiovascular Therapeutics (TCT).`,
        `O evento abordou novos dispositivos para intervenção coronária complexa, balões farmacofóricos, avanços em terapias estruturais aórticas e mitrais e técnicas de imagem intracoronária.`,
        `Assista às análises críticas e discussões aprofundadas com intervencionistas da SBHCI comentando a aplicabilidade prática dos dados na realidade nacional.`
      ];
    }

    return [
      post.description,
      `A iniciativa reforça a missão da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista (SBHCI) em promover a educação médica continuada e a difusão do conhecimento de excelência.`,
      `Para mais detalhes e materiais científicos complementares, explore a programação completa no CathlabFlix.`
    ];
  }

  function getLocalFallbackNews() {
    return [
      {
        id: '1',
        title: 'TCT 2026: Destaques e Inovações em Cardiologia Intervencionista',
        description: 'Acompanhe as principais discussões, novos ensaios clínicos e avanços tecnológicos apresentados no congresso TCT 2026.',
        category: 'Congressos',
        formattedDate: '15 de Outubro de 2026',
        image: 'https://static.wixstatic.com/media/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png'
      },
      {
        id: '2',
        title: 'SOLACI-SBHCI 2026: Cobertura Completa e Gravações de Aulas',
        description: 'Assista a todas as transmissões ao vivo, sessões de casos e debates com especialistas que marcaram o evento oficial em São Paulo.',
        category: 'SBHCI Oficial',
        formattedDate: '12 de Outubro de 2026',
        image: 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png'
      },
      {
        id: '3',
        title: 'Diretrizes em Intervenções Estruturais e Válvulas Percutâneas',
        description: 'Revisão atualizada sobre as mais recentes diretrizes e protocolos adotados pelas principais sociedades internacionais e pela SBHCI.',
        category: 'Artigos',
        formattedDate: '08 de Outubro de 2026',
        image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png'
      },
      {
        id: '4',
        title: 'Webinares SBHCI com Inteligência Artificial: Resumos e Casos Clínicos',
        description: 'Explore a nova ferramenta interativa do CathlabFlix com resumos automáticos gerados por IA, infográficos e quizzes de autoverificação.',
        category: 'Educação',
        formattedDate: '05 de Outubro de 2026',
        image: 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png'
      }
    ];
  }
})(typeof window !== 'undefined' ? window : globalThis);
