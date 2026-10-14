/**
 * CathlabFlix - Embed Home Logic
 * Controla a integração de notícias Wix, agenda de eventos e busca interna sincronizada
 */

(function() {
  'use strict';

  let calendarInstance = null;
  let allNewsItems = [];
  let currentNewsPage = 1;
  const POSTS_PER_PAGE = 4;
  let currentSearchQuery = '';

  document.addEventListener('DOMContentLoaded', () => {
    initEmbedNews();
    initEmbedCalendar();
    initEmbedSearch();
    initIframeAutoResize();
  });

  /**
   * 1. Carregamento de Notícias do Wix com Paginação
   */
  async function initEmbedNews() {
    const container = document.getElementById('wixNewsContainer');
    if (!container) return;

    try {
      const res = await fetch('/api/wix-news');
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

    currentNewsPage = 1;
    renderNewsFeed();
  }

  function renderNewsFeed() {
    const container = document.getElementById('wixNewsContainer');
    const paginationContainer = document.getElementById('newsPaginationContainer');
    if (!container) return;

    // Aplica filtro de busca se houver
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

    // Se estiver buscando, mostra até 8 itens diretos sem quebrar paginação complexa
    if (currentSearchQuery) {
      const searchItems = itemsToDisplay.slice(0, 8);
      renderCardsHtml(container, searchItems);
      if (paginationContainer) paginationContainer.style.display = 'none';
      notifyIframeHeight();
      return;
    }

    // Modo normal: paginado de 4 em 4
    const totalPages = Math.ceil(itemsToDisplay.length / POSTS_PER_PAGE);
    if (currentNewsPage < 1) currentNewsPage = 1;
    if (totalPages > 0 && currentNewsPage > totalPages) currentNewsPage = totalPages;

    const start = (currentNewsPage - 1) * POSTS_PER_PAGE;
    const pageItems = itemsToDisplay.slice(start, start + POSTS_PER_PAGE);

    renderCardsHtml(container, pageItems);
    renderPaginationHtml(paginationContainer, totalPages, currentNewsPage);
    notifyIframeHeight();
  }

  function renderCardsHtml(container, items) {
    container.innerHTML = items.map(item => {
      const postUrl = `/new/post?id=${encodeURIComponent(item.id || item.slug || '1')}`;

      return `
        <article class="wix-news-card" data-id="${item.id}">
          <a href="${postUrl}" class="news-card-thumb-wrapper" title="${escapeHTML(item.title)}">
            <img 
              src="${item.image}" 
              alt="${escapeHTML(item.title)}" 
              class="news-card-thumb" 
              loading="lazy"
              onerror="this.src='/assets/images/og-cathlabflix.png'"
            >
            <span class="news-category-badge">${escapeHTML(item.category || 'Notícia')}</span>
          </a>

          <div class="news-card-content">
            <div class="news-card-header">
              <span class="news-card-date">${escapeHTML(item.formattedDate || '')}</span>
            </div>

            <h3 class="news-card-title">
              <a href="${postUrl}" title="${escapeHTML(item.title)}">
                ${escapeHTML(item.title)}
              </a>
            </h3>

            <p class="news-card-excerpt">${escapeHTML(item.description)}</p>

            <div class="news-card-footer">
              <a href="${postUrl}" class="news-card-btn" title="Confira">
                <span>Confira</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderPaginationHtml(container, totalPages, currentPage) {
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
        if (targetPage && targetPage !== currentNewsPage && targetPage >= 1 && targetPage <= totalPages) {
          currentNewsPage = targetPage;
          renderNewsFeed();
        }
      });
    });
  }

  /**
   * 2. Inicialização do Calendário Interativo Moderno
   */
  function initEmbedCalendar() {
    const calendarContainer = document.getElementById('agendaCalendarContainer');
    if (!calendarContainer) return;

    if (typeof ModernAgendaCalendar === 'function') {
      calendarInstance = new ModernAgendaCalendar('agendaCalendarContainer', {
        initialView: 'month'
      });
    }
  }

  /**
   * 3. Busca Interna do Embed ("Busque em Notícias e Eventos...")
   */
  function initEmbedSearch() {
    const searchInput = document.getElementById('embedSearchInput');
    const clearBtn = document.getElementById('embedSearchClearBtn');
    const statusBar = document.getElementById('embedSearchStatusBar');
    const badge = document.getElementById('embedSearchBadge');

    if (!searchInput) return;

    let debounceTimer = null;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      currentSearchQuery = query;

      if (query.length > 0) {
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      } else {
        if (clearBtn) clearBtn.style.display = 'none';
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 150);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchQuery = '';
        clearBtn.style.display = 'none';
        performSearch('');
        searchInput.focus();
      });
    }

    function performSearch(query) {
      // 1. Filtra notícias
      renderNewsFeed();

      // 2. Filtra calendário
      if (calendarInstance && typeof calendarInstance.setSearchQuery === 'function') {
        calendarInstance.setSearchQuery(query);
      }

      // 3. Atualiza status bar
      if (statusBar && badge) {
        if (!query) {
          statusBar.style.display = 'none';
        } else {
          statusBar.style.display = 'flex';
          const newsCount = allNewsItems.filter(item => {
            const q = query.toLowerCase();
            return (item.title || '').toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
          }).length;

          const eventsList = (typeof EventsService !== 'undefined' ? EventsService.getAllEvents() : (window.INITIAL_EVENTS || []));
          const eventsCount = eventsList.filter(ev => {
            const q = query.toLowerCase();
            return (ev.title || '').toLowerCase().includes(q) || (ev.subtitle || '').toLowerCase().includes(q) || (ev.location || '').toLowerCase().includes(q);
          }).length;

          badge.textContent = `${newsCount} notícia(s), ${eventsCount} evento(s) encontrados`;
        }
      }

      notifyIframeHeight();
    }
  }

  /**
   * 4. Comunicação com Iframe do Wix para Ajuste Automático de Altura
   */
  function initIframeAutoResize() {
    window.addEventListener('load', notifyIframeHeight);
    window.addEventListener('resize', notifyIframeHeight);

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        notifyIframeHeight();
      });
      ro.observe(document.body);
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

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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
})();
