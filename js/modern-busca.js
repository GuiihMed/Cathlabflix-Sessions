/**
 * CathlabFlix Modern Busca - Controlador da Página Interna de Busca (/new/busca)
 * 
 * Funcionalidades:
 * - Leitura e sincronização com parâmetros da URL (?q=..., ?type=..., ?page=...)
 * - Busca em tempo real com debounce de 300ms e busca imediata no Enter/Submit
 * - Filtros por tipo de conteúdo com contadores dinâmicos (Todos, Vídeos, Aulas PPTX, Notícias, Páginas)
 * - Chips de sugestões rápidas populares
 * - Highlight seguro de termos buscados e sanitização rigorosa contra XSS
 * - Paginação completa (12 itens por página) com navegação fluida
 * - Histórico do navegador via history.pushState e popstate
 * - Estados visuais: Carregando, Vazio e Erro com suporte a temas Claro e Azul Noturno
 */

(function () {
  'use strict';

  // Configurações
  const PAGE_LIMIT = 12;

  // Estado da Busca
  const state = {
    query: '',
    type: 'all',
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    hasMore: false,
    counts: { all: 0, video: 0, aula: 0, post: 0, page: 0 },
    results: [],
    isLoading: false
  };

  let debounceTimer = null;
  let activeAbortController = null;

  // Elementos do DOM
  let dom = {};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBuscaPage);
  } else {
    initBuscaPage();
  }

  function initBuscaPage() {
    dom = {
      mainInput: document.getElementById('buscaMainInput'),
      clearBtn: document.getElementById('buscaClearBtn'),
      submitBtn: document.getElementById('buscaSubmitBtn'),
      filterTabs: document.querySelectorAll('.busca-filter-tab'),
      suggestionChips: document.querySelectorAll('.busca-suggestion-chip'),
      metaContainer: document.getElementById('buscaResultsMeta'),
      metaCount: document.getElementById('buscaMetaCount'),
      gridContainer: document.getElementById('buscaResultsGrid'),
      paginationNav: document.getElementById('buscaPaginationNav'),
      // Contadores nas abas
      badgeAll: document.getElementById('tabBadgeAll'),
      badgeVideo: document.getElementById('tabBadgeVideo'),
      badgeAula: document.getElementById('tabBadgeAula'),
      badgePost: document.getElementById('tabBadgePost'),
      badgePage: document.getElementById('tabBadgePage')
    };

    if (!dom.mainInput || !dom.gridContainer) return;

    // 1. Lê os parâmetros iniciais da URL
    parseUrlParams();

    // 2. Preenche o input se houver termo na URL
    if (state.query) {
      dom.mainInput.value = state.query;
      if (dom.clearBtn) dom.clearBtn.style.display = 'flex';
    }

    // 3. Atualiza aba ativa se houver filtro por tipo na URL
    updateActiveTabUI();

    // 4. Registra Event Listeners
    setupEventListeners();

    // 5. Dispara a busca inicial (ou carrega conteúdo em destaque se vazia)
    fetchSearch();
  }

  /**
   * Lê parâmetros da URL
   */
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    state.query = (params.get('q') || '').trim();
    state.type = params.get('type') || 'all';
    state.page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  }

  /**
   * Atualiza a URL sem recarregar a página
   */
  function updateUrlParams() {
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    if (state.type && state.type !== 'all') params.set('type', state.type);
    if (state.page > 1) params.set('page', state.page.toString());

    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.pushState({ ...state }, '', newUrl);
  }

  /**
   * Configura eventos de clique e digitação
   */
  function setupEventListeners() {
    // Digitação com debounce de 300ms
    dom.mainInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      state.query = val;
      state.page = 1;

      if (dom.clearBtn) {
        dom.clearBtn.style.display = e.target.value ? 'flex' : 'none';
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        updateUrlParams();
        fetchSearch();
      }, 300);
    });

    // Enter para disparar busca imediatamente
    dom.mainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(debounceTimer);
        state.query = dom.mainInput.value.trim();
        state.page = 1;
        updateUrlParams();
        fetchSearch();
      }
    });

    // Botão Submit
    if (dom.submitBtn) {
      dom.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearTimeout(debounceTimer);
        state.query = dom.mainInput.value.trim();
        state.page = 1;
        updateUrlParams();
        fetchSearch();
      });
    }

    // Botão Limpar
    if (dom.clearBtn) {
      dom.clearBtn.addEventListener('click', () => {
        dom.mainInput.value = '';
        state.query = '';
        state.page = 1;
        dom.clearBtn.style.display = 'none';
        dom.mainInput.focus();
        updateUrlParams();
        fetchSearch();
      });
    }

    // Abas de Filtro por Tipo
    dom.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const type = tab.getAttribute('data-type') || 'all';
        if (state.type === type) return;

        state.type = type;
        state.page = 1;
        updateActiveTabUI();
        updateUrlParams();
        fetchSearch();
      });
    });

    // Chips de Sugestões Populares
    dom.suggestionChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const term = chip.getAttribute('data-term') || chip.textContent.trim();
        dom.mainInput.value = term;
        state.query = term;
        state.page = 1;
        if (dom.clearBtn) dom.clearBtn.style.display = 'flex';
        updateUrlParams();
        fetchSearch();
        window.scrollTo({ top: dom.mainInput.offsetTop - 80, behavior: 'smooth' });
      });
    });

    // Suporte ao Voltar/Avançar do navegador
    window.addEventListener('popstate', (e) => {
      parseUrlParams();
      dom.mainInput.value = state.query;
      if (dom.clearBtn) dom.clearBtn.style.display = state.query ? 'flex' : 'none';
      updateActiveTabUI();
      fetchSearch();
    });
  }

  /**
   * Atualiza a classe ativa das abas
   */
  function updateActiveTabUI() {
    dom.filterTabs.forEach(tab => {
      const tabType = tab.getAttribute('data-type') || 'all';
      if (tabType === state.type) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });
  }

  /**
   * Executa a requisição à API de busca (/api/search)
   */
  async function fetchSearch() {
    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();

    renderLoadingState();

    try {
      let endpoint = `/api/search?page=${state.page}&limit=${state.limit}`;
      if (state.query && state.query.length >= 3) {
        endpoint += `&q=${encodeURIComponent(state.query)}`;
      } else {
        // Quando vazio ou < 3 caracteres, solicita o catálogo inicial em destaque
        endpoint += `&initial=true`;
      }

      if (state.type && state.type !== 'all') {
        endpoint += `&type=${encodeURIComponent(state.type)}`;
      }

      const res = await fetch(endpoint, { signal: activeAbortController.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      activeAbortController = null;

      if (!data.success) {
        renderErrorState();
        return;
      }

      state.total = data.total || 0;
      state.hasMore = !!data.hasMore;
      state.results = Array.isArray(data.results) ? data.results : [];
      if (data.counts) {
        state.counts = data.counts;
        updateTabBadges();
      }

      renderResults();
      renderPagination();

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[Busca Interna] Erro:', err);
      renderErrorState();
    }
  }

  /**
   * Atualiza as contagens nas abas
   */
  function updateTabBadges() {
    if (dom.badgeAll) dom.badgeAll.textContent = state.counts.all || '0';
    if (dom.badgeVideo) dom.badgeVideo.textContent = state.counts.video || '0';
    if (dom.badgeAula) dom.badgeAula.textContent = state.counts.aula || '0';
    if (dom.badgePost) dom.badgePost.textContent = state.counts.post || '0';
    if (dom.badgePage) dom.badgePage.textContent = state.counts.page || '0';
  }

  /**
   * Renderiza os cards de resultados
   */
  function renderResults() {
    // 1. Atualiza barra de meta informação
    if (dom.metaCount) {
      if (state.query && state.query.length >= 3) {
        dom.metaCount.innerHTML = `Exibindo <strong>${state.total}</strong> resultado(s) para "<strong>${escapeHtml(state.query)}</strong>"`;
      } else {
        dom.metaCount.innerHTML = `Conteúdos e sessões em destaque (<strong>${state.total}</strong> disponíveis)`;
      }
    }

    // 2. Se vazio
    if (!state.results || state.results.length === 0) {
      renderEmptyState();
      return;
    }

    // 3. Monta os cards
    let html = '';
    state.results.forEach(item => {
      const type = item.type || 'page';
      const title = highlightTerm(escapeHtml(item.title), state.query);
      const desc = highlightTerm(escapeHtml(item.description || ''), state.query);
      const speaker = item.speaker ? highlightTerm(escapeHtml(item.speaker), state.query) : '';
      const category = escapeHtml(item.category || item.badge || 'Geral');

      let badgeClass = 'badge-page';
      let typeLabel = 'Página';
      let actionLabel = 'Acessar →';

      if (type === 'video') {
        badgeClass = 'badge-video';
        typeLabel = 'Vídeo / Sessão';
        actionLabel = 'Assistir Vídeo →';
      } else if (type === 'aula') {
        badgeClass = 'badge-aula';
        typeLabel = 'Apresentação PPTX';
        actionLabel = 'Ver Apresentação →';
      } else if (type === 'post') {
        badgeClass = 'badge-post';
        typeLabel = 'Notícia / Artigo';
        actionLabel = 'Confira →';
      }

      html += `
        <a href="${escapeHtml(item.url)}" class="busca-card" data-type="${escapeHtml(type)}">
          <div class="busca-card-header">
            <span class="busca-card-badge ${badgeClass}">${escapeHtml(typeLabel)}</span>
            <span class="busca-card-category">${category}</span>
          </div>

          <h3 class="busca-card-title">${title}</h3>

          ${speaker ? `
            <div class="busca-card-speaker">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>${speaker}</span>
            </div>
          ` : ''}

          <p class="busca-card-desc">${desc}</p>

          <div class="busca-card-footer">
            <span class="busca-card-action-btn">${actionLabel}</span>
          </div>
        </a>
      `;
    });

    dom.gridContainer.innerHTML = html;
  }

  /**
   * Renderiza a paginação numérica e botões Anterior/Próximo
   */
  function renderPagination() {
    if (!dom.paginationNav) return;

    const totalPages = Math.ceil(state.total / state.limit);
    if (totalPages <= 1) {
      dom.paginationNav.innerHTML = '';
      return;
    }

    let html = `
      <button type="button" class="busca-pagination-btn ${state.page <= 1 ? 'disabled' : ''}" id="buscaPrevPageBtn" aria-label="Página anterior">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Anterior</span>
      </button>
    `;

    // Gera números de página
    const maxVisible = 5;
    let startPage = Math.max(1, state.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      html += `<button type="button" class="busca-pagination-num" data-page="1">1</button>`;
      if (startPage > 2) html += `<span style="padding: 0 4px; color: var(--color-text-tertiary);">...</span>`;
    }

    for (let p = startPage; p <= endPage; p++) {
      html += `
        <button type="button" class="busca-pagination-num ${p === state.page ? 'active' : ''}" data-page="${p}">
          ${p}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += `<span style="padding: 0 4px; color: var(--color-text-tertiary);">...</span>`;
      html += `<button type="button" class="busca-pagination-num" data-page="${totalPages}">${totalPages}</button>`;
    }

    html += `
      <button type="button" class="busca-pagination-btn ${state.page >= totalPages ? 'disabled' : ''}" id="buscaNextPageBtn" aria-label="Próxima página">
        <span>Próxima</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;

    dom.paginationNav.innerHTML = html;

    // Registra cliques na paginação
    const prevBtn = document.getElementById('buscaPrevPageBtn');
    const nextBtn = document.getElementById('buscaNextPageBtn');
    const numBtns = dom.paginationNav.querySelectorAll('.busca-pagination-num');

    if (prevBtn && state.page > 1) {
      prevBtn.addEventListener('click', () => goToPage(state.page - 1));
    }

    if (nextBtn && state.page < totalPages) {
      nextBtn.addEventListener('click', () => goToPage(state.page + 1));
    }

    numBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        if (p && p !== state.page) goToPage(p);
      });
    });
  }

  function goToPage(p) {
    state.page = p;
    updateUrlParams();
    fetchSearch();
    window.scrollTo({ top: dom.gridContainer.offsetTop - 120, behavior: 'smooth' });
  }

  /**
   * Estados Visuais
   */
  function renderLoadingState() {
    dom.gridContainer.innerHTML = `
      <div class="busca-state-box">
        <div class="busca-spinner"></div>
        <div style="font-weight: 600; color: var(--color-text-primary);">Pesquisando no acervo do CathlabFlix...</div>
        <div style="font-size: 0.8125rem; color: var(--color-text-tertiary); margin-top: 4px;">Consultando sessões, cirurgias, aulas e artigos científicos</div>
      </div>
    `;
    if (dom.paginationNav) dom.paginationNav.innerHTML = '';
  }

  function renderEmptyState() {
    dom.gridContainer.innerHTML = `
      <div class="busca-state-box">
        <svg class="busca-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <div class="busca-empty-title">Nenhum resultado encontrado</div>
        <div class="busca-empty-hint">
          Não localizamos resultados para "<strong>${escapeHtml(state.query)}</strong>".
          Verifique se as palavras estão digitadas corretamente ou tente termos mais amplos (ex: <em>TAVI, Angioplastia, Arrieta, INCOR</em>).
        </div>
        <button type="button" class="busca-empty-reset-btn" id="buscaResetBtn">Ver Todos os Conteúdos</button>
      </div>
    `;

    const resetBtn = document.getElementById('buscaResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        dom.mainInput.value = '';
        state.query = '';
        state.type = 'all';
        state.page = 1;
        updateActiveTabUI();
        updateUrlParams();
        fetchSearch();
      });
    }

    if (dom.paginationNav) dom.paginationNav.innerHTML = '';
  }

  function renderErrorState() {
    dom.gridContainer.innerHTML = `
      <div class="busca-state-box" style="color: #DC2626;">
        <div class="busca-empty-title" style="color: #DC2626;">Erro na busca</div>
        <div class="busca-empty-hint">Ocorreu uma falha temporária ao consultar os servidores da Vercel.</div>
        <button type="button" class="busca-empty-reset-btn" id="buscaRetryBtn">Tentar Novamente</button>
      </div>
    `;

    const retryBtn = document.getElementById('buscaRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => fetchSearch());
    }

    if (dom.paginationNav) dom.paginationNav.innerHTML = '';
  }

  /**
   * Sanitização XSS e Highlight
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightTerm(text, term) {
    if (!text || !term || term.length < 2) return text;
    const words = term.trim().split(/\s+/).filter(w => w.length >= 2);
    if (!words.length) return text;

    const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

})();
