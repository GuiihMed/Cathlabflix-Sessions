/**
 * CathlabFlix Modern Aulas - Controlador da Página /new/aulas-solaci
 * Gerencia a grade de apresentações PPTX do SOLACI-SBHCI 2026 conectada à API Google Drive
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initModernAulas();
    initHamburgerDrawer();
    initThemeSwitcher();
  });

  // Estado da Aplicação
  const state = {
    currentDayId: 'dia-29',
    currentRoomFilter: 'Todas as Salas',
    currentPeriodFilter: 'all', // 'all' | 'manha' | 'tarde'
    searchQuery: '',
    openAulaIds: new Set(),
    isLoading: true
  };

  // Estrutura em memória dos dados das apresentações
  let scheduleData = {
    days: [
      {
        id: "dia-29",
        name: "Dia 29",
        label: "Dia 29",
        subtitle: "29 de Julho",
        rooms: ["Todas as Salas"],
        aulas: []
      },
      {
        id: "dia-30",
        name: "Dia 30",
        label: "Dia 30",
        subtitle: "30 de Julho",
        rooms: ["Todas as Salas"],
        aulas: []
      },
      {
        id: "dia-31",
        name: "Dia 31",
        label: "Dia 31",
        subtitle: "31 de Julho",
        rooms: ["Todas as Salas"],
        aulas: []
      }
    ]
  };

  // Elementos do DOM
  let dom = {};

  function initModernAulas() {
    dom = {
      daysBar: document.getElementById('aulasDaysBar'),
      roomsBar: document.getElementById('aulasRoomsBar'),
      toolbar: document.getElementById('aulasToolbar'),
      countBadge: document.getElementById('aulasCountBadge'),
      periodSwitch: document.getElementById('aulasPeriodSwitch'),
      countAllPeriod: document.getElementById('countAllPeriod'),
      countManhaPeriod: document.getElementById('countManhaPeriod'),
      countTardePeriod: document.getElementById('countTardePeriod'),
      searchInput: document.getElementById('aulasSearchInput'),
      searchClearBtn: document.getElementById('aulasSearchClearBtn'),
      aulasContainer: document.getElementById('aulasContainer')
    };

    renderSkeletons(5);
    updatePeriodButtons();
    bindEvents();
    loadAulasFromDriveApi();
  }

  function renderSkeletons(count = 5) {
    if (!dom.aulasContainer) return;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="aulas-skeleton"></div>`;
    }
    dom.aulasContainer.innerHTML = html;
    if (dom.countBadge) {
      dom.countBadge.innerHTML = 'Sincronizando apresentações com o Google Drive...';
    }
  }

  function bindEvents() {
    // 1. Clique nas abas de dias
    if (dom.daysBar) {
      dom.daysBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.aulas-day-tab');
        if (!btn) return;
        const dayId = btn.dataset.dayId;
        if (dayId) selectDay(dayId);
      });
    }

    // 2. Clique nos botões de salas
    if (dom.roomsBar) {
      dom.roomsBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.aulas-room-tab');
        if (!btn) return;
        const roomName = btn.dataset.roomName;
        if (roomName) selectRoom(roomName);
      });
    }

    // 3. Campo de busca em tempo real
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        state.searchQuery = (e.target.value || '').trim().toLowerCase();
        if (dom.searchClearBtn) {
          dom.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
        }
        renderAulas();
      });
    }

    if (dom.searchClearBtn && dom.searchInput) {
      dom.searchClearBtn.addEventListener('click', () => {
        dom.searchInput.value = '';
        state.searchQuery = '';
        dom.searchClearBtn.style.display = 'none';
        renderAulas();
        dom.searchInput.focus();
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

    // 5. Clique nos Accordions
    if (dom.aulasContainer) {
      dom.aulasContainer.addEventListener('click', (e) => {
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

  function selectDay(dayId) {
    if (state.currentDayId === dayId) return;
    state.currentDayId = dayId;
    state.currentRoomFilter = 'Todas as Salas';
    state.openAulaIds.clear();

    renderDays();
    renderRooms();
    renderAulas();
  }

  function selectRoom(roomName) {
    if (state.currentRoomFilter === roomName) return;
    state.currentRoomFilter = roomName;
    state.openAulaIds.clear();

    renderRooms();
    renderAulas();
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

  function renderDays() {
    if (!dom.daysBar) return;
    dom.daysBar.innerHTML = '';

    if (!scheduleData.days || scheduleData.days.length === 0) return;

    scheduleData.days.forEach(day => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `aulas-day-tab ${day.id === state.currentDayId ? 'active' : ''}`;
      btn.dataset.dayId = day.id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', day.id === state.currentDayId ? 'true' : 'false');
      btn.innerHTML = `
        <span class="tab-name">${escapeHTML(day.name || day.label)}</span>
        <span class="tab-sub">${escapeHTML(day.subtitle || '')}</span>
      `;
      dom.daysBar.appendChild(btn);
    });
  }

  function renderRooms() {
    if (!dom.roomsBar) return;
    dom.roomsBar.innerHTML = '';

    const currentDay = getCurrentDay();
    if (!currentDay || !Array.isArray(currentDay.rooms) || currentDay.rooms.length <= 1) {
      dom.roomsBar.style.display = 'none';
      return;
    }

    dom.roomsBar.style.display = 'flex';

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

  function renderToolbar(count, totalDayCount) {
    if (!dom.countBadge) return;
    const currentDay = getCurrentDay() || { name: 'Dia' };
    const periodSuffix = state.currentPeriodFilter === 'manha' 
      ? ' na Manhã' 
      : (state.currentPeriodFilter === 'tarde' ? ' na Tarde' : '');

    if (state.searchQuery) {
      dom.countBadge.innerHTML = `<strong>${count}</strong> resultado(s) para "${escapeHTML(state.searchQuery)}"${periodSuffix}`;
    } else if (state.currentRoomFilter !== 'Todas as Salas') {
      dom.countBadge.innerHTML = `<strong>${count}</strong> apresentações em <strong>${escapeHTML(state.currentRoomFilter)}</strong>${periodSuffix}`;
    } else {
      dom.countBadge.innerHTML = `<strong>${count}</strong> apresentações disponíveis no <strong>${escapeHTML(currentDay.name || 'Dia')}</strong>${periodSuffix}`;
    }
  }

  function createAulaAccordionItem(aula) {
    const isOpen = state.openAulaIds.has(aula.id);
    const file = aula.file || {};
    const fileName = file.name || `${aula.title}.pptx`;
    const fileSize = file.size || 'Disponível';
    const fileFormat = (file.format || 'PPTX').toUpperCase();
    const downloadUrl = file.downloadUrl || '#';
    const viewUrl = file.viewUrl || '';

    const isPdf = fileFormat === 'PDF';
    const isKey = fileFormat === 'KEYNOTE';
    const badgeClass = isPdf ? 'pdf' : (isKey ? 'keynote' : '');
    const badgeLetter = isPdf ? 'PDF' : (isKey ? 'KEY' : 'PPTX');

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
            ${aula.time ? `<span class="aula-time-badge">${escapeHTML(aula.time)}</span>` : ''}
            ${aula.room ? `<span class="aula-room-badge">${escapeHTML(aula.room)}</span>` : ''}
          </div>
          <span class="aulas-item-title">${escapeHTML(aula.speaker || aula.title)}</span>
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
            <span class="aulas-pptx-name" title="${escapeHTML(fileName)}">${escapeHTML(fileName)}</span>
            <span class="aulas-pptx-meta">Formato ${escapeHTML(fileFormat)} · Tamanho: ${escapeHTML(fileSize)}</span>
          </div>
          <div class="aulas-pptx-actions">
            ${viewUrl ? `
              <a 
                href="${escapeHTML(viewUrl)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="aulas-pptx-view-btn" 
                title="Visualizar no Google Drive"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Visualizar</span>
              </a>
            ` : ''}
            <a 
              href="${escapeHTML(downloadUrl)}" 
              class="aulas-pptx-download-btn" 
              title="Download ${escapeHTML(fileFormat)}" 
              ${downloadUrl !== '#' ? 'download' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download</span>
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
    section.setAttribute('aria-label', isManha ? 'Apresentações da Manhã' : 'Apresentações da Tarde');

    const iconHtml = isManha 
      ? `<svg class="period-header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`
      : `<svg class="period-header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 18a5 5 0 0 0-10 0"></path>
          <line x1="12" y1="9" x2="12" y2="2"></line>
          <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
          <line x1="1" y1="18" x2="3" y2="18"></line>
          <line x1="21" y1="18" x2="23" y2="18"></line>
          <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
          <line x1="23" y1="22" x2="1" y2="22"></line>
        </svg>`;

    const titleText = isManha ? 'Manhã' : 'Tarde';
    const rangeText = isManha ? '08:00 às 12:00' : '12:00 às 18:30';
    const descText = isManha 
      ? 'Apresentações científicas e conferências do período matutino' 
      : 'Apresentações científicas, mesas-redondas e casos do período vespertino';

    const header = document.createElement('div');
    header.className = 'aulas-period-header';
    header.innerHTML = `
      <div class="aulas-period-header-left">
        <div class="aulas-period-title-group">
          <span class="aulas-period-icon-wrap ${isManha ? 'sun' : 'sunset'}">${iconHtml}</span>
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

  function renderAulas() {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = '';

    if (state.isLoading) {
      renderSkeletons(5);
      return;
    }

    const currentDay = getCurrentDay();
    if (!currentDay || !Array.isArray(currentDay.aulas) || currentDay.aulas.length === 0) {
      renderEmpty('Nenhuma apresentação encontrada para este dia.');
      renderToolbar(0, 0);
      updatePeriodCounts([]);
      return;
    }

    // 1. Filtra por sala primeiro (para atualizar os contadores do período)
    const roomFilteredAulas = currentDay.aulas.filter(aula => {
      if (state.currentRoomFilter !== 'Todas as Salas' && aula.room !== state.currentRoomFilter) {
        return false;
      }
      return true;
    });

    updatePeriodCounts(roomFilteredAulas);

    // 2. Filtra por busca e período
    const query = state.searchQuery;

    const finalFilteredAulas = roomFilteredAulas.filter(aula => {
      // Filtro por período
      const period = getAulaPeriod(aula);
      if (state.currentPeriodFilter !== 'all' && period !== state.currentPeriodFilter) {
        return false;
      }

      // Filtro por busca
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
      renderEmpty('Nenhuma apresentação corresponde aos filtros aplicados.');
      return;
    }

    // 3. Separação visual em Manhã e Tarde
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
  }

  function toggleAula(aulaId) {
    const item = dom.aulasContainer.querySelector(`[data-aula-id="${aulaId}"]`);
    if (!item) return;

    const isOpen = state.openAulaIds.has(aulaId);

    if (isOpen) {
      state.openAulaIds.delete(aulaId);
      item.classList.remove('open');
      const header = item.querySelector('.aulas-accordion-header');
      if (header) header.setAttribute('aria-expanded', 'false');
    } else {
      // Fecha outros para visualização focada
      state.openAulaIds.forEach((openId) => {
        const openItem = dom.aulasContainer.querySelector(`[data-aula-id="${openId}"]`);
        if (openItem) {
          openItem.classList.remove('open');
          const prevHeader = openItem.querySelector('.aulas-accordion-header');
          if (prevHeader) prevHeader.setAttribute('aria-expanded', 'false');
        }
      });
      state.openAulaIds.clear();

      state.openAulaIds.add(aulaId);
      item.classList.add('open');
      const header = item.querySelector('.aulas-accordion-header');
      if (header) header.setAttribute('aria-expanded', 'true');
    }
  }

  function renderEmpty(message) {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = `
      <div class="aulas-empty-state">
        <h4 class="aulas-empty-title">${escapeHTML(message)}</h4>
        <p class="aulas-empty-desc">Tente selecionar outro dia, escolher outra sala ou limpar o campo de busca.</p>
      </div>
    `;
  }

  function getCurrentDay() {
    return scheduleData.days.find(d => d.id === state.currentDayId) || scheduleData.days[0] || null;
  }

  async function loadAulasFromDriveApi() {
    try {
      const response = await fetch('/api/aulas');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.configured && Array.isArray(data.days) && data.days.length > 0) {
        scheduleData.days = data.days;

        if (!scheduleData.days.some(d => d.id === state.currentDayId)) {
          state.currentDayId = scheduleData.days[0].id;
        }

        state.isLoading = false;
        renderDays();
        renderRooms();
        renderAulas();
        return;
      }
    } catch (err) {
      console.warn('[Modern Aulas] Erro ao carregar da API Google Drive, usando dados em cache:', err);
    }

    state.isLoading = false;
    renderDays();
    renderRooms();
    renderAulas();
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Menu Hambúrguer (Drawer)
   */
  function initHamburgerDrawer() {
    const hamburgerBtn = document.getElementById('topbarHamburgerBtn');
    const closeBtn = document.getElementById('drawerCloseBtn');
    const backdrop = document.getElementById('drawerBackdrop');
    const drawer = document.getElementById('appDrawer');

    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleDrawer(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('active')) return;
      if (!drawer.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
        closeDrawer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    drawer.querySelectorAll('.dropdown-nav-link, .drawer-nav-link').forEach(link => {
      link.addEventListener('click', () => closeDrawer());
    });
  }

  /**
   * Seletor de Temas (Claro vs Azul #062257 / #010234)
   */
  function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.drawer-theme-btn');
    if (!themeBtns.length) return;

    function applyTheme(theme) {
      if (theme === 'blue') {
        document.documentElement.setAttribute('data-theme', 'blue');
        try { localStorage.setItem('cathlabflix-theme', 'blue'); } catch (e) {}
      } else {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('cathlabflix-theme', 'light'); } catch (e) {}
      }

      themeBtns.forEach(btn => {
        const val = btn.getAttribute('data-theme-val');
        const isActive = val === (theme === 'blue' ? 'blue' : 'light');
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }

    let currentTheme = 'light';
    try {
      const saved = localStorage.getItem('cathlabflix-theme');
      if (saved) {
        currentTheme = saved;
      } else if (document.documentElement.getAttribute('data-theme') === 'blue') {
        currentTheme = 'blue';
      }
    } catch (e) {}

    applyTheme(currentTheme);

    themeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetTheme = btn.getAttribute('data-theme-val') || 'light';
        applyTheme(targetTheme);
      });
    });
  }

})();
