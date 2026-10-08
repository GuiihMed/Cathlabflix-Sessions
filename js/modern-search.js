/**
 * CathlabFlix Modern Search - Controlador do Componente de Busca Expansível
 * 
 * Funcionalidades:
 * - Click-to-Expand para a esquerda com foco automático
 * - Tooltip "Busque no site"
 * - Debounce de 300ms para evitar chamadas desnecessárias à API
 * - Autocompletar / Dropdown após 3 caracteres digitados
 * - Estados visuais completos: Carregando, Vazio, Erro e Sucesso
 * - Highlight seguro de termos buscados (prevenção rigorosa de XSS)
 * - Paginação de 10 em 10 itens por requisição com carregamento incremental
 * - AbortController para cancelamento de requisições concorrentes
 * - Atalhos de teclado (Escape fecha, navegação acessível)
 */

(function () {
  'use strict';

  // Executa na inicialização do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModernSearch);
  } else {
    initModernSearch();
  }

  function initModernSearch() {
    const module = document.getElementById('headerSearchModule');
    if (!module) return;

    const box = document.getElementById('searchExpandableBox');
    const triggerBtn = document.getElementById('searchTriggerBtn');
    const input = document.getElementById('searchFieldInput');
    const closeBtn = document.getElementById('searchCloseBtn');
    const dropdown = document.getElementById('searchDropdownResults');
    const content = document.getElementById('searchDropdownContent');

    if (!box || !triggerBtn || !input || !dropdown || !content) return;

    let debounceTimer = null;
    let activeAbortController = null;
    let currentTerm = '';
    let currentPage = 1;
    let currentTotal = 0;
    let loadedCount = 0;
    let isLoading = false;

    // 1. Alterna estado expandido ao clicar na lupa
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!box.classList.contains('is-expanded')) {
        openSearch();
      } else if (!input.value.trim()) {
        closeSearch();
      } else {
        input.focus();
      }
    });

    // 2. Botão de limpar ou fechar
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (input.value) {
          input.value = '';
          currentTerm = '';
          closeBtn.style.display = 'none';
          dropdown.classList.remove('is-visible');
          content.innerHTML = '';
          input.focus();
        } else {
          closeSearch();
        }
      });
    }

    function openSearch() {
      box.classList.add('is-expanded');
      triggerBtn.setAttribute('aria-expanded', 'true');
      input.focus();
    }

    function closeSearch() {
      box.classList.remove('is-expanded');
      triggerBtn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('is-visible');
      input.value = '';
      currentTerm = '';
      currentPage = 1;
      loadedCount = 0;
      if (closeBtn) closeBtn.style.display = 'none';
      content.innerHTML = '';
      if (activeAbortController) {
        activeAbortController.abort();
        activeAbortController = null;
      }
    }

    // 3. Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!module.contains(e.target)) {
        dropdown.classList.remove('is-visible');
        if (box.classList.contains('is-expanded') && !input.value.trim()) {
          closeSearch();
        }
      }
    });

    // 4. Tecla ESC fecha a busca
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && box.classList.contains('is-expanded')) {
        closeSearch();
      }
    });

    // 5. Digitação com Debounce de 300ms
    input.addEventListener('input', (e) => {
      const term = e.target.value.trim();
      currentTerm = term;
      currentPage = 1;
      loadedCount = 0;

      if (closeBtn) {
        closeBtn.style.display = e.target.value ? 'flex' : 'none';
      }

      clearTimeout(debounceTimer);

      if (term.length < 3) {
        dropdown.classList.remove('is-visible');
        content.innerHTML = '';
        if (activeAbortController) {
          activeAbortController.abort();
          activeAbortController = null;
        }
        return;
      }

      renderLoadingState();
      dropdown.classList.add('is-visible');

      // Debounce de 300ms antes de disparar a requisição
      debounceTimer = setTimeout(() => {
        fetchSearchResults(term, 1, false);
      }, 300);
    });

    // 6. Chamada à API com suporte a Paginação de 10 em 10
    async function fetchSearchResults(term, page = 1, isAppend = false) {
      if (isLoading && !isAppend) return;
      isLoading = true;

      if (activeAbortController && !isAppend) {
        activeAbortController.abort();
      }
      activeAbortController = new AbortController();

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&page=${page}`, {
          signal: activeAbortController.signal
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        isLoading = false;

        if (!data.success) {
          renderErrorState(term, page);
          return;
        }

        currentTotal = data.total || 0;
        const results = Array.isArray(data.results) ? data.results : [];

        if (results.length === 0 && !isAppend) {
          renderEmptyState(term);
          return;
        }

        loadedCount = isAppend ? loadedCount + results.length : results.length;
        renderResults(results, term, data.hasMore, page, isAppend);

      } catch (err) {
        if (err.name === 'AbortError') return;
        isLoading = false;
        console.error('[Modern Search] Erro ao buscar:', err);
        renderErrorState(term, page);
      }
    }

    // 7. Renderização dos Resultados e Botão de Paginação
    function renderResults(items, term, hasMore, page, isAppend) {
      let itemsHtml = '';

      items.forEach(item => {
        const highlightedTitle = highlightTerm(escapeHtml(item.title), term);
        const highlightedDesc = highlightTerm(escapeHtml(item.description || ''), term);
        const badgeLabel = item.badge || item.category || 'Conteúdo';
        const itemType = item.type === 'aula' 
          ? 'Apresentação PPTX' 
          : (item.type === 'post' ? 'Notícia' : (item.type === 'video' ? 'Vídeo / Aula' : 'Página'));

        itemsHtml += `
          <a href="${escapeHtml(item.url)}" class="search-result-item" role="option">
            <div class="search-item-meta">
              <span class="search-item-badge">${escapeHtml(badgeLabel)}</span>
              <span class="search-item-type">${escapeHtml(itemType)}</span>
            </div>
            <div class="search-item-title">${highlightedTitle}</div>
            ${item.description ? `<div class="search-item-desc">${highlightedDesc}</div>` : ''}
          </a>
        `;
      });

      if (isAppend) {
        // Remove botão anterior de carregar mais
        const oldLoadMore = content.querySelector('.search-load-more-wrap');
        if (oldLoadMore) oldLoadMore.remove();
        content.insertAdjacentHTML('beforeend', itemsHtml);
      } else {
        const headerHtml = `
          <div class="search-dropdown-header">
            <span>Resultados</span>
            <span class="search-dropdown-count">${currentTotal} encontrado(s)</span>
          </div>
        `;
        content.innerHTML = headerHtml + itemsHtml;
      }

      // Adiciona botão de carregar mais se houver mais páginas (> 10 resultados)
      if (hasMore) {
        const loadMoreHtml = `
          <div class="search-load-more-wrap">
            <button type="button" class="search-load-more-btn" id="searchLoadMoreBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span>Carregar mais (${loadedCount} de ${currentTotal})</span>
            </button>
          </div>
        `;
        content.insertAdjacentHTML('beforeend', loadMoreHtml);

        const loadMoreBtn = document.getElementById('searchLoadMoreBtn');
        if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            loadMoreBtn.innerHTML = `<span>Carregando...</span>`;
            loadMoreBtn.disabled = true;
            fetchSearchResults(term, page + 1, true);
          });
        }
      }
    }

    // 8. Estados Visuais
    function renderLoadingState() {
      content.innerHTML = `
        <div class="search-state-message">
          <div class="search-spinner"></div>
          <div>Pesquisando no CathlabFlix...</div>
        </div>
      `;
    }

    function renderEmptyState(term) {
      content.innerHTML = `
        <div class="search-state-message">
          <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <div class="search-empty-title">Nenhum resultado encontrado</div>
          <div class="search-empty-hint">Não encontramos itens para "<strong>${escapeHtml(term)}</strong>". Verifique a ortografia ou tente outros termos médicos.</div>
        </div>
      `;
    }

    function renderErrorState(term, page) {
      content.innerHTML = `
        <div class="search-state-message search-error-box">
          <div class="search-empty-title">Falha ao buscar</div>
          <div class="search-empty-hint">Ocorreu um erro ao consultar o servidor.</div>
          <button type="button" class="search-retry-btn" id="searchRetryBtn">Tentar novamente</button>
        </div>
      `;

      const retryBtn = document.getElementById('searchRetryBtn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          renderLoadingState();
          fetchSearchResults(term, page, false);
        });
      }
    }

    // 9. Prevenção de XSS e Highlight
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
      if (!text || !term) return text;
      // Normaliza termos múltiplos divididos por espaço
      const words = term.trim().split(/\s+/).filter(w => w.length >= 2);
      if (!words.length) return text;

      const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
  }
})();
