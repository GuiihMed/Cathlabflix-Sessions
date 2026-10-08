/**
 * CathlabFlix Modern UI - Scripts & Interatividade
 * Baseado nas diretrizes do design_system_cathlabflix_modern_ui.md
 */

document.addEventListener('DOMContentLoaded', () => {
  initTopBarScroll();
  initSearch();
  initCategories();
  initCarousels();
  initVideoPlayerModal();
  initFavorites();
  initMobileBottomNav();
  initContinueWatching();
  initHamburgerDrawer();
  initThemeSwitcher();
});

/* ==========================================================================
   1. Dados e Mapeamento de Sessões
   ========================================================================== */

// Base de imagens médicas e posters temáticos de cardiologia intervencionista
const THEME_POSTERS = [
  '/assets/images/solaci-2026-gravacao.png',
  '/assets/images/solaci-2026-aulas.png',
  '/assets/images/solaci-2026-confira.png',
  '/assets/images/og-cathlabflix.png'
];

// Dados enriquecidos das sessões reais do SOLACI SBHCI 2026
const FEATURED_SESSIONS = [
  {
    id: "vimeo-1223707542",
    title: "SOLACI INCOR - Dr Raul Arrieta - Caso 003",
    speaker: "Dr. Raul Arrieta",
    room: "INCOR",
    day: "Dia 29",
    category: "Estrutural",
    duration: "43 min",
    durationSec: 2614,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223707542?autoplay=1",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Intervenção estrutural congênita e discussão aprofundada de procedimentos percutâneos em cardiologia pediátrica e adultos.",
    progress: 72
  },
  {
    id: "vimeo-1223707532",
    title: "SOLACI INCOR - Dr Raul Arrieta - Caso 004",
    speaker: "Dr. Raul Arrieta",
    room: "INCOR",
    day: "Dia 29",
    category: "Congênitas",
    duration: "46 min",
    durationSec: 2795,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223707532?autoplay=1",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Discussão de fechamento de defeitos de septo e oclusores vasculares avançados no INCOR.",
    progress: 45
  },
  {
    id: "vimeo-1223707531",
    title: "SOLACI INCOR - Dr Carlos Campos - 002",
    speaker: "Dr. Carlos Campos",
    room: "INCOR",
    day: "Dia 29",
    category: "Coronária",
    duration: "40 min",
    durationSec: 2453,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223707531?autoplay=1",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Intervenção coronária complexa guiada por imagem intracoronária (OCT e IVUS) com stents farmacológicos modernos.",
    progress: 15
  },
  {
    id: "vimeo-1223707530",
    title: "SOLACI INCOR - Dr Carlos Campos - 001",
    speaker: "Dr. Carlos Campos",
    room: "INCOR",
    day: "Dia 29",
    category: "Coronária",
    duration: "24 min",
    durationSec: 1444,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223707530?autoplay=1",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Abordagem moderna de bifurcações e lesões de tronco de coronária esquerda.",
    progress: 0
  },
  {
    id: "vimeo-1223744925",
    title: "Sessão Dante Pazzanese - MEDTRONIC 001",
    speaker: "Heart Team Dante Pazzanese",
    room: "Dante Pazzanese",
    day: "Dia 31",
    category: "TAVI & Valvar",
    duration: "48 min",
    durationSec: 2895,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223744925?autoplay=1",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "TAVI autoexpansível em anatomias desafiadoras com monitoramento de ritmo e pós-dilatação estratégica.",
    progress: 88
  },
  {
    id: "vimeo-1223744924",
    title: "Sessão Dante Pazzanese - SMT 002",
    speaker: "Equipe Dante Pazzanese",
    room: "Dante Pazzanese",
    day: "Dia 31",
    category: "Coronária",
    duration: "34 min",
    durationSec: 2085,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223744924?autoplay=1",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Oclusões totais crônicas (CTO) com técnicas anterógrada e retrógrada no laboratório de hemodinâmica.",
    progress: 0
  },
  {
    id: "vimeo-1223744923",
    title: "Simpósio Dante Pazzanese - DANTE 003",
    speaker: "Corpo Clínico Dante Pazzanese",
    room: "Dante Pazzanese",
    day: "Dia 31",
    category: "Casos Ao Vivo",
    duration: "42 min",
    durationSec: 2522,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223744923?autoplay=1",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Transmissão ao vivo de angioplastia com suporte circulatório mecânico temporário.",
    progress: 30
  },
  {
    id: "vimeo-1223744922",
    title: "Sessão Dante Pazzanese - MERIL 004",
    speaker: "Especialistas Convidados",
    room: "Dante Pazzanese",
    day: "Dia 31",
    category: "Estrutural",
    duration: "46 min",
    durationSec: 2806,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223744922?autoplay=1",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Implante de prótese transcateter balão-expansível de última geração em estenose aórtica severa.",
    progress: 0
  },
  {
    id: "heart-team-dia29",
    title: "Heart Team Master Session - Dia 29",
    speaker: "Heart Team Internacional",
    room: "Heart Team",
    day: "Dia 29",
    category: "Heart Team",
    duration: "52 min",
    durationSec: 3120,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223707542?autoplay=1",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Decisões colegiadas entre cirurgiões cardíacos e cardiologistas intervencionistas para revascularização complexa.",
    progress: 55
  },
  {
    id: "heart-team-dia30",
    title: "Heart Team Estrutural - Dia 30",
    speaker: "Painel SOLACI & SBHCI",
    room: "Heart Team",
    day: "Dia 30",
    category: "Heart Team",
    duration: "58 min",
    durationSec: 3480,
    year: "2026",
    videoUrl: "https://player.vimeo.com/video/1223707532?autoplay=1",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Manejo intervencionista de choque cardiogênico e suporte hemodinâmico na sala de procedimentos.",
    progress: 0
  }
];

