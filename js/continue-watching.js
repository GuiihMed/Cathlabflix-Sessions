/**
 * CathlabFlix Continue Watching Cookie Manager
 * Gerencia a lista e o progresso de "Continue Assistindo" via Cookies do Usuário
 * Totalmente isolado por congresso (SOLACI vs TCT) para evitar contaminação cruzada
 * CathlabFlix by SBHCI
 */
(function(window) {
  'use strict';

  const COOKIE_DAYS = 365;
  const COOKIE_PREFIX = 'cathlabflix_continue_watching_';
  const LEGACY_COOKIE_NAME = 'cathlabflix_continue_watching';

  // Itens padrão oficiais para SOLACI SBHCI 2026
  const DEFAULT_SOLACI_SESSIONS = [
    {
      id: "vimeo-1223707542",
      title: "SOLACI INCOR - Dr Raul Arrieta - Caso 003",
      speaker: "Dr. Raul Arrieta",
      room: "INCOR",
      category: "Estrutural",
      duration: "43 min",
      durationSec: 2614,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1223707542?autoplay=1",
      poster: "/assets/images/solaci-2026-gravacao.png",
      description: "Intervenção estrutural congênita e discussão aprofundada de procedimentos percutâneos em cardiologia pediátrica e adultos.",
      progress: 72,
      link: "/new/player?id=vimeo-1223707542",
      congress: "solaci",
      updatedAt: Date.now() - 1000 * 60 * 30
    },
    {
      id: "vimeo-1223707532",
      title: "SOLACI INCOR - Dr Raul Arrieta - Caso 004",
      speaker: "Dr. Raul Arrieta",
      room: "INCOR",
      category: "Congênitas",
      duration: "46 min",
      durationSec: 2795,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1223707532?autoplay=1",
      poster: "/assets/images/solaci-2026-confira.png",
      description: "Discussão de fechamento de defeitos de septo e oclusores vasculares avançados no INCOR.",
      progress: 45,
      link: "/new/player?id=vimeo-1223707532",
      congress: "solaci",
      updatedAt: Date.now() - 1000 * 60 * 90
    },
    {
      id: "vimeo-1223744925",
      title: "Sessão Dante Pazzanese - MEDTRONIC 001",
      speaker: "Heart Team Dante Pazzanese",
      room: "Dante Pazzanese",
      category: "TAVI & Valvar",
      duration: "48 min",
      durationSec: 2895,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1223744925?autoplay=1",
      poster: "/assets/images/solaci-2026-gravacao.png",
      description: "TAVI autoexpansível em anatomias desafiadoras com monitoramento de ritmo e pós-dilatação estratégica.",
      progress: 88,
      link: "/new/player?id=vimeo-1223744925",
      congress: "solaci",
      updatedAt: Date.now() - 1000 * 60 * 240
    },
    {
      id: "vimeo-1223707531",
      title: "SOLACI INCOR - Dr Carlos Campos - 002",
      speaker: "Dr. Carlos Campos",
      room: "INCOR",
      category: "Coronária",
      duration: "40 min",
      durationSec: 2453,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1223707531?autoplay=1",
      poster: "/assets/images/solaci-2026-gravacao.png",
      description: "Intervenção coronária complexa guiada por imagem intracoronária (OCT e IVUS) com stents farmacológicos modernos.",
      progress: 15,
      link: "/new/player?id=vimeo-1223707531",
      congress: "solaci",
      updatedAt: Date.now() - 1000 * 60 * 480
    }
  ];

  // Itens padrão oficiais para TCT Plus Latam Valves 2026
  const DEFAULT_TCT_SESSIONS = [
    {
      id: "vimeo-1199850334",
      title: "Redo TAVI",
      speaker: "Pedro Villablanca",
      room: "Sala 01",
      category: "TCT 2026",
      duration: "13 min",
      durationSec: 803,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1199850334?autoplay=1",
      poster: "https://i.vimeocdn.com/video/2166790808-9ad1d5779ab28315dd26de6f89d4759f40c75034079fc8ae369fac36410e2780-d_1920x1080?&r=pad&region=us",
      description: "Discussão aprofundada sobre indicação, técnicas e desfechos clínicos em intervenções de Redo TAVI no TCT Plus Latam Valves.",
      progress: 68,
      link: "/new/tct?id=vimeo-1199850334",
      congress: "tct",
      updatedAt: Date.now() - 1000 * 60 * 25
    },
    {
      id: "vimeo-1199852487",
      title: "TAV-in-TAV",
      speaker: "Live Case in a Box 1",
      room: "Sala 01",
      category: "Casos Ao Vivo TCT",
      duration: "36 min",
      durationSec: 2170,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1199852487?autoplay=1",
      poster: "https://i.vimeocdn.com/video/2166796259-aa77d71e9e66a33cc26e02a7607f26162679e1410893fa430ab50b3b28a95a23-d_1920x1080?&r=pad&region=us",
      description: "Caso ao vivo gravado com técnicas passo-a-passo para intervenção de valva transcateter secundária (TAV-in-TAV).",
      progress: 45,
      link: "/new/tct?id=vimeo-1199852487",
      congress: "tct",
      updatedAt: Date.now() - 1000 * 60 * 75
    },
    {
      id: "vimeo-1199845538",
      title: "TAVI degeneration",
      speaker: "Nicolas Van Mieghem",
      room: "Sala 01",
      category: "TCT Valvopatias",
      duration: "15 min",
      durationSec: 903,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1199845538?autoplay=1",
      poster: "https://i.vimeocdn.com/video/2166780332-c4f3a48b23e2029c060efc5d616fbe7026a6b1b76928514e810126f1cdd2f07e-d_1920x1080?&r=pad&region=us",
      description: "Manejo de degeneração estrutural de bioprótese aórtica transcateter e algoritmos diagnósticos modernos.",
      progress: 85,
      link: "/new/tct?id=vimeo-1199845538",
      congress: "tct",
      updatedAt: Date.now() - 1000 * 60 * 180
    },
    {
      id: "vimeo-1199850312",
      title: "Welcome to TCT Plus LATAM Valves",
      speaker: "TCT Latam Faculty",
      room: "Sala 02",
      category: "Sessão Plenária TCT",
      duration: "60 min",
      durationSec: 3613,
      year: "2026",
      videoUrl: "https://player.vimeo.com/video/1199850312?autoplay=1",
      poster: "https://i.vimeocdn.com/video/2166797305-7407be2d205f1dbfebb11cafef064a41bc7e807709ca6719f92039abc8d5cb38-d_1920x1080?&r=pad&region=us",
      description: "Abertura oficial do congresso CRF TCT Plus Latam Valves 2026 com destaques científicos e diretrizes latino-americanas.",
      progress: 20,
      link: "/new/tct?id=vimeo-1199850312",
      congress: "tct",
      updatedAt: Date.now() - 1000 * 60 * 360
    }
  ];

  function resolveCongress(explicitCongress, sessionData) {
    if (explicitCongress === 'tct' || explicitCongress === 'solaci') {
      return explicitCongress;
    }
    if (sessionData) {
      if (sessionData.congress) {
        const c = String(sessionData.congress).toLowerCase();
        if (c.includes('tct')) return 'tct';
        if (c.includes('solaci')) return 'solaci';
      }
      if (sessionData.id && String(sessionData.id).startsWith('vimeo-1199')) {
        return 'tct';
      }
      if (sessionData.title) {
        const t = String(sessionData.title).toLowerCase();
        if (t.includes('tct')) return 'tct';
        if (t.includes('solaci')) return 'solaci';
      }
    }
    try {
      const path = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
      if (path.includes('/tct') || path.includes('tct.html')) return 'tct';
      if (path.includes('/solaci') || path.includes('solaci.html')) return 'solaci';
      if (document.getElementById('tctSessionsCarouselTrack') || document.querySelector('[data-tct-day]')) return 'tct';
      if (document.getElementById('solaciCarouselTrack')) return 'solaci';
    } catch (e) {}

    return 'solaci';
  }

  function getCookieName(congress) {
    return COOKIE_PREFIX + congress;
  }

  function getDefaults(congress) {
    return congress === 'tct' ? [...DEFAULT_TCT_SESSIONS] : [...DEFAULT_SOLACI_SESSIONS];
  }

  function isItemValidForCongress(item, congress) {
    if (!item || !item.id) return false;
    const itemCongress = (item.congress || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    if (congress === 'tct') {
      if (itemCongress === 'solaci') return false;
      if (title.includes('solaci') || (item.speaker && item.speaker.includes('SOLACI'))) return false;
      return true;
    }

    if (congress === 'solaci') {
      if (itemCongress === 'tct') return false;
      if (title.includes('tct')) return false;
      return true;
    }

    return true;
  }

  function getCookie(name) {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const raw = c.substring(nameEQ.length, c.length);
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      }
    }
    return null;
  }

  function setCookie(name, value, days = COOKIE_DAYS) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(serialized) + expires + "; path=/; SameSite=Lax";
  }

  function getContinueWatchingList(targetCongress) {
    const congress = resolveCongress(targetCongress);
    const cookieName = getCookieName(congress);
    const raw = getCookie(cookieName);

    if (raw === null) {
      // Migração de cookie legado apenas para SOLACI
      if (congress === 'solaci') {
        const legacyRaw = getCookie(LEGACY_COOKIE_NAME);
        if (legacyRaw !== null) {
          try {
            const parsedLegacy = JSON.parse(legacyRaw);
            if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
              const solaciOnly = parsedLegacy.filter(item => isItemValidForCongress(item, 'solaci'));
              if (solaciOnly.length > 0) {
                setCookie(cookieName, solaciOnly);
                return solaciOnly;
              }
            }
          } catch (e) {}
        }
      }

      // Semeia cookie oficial padrão para o congresso ativo
      const defaults = getDefaults(congress);
      setCookie(cookieName, defaults);
      return [...defaults];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(item => isItemValidForCongress(item, congress));
        if (valid.length !== parsed.length) {
          setCookie(cookieName, valid);
        }
        if (valid.length === 0) {
          const defaults = getDefaults(congress);
          setCookie(cookieName, defaults);
          return [...defaults];
        }
        return valid.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      }
    } catch (e) {
      console.warn(`[ContinueWatching] Cookie de ${congress} mal formatado, reinicializando:`, e);
      const defaults = getDefaults(congress);
      setCookie(cookieName, defaults);
      return [...defaults];
    }

    const defaults = getDefaults(congress);
    setCookie(cookieName, defaults);
    return [...defaults];
  }

  function saveContinueWatchingList(items, targetCongress) {
    if (!Array.isArray(items)) return;
    const congress = resolveCongress(targetCongress);
    const cookieName = getCookieName(congress);
    const sanitized = items.filter(item => isItemValidForCongress(item, congress));

    setCookie(cookieName, sanitized);
    window.dispatchEvent(new CustomEvent('cathlabflix:continueWatchingUpdated', { 
      detail: { items: sanitized, congress } 
    }));
  }

  function updateWatchProgress(sessionData, explicitCongress) {
    if (!sessionData || !sessionData.id) return null;
    const congress = resolveCongress(explicitCongress, sessionData);

    const list = getContinueWatchingList(congress);
    const existingIndex = list.findIndex(item => item.id === sessionData.id);

    const progressVal = typeof sessionData.progress === 'number' 
      ? Math.min(100, Math.max(1, Math.round(sessionData.progress))) 
      : (existingIndex >= 0 ? list[existingIndex].progress : 25);

    const defaultPoster = congress === 'tct' 
      ? '/assets/images/tct-latam-2026.png' 
      : '/assets/images/solaci-2026-gravacao.png';

    const defaultLink = congress === 'tct'
      ? `/new/tct?id=${encodeURIComponent(sessionData.id)}`
      : `/new/player?id=${encodeURIComponent(sessionData.id)}`;

    const item = {
      id: sessionData.id,
      title: sessionData.title || (existingIndex >= 0 ? list[existingIndex].title : (congress === 'tct' ? 'Sessão TCT Latam' : 'Aula SOLACI')),
      speaker: sessionData.speaker || (existingIndex >= 0 ? list[existingIndex].speaker : 'Especialista SBHCI'),
      room: sessionData.room || (existingIndex >= 0 ? list[existingIndex].room : 'Auditório'),
      category: sessionData.category || (existingIndex >= 0 ? list[existingIndex].category : (congress === 'tct' ? 'TCT 2026' : 'Cardiologia')),
      duration: sessionData.duration || (existingIndex >= 0 ? list[existingIndex].duration : '45 min'),
      poster: sessionData.poster || (existingIndex >= 0 ? list[existingIndex].poster : defaultPoster),
      videoUrl: sessionData.videoUrl || (existingIndex >= 0 ? list[existingIndex].videoUrl : ''),
      progress: progressVal,
      link: sessionData.link || defaultLink,
      congress: congress,
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
    }
    list.unshift(item);

    const trimmed = list.slice(0, 12);
    saveContinueWatchingList(trimmed, congress);
    return item;
  }

  function removeFromContinueWatching(id, explicitCongress) {
    const congress = resolveCongress(explicitCongress);
    const list = getContinueWatchingList(congress).filter(item => item.id !== id);
    saveContinueWatchingList(list, congress);
  }

  function clearAllContinueWatching(explicitCongress) {
    if (explicitCongress === 'all') {
      saveContinueWatchingList([], 'solaci');
      saveContinueWatchingList([], 'tct');
      return;
    }
    const congress = resolveCongress(explicitCongress);
    saveContinueWatchingList([], congress);
  }

  function resetToDefault(explicitCongress) {
    if (explicitCongress === 'all') {
      saveContinueWatchingList(DEFAULT_SOLACI_SESSIONS, 'solaci');
      saveContinueWatchingList(DEFAULT_TCT_SESSIONS, 'tct');
      return;
    }
    const congress = resolveCongress(explicitCongress);
    saveContinueWatchingList(getDefaults(congress), congress);
  }

  const ContinueWatchingManager = {
    COOKIE_PREFIX,
    COOKIE_NAME_SOLACI: COOKIE_PREFIX + 'solaci',
    COOKIE_NAME_TCT: COOKIE_PREFIX + 'tct',
    getCookie,
    setCookie,
    resolveCongress,
    getList: getContinueWatchingList,
    saveList: saveContinueWatchingList,
    updateProgress: updateWatchProgress,
    removeItem: removeFromContinueWatching,
    clearAll: clearAllContinueWatching,
    resetToDefault
  };

  window.ContinueWatchingManager = ContinueWatchingManager;
})(window);
