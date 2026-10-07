/**
 * Cathlabflix Sessions - Controlador da Grade de Aulas e Apresentações PPTX (/solaci/aulas)
 * 
 * Gerencia:
 * - Seleção de Dias (Dia 29 | Dia 30 | Dia 31)
 * - Filtro de Salas/Arenas do Dia (Todas as Salas | HEART TEAM ARENA | STRUCTURAL | CROSSROADS...)
 * - Busca instantânea por palestrante, horário ou tema
 * - Skeletons de carregamento e estado vazio elegante
 * - Cards de Apresentação PPTX/PDF/Keynote com visualização no Google Drive e download direto
 * - Auto-ajuste de altura via postMessage para iframes/embeds externos
 * - Conexão nativa à Serverless Function (/api/aulas) consumindo a API oficial do Google Drive
 */

(function () {
  'use strict';

  // Estado da Aplicação de Aulas
  const state = {
    currentDayId: 'dia-29',
    currentRoomFilter: 'Todas as Salas',
    searchQuery: '',
    openAulaIds: new Set(),
    isLoading: true
  };

  // Elementos do DOM
  const dom = {
    daysBar: document.getElementById('aulasDaysBar'),
    roomsBar: document.getElementById('aulasRoomsBar'),
    toolbar: document.getElementById('aulasToolbar'),
    countBadge: document.getElementById('aulasCountBadge'),
    searchInput: document.getElementById('aulasSearchInput'),
    aulasContainer: document.getElementById('aulasContainer')
  };

  /**
   * Inicialização da aplicação
   */
  function init() {
    renderSkeletons();
    bindEvents();
    setupIframeResizer();
    loadAulasFromDriveApi();
  }

  /**
   * Renderiza Skeletons de carregamento inicial
   */
  function renderSkeletons() {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = `
      <div class="aulas-skeleton"></div>
      <div class="aulas-skeleton"></div>
      <div class="aulas-skeleton"></div>
      <div class="aulas-skeleton"></div>
      <div class="aulas-skeleton"></div>
    `;
    if (dom.countBadge) {
      dom.countBadge.innerHTML = 'Sincronizando com o Google Drive...';
    }
  }

  /**
   * Renderiza as Abas dos Dias (Nível 1)
   */
  function renderDays() {
    if (!dom.daysBar) return;
    dom.daysBar.innerHTML = '';

    if (!AULAS_SCHEDULE.days || AULAS_SCHEDULE.days.length === 0) return;

    AULAS_SCHEDULE.days.forEach(day => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `aulas-day-tab ${day.id === state.currentDayId ? 'active' : ''}`;
      btn.dataset.dayId = day.id;
      btn.textContent = day.name || day.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', day.id === state.currentDayId ? 'true' : 'false');
      btn.id = `tab-${day.id}`;
      dom.daysBar.appendChild(btn);
    });
  }

  /**
   * Renderiza o Filtro de Salas/Arenas do Dia (Sub-Nível)
   */
  function renderRooms() {
    if (!dom.roomsBar) return;
    dom.roomsBar.innerHTML = '';

    const currentDay = getCurrentDay();
    if (!currentDay || !Array.isArray(currentDay.rooms) || currentDay.rooms.length <= 1) {
      dom.roomsBar.style.display = 'none';
      return;
    }

    dom.roomsBar.style.display = 'flex';

    // Se o filtro atual não estiver na lista de salas deste dia, reseta para 'Todas as Salas'
    if (!currentDay.rooms.includes(state.currentRoomFilter)) {
      state.currentRoomFilter = 'Todas as Salas';
    }

    currentDay.rooms.forEach(room => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `aulas-room-tab ${room === state.currentRoomFilter ? 'active' : ''}`;
      btn.dataset.roomName = room;
      btn.textContent = room;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', room === state.currentRoomFilter ? 'true' : 'false');
      dom.roomsBar.appendChild(btn);
    });
  }

  /**
   * Seleciona um dia e atualiza o estado
   */
  function selectDay(dayId) {
    if (state.currentDayId === dayId) return;

    state.currentDayId = dayId;
    state.currentRoomFilter = 'Todas as Salas';
    state.openAulaIds.clear();

    renderDays();
    renderRooms();
    renderAulas();
    notifyHeight();
  }

  /**
   * Seleciona uma sala/arena
   */
  function selectRoom(roomName) {
    if (state.currentRoomFilter === roomName) return;

    state.currentRoomFilter = roomName;
    renderRooms();
    renderAulas();
    notifyHeight();
  }

  /**
   * Atualiza contador da barra de ferramentas
   */
  function renderToolbar(count, totalDayCount) {
    if (!dom.countBadge) return;

    const currentDay = getCurrentDay() || { name: 'Dia' };

    if (state.searchQuery.trim()) {
      dom.countBadge.innerHTML = `<strong>${count}</strong> resultado(s) para "${escapeHtml(state.searchQuery)}"`;
    } else if (state.currentRoomFilter !== 'Todas as Salas') {
      dom.countBadge.innerHTML = `<strong>${count}</strong> apresentação(ões) em <strong>${escapeHtml(state.currentRoomFilter)}</strong>`;
    } else {
      dom.countBadge.innerHTML = `<strong>${count}</strong> apresentações disponíveis no ${escapeHtml(currentDay.name || 'Dia')}`;
    }
  }

  /**
   * Renderiza a lista de apresentações com accordions e cards de download
   */
  function renderAulas() {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = '';

    if (state.isLoading) {
      renderSkeletons();
      return;
    }

    const currentDay = getCurrentDay();
    if (!currentDay || !Array.isArray(currentDay.aulas) || currentDay.aulas.length === 0) {
      renderEmpty('Nenhuma apresentação disponível para este dia no momento.');
      renderToolbar(0, 0);
      notifyHeight();
      return;
    }

    const query = (state.searchQuery || '').trim().toLowerCase();

    // Filtra por sala e busca textual
    const filteredAulas = currentDay.aulas.filter(aula => {
      // 1. Filtro por sala
      if (state.currentRoomFilter !== 'Todas as Salas' && aula.room !== state.currentRoomFilter) {
        return false;
      }
      // 2. Filtro por texto
      if (query) {
        const titleMatch = (aula.title || '').toLowerCase().includes(query);
        const speakerMatch = (aula.speaker || '').toLowerCase().includes(query);
        const roomMatch = (aula.room || '').toLowerCase().includes(query);
        const timeMatch = (aula.time || '').toLowerCase().includes(query);
        const fileMatch = aula.file && (aula.file.name || '').toLowerCase().includes(query);
        return titleMatch || speakerMatch || roomMatch || timeMatch || fileMatch;
      }
      return true;
    });

    renderToolbar(filteredAulas.length, currentDay.aulas.length);

    if (filteredAulas.length === 0) {
      renderEmpty('Nenhuma apresentação encontrada para os filtros selecionados.');
      notifyHeight();
      return;
    }

    const fragment = document.createDocumentFragment();

    filteredAulas.forEach(aula => {
      const isOpen = state.openAulaIds.has(aula.id);
      const file = aula.file || {};
      const fileName = file.name || `${aula.title}.pptx`;
      const fileSize = file.size || 'Disponível';
      const fileFormat = file.format || 'PPTX';
      const downloadUrl = file.downloadUrl || '#';
      const viewUrl = file.viewUrl || '';

      const isPdf = fileFormat === 'PDF';
      const isKey = fileFormat === 'KEYNOTE';
      const badgeClass = isPdf ? 'pdf' : (isKey ? 'keynote' : '');
      const badgeLetter = isPdf ? 'PDF' : (isKey ? 'KEY' : 'P');

      const item = document.createElement('div');
      item.className = `aulas-accordion-item ${isOpen ? 'open' : ''}`;
      item.dataset.aulaId = aula.id;

      item.innerHTML = `
        <button 
          type="button" 
          class="aulas-accordion-header" 
          aria-expanded="${isOpen}"
          aria-controls="aula-body-${aula.id}"
          id="aula-header-${aula.id}"
        >
          <div class="aulas-header-left">
            ${aula.time ? `<span class="aula-time-badge">${escapeHtml(aula.time)}</span>` : ''}
            ${aula.room ? `<span class="aula-room-badge">${escapeHtml(aula.room)}</span>` : ''}
            <span class="aulas-item-title">${escapeHtml(aula.speaker || aula.title)}</span>
          </div>
          <span class="aulas-item-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div 
          class="aulas-accordion-body" 
          id="aula-body-${aula.id}"
          role="region"
          aria-labelledby="aula-header-${aula.id}"
        >
          <div class="aulas-pptx-card">
            <div class="aulas-pptx-badge ${badgeClass}">${badgeLetter}</div>
            <div class="aulas-pptx-info">
              <span class="aulas-pptx-name" title="${escapeHtml(fileName)}">${escapeHtml(fileName)}</span>
              <span class="aulas-pptx-meta">Download ${escapeHtml(fileFormat)} · ${escapeHtml(fileSize)}</span>
            </div>
            <div class="aulas-pptx-actions">
              ${viewUrl ? `
                <a 
                  href="${escapeHtml(viewUrl)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="aulas-pptx-view-btn" 
                  title="Visualizar Apresentação no Google Drive"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </a>
              ` : ''}
              <a 
                href="${escapeHtml(downloadUrl)}" 
                class="aulas-pptx-download-btn" 
                title="Baixar ${escapeHtml(fileFormat)} (${escapeHtml(fileName)})"
                data-aula-id="${aula.id}"
                ${downloadUrl !== '#' ? 'download' : ''}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `;

      fragment.appendChild(item);
    });

    dom.aulasContainer.appendChild(fragment);
    notifyHeight();
  }

  /**
   * Exibe mensagem amigável de estado vazio
   */
  function renderEmpty(message) {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = `
      <div class="aulas-empty-state">
        <div>${escapeHtml(message)}</div>
        <p>Experimente alternar entre os dias ou ajustar os termos de busca.</p>
      </div>
    `;
  }

  /**
   * Alterna abertura/fechamento do accordion
   */
  function toggleAula(aulaId) {
    const item = dom.aulasContainer.querySelector(`[data-aula-id="${aulaId}"]`);
    if (!item) return;

    const isOpen = state.openAulaIds.has(aulaId);
    const header = item.querySelector('.aulas-accordion-header');

    if (isOpen) {
      state.openAulaIds.delete(aulaId);
      item.classList.remove('open');
      if (header) header.setAttribute('aria-expanded', 'false');
    } else {
      state.openAulaIds.add(aulaId);
      item.classList.add('open');
      if (header) header.setAttribute('aria-expanded', 'true');
    }

    notifyHeight();
  }

  /**
   * Configuração de Eventos
   */
  function bindEvents() {
    // 1. Clique nas abas de Dias
    if (dom.daysBar) {
      dom.daysBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.aulas-day-tab');
        if (!btn) return;
        const dayId = btn.dataset.dayId;
        if (dayId) selectDay(dayId);
      });
    }

    // 2. Clique nos botões de Salas/Arenas
    if (dom.roomsBar) {
      dom.roomsBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.aulas-room-tab');
        if (!btn) return;
        const roomName = btn.dataset.roomName;
        if (roomName) selectRoom(roomName);
      });
    }

    // 3. Campo de busca textual em tempo real
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value || '';
        renderAulas();
      });
    }

    // 4. Clique nos Accordions e Botões de Download
    if (dom.aulasContainer) {
      dom.aulasContainer.addEventListener('click', (e) => {
        // Se clicou no botão de download ou visualização, não alterna o accordion
        if (e.target.closest('.aulas-pptx-download-btn') || e.target.closest('.aulas-pptx-view-btn')) {
          return;
        }

        const header = e.target.closest('.aulas-accordion-header');
        if (header) {
          const item = header.closest('.aulas-accordion-item');
          if (item && item.dataset.aulaId) {
            toggleAula(item.dataset.aulaId);
          }
        }
      });
    }
  }

  /**
   * Helper: Resgata objeto do dia atual
   */
  function getCurrentDay() {
    return AULAS_SCHEDULE.days.find(d => d.id === state.currentDayId) || AULAS_SCHEDULE.days[0] || null;
  }

  /**
   * Escape HTML simples para prevenir injeção
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

  /**
   * Notifica a janela pai (iframe) da nova altura dinâmica
   */
  function setupIframeResizer() {
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      const ro = new ResizeObserver(() => notifyHeight());
      ro.observe(document.body);
    }
    window.addEventListener('resize', notifyHeight);
    window.addEventListener('load', notifyHeight);
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'cathlabflix-request-height') {
        notifyHeight();
      }
    });
    notifyHeight();
  }

  function notifyHeight() {
    if (window.parent && window.parent !== window) {
      const height = Math.max(
        document.body.scrollHeight || 0,
        document.body.offsetHeight || 0,
        document.documentElement.scrollHeight || 0
      );
      window.parent.postMessage({
        type: 'cathlabflix-sessions-resize',
        height: height
      }, '*');
    }
  }

  /**
   * Consome a API Serverless /api/aulas para sincronizar arquivos do Google Drive
   */
  async function loadAulasFromDriveApi() {
    try {
      const response = await fetch('/api/aulas');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.configured && Array.isArray(data.days) && data.days.length > 0) {
        AULAS_SCHEDULE.days = data.days;

        // Se o dia atualmente selecionado não existir nos novos dados, seleciona o primeiro
        if (!AULAS_SCHEDULE.days.some(d => d.id === state.currentDayId)) {
          state.currentDayId = AULAS_SCHEDULE.days[0].id;
        }

        state.isLoading = false;
        renderDays();
        renderRooms();
        renderAulas();
        notifyHeight();
        return;
      }
    } catch (err) {
      console.warn('[Aulas Google Drive API] Falha na sincronização imediata, usando fallback local:', err);
    }

    state.isLoading = false;
    renderDays();
    renderRooms();
    renderAulas();
    notifyHeight();
  }

  /**
   * Hook preparado para chamada manual com parâmetros
   */
  window.AulasDriveAdapter = {
    loadFromDrive: async function (folderId, apiKey) {
      try {
        state.isLoading = true;
        renderSkeletons();

        const query = new URLSearchParams();
        if (folderId) query.set('folderId', folderId);
        if (apiKey) query.set('apiKey', apiKey);

        const response = await fetch(`/api/aulas?${query.toString()}`);
        if (!response.ok) return;

        const data = await response.json();
        if (data.configured && Array.isArray(data.days) && data.days.length > 0) {
          AULAS_SCHEDULE.days = data.days;
          if (!AULAS_SCHEDULE.days.some(d => d.id === state.currentDayId)) {
            state.currentDayId = AULAS_SCHEDULE.days[0].id;
          }
        }
      } catch (e) {
        console.error('[AulasDriveAdapter Error]', e);
      } finally {
        state.isLoading = false;
        renderDays();
        renderRooms();
        renderAulas();
        notifyHeight();
      }
    }
  };

  // Executa inicialização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