const PPTX_CLASSES = [
  {
    id: "pptx-1",
    title: "Aulas & Apresentações SOLACI 2026 - Dia 29",
    speaker: "Comissão Científica",
    room: "Apresentações PPTX",
    category: "Aulas PPTX",
    duration: "18 Apresentações",
    year: "2026",
    linkUrl: "/solaci/aulas",
    poster: "/assets/images/solaci-2026-aulas.png",
    description: "Acesse e baixe os slides em PPTX de todas as conferências científicas do Dia 29."
  },
  {
    id: "pptx-2",
    title: "Aulas & Apresentações SOLACI 2026 - Dia 30",
    speaker: "Comissão Científica",
    room: "Apresentações PPTX",
    category: "Aulas PPTX",
    duration: "24 Apresentações",
    year: "2026",
    linkUrl: "/solaci/aulas",
    poster: "/assets/images/solaci-2026-aulas.png",
    description: "Grade de slides completa do segundo dia sobre intervenção coronária e inovação tecnológica."
  },
  {
    id: "pptx-3",
    title: "Aulas & Apresentações SOLACI 2026 - Dia 31",
    speaker: "Comissão Científica",
    room: "Apresentações PPTX",
    category: "Aulas PPTX",
    duration: "22 Apresentações",
    year: "2026",
    linkUrl: "/solaci/aulas",
    poster: "/assets/images/solaci-2026-aulas.png",
    description: "Apresentações de encerramento, simpósios de indústria e sessões plenárias de destaque."
  }
];

/* ==========================================================================
   2. Interatividade do TopBar & Scroll
   ========================================================================== */
function initTopBarScroll() {
  const topbar = document.getElementById('appTopbar');
  if (!topbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Busca em Tempo Real (Pill Search)
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }

    filterCardsBySearch(query);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      filterCardsBySearch('');
      searchInput.focus();
    });
  }
}

function filterCardsBySearch(query) {
  const allCards = document.querySelectorAll('.content-card');
  let matchedCount = 0;

  allCards.forEach(card => {
    const title = card.getAttribute('data-title') || '';
    const speaker = card.getAttribute('data-speaker') || '';
    const category = card.getAttribute('data-category') || '';
    const room = card.getAttribute('data-room') || '';

    const searchableText = `${title} ${speaker} ${category} ${room}`.toLowerCase();
    
    if (!query || searchableText.includes(query)) {
      card.style.display = 'block';
      matchedCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Atualiza tags de contagem
  const countTag = document.getElementById('solaciCountTag');
  if (countTag && query) {
    countTag.textContent = `${matchedCount} encontrados`;
  } else if (countTag) {
    countTag.textContent = '37 Gravações';
  }
}

/* ==========================================================================
   4. Categorias & Tags em Pílula (Horizontal Filter)
   ========================================================================== */
function initCategories() {
  const pills = document.querySelectorAll('.category-pill');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-category');
      filterCardsByCategory(selectedCategory);
    });
  });
}

