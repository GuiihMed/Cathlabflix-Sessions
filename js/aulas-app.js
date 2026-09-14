/**
 * Cathlabflix Sessions - Controlador da Grade de Aulas e Apresentações PPTX (/solaci/aulas)
 * 
 * Gerencia:
 * - Seleção de Dias (Dia 29 | Dia 30 | Dia 31)
 * - Accordion com Card de Download PPTX (Nomes reais sincronizados com Gravações)
 * - Auto-ajuste de altura via postMessage para iframes/embed
 * - Hook preparado para Google Drive API
 */

(function () {
  'use strict';

  // Estado da Aplicação de Aulas
  const state = {
    currentDayId: null,
    openAulaIds: new Set()
  };

  // Elementos do DOM
  const dom = {
    daysBar: document.getElementById('aulasDaysBar'),
    aulasContainer: document.getElementById('aulasContainer')
  };

  /**
   * Inicialização
   */
  function init() {
    if (!AULAS_SCHEDULE.days || AULAS_SCHEDULE.days.length === 0) {
      console.warn("Nenhum dia configurado em AULAS_SCHEDULE.");
      return;
    }

    // Inicializa no primeiro dia
    const initialDay = AULAS_SCHEDULE.days[0];
    state.currentDayId = initialDay.id;

    // Abre a primeira aula por padrão para feedback visual imediato
    if (initialDay.aulas && initialDay.aulas.length > 0) {
      state.openAulaIds.add(initialDay.aulas[0].id);
    }

    renderDays();
    renderAulas();
    bindEvents();
    setupIframeResizer();
  }

  /**
   * Renderiza Abas dos Dias (Nível 1)
   */
  function renderDays() {
    if (!dom.daysBar) return;
    dom.daysBar.innerHTML = '';

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
   * Seleciona um dia e atualiza a grade de aulas
   */
  function selectDay(dayId) {
    if (state.currentDayId === dayId) return;

    state.currentDayId = dayId;
    state.openAulaIds.clear();

    const currentDay = getCurrentDay();
    if (currentDay && currentDay.aulas && currentDay.aulas.length > 0) {
      state.openAulaIds.add(currentDay.aulas[0].id);
    }

    renderDays();
    renderAulas();
    notifyHeight();
  }

  /**
   * Renderiza a Lista de Accordions com Cards de Download PPTX
   */
  function renderAulas() {
    if (!dom.aulasContainer) return;
    dom.aulasContainer.innerHTML = '';

    const currentDay = getCurrentDay();
    if (!currentDay || !currentDay.aulas || currentDay.aulas.length === 0) {
      dom.aulasContainer.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; color: #94a3b8; font-size: 0.95rem;">
          Nenhuma aula disponível para este dia.
        </div>
      `;
      notifyHeight();
      return;
    }

    const fragment = document.createDocumentFragment();

    currentDay.aulas.forEach((aula, index) => {
      const isOpen = state.openAulaIds.has(aula.id);
      const file = aula.file || {};
      const fileName = file.name || `${aula.title}.pptx`;
      const fileSize = file.size || '38.39MB';
      const downloadUrl = file.downloadUrl || '#';

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
          <span class="aulas-item-title">${escapeHtml(aula.title)}</span>
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
            <div class="aulas-pptx-badge">P</div>
            <div class="aulas-pptx-info">
              <span class="aulas-pptx-name">${escapeHtml(fileName)}</span>
              <span class="aulas-pptx-meta">Download PPTX · ${escapeHtml(fileSize)}</span>
            </div>
            <a 
              href="${downloadUrl}" 
              class="aulas-pptx-download-btn" 
              title="Baixar Apresentação PPTX (${escapeHtml(fileName)})"
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
      `;

      fragment.appendChild(item);
    });

    dom.aulasContainer.appendChild(fragment);
    notifyHeight();
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

    // 2. Clique nos Accordions e Botões de Download
    if (dom.aulasContainer) {
      dom.aulasContainer.addEventListener('click', (e) => {
        // Intercepta botão de download para feedback se ainda não conectado ao Google Drive
        const downloadBtn = e.target.closest('.aulas-pptx-download-btn');
        if (downloadBtn) {
          const href = downloadBtn.getAttribute('href');
          if (!href || href === '#') {
            e.preventDefault();
            showDrivePendingNotice();
            return;
          }
        }

        // Accordion Toggle
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
   * Exibe aviso amigável quando o arquivo do Drive ainda está em processo de sincronização
   */
  function showDrivePendingNotice() {
    let toast = document.getElementById('aulasDriveToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'aulasDriveToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.background = '#0a1f54';
      toast.style.color = '#ffffff';
      toast.style.border = '1px solid #38bdf8';
      toast.style.padding = '0.85rem 1.4rem';
      toast.style.borderRadius = '8px';
      toast.style.fontSize = '0.88rem';
      toast.style.fontWeight = '500';
      toast.style.fontFamily = 'Montserrat, sans-serif';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
      toast.style.zIndex = '9999';
      toast.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease';
      toast.style.opacity = '0';
      toast.textContent = 'Arquivo PPTX estará disponível para download assim que conectado à pasta do Google Drive.';
      document.body.appendChild(toast);
    }

    // Exibe toast com animação
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    clearTimeout(window._aulasToastTimer);
    window._aulasToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3800);
  }

  /**
   * Helper: Resgata objeto do dia atual
   */
  function getCurrentDay() {
    return AULAS_SCHEDULE.days.find(d => d.id === state.currentDayId) || null;
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
