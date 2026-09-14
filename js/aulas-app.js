/**
 * Cathlabflix Sessions - Controlador da Grade de Aulas e Apresentações PPTX (/solaci/aulas)
 * 
 * Gerencia:
 * - Seleção de Salas (Nível 1)
 * - Seleção e Scroll Horizontal de Períodos (Nível 2)
 * - Accordion com Card de Download PPTX (Nível 3)
 * - Auto-ajuste de altura via postMessage para iframes/embed
 * - Hook preparado para Google Drive API
 */

(function () {
  'use strict';

  // Estado da Aplicação de Aulas
  const state = {
    currentRoomId: null,
    currentPeriodId: null,
    openAulaIds: new Set()
  };

  // Elementos do DOM
  const dom = {
    roomsBar: document.getElementById('aulasRoomsBar'),
    periodsWrapper: document.getElementById('aulasPeriodsWrapper'),
    scrollNextBtn: document.getElementById('aulasScrollNextBtn'),
    aulasContainer: document.getElementById('aulasContainer')
  };

  /**
   * Inicialização
   */
  function init() {
    if (!AULAS_SCHEDULE.rooms || AULAS_SCHEDULE.rooms.length === 0) {
      console.warn("Nenhuma sala configurada em AULAS_SCHEDULE.");
      return;
    }

    // Inicializa na primeira sala e no primeiro período
    const initialRoom = AULAS_SCHEDULE.rooms[0];
    state.currentRoomId = initialRoom.id;

    if (initialRoom.periods && initialRoom.periods.length > 0) {
      state.currentPeriodId = initialRoom.periods[0].id;
    }

    renderRooms();
    renderPeriods();
    renderAulas();
    bindEvents();
    setupIframeResizer();
  }

  /**
   * Renderiza Abas de Salas (Nível 1)
   */
  function renderRooms() {
    if (!dom.roomsBar) return;
    dom.roomsBar.innerHTML = '';

    AULAS_SCHEDULE.rooms.forEach(room => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `aulas-room-tab ${room.id === state.currentRoomId ? 'active' : ''}`;
      btn.dataset.roomId = room.id;
      btn.textContent = room.name;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', room.id === state.currentRoomId ? 'true' : 'false');
      dom.roomsBar.appendChild(btn);
    });
  }

  /**
   * Renderiza Sub-abas de Períodos (Nível 2)
   */
  function renderPeriods() {
    if (!dom.periodsWrapper) return;
    dom.periodsWrapper.innerHTML = '';

    const currentRoom = getCurrentRoom();
    if (!currentRoom || !currentRoom.periods || currentRoom.periods.length === 0) {
      dom.periodsWrapper.innerHTML = '<span style="color: #94a3b8; font-size: 0.85rem; padding: 0.5rem 0;">Nenhum período disponível.</span>';
      return;
    }

    currentRoom.periods.forEach(period => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `aulas-period-tab ${period.id === state.currentPeriodId ? 'active' : ''}`;
      btn.dataset.periodId = period.id;
      btn.textContent = period.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', period.id === state.currentPeriodId ? 'true' : 'false');
      dom.periodsWrapper.appendChild(btn);
    });

    updateScrollArrowVisibility();
  }

  /**
   * Renderiza a Lista de Accordions com os Cards de PPTX (Nível 3)
   */
  function renderAulas() {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = '';

    const currentPeriod = getCurrentPeriod();
    if (!currentPeriod || !currentPeriod.aulas || currentPeriod.aulas.length === 0) {
      renderEmptyState();
      notifyHeight();
      return;
    }

    // Por padrão, se nenhum item estiver aberto, abre o primeiro (como na imagem de referência)
    if (state.openAulaIds.size === 0 && currentPeriod.aulas.length > 0) {
      state.openAulaIds.add(currentPeriod.aulas[0].id);
    }

    const fragment = document.createDocumentFragment();

    currentPeriod.aulas.forEach(aula => {
      const isOpen = state.openAulaIds.has(aula.id);
      const itemEl = document.createElement('div');
      itemEl.className = `aula-accordion-item ${isOpen ? 'active' : ''}`;
      itemEl.id = `aula-item-${aula.id}`;

      const file = aula.file || {};
      const fileName = escapeHtml(file.name || 'Apresentacao.pptx');
      const fileSize = escapeHtml(file.size || 'Download PPTX');
      const downloadUrl = file.downloadUrl && file.downloadUrl !== '#' ? escapeHtml(file.downloadUrl) : 'javascript:void(0)';

      itemEl.innerHTML = `
        <button 
          type="button" 
          class="aula-accordion-header" 
          aria-expanded="${isOpen ? 'true' : 'false'}"
          aria-controls="panel-${aula.id}"
          data-aula-id="${aula.id}"
        >
          <span class="aula-accordion-title">${escapeHtml(aula.title)}</span>
          <svg class="aula-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div class="aula-accordion-body" id="panel-${aula.id}" role="region">
          <a href="${downloadUrl}" class="pptx-card-box" target="_blank" rel="noopener" download title="Baixar ${fileName}">
            <div class="pptx-left-group">
              <!-- Ícone Badge P do PowerPoint -->
              <div class="pptx-icon-badge" aria-hidden="true">P</div>
              
              <div class="pptx-info-stack">
                <span class="pptx-filename">${fileName}</span>
                <span class="pptx-filemeta">Download PPTX · ${fileSize}</span>
              </div>
            </div>

            <!-- Botão de Download SVG -->
            <div class="pptx-download-btn" title="Baixar apresentação">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
          </a>
        </div>
      `;

      fragment.appendChild(itemEl);
    });

    dom.aulasContainer.appendChild(fragment);
    notifyHeight();
  }

  /**
   * Estado Vazio para períodos sem aulas cadastradas ainda
   */
  function renderEmptyState() {
    dom.aulasContainer.innerHTML = `
      <div class="aulas-empty-state">
        <svg class="aulas-empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>As apresentações deste período estarão disponíveis em breve.</p>
      </div>
    `;
  }

  /**
   * Event Listeners
   */
  function bindEvents() {
    // 1. Clique nas salas (Nível 1)
    if (dom.roomsBar) {
      dom.roomsBar.addEventListener('click', (e) => {
        const tab = e.target.closest('.aulas-room-tab');
        if (!tab) return;
        const roomId = tab.dataset.roomId;
        if (roomId && roomId !== state.currentRoomId) {
          selectRoom(roomId);
        }
      });
    }

    // 2. Clique nos períodos (Nível 2)
    if (dom.periodsWrapper) {
      dom.periodsWrapper.addEventListener('click', (e) => {
        const tab = e.target.closest('.aulas-period-tab');
        if (!tab) return;
        const periodId = tab.dataset.periodId;
        if (periodId && periodId !== state.currentPeriodId) {
          selectPeriod(periodId);
        }
      });
    }

    // 3. Clique nos accordions (Nível 3)
    if (dom.aulasContainer) {
      dom.aulasContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.aula-accordion-header');
        if (!header) return;
        const aulaId = header.dataset.aulaId;
        if (!aulaId) return;
        toggleAula(aulaId);
      });
    }

    // 4. Seta de Rolagem Horizontal de Períodos
    if (dom.scrollNextBtn && dom.periodsWrapper) {
      dom.scrollNextBtn.addEventListener('click', () => {
        const isNearEnd = dom.periodsWrapper.scrollLeft + dom.periodsWrapper.clientWidth >= dom.periodsWrapper.scrollWidth - 15;
        if (isNearEnd) {
          dom.periodsWrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          dom.periodsWrapper.scrollBy({ left: 160, behavior: 'smooth' });
        }
      });

      dom.periodsWrapper.addEventListener('scroll', updateScrollArrowVisibility, { passive: true });
      window.addEventListener('resize', updateScrollArrowVisibility);
    }
  }

  /**
   * Seleciona Sala
   */
  function selectRoom(roomId) {
    state.currentRoomId = roomId;
    const room = getCurrentRoom();
    state.currentPeriodId = (room && room.periods && room.periods.length > 0) ? room.periods[0].id : null;
    state.openAulaIds.clear();

    renderRooms();
    renderPeriods();
    renderAulas();
  }

  /**
   * Seleciona Período
   */
  function selectPeriod(periodId) {
    state.currentPeriodId = periodId;
    state.openAulaIds.clear();

    // Atualiza classes ativas de períodos
    const allTabs = dom.periodsWrapper.querySelectorAll('.aulas-period-tab');
    allTabs.forEach(t => {
      const isActive = t.dataset.periodId === periodId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderAulas();
  }

  /**
   * Alterna estado do Accordion
   */
  function toggleAula(aulaId) {
    const itemEl = document.getElementById(`aula-item-${aulaId}`);
    if (!itemEl) return;

    if (state.openAulaIds.has(aulaId)) {
      state.openAulaIds.delete(aulaId);
      itemEl.classList.remove('active');
      const btn = itemEl.querySelector('.aula-accordion-header');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
      state.openAulaIds.add(aulaId);
      itemEl.classList.add('active');
      const btn = itemEl.querySelector('.aula-accordion-header');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }

    notifyHeight();
  }

  /**
   * Mostra/oculta seta de rolagem de períodos
   */
  function updateScrollArrowVisibility() {
    if (!dom.scrollNextBtn || !dom.periodsWrapper) return;
    requestAnimationFrame(() => {
      const canScroll = dom.periodsWrapper.scrollWidth > dom.periodsWrapper.clientWidth + 8;
      dom.scrollNextBtn.style.display = canScroll ? 'flex' : 'none';
    });
  }

  /**
   * Helper: Resgata objeto da sala atual
   */
  function getCurrentRoom() {
    return AULAS_SCHEDULE.rooms.find(r => r.id === state.currentRoomId) || null;
  }

  /**
   * Helper: Resgata objeto do período atual
   */
  function getCurrentPeriod() {
    const room = getCurrentRoom();
    if (!room || !room.periods) return null;
    return room.periods.find(p => p.id === state.currentPeriodId) || null;
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
   * Hook preparado para Google Drive API
   * Será chamado quando os dados da pasta forem disponibilizados
   */
  window.AulasDriveAdapter = {
    loadFromDrive: async function (folderId, apiKey) {
      console.log(`[Google Drive Adapter] Preparado para conectar à pasta: ${folderId}`);
      // Lógica de fetch da API do Google Drive Files v3 será ativada aqui
    }
  };

  // Executa inicialização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