function filterCardsByCategory(category) {
  const allCards = document.querySelectorAll('.content-card');

  allCards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    const cardRoom = card.getAttribute('data-room') || '';

    if (!category || category === 'all') {
      card.style.display = 'block';
    } else if (category === 'Heart Team' && cardRoom.includes('Heart Team')) {
      card.style.display = 'block';
    } else if (category === 'INCOR' && cardRoom.includes('INCOR')) {
      card.style.display = 'block';
    } else if (category === 'Dante Pazzanese' && cardRoom.includes('Dante Pazzanese')) {
      card.style.display = 'block';
    } else if (cardCat.toLowerCase().includes(category.toLowerCase())) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   5. Carrosséis com Rolagem Suave & Botões Prev/Next
   ========================================================================== */
function initCarousels() {
  // Renderizar cards do carrossel SOLACI
  renderSolaciCards();

  // Renderizar cards de Aulas PPTX
  renderPptxCards();

  // Configurar botões de navegação dos carrosséis
  setupCarouselNav('prevSolaciBtn', 'nextSolaciBtn', 'solaciCarouselTrack');
  setupCarouselNav('prevContinueBtn', 'nextContinueBtn', 'continueCarouselTrack');
  setupCarouselNav('prevPptxBtn', 'nextPptxBtn', 'pptxCarouselTrack');
}

function setupCarouselNav(prevBtnId, nextBtnId, trackId) {
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const track = document.getElementById(trackId);

  if (!track) return;

  const wrapper = track.closest('.carousel-track-wrapper') || track.parentElement;

  const updateScrollState = () => {
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const hasScrollLeft = scrollLeft > 12;
    const isAtEnd = scrollLeft >= maxScroll - 12;

    if (wrapper) {
      if (maxScroll <= 6) {
        wrapper.classList.add('no-scroll');
      } else {
        wrapper.classList.remove('no-scroll');
        wrapper.classList.toggle('has-scroll-left', hasScrollLeft);
        wrapper.classList.toggle('is-at-end', isAtEnd);
      }
    }

    if (prevBtn) {
      prevBtn.disabled = !hasScrollLeft;
      prevBtn.style.opacity = hasScrollLeft ? '1' : '0.35';
      prevBtn.style.pointerEvents = hasScrollLeft ? 'auto' : 'none';
    }
    if (nextBtn) {
      nextBtn.disabled = isAtEnd;
      nextBtn.style.opacity = isAtEnd ? '0.35' : '1';
      nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }
  };

  requestAnimationFrame(updateScrollState);
  setTimeout(updateScrollState, 200);

  track.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  const getScrollDistance = () => {
    const firstCard = track.querySelector('.content-card');
    if (firstCard) {
      return (firstCard.offsetWidth + 16) * 1.5;
    }
    return 320;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
    });
  }
}

function createCardHTML(session, isContinueWatching = false) {
  const isSaved = isFavorite(session.id);
  const progressHTML = isContinueWatching ? `
    <div class="card-progress-bar">
      <div class="card-progress-fill" style="width: ${session.progress || 35}%;"></div>
    </div>
  ` : '';

  return `
    <article 
      class="content-card" 
      data-id="${session.id}"
      data-title="${escapeHTML(session.title)}"
      data-speaker="${escapeHTML(session.speaker)}"
      data-category="${escapeHTML(session.category)}"
      data-room="${escapeHTML(session.room)}"
      data-video="${session.videoUrl || ''}"
      data-description="${escapeHTML(session.description || '')}"
      tabindex="0"
      role="button"
      aria-label="Assistir ${escapeHTML(session.title)}"
    >
      <div class="card-thumbnail-wrapper">
        <img 
          src="${session.poster}" 
          alt="${escapeHTML(session.title)}" 
          class="card-image"
          loading="lazy"
        />
        <div class="card-gradient-overlay"></div>
      </div>

      <div class="card-top-badges">
        <span class="card-category-tag">${session.room || session.category}</span>
        <button 
          type="button" 
          class="card-favorite-btn ${isSaved ? 'saved' : ''}" 
          data-fav-id="${session.id}"
          title="${isSaved ? 'Remover da minha lista' : 'Adicionar à minha lista'}"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div class="card-bottom-info">
        <div class="card-text-block">
          <h3 class="card-title">${escapeHTML(session.title)}</h3>
          <div class="card-meta-line">
            <span class="card-speaker">${escapeHTML(session.speaker)}</span>
            <span>•</span>
            <span>${session.duration}</span>
          </div>
        </div>

        <div class="card-play-button" title="Reproduzir">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      </div>

      ${progressHTML}
    </article>
  `;
}

