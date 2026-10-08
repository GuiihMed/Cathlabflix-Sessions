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
    currentPeriodFilter: 'all', // 'all' | 'manha' | 'tarde'
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
    periodSwitch: document.getElementById('aulasPeriodSwitch'),
    countAllPeriod: document.getElementById('countAllPeriod'),
    countManhaPeriod: document.getElementById('countManhaPeriod'),
    countTardePeriod: document.getElementById('countTardePeriod'),
    searchInput: document.getElementById('aulasSearchInput'),
    aulasContainer: document.getElementById('aulasContainer')
  };

  /**
   * Inicialização da aplicação
   */
  function init() {
    renderSkeletons();
    updatePeriodButtons();
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
    state.openAulaIds.clear();
    renderRooms();
    renderAulas();
    notifyHeight();
  }

  function selectPeriod(period) {
    if (state.currentPeriodFilter === period) return;
    state.currentPeriodFilter = period;
    state.openAulaIds.clear();
    updatePeriodButtons();
    renderAulas();
  }

  function updatePeriodButtons() {
    if (!dom.periodSwitch) return;
    const buttons = dom.periodSwitch.querySelectorAll('.aulas-period-btn');
    buttons.forEach(btn => {
      const isActive = btn.dataset.period === state.currentPeriodFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function getAulaPeriod(aula) {
    if (aula && aula.period) return aula.period;
    if (!aula || !aula.time) return 'tarde';
    const hour = parseInt(aula.time.split(':')[0], 10);
    if (isNaN(hour)) return 'manha';
    return hour < 12 ? 'manha' : 'tarde';
  }

  function updatePeriodCounts(roomFilteredAulas) {
    if (!roomFilteredAulas) return;
    let countManha = 0;
    let countTarde = 0;
    roomFilteredAulas.forEach(aula => {
      const p = getAulaPeriod(aula);
      if (p === 'manha') countManha++;
      else countTarde++;
    });

    if (dom.countAllPeriod) dom.countAllPeriod.textContent = String(roomFilteredAulas.length);
    if (dom.countManhaPeriod) dom.countManhaPeriod.textContent = String(countManha);
    if (dom.countTardePeriod) dom.countTardePeriod.textContent = String(countTarde);
  }

  /**
   * Atualiza contador da barra de ferramentas
   */
  function renderToolbar(count, totalDayCount) {
    if (!dom.countBadge) return;

    const currentDay = getCurrentDay() || { name: 'Dia' };
    const periodSuffix = state.currentPeriodFilter === 'manha' 
      ? ' na Manhã' 
      : (state.currentPeriodFilter === 'tarde' ? ' na Tarde' : '');

    if (state.searchQuery.trim()) {
      dom.countBadge.innerHTML = `<strong>${count}</strong> resultado(s) para "${escapeHtml(state.searchQuery)}"${periodSuffix}`;
    } else if (state.currentRoomFilter !== 'Todas as Salas') {
      dom.countBadge.innerHTML = `<strong>${count}</strong> apresentações em <strong>${escapeHtml(state.currentRoomFilter)}</strong>${periodSuffix}`;
    } else {
      dom.countBadge.innerHTML = `<strong>${count}</strong> apresentações disponíveis (${escapeHtml(currentDay.name || 'Dia')})${periodSuffix}`;
    }
  }

  function createAulaAccordionItem(aula) {
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
        <div class="aulas-header-content">
          <div class="aulas-header-meta">
            ${aula.time ? `<span class="aula-time-badge">${escapeHtml(aula.time)}</span>` : ''}
            ${aula.room ? `<span class="aula-room-badge">${escapeHtml(aula.room)}</span>` : ''}
          </div>
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

    return item;
  }

  function createPeriodSectionElement(periodType, aulasList) {
    const isManha = periodType === 'manha';
    const section = document.createElement('section');
    section.className = `aulas-period-section ${isManha ? 'section-manha' : 'section-tarde'}`;

    const iconSvg = isManha 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line></svg>`;

    const titleText = isManha ? 'Manhã' : 'Tarde';
    const rangeText = isManha ? '08:00 às 12:00' : '12:00 às 18:30';
    const descText = isManha ? 'Apresentações e conferências matutinas' : 'Apresentações e sessões vespertinas';

    const header = document.createElement('div');
    header.className = 'aulas-period-header';
    header.innerHTML = `
      <div class="aulas-period-header-left">
        <div class="aulas-period-title-group">
          <span class="aulas-period-icon-wrap ${isManha ? 'sun' : 'sunset'}">${iconSvg}</span>
          <h2 class="aulas-period-title">${titleText}</h2>
          <span class="aulas-period-range-tag">${rangeText}</span>
        </div>
        <p class="aulas-period-desc">${descText}</p>
      </div>
      <div class="aulas-period-header-right">
        <span class="aulas-period-count-pill">
          <strong>${aulasList.length}</strong> ${aulasList.length === 1 ? 'apresentação' : 'apresentações'}
        </span>
      </div>
    `;

    const itemsWrapper = document.createElement('div');
    itemsWrapper.className = 'aulas-period-items';

    aulasList.forEach(aula => {
      itemsWrapper.appendChild(createAulaAccordionItem(aula));
    });

    section.appendChild(header);
    section.appendChild(itemsWrapper);
    return section;
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
      updatePeriodCounts([]);
      notifyHeight();
      return;
    }

    // 1. Filtra por sala
    const roomFilteredAulas = currentDay.aulas.filter(aula => {
      if (state.currentRoomFilter !== 'Todas as Salas' && aula.room !== state.currentRoomFilter) {
        return false;
      }
      return true;
    });

    updatePeriodCounts(roomFilteredAulas);

    // 2. Filtra por busca e período
    const query = (state.searchQuery || '').trim().toLowerCase();
    const finalFilteredAulas = roomFilteredAulas.filter(aula => {
      const period = getAulaPeriod(aula);
      if (state.currentPeriodFilter !== 'all' && period !== state.currentPeriodFilter) {
        return false;
      }

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

    renderToolbar(finalFilteredAulas.length, currentDay.aulas.length);

    if (finalFilteredAulas.length === 0) {
      renderEmpty('Nenhuma apresentação encontrada para os filtros selecionados.');
      notifyHeight();
      return;
    }

    // 3. Separação em Manhã e Tarde
    const manhaAulas = finalFilteredAulas.filter(a => getAulaPeriod(a) === 'manha');
    const tardeAulas = finalFilteredAulas.filter(a => getAulaPeriod(a) === 'tarde');

    const fragment = document.createDocumentFragment();

    if (state.currentPeriodFilter === 'all') {
      if (manhaAulas.length > 0) {
        fragment.appendChild(createPeriodSectionElement('manha', manhaAulas));
      }
      if (tardeAulas.length > 0) {
        fragment.appendChild(createPeriodSectionElement('tarde', tardeAulas));
      }
    } else if (state.currentPeriodFilter === 'manha' && manhaAulas.length > 0) {
      fragment.appendChild(createPeriodSectionElement('manha', manhaAulas));
    } else if (state.currentPeriodFilter === 'tarde' && tardeAulas.length > 0) {
      fragment.appendChild(createPeriodSectionElement('tarde', tardeAulas));
    }

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
   * Alterna abertura/fechamento do accordion (modo exclusivo: apenas um aberto por vez)
   */
  function toggleAula(aulaId) {
    const item = dom.aulasContainer.querySelector(`[data-aula-id="${aulaId}"]`);
    if (!item) return;

    const isOpen = state.openAulaIds.has(aulaId);

    if (isOpen) {
      // Fecha o item atualmente aberto
      state.openAulaIds.delete(aulaId);
      item.classList.remove('open');
      const header = item.querySelector('.aulas-accordion-header');
      if (header) header.setAttribute('aria-expanded', 'false');
    } else {
      // Fecha todos os outros itens abertos anteriormente
      state.openAulaIds.forEach((openId) => {
        const openItem = dom.aulasContainer.querySelector(`[data-aula-id="${openId}"]`);
        if (openItem) {
          openItem.classList.remove('open');
          const prevHeader = openItem.querySelector('.aulas-accordion-header');
          if (prevHeader) prevHeader.setAttribute('aria-expanded', 'false');
        }
      });
      state.openAulaIds.clear();

      // Abre o item recém-selecionado
      state.openAulaIds.add(aulaId);
      item.classList.add('open');
      const header = item.querySelector('.aulas-accordion-header');
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

    // 4. Clique no Seletor de Período (Todos | Manhã | Tarde)
    if (dom.periodSwitch) {
      dom.periodSwitch.addEventListener('click', (e) => {
        const btn = e.target.closest('.aulas-period-btn');
        if (!btn) return;
        const period = btn.dataset.period;
        if (period) selectPeriod(period);
      });
    }

    // 5. Clique nos Accordions e Botões de Download
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
