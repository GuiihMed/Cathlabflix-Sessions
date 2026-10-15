/**
 * CathlabFlix - Lógica da Página Interna de Evento (/new/evento)
 */

document.addEventListener('DOMContentLoaded', () => {
  initEventoDetail();
});

function initEventoDetail() {
  const container = document.getElementById('eventoDetailContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id') || 'solaci-2026-destaque';

  let event = null;
  if (typeof EventsService !== 'undefined' && typeof EventsService.getEventById === 'function') {
    event = EventsService.getEventById(eventId);
  }

  // Fallback para window.INITIAL_EVENTS se EventsService não estiver carregado
  if (!event && typeof INITIAL_EVENTS !== 'undefined' && Array.isArray(INITIAL_EVENTS)) {
    event = INITIAL_EVENTS.find(e => e.id === eventId) || null;
  }

  if (!event) {
    renderNotFound(container, eventId);
    return;
  }

  renderEvent(container, event);
}

function renderEvent(container, event) {
  document.title = `${escapeHTML(event.title)} - CathlabFlix SBHCI`;

  const isApoio = event.type === 'apoio_sbhci' || (event.badge && event.badge.includes('APOIO'));
  const typeBadgeLabel = isApoio ? 'Apoio SBHCI' : 'Evento Oficial';
  const typeBadgeClass = isApoio ? 'badge-apoio' : 'badge-oficial';

  // Formatação de data
  const dateFormatted = formatDateString(event.date, event.endDate, event.dateRangeLabel);
  const eventImg = event.image || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';

  container.innerHTML = `
    <!-- Barra Superior de Navegação -->
    <div class="event-nav-header">
      <a href="javascript:history.length > 1 ? history.back() : window.location.href='/new/embed-home.html'" class="event-back-btn" title="Voltar para a Agenda">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Voltar para Eventos</span>
      </a>
      <span class="event-category-chip ${typeBadgeClass}">${typeBadgeLabel}</span>
    </div>

    <!-- Banner Hero do Evento -->
    <div class="event-hero-banner">
      <img src="${eventImg}" alt="${escapeHTML(event.title)}" class="event-hero-img" onerror="this.src='/assets/images/og-cathlabflix.png'">
      <div class="event-hero-gradient"></div>
      <div class="event-hero-meta-overlay">
        <span class="event-hero-modality">${event.modality || 'Evento SBHCI'}</span>
      </div>
    </div>

    <!-- Corpo Principal do Evento -->
    <div class="event-article-body">
      <!-- Cabeçalho -->
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

      <!-- Painel Rápido de Informações (Data, Horário, Local) -->
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
            <span class="info-card-val">${dateFormatted}</span>
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

      <!-- Barra de Ações (Salvar na Agenda & Acessar Conteúdo) -->
      <section class="event-action-bar">
        <div class="event-action-buttons">
          <div class="agenda-export-dropdown-wrapper">
            <button type="button" class="event-primary-btn outline" id="eventExportBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Salvar na Agenda</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div class="agenda-export-menu" id="eventExportMenu">
              <a href="${EventsService.generateGoogleCalendarUrl(event)}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                <span class="export-menu-icon google">G</span>
                Google Calendar
              </a>
              <button type="button" class="export-menu-item" id="exportAppleBtn">
                <span class="export-menu-icon apple"></span>
                Apple Agenda (.ics)
              </button>
              <button type="button" class="export-menu-item" id="exportOutlookBtn">
                <span class="export-menu-icon outlook">O</span>
                Outlook (.ics)
              </button>
            </div>
          </div>

          ${event.actionUrl && !event.actionUrl.includes('evento') ? `
            <a href="${event.actionUrl}" class="event-primary-btn fill" target="_blank" rel="noopener noreferrer">
              <span>Acessar Transmissão / Inscrição</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          ` : `
            <a href="https://www.cathlabflix.org" class="event-primary-btn fill" target="_blank" rel="noopener noreferrer">
              <span>Acessar Plataforma Oficial</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          `}
        </div>
      </section>

      <!-- Descrição Detalhada do Evento -->
      <section class="event-content-section">
        <h2 class="section-title">Sobre este Evento</h2>
        <div class="event-description-text">
          <p>${escapeHTML(event.description || event.subtitle || 'Mais detalhes serão divulgados em breve.')}</p>
        </div>
      </section>
    </div>
  `;

  // Listeners de exportação de agenda
  const exportBtn = document.getElementById('eventExportBtn');
  const exportMenu = document.getElementById('eventExportMenu');
  if (exportBtn && exportMenu) {
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.agenda-export-dropdown-wrapper')) {
        exportMenu.classList.remove('is-open');
      }
    });

    const appleBtn = document.getElementById('exportAppleBtn');
    if (appleBtn) {
      appleBtn.addEventListener('click', () => {
        EventsService.downloadIcs(event, `${event.id}.ics`);
        exportMenu.classList.remove('is-open');
      });
    }

    const outlookBtn = document.getElementById('exportOutlookBtn');
    if (outlookBtn) {
      outlookBtn.addEventListener('click', () => {
        EventsService.downloadIcs(event, `${event.id}.ics`);
        exportMenu.classList.remove('is-open');
      });
    }
  }
}

function renderNotFound(container, eventId) {
  container.innerHTML = `
    <div class="event-not-found-card">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); margin-bottom: 16px;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h2>Evento não encontrado</h2>
      <p>O evento solicitado (<code>${escapeHTML(eventId)}</code>) não foi localizado ou foi encerrado.</p>
      <a href="/new/embed-home.html" class="event-primary-btn fill" style="margin-top: 16px;">
        <span>Voltar para a Agenda</span>
      </a>
    </div>
  `;
}

function formatDateString(dateStr, endDateStr, dateRangeLabel) {
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
