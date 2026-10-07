/**
 * CathlabFlix Modern Hub - Lógica Principal da Página /new
 * Integração com API Wix Blog e Calendário Interativo
 */

document.addEventListener('DOMContentLoaded', () => {
  initHubHeroCarousel();
  loadWixNews();
  initHubCalendar();
  initHamburgerDrawer();
  initThemeSwitcher();
});

/**
 * 1. Carrossel Hero com Banners Oficiais
 */
function initHubHeroCarousel() {
  const track = document.getElementById('hubHeroTrack');
  const slides = document.querySelectorAll('.hub-hero-slide');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const dotsContainer = document.getElementById('heroDotsContainer');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Cria bolinhas de paginação
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Atualiza dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.hero-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 7000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  const carouselSection = document.getElementById('hubHeroSection');
  if (carouselSection) {
    carouselSection.addEventListener('mouseenter', stopAutoplay);
    carouselSection.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/**
 * 2. Carregamento Automático de Notícias do Wix via /api/wix-news
 */
async function loadWixNews() {
  const container = document.getElementById('wixNewsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/wix-news');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      renderNewsCards(container, data.items);
    } else {
      renderNewsError(container, 'Nenhuma notícia disponível no momento.');
    }
  } catch (error) {
    console.warn('[Hub News] Usando fallback local:', error);
    // Usa dados locais se houver falha de rede
    const fallback = getLocalFallbackNews();
    renderNewsCards(container, fallback);
  }
}

function renderNewsCards(container, items) {
  container.innerHTML = items.map(item => {
    const actionUrl = item.internalAction?.url || item.link;
    const actionLabel = item.internalAction?.label || 'Confira';
    const isInternal = item.internalAction?.isInternal || false;

    return `
      <article class="wix-news-card" data-id="${item.id}">
        <div class="news-card-thumb-wrapper">
          <img 
            src="${item.image}" 
            alt="${escapeHTML(item.title)}" 
            class="news-card-thumb" 
            loading="lazy"
            onerror="this.src='/assets/images/og-cathlabflix.png'"
          >
          <span class="news-category-badge">${item.category || 'Notícia'}</span>
        </div>

        <div class="news-card-content">
          <div class="news-card-header">
            <span class="news-card-date">${item.formattedDate || ''}</span>
          </div>

          <h3 class="news-card-title">
            <a href="${actionUrl}" ${isInternal ? '' : 'target="_blank" rel="noopener noreferrer"'}>
              ${escapeHTML(item.title)}
            </a>
          </h3>

          <p class="news-card-excerpt">${escapeHTML(item.description)}</p>

          <div class="news-card-footer">
            <a 
              href="${actionUrl}" 
              class="news-card-btn" 
              ${isInternal ? '' : 'target="_blank" rel="noopener noreferrer"'}
            >
              <span>${actionLabel}</span>
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

function renderNewsError(container, msg) {
  container.innerHTML = `
    <div class="news-loading-state">
      <p>${msg}</p>
    </div>
  `;
}

function getLocalFallbackNews() {
  return [
    {
      id: '1',
      title: 'Conteúdos do Congresso SOLACI-SBHCI 2026 ganham destaque com cobertura multiplataforma',
      description: 'Já estão disponíveis no CathlabFlix os conteúdos e principais discussões do Congresso SOLACI-SBHCI 2026.',
      image: 'https://static.wixstatic.com/media/1d3d47_0e8baa2ca7354d62b8b17794f33d9e28~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Congresso',
      formattedDate: '23 Set 2026',
      internalAction: { label: 'Confira', url: '/new/solaci', isInternal: true }
    },
    {
      id: '2',
      title: 'CathlabFlix inaugura nova era da educação em Cardiologia Intervencionista',
      description: 'Desenvolvida para centralizar conteúdos da especialidade em um único ambiente.',
      image: 'https://static.wixstatic.com/media/a8daef_06fc0a89d72d4a05ad4f78d62ae31021~mv2.jpeg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Institucional',
      formattedDate: '11 Mai 2026',
      internalAction: { label: 'Confira', url: 'https://www.cathlabflix.org/destaques', isInternal: false }
    }
  ];
}

/**
 * 3. Inicialização da Agenda Interativa
 */
function initHubCalendar() {
  if (window.ModernAgendaCalendar) {
    window.agendaInstance = new ModernAgendaCalendar('agendaCalendarContainer');
  }
}

/**
 * 4. Menu Hambúrguer
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
    document.body.style.overflow = 'hidden';
    drawer.setAttribute('aria-hidden', 'false');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    drawer.setAttribute('aria-hidden', 'true');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });
}

/**
 * 5. Seletor de Temas (Claro vs Azul #062257 / #010234)
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

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