function renderSolaciCards() {
  const track = document.getElementById('solaciCarouselTrack');
  if (!track) return;

  track.innerHTML = FEATURED_SESSIONS.map(s => createCardHTML(s)).join('');
  attachCardEvents(track);
}

function renderPptxCards() {
  const track = document.getElementById('pptxCarouselTrack');
  if (!track) return;

  track.innerHTML = PPTX_CLASSES.map(c => `
    <article 
      class="content-card content-card-wide" 
      data-id="${c.id}"
      data-link="${c.linkUrl}"
      tabindex="0"
      role="button"
    >
      <div class="card-thumbnail-wrapper">
        <img src="${c.poster}" alt="${escapeHTML(c.title)}" class="card-image" loading="lazy" />
        <div class="card-gradient-overlay"></div>
      </div>

      <div class="card-top-badges">
        <span class="card-category-tag" style="background: rgba(229, 9, 20, 0.85);">${c.category}</span>
      </div>

      <div class="card-bottom-info">
        <div class="card-text-block">
          <h3 class="card-title">${escapeHTML(c.title)}</h3>
          <div class="card-meta-line">
            <span class="card-speaker">${escapeHTML(c.speaker)}</span>
            <span>•</span>
            <span>${c.duration}</span>
          </div>
        </div>

        <a href="${c.linkUrl}" class="card-play-button" title="Acessar Aulas">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </article>
  `).join('');

  track.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const link = card.getAttribute('data-link');
      if (link) window.location.href = link;
    });
  });
}

function initContinueWatching() {
  const track = document.getElementById('continueCarouselTrack');
  if (!track) return;

  const continueItems = FEATURED_SESSIONS.filter(s => s.progress > 0);
  track.innerHTML = continueItems.map(s => createCardHTML(s, true)).join('');
  attachCardEvents(track);
}

/* ==========================================================================
   6. Modal do Player de Vídeo (Vimeo Oficial)
   ========================================================================== */
let activeVideoUrl = '';

function initVideoPlayerModal() {
  const modal = document.getElementById('playerModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = modal;

  // Botão Assistir Agora no Hero
  const heroWatchBtn = document.getElementById('heroWatchBtn');
  if (heroWatchBtn) {
    heroWatchBtn.addEventListener('click', () => {
      window.location.href = '/new/player';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePlayerModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePlayerModal();
    });
  }

  // Tecla ESC fecha o modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closePlayerModal();
    }
  });

  // Copiar link do vídeo
  const copyBtn = document.getElementById('modalCopyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copiado para a área de transferência!");
      }
    });
  }
}

