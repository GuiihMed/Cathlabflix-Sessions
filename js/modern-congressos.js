/**
 * CathlabFlix - Hub de Congressos & TCT Latam Valves
 * Controle Interativo de Filtros, Busca em Tempo Real e Contador Regressivo
 */

document.addEventListener('DOMContentLoaded', () => {
  initCongressosFilters();
  initCongressosSearch();
  initTctCountdown();
  initCongressosFavorites();
});

/* ==========================================================================
   1. Filtro por Abas de Status (Todos / Gravações / Próximos)
   ========================================================================== */
function initCongressosFilters() {
  const tabBtns = document.querySelectorAll('.congressos-tab-btn');
  const cards = document.querySelectorAll('.congresso-card');
  const emptyState = document.getElementById('congressosEmptyState');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-filter');
      applyCombinedFilter();
    });
  });
}

/* ==========================================================================
   2. Busca em Tempo Real por Nome, Cidade ou Destaque
   ========================================================================== */
function initCongressosSearch() {
  const searchInput = document.getElementById('congressosSearchInput');
  const clearBtn = document.getElementById('congressosSearchClear');

  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = searchInput.value.trim();
      if (clearBtn) {
        clearBtn.style.display = query ? 'flex' : 'none';
      }
      applyCombinedFilter();
    }, 180);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      applyCombinedFilter();
    });
  }
}

function applyCombinedFilter() {
  const activeTab = document.querySelector('.congressos-tab-btn.active');
  const searchInput = document.getElementById('congressosSearchInput');
  const cards = document.querySelectorAll('.congresso-card');
  const emptyState = document.getElementById('congressosEmptyState');
  const resultCounter = document.getElementById('congressosResultCounter');

  const filterType = activeTab ? activeTab.getAttribute('data-filter') : 'all';
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  let visibleCount = 0;

  cards.forEach(card => {
    const cardStatus = card.getAttribute('data-status');
    const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
    const cardCity = (card.getAttribute('data-city') || '').toLowerCase();
    const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();

    const matchesStatus = (filterType === 'all' || cardStatus === filterType);
    const matchesQuery = !query || 
      cardTitle.includes(query) || 
      cardCity.includes(query) || 
      cardTags.includes(query);

    if (matchesStatus && matchesQuery) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      visibleCount++;
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });

  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  if (resultCounter) {
    resultCounter.textContent = visibleCount === 1 
      ? '1 congresso encontrado' 
      : `${visibleCount} congressos encontrados`;
  }
}

/* ==========================================================================
   3. Contador Regressivo em Tempo Real (TCT Latam Valves 2026)
   Data do Evento: 19 de Março de 2026, 08:00 (São Paulo)
   ========================================================================== */
function initTctCountdown() {
  const countdownSlots = document.querySelectorAll('[data-countdown-target]');
  if (!countdownSlots.length) return;

  function updateTimers() {
    countdownSlots.forEach(container => {
      const targetDateStr = container.getAttribute('data-countdown-target');
      if (!targetDateStr) return;

      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      const daysEl = container.querySelector('.timer-val-days');
      const hoursEl = container.querySelector('.timer-val-hours');
      const minsEl = container.querySelector('.timer-val-mins');
      const secsEl = container.querySelector('.timer-val-secs');

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    });
  }

  updateTimers();
  setInterval(updateTimers, 1000);
}

/* ==========================================================================
   4. Favoritar Congresso (Minha Lista)
   ========================================================================== */
function initCongressosFavorites() {
  const favBtns = document.querySelectorAll('.congresso-fav-btn');
  if (!favBtns.length) return;

  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem('cathlabflix-fav-congressos') || '[]');
    } catch {
      return [];
    }
  };

  const saveFavorites = (favs) => {
    try {
      localStorage.setItem('cathlabflix-fav-congressos', JSON.stringify(favs));
    } catch (e) {
      console.warn('Erro ao salvar favoritos:', e);
    }
  };

  // Inicializar estado dos botões
  const currentFavs = getFavorites();
  favBtns.forEach(btn => {
    const id = btn.getAttribute('data-congresso-id');
    if (id && currentFavs.includes(id)) {
      btn.classList.add('saved');
      btn.title = 'Remover da minha lista';
    }
  });

  favBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const id = btn.getAttribute('data-congresso-id');
      if (!id) return;

      let favs = getFavorites();
      if (favs.includes(id)) {
        favs = favs.filter(item => item !== id);
        btn.classList.remove('saved');
        btn.title = 'Adicionar à minha lista';
      } else {
        favs.push(id);
        btn.classList.add('saved');
        btn.title = 'Remover da minha lista';
      }
      saveFavorites(favs);
    });
  });
}
