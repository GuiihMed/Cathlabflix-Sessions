/**
 * CathlabFlix Continue Watching Cookie Manager
 * Gerencia a lista e o progresso de "Continue Assistindo" via Cookies do Usuário
 * Totalmente desacoplado e acessível em todas as páginas da plataforma
 */
(function(window) {
  'use strict';

  const COOKIE_NAME = 'cathlabflix_continue_watching';
  const COOKIE_DAYS = 365;

  // Itens padrão caso o usuário acesse pela primeira vez e o cookie ainda não exista
  const DEFAULT_SESSIONS = [
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
      updatedAt: Date.now() - 1000 * 60 * 480
    }
  ];

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

  function getContinueWatchingList() {
    const raw = getCookie(COOKIE_NAME);
    if (raw === null) {
      // Primeira visita: semeia o cookie do usuário com os itens padrão
      setCookie(COOKIE_NAME, DEFAULT_SESSIONS);
      return [...DEFAULT_SESSIONS];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      }
    } catch (e) {
      console.warn('[ContinueWatching] Cookie mal formatado, reinicializando:', e);
      setCookie(COOKIE_NAME, DEFAULT_SESSIONS);
      return [...DEFAULT_SESSIONS];
    }
    return [];
  }

  function saveContinueWatchingList(items) {
    if (!Array.isArray(items)) return;
    setCookie(COOKIE_NAME, items);
    window.dispatchEvent(new CustomEvent('cathlabflix:continueWatchingUpdated', { detail: { items } }));
  }

  function updateWatchProgress(sessionData) {
    if (!sessionData || !sessionData.id) return null;
    const list = getContinueWatchingList();
    const existingIndex = list.findIndex(item => item.id === sessionData.id);

    const progressVal = typeof sessionData.progress === 'number' 
      ? Math.min(100, Math.max(1, Math.round(sessionData.progress))) 
      : (existingIndex >= 0 ? list[existingIndex].progress : 25);

    const item = {
      id: sessionData.id,
      title: sessionData.title || (existingIndex >= 0 ? list[existingIndex].title : 'Aula CathlabFlix'),
      speaker: sessionData.speaker || (existingIndex >= 0 ? list[existingIndex].speaker : 'Especialista SBHCI'),
      room: sessionData.room || (existingIndex >= 0 ? list[existingIndex].room : 'Auditório'),
      category: sessionData.category || (existingIndex >= 0 ? list[existingIndex].category : 'Cardiologia'),
      duration: sessionData.duration || (existingIndex >= 0 ? list[existingIndex].duration : '45 min'),
      poster: sessionData.poster || (existingIndex >= 0 ? list[existingIndex].poster : '/assets/images/solaci-2026-gravacao.png'),
      videoUrl: sessionData.videoUrl || (existingIndex >= 0 ? list[existingIndex].videoUrl : ''),
      progress: progressVal,
      link: sessionData.link || `/new/player?id=${encodeURIComponent(sessionData.id)}`,
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
    }
    list.unshift(item);

    const trimmed = list.slice(0, 12);
    saveContinueWatchingList(trimmed);
    return item;
  }

  function removeFromContinueWatching(id) {
    const list = getContinueWatchingList().filter(item => item.id !== id);
    saveContinueWatchingList(list);
  }

  function clearAllContinueWatching() {
    saveContinueWatchingList([]);
  }

  function resetToDefault() {
    saveContinueWatchingList(DEFAULT_SESSIONS);
  }

  const ContinueWatchingManager = {
    COOKIE_NAME,
    getCookie,
    setCookie,
    getList: getContinueWatchingList,
    saveList: saveContinueWatchingList,
    updateProgress: updateWatchProgress,
    removeItem: removeFromContinueWatching,
    clearAll: clearAllContinueWatching,
    resetToDefault
  };

  window.ContinueWatchingManager = ContinueWatchingManager;
})(window);