function attachCardEvents(container) {
  container.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Se clicou no botão de favoritar, ignora abertura do player
      if (e.target.closest('.card-favorite-btn')) return;

      const id = card.getAttribute('data-id') || '';
      const title = card.getAttribute('data-title');
      const speaker = card.getAttribute('data-speaker');
      const room = card.getAttribute('data-room');
      const videoUrl = card.getAttribute('data-video');
      const description = card.getAttribute('data-description');

      if (videoUrl) {
        openPlayerModal({ id, title, speaker, room, videoUrl, description });
      }
    });

    // Acessibilidade por teclado (Enter ou Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function openPlayerModal(sessionData) {
  const modal = document.getElementById('playerModal');
  const iframeContainer = document.getElementById('playerIframeContainer');
  const titleEl = document.getElementById('modalSessionTitle');
  const speakerEl = document.getElementById('modalSpeakerName');
  const roomEl = document.getElementById('modalRoomInfo');
  const openPlayerBtn = document.getElementById('modalOpenPlayerBtn');

  if (!modal || !iframeContainer) return;

  activeVideoUrl = sessionData.videoUrl;

  titleEl.textContent = sessionData.title || "Sessão SOLACI SBHCI 2026";
  speakerEl.textContent = sessionData.speaker || "Especialista";
  roomEl.textContent = `${sessionData.room || 'Auditório'} • SOLACI SBHCI 2026`;

  // Atualizar link para a página completa de aula com slides e playlist
  if (openPlayerBtn) {
    if (sessionData.id) {
      openPlayerBtn.href = `/new/player?id=${encodeURIComponent(sessionData.id)}`;
    } else {
      openPlayerBtn.href = '/new/player';
    }
  }

  // Injetar Iframe do Vimeo com reprodução limpa
  iframeContainer.innerHTML = `
    <iframe 
      src="${sessionData.videoUrl}" 
      allow="autoplay; fullscreen; picture-in-picture" 
      allowfullscreen
      title="${escapeHTML(sessionData.title)}"
    ></iframe>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePlayerModal() {
  const modal = document.getElementById('playerModal');
  const iframeContainer = document.getElementById('playerIframeContainer');

  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';

  // Limpar iframe para parar áudio imediatamente
  if (iframeContainer) {
    iframeContainer.innerHTML = '';
  }
}

/* ==========================================================================
   7. Minha Lista & Favoritos (Persistência com LocalStorage)
   ========================================================================== */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('cathlabflix_favorites') || '[]');
  } catch (e) {
    return [];
  }
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(item => item !== id);
    showToast("Removido da Minha Lista");
  } else {
    favs.push(id);
    showToast("Adicionado à Minha Lista ❤️");
  }
  localStorage.setItem('cathlabflix_favorites', JSON.stringify(favs));
  updateFavoriteButtonsState();
}

function updateFavoriteButtonsState() {
  const favs = getFavorites();
  document.querySelectorAll('.card-favorite-btn').forEach(btn => {
    const id = btn.getAttribute('data-fav-id');
    const isSaved = favs.includes(id);
    btn.classList.toggle('saved', isSaved);
    btn.title = isSaved ? 'Remover da minha lista' : 'Adicionar à minha lista';
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
  });
}

function initFavorites() {
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.card-favorite-btn');
    if (!favBtn) return;

    e.stopPropagation();
    const id = favBtn.getAttribute('data-fav-id');
    if (id) toggleFavorite(id);
  });

  // Botão "+ Minha Lista" no Hero
  const heroListBtn = document.getElementById('heroMyListBtn');
  if (heroListBtn) {
    heroListBtn.addEventListener('click', () => {
      toggleFavorite('featured-hero-2026');
    });
  }
}

/* ==========================================================================
   8. Menu Mobile Flutuante (Bottom Navigation)
   ========================================================================== */
function initMobileBottomNav() {
  const links = document.querySelectorAll('.bottom-nav-link');
  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetSection = link.getAttribute('data-nav-target');
      if (targetSection === 'explore' || targetSection === 'solaci') {
        const solaciSec = document.getElementById('solaciSection');
        if (solaciSec) solaciSec.scrollIntoView({ behavior: 'smooth' });
      } else if (targetSection === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

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

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleDrawer);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Fechar ao clicar fora do dropdown
  document.addEventListener('click', (e) => {
    if (!drawer.classList.contains('active')) return;
    if (!drawer.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
      closeDrawer();
    }
  });

  // Tecla ESC fecha o dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Ações nos links do menu
  drawer.querySelectorAll('.dropdown-nav-link, .drawer-nav-link, .dropdown-featured-card').forEach(link => {
    link.addEventListener('click', (e) => {
      const filterCat = link.getAttribute('data-filter-category');
      if (filterCat) {
        filterCardsByCategory(filterCat);
        const targetSection = document.getElementById('solaciSection');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      closeDrawer();
    });
  });

  // Integração com botão de menu na bottom-nav mobile se houver
  const mobileMenuBtn = document.querySelector('[data-nav-target="menu"]');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }
}

/* ==========================================================================
   9. Utilitários (Toast & Escape)
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 2800);
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

/**
 * Alternador de Tema Oficial (Claro vs Azul #062257 e #010234)
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

