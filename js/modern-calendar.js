/**
 * CathlabFlix Modern Agenda & Interactive Calendar
 * Design inspirado nas referências: Frosted Glass / Soft UI + Expansão Vertical
 */

// Estrutura de dados inicial preparada para plugar os eventos reais posteriormente
const INITIAL_EVENTS = [
  {
    id: 'solaci-2026-destaque',
    date: '2026-10-21', // Formato YYYY-MM-DD
    title: 'Sessão Especial SOLACI SBHCI 2026',
    subtitle: 'Debates sobre Intervenções Coronárias Complexas e Casos Ao Vivo',
    time: '14:00 - 18:00',
    category: 'Congresso',
    color: 'red', // red | blue | amber | green
    badge: 'LEMBRE-SE',
    modality: 'Presencial e On-line',
    actionUrl: '/new/solaci',
    actionLabel: 'Acessar Congresso'
  },
  {
    id: 'webinar-sbhci-outubro',
    date: '2026-10-09',
    title: 'Webinar SBHCI: Atualizações em Terapias Estruturais',
    subtitle: 'Discussão de casos de TAVI e Valve-in-Valve Mitral',
    time: '19:00 - 20:30',
    category: 'Webinar',
    color: 'blue',
    badge: 'AO VIVO',
    modality: 'Transmissão Online',
    actionUrl: 'https://www.cathlabflix.org/destaques',
    actionLabel: 'Ver Transmissão'
  },
  {
    id: 'curso-intervencionistas-modulo',
    date: '2026-10-28',
    title: 'Curso para Intervencionistas em Formação',
    subtitle: 'Módulo 2: Técnicas Fundamentais de Hemodinâmica',
    time: '09:00 - 12:00',
    category: 'Curso',
    color: 'amber',
    badge: 'AULA',
    modality: 'On-demand & Exercícios',
    actionUrl: 'https://www.cathlabflix.org/destaques',
    actionLabel: 'Ver Conteúdo'
  }
];

class ModernAgendaCalendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Data inicial baseada em Outubro de 2026 (conforme o print do usuário) ou atual
    this.currentDate = new Date(2026, 9, 1); // Mês 9 = Outubro
    this.selectedDateStr = '2026-10-21'; // Seleciona o dia 21 inicialmente aberto como demonstração
    this.events = options.events || INITIAL_EVENTS;

    this.monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    this.init();
  }

  init() {
    this.renderSkeleton();
    this.renderMonthDays();
    this.attachEventListeners();

    // Se houver data pré-selecionada com evento, abre a gaveta
    if (this.selectedDateStr) {
      const initialEvent = this.getEventsForDate(this.selectedDateStr)[0];
      if (initialEvent) {
        this.expandEventDrawer(initialEvent, this.selectedDateStr);
      }
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="agenda-card-wrapper">
        <!-- Topo da Agenda com Título e Navegação de Mês -->
        <div class="agenda-header">
          <div class="agenda-header-titles">
            <span class="agenda-kicker">AGENDA</span>
            <h3 class="agenda-month-title" id="agendaMonthDisplay">Outubro 2026</h3>
          </div>

          <div class="agenda-nav-controls">
            <button type="button" class="agenda-nav-btn" id="agendaPrevMonthBtn" aria-label="Mês anterior">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button type="button" class="agenda-nav-btn" id="agendaNextMonthBtn" aria-label="Próximo mês">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Grade de Dias da Semana -->
        <div class="agenda-weekdays-row">
          ${this.dayNames.map(day => `<span class="agenda-weekday-label">${day}</span>`).join('')}
        </div>

        <!-- Grade Numérica de Dias do Mês -->
        <div class="agenda-days-grid" id="agendaDaysGrid" role="grid" aria-label="Calendário de Eventos">
          <!-- Injetado dinamicamente -->
        </div>

        <!-- Gaveta Expansível Inferior (Aparece embaixo sem mover o mapa) -->
        <div class="agenda-expandable-drawer" id="agendaExpandableDrawer" aria-live="polite">
          <div class="agenda-drawer-inner" id="agendaDrawerInner">
            <!-- Detalhe do evento selecionado -->
          </div>
        </div>
      </div>
    `;
  }

  renderMonthDays() {
    const monthDisplay = document.getElementById('agendaMonthDisplay');
    const daysGrid = document.getElementById('agendaDaysGrid');
    if (!monthDisplay || !daysGrid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    monthDisplay.textContent = `${this.monthNames[month]} ${year}`;

    // Primeiro dia da semana do mês (0 = Domingo)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Quantidade total de dias no mês
    const totalDays = new Date(year, month + 1, 0).getDate();

    let gridHtml = '';

    // Dias vazios de preenchimento do mês anterior
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += `<div class="agenda-day-cell empty" aria-hidden="true"></div>`;
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const dayFormatted = String(day).padStart(2, '0');
      const monthFormatted = String(month + 1).padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;

      const eventsOnDay = this.getEventsForDate(dateStr);
      const hasEvent = eventsOnDay.length > 0;
      const isSelected = dateStr === this.selectedDateStr;

      let eventClass = '';
      let markerDot = '';

      if (hasEvent) {
        const primaryCategory = eventsOnDay[0].color || 'red';
        eventClass = `has-event event-${primaryCategory}`;
        markerDot = `<span class="agenda-day-badge-ring ${primaryCategory}"></span>`;
      }

      const selectedClass = isSelected ? 'is-selected' : '';

      gridHtml += `
        <button 
          type="button" 
          class="agenda-day-cell ${eventClass} ${selectedClass}" 
          data-date="${dateStr}"
          aria-label="${day} de ${this.monthNames[month]}${hasEvent ? ' - possui evento' : ''}"
          ${hasEvent ? 'aria-haspopup="dialog"' : ''}
        >
          <span class="agenda-day-number">${day}</span>
          ${markerDot}
        </button>
      `;
    }

    daysGrid.innerHTML = gridHtml;
    this.attachDayClicks();
  }

  getEventsForDate(dateStr) {
    return this.events.filter(ev => ev.date === dateStr);
  }

  attachDayClicks() {
    const dayCells = this.container.querySelectorAll('.agenda-day-cell:not(.empty)');
    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.getAttribute('data-date');
        const eventsOnDay = this.getEventsForDate(dateStr);

        // Se clicou no mesmo dia que já estava selecionado, recolhe
        if (this.selectedDateStr === dateStr) {
          this.collapseEventDrawer();
          this.selectedDateStr = null;
          cell.classList.remove('is-selected');
          return;
        }

        // Remove seleção anterior
        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => {
          c.classList.remove('is-selected');
        });

        this.selectedDateStr = dateStr;
        cell.classList.add('is-selected');

        if (eventsOnDay.length > 0) {
          this.expandEventDrawer(eventsOnDay[0], dateStr);
        } else {
          this.expandEmptyDrawer(dateStr);
        }
      });
    });
  }

  expandEventDrawer(eventItem, dateStr) {
    const drawer = document.getElementById('agendaExpandableDrawer');
    const inner = document.getElementById('agendaDrawerInner');
    if (!drawer || !inner) return;

    const parts = dateStr.split('-');
    const dayNum = parts[2];
    const monthShort = this.monthNames[parseInt(parts[1], 10) - 1].substring(0, 3).toUpperCase();

    const colorClass = eventItem.color || 'red';

    inner.innerHTML = `
      <div class="agenda-event-detail-card ${colorClass}">
        <!-- Topo com badge lembre-se e botão fechar -->
        <div class="event-detail-top">
          <div class="event-date-pill">
            <span class="event-pill-date">${dayNum} ${monthShort}</span>
            <span class="event-pill-badge">${eventItem.badge || 'LEMBRE-SE'}</span>
          </div>

          <button type="button" class="event-detail-close-btn" id="eventDetailCloseBtn" title="Recolher detalhes" aria-label="Fechar detalhes do evento">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Conteúdo do evento -->
        <div class="event-detail-body">
          <span class="event-category-tag">${eventItem.category}</span>
          <h4 class="event-detail-title">${eventItem.title}</h4>
          <p class="event-detail-desc">${eventItem.subtitle}</p>

          <div class="event-detail-meta">
            <div class="event-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${eventItem.time}</span>
            </div>

            <div class="event-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>${eventItem.modality}</span>
            </div>
          </div>

          ${eventItem.actionUrl ? `
            <a href="${eventItem.actionUrl}" class="event-detail-cta-btn">
              ${eventItem.actionLabel || 'Acessar Detalhes'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          ` : ''}
        </div>
      </div>
    `;

    drawer.classList.add('is-open');

    // Botão de fechar da gaveta
    const closeBtn = document.getElementById('eventDetailCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.collapseEventDrawer();
        this.selectedDateStr = null;
        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
      });
    }
  }

  expandEmptyDrawer(dateStr) {
    const drawer = document.getElementById('agendaExpandableDrawer');
    const inner = document.getElementById('agendaDrawerInner');
    if (!drawer || !inner) return;

    const parts = dateStr.split('-');
    const dayNum = parts[2];
    const monthShort = this.monthNames[parseInt(parts[1], 10) - 1].substring(0, 3).toUpperCase();

    inner.innerHTML = `
      <div class="agenda-event-empty-box">
        <span class="empty-date-tag">${dayNum} ${monthShort}</span>
        <p class="empty-text">Nenhum evento agendado para este dia.</p>
      </div>
    `;

    drawer.classList.add('is-open');
  }

  collapseEventDrawer() {
    const drawer = document.getElementById('agendaExpandableDrawer');
    if (drawer) {
      drawer.classList.remove('is-open');
    }
  }

  attachEventListeners() {
    const prevBtn = document.getElementById('agendaPrevMonthBtn');
    const nextBtn = document.getElementById('agendaNextMonthBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }
  }

  /**
   * Método público para carregar eventos customizados enviados posteriormente
   */
  setEvents(newEvents) {
    this.events = newEvents;
    this.renderMonthDays();
  }
}

// Exportação global para uso nas páginas
window.ModernAgendaCalendar = ModernAgendaCalendar;
