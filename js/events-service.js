/**
 * CathlabFlix Events Service
 * Gerenciamento centralizado de eventos, persistência local, integração automática com Wix CMS / API e exportação de calendários (.ics / Google)
 */

(function(global) {
  'use strict';

  const STORAGE_KEY = 'cathlabflix_custom_events';
  let remoteEvents = [];

  function normalizeWixEventItem(it, idx) {
    if (!it || typeof it !== 'object') return null;

    const id = it._id || it.id || it.slug || `evento-wix-${idx + 1}`;
    const title = it.title || it.Title || it.nome || it.Nome || 'Evento Sem Título';
    
    // Data de início
    let date = it.date || it.data || it.dataInicio || it.startDate || it.Data || '';
    if (date instanceof Date) {
      date = date.toISOString().split('T')[0];
    } else if (typeof date === 'string' && date.includes('T')) {
      date = date.split('T')[0];
    }

    // Data de término
    let endDate = it.endDate || it.dataFim || it.dataTermino || it.EndDate || date;
    if (endDate instanceof Date) {
      endDate = endDate.toISOString().split('T')[0];
    } else if (typeof endDate === 'string' && endDate.includes('T')) {
      endDate = endDate.split('T')[0];
    }

    const time = it.time || it.horario || it.Horario || 'Horário a definir';
    const location = it.location || it.local || it.cidade || it.Local || 'CathlabFlix Streaming';
    const description = it.description || it.descricao || it.resumo || it.subtitle || it.Descricao || '';
    const subtitle = it.subtitle || it.subtitulo || description.slice(0, 100);
    
    // Imagem (suporta wix:image:// e URLs diretas)
    let image = it.image || it.imagem || it.foto || it.cover || it.Image || '';
    if (image && typeof image === 'string' && image.startsWith('wix:image://')) {
      const m = image.match(/wix:image:\/\/v1\/([^/]+)\//);
      if (m && m[1]) {
        image = `https://static.wixstatic.com/media/${m[1]}/v1/fill/w_1000,h_1000,al_c,q_80/file.png`;
      }
    }
    if (!image) {
      image = 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';
    }

    const type = (it.type || it.tipo || it.Tipo || 'evento').toLowerCase();
    const isApoio = type.includes('apoio') || (it.badge && it.badge.includes('APOIO'));
    const badge = it.badge || (isApoio ? 'APOIO SBHCI' : 'EVENTO OFICIAL SBHCI');
    const category = it.category || it.categoria || (type.includes('webinar') ? 'Webinar' : (type.includes('curso') ? 'Curso' : 'Congresso'));
    const registrationUrl = it.registrationUrl || it.linkInscricao || it.inscricao || it.link || '';

    return {
      id: String(id),
      slug: it.slug || String(id),
      title: String(title),
      subtitle: String(subtitle),
      description: String(description),
      date: String(date),
      endDate: String(endDate),
      time: String(time),
      location: String(location),
      modality: it.modality || it.modalidade || (location.toLowerCase().includes('streaming') || location.toLowerCase().includes('on-line') || location.toLowerCase().includes('online') ? 'Transmissão Online' : 'Presencial'),
      type: isApoio ? 'apoio_sbhci' : 'evento',
      badge: String(badge),
      category: String(category),
      color: isApoio ? 'blue' : 'red',
      image: String(image),
      registrationUrl: String(registrationUrl),
      actionUrl: `/new/evento?id=${encodeURIComponent(id)}`,
      actionLabel: 'Confira'
    };
  }

  const EventsService = {
    normalizeWixEventItem,

    /**
     * Define eventos diretamente do Wix CMS
     */
    setEventsFromWix(rawItems) {
      if (!Array.isArray(rawItems) || rawItems.length === 0) return;
      const normalized = rawItems.map((it, idx) => normalizeWixEventItem(it, idx)).filter(Boolean);
      if (normalized.length > 0) {
        remoteEvents = normalized;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cathlabflix:events-updated', { detail: normalized }));
        }
      }
    },

    /**
     * Retorna todos os eventos combinando os eventos oficiais com os cadastrados via painel/Wix
     */
    getAllEvents() {
      let baseList = [];
      if (typeof window !== 'undefined' && Array.isArray(window.INITIAL_EVENTS)) {
        baseList = window.INITIAL_EVENTS.slice();
      } else if (typeof INITIAL_EVENTS !== 'undefined' && Array.isArray(INITIAL_EVENTS)) {
        baseList = INITIAL_EVENTS.slice();
      }

      let customList = [];
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            customList = JSON.parse(stored);
          }
        }
      } catch (e) {
        console.warn('[EventsService] Erro ao ler eventos customizados:', e);
      }

      // Mescla substituindo por ID se já existir ou adicionando novos no topo
      const map = new Map();
      baseList.forEach(ev => map.set(ev.id, ev));
      customList.forEach(ev => map.set(ev.id, ev));
      // Eventos remotos do Wix CMS têm prioridade máxima de atualização
      remoteEvents.forEach(ev => map.set(ev.id, ev));

      const merged = Array.from(map.values());
      return merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },

    /**
     * Busca um evento específico por ID ou slug
     */
    getEventById(id) {
      if (!id) return null;
      const cleanId = String(id).trim().toLowerCase();
      const all = this.getAllEvents();
      return all.find(ev => (ev.id && ev.id.toLowerCase() === cleanId) || (ev.slug && ev.slug.toLowerCase() === cleanId)) || null;
    },

    /**
     * Sincroniza eventos remotos da API / Wix CMS
     */
    async syncFromRemote() {
      try {
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const endpoint = isLocal ? '/api/wix-events' : 'https://cathlabflix-sessions.vercel.app/api/wix-events';
        const res = await fetch(endpoint);
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.success && Array.isArray(data.items)) {
          this.setEventsFromWix(data.items);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cathlabflix:remote-events-loaded', { detail: data.items }));
          }
          return data.items;
        }
      } catch (e) {
        console.warn('[EventsService] Não foi possível sincronizar da API remota:', e);
      }
      return null;
    },

    /**
     * Salva ou atualiza um evento no banco local (localStorage) e dispara envio automático para a API/Wix CMS
     */
    saveEvent(eventData) {
      if (!eventData || !eventData.title || !eventData.date) {
        throw new Error('Título e Data são campos obrigatórios para o evento.');
      }

      const id = eventData.id || this.slugify(eventData.title) + '-' + Date.now().toString(36);
      
      // Regra de replicação de data de início caso término esteja vazio
      const startDate = eventData.date.trim();
      const finalEndDate = eventData.endDate && eventData.endDate.trim() !== '' ? eventData.endDate.trim() : startDate;

      // Mapeamento dos 3 tipos
      const typeRaw = (eventData.type || 'evento').toLowerCase();
      let finalType = 'evento';
      let finalBadge = 'EVENTO OFICIAL SBHCI';
      let finalColor = 'red';

      if (typeRaw.includes('apoio')) {
        finalType = 'apoio_sbhci';
        finalBadge = 'APOIO SBHCI';
        finalColor = 'blue';
      } else if (typeRaw === 'eventos' || typeRaw === 'evento_geral') {
        finalType = 'eventos';
        finalBadge = 'EVENTOS';
        finalColor = 'blue';
      }

      const regUrl = eventData.registrationUrl ? eventData.registrationUrl.trim() : '';

      const normalized = {
        id: id,
        slug: id,
        title: eventData.title.trim(),
        subtitle: (eventData.subtitle || eventData.description || '').substring(0, 160),
        description: eventData.description || eventData.subtitle || '',
        date: startDate,
        endDate: finalEndDate,
        time: eventData.time ? eventData.time.trim() : 'Horário a definir',
        location: eventData.location ? eventData.location.trim() : 'Plataforma CathlabFlix Streaming',
        modality: eventData.modality || (eventData.location && eventData.location.toLowerCase().includes('wtc') ? 'Presencial e On-line' : 'Transmissão Online'),
        type: finalType,
        badge: finalBadge,
        category: eventData.category || (finalType === 'apoio_sbhci' ? 'Apoio SBHCI' : (finalType === 'eventos' ? 'Eventos' : 'Congresso')),
        color: finalColor,
        image: eventData.image || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
        registrationUrl: regUrl,
        actionUrl: regUrl || `/new/evento?id=${encodeURIComponent(id)}`,
        actionLabel: 'Confira'
      };

      try {
        if (typeof localStorage !== 'undefined') {
          let customList = [];
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) customList = JSON.parse(stored);

          const existingIdx = customList.findIndex(e => e.id === normalized.id);
          if (existingIdx >= 0) {
            customList[existingIdx] = normalized;
          } else {
            customList.push(normalized);
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(customList));
        }

        // Dispara evento global para re-renderizar instâncias ativas do calendário
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cathlabflix:events-updated', { detail: normalized }));
        }

        // Sincronização automática em background com a API do Wix CMS
        if (typeof fetch !== 'undefined') {
          fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalized)
          }).then(res => res.json()).then(resData => {
            console.log('[EventsService] Evento sincronizado com a API:', resData);
          }).catch(err => {
            console.warn('[EventsService] Não foi possível sincronizar com o backend remoto agora (salvo localmente):', err);
          });
        }

        return normalized;
      } catch (err) {
        console.error('[EventsService] Falha ao persistir evento:', err);
        throw err;
      }
    },

    /**
     * Remove um evento personalizado do banco local
     */
    deleteEvent(id) {
      try {
        if (typeof localStorage !== 'undefined') {
          let customList = [];
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) customList = JSON.parse(stored);

          const filtered = customList.filter(e => e.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cathlabflix:events-updated', { detail: { id, deleted: true } }));
        }
        return true;
      } catch (err) {
        console.error('[EventsService] Falha ao excluir evento:', err);
        return false;
      }
    },

    /**
     * Retorna os eventos formatados para importação em Coleção de Dados do Wix (Wix Data Collection / CMS)
     */
    exportWixCollectionJSON() {
      const events = this.getAllEvents();
      return events.map(ev => ({
        _id: ev.id,
        title: ev.title,
        subtitle: ev.subtitle,
        description: ev.description,
        date: ev.date,
        endDate: ev.endDate || ev.date,
        time: ev.time,
        location: ev.location,
        modality: ev.modality,
        type: ev.type === 'apoio_sbhci' ? 'Apoio SBHCI' : (ev.type === 'eventos' ? 'Eventos' : 'Evento Oficial SBHCI'),
        badge: ev.badge,
        image: ev.image,
        registrationUrl: ev.registrationUrl || '',
        slug: ev.slug || ev.id
      }));
    },

    /**
     * Código Velo Backend para http-functions.js no Wix
     */
    generateWixVeloSnippet() {
      return `// Wix Velo Backend (http-functions.js)
// Coleção: "Eventos"
import { ok, created, serverError } from 'wix-http-functions';
import wixData from 'wix-data';

// GET https://SEU-SITE-WIX/_functions/eventos
export function get_eventos(request) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };

  return wixData.query('Eventos')
    .ascending('date')
    .find()
    .then(results => {
      options.body = {
        success: true,
        items: results.items
      };
      return ok(options);
    })
    .catch(error => {
      options.body = { success: false, error: error.message };
      return serverError(options);
    });
}

// POST https://SEU-SITE-WIX/_functions/eventos
export function post_eventos(request) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };

  return request.body.json()
    .then(body => {
      return wixData.insert('Eventos', body);
    })
    .then(result => {
      options.body = { success: true, item: result };
      return created(options);
    })
    .catch(error => {
      options.body = { success: false, error: error.message };
      return serverError(options);
    });
}`;
    },

    /**
     * Cria slug amigável a partir do título
     */
    slugify(str) {
      return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    /**
     * Gera URL de adição para o Google Calendar
     */
    generateGoogleCalendarUrl(event) {
      if (!event) return '#';
      const title = encodeURIComponent(event.title || 'Evento CathlabFlix');
      const details = encodeURIComponent((event.description || event.subtitle || '') + '\n\nMais informações: ' + (event.registrationUrl || 'https://cathlabflix-sessions.vercel.app'));
      const location = encodeURIComponent(event.location || 'CathlabFlix Streaming');

      const dateClean = (event.date || '').replace(/-/g, '');
      const endDateClean = (event.endDate || event.date || '').replace(/-/g, '');
      const startHour = (event.startTime || '09:00').replace(':', '');
      const endHour = (event.endTime || '18:00').replace(':', '');

      const startIso = `${dateClean}T${startHour}00Z`;
      const endIso = `${endDateClean}T${endHour}00Z`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
    },

    /**
     * Gera e dispara download do arquivo .ics (Apple Agenda, Outlook, etc.)
     */
    downloadIcs(event, fileName) {
      if (!event) return;
      const dateClean = (event.date || '').replace(/-/g, '');
      const endDateClean = (event.endDate || event.date || '').replace(/-/g, '');
      const startHour = (event.startTime || '09:00').replace(':', '');
      const endHour = (event.endTime || '18:00').replace(':', '');

      const dtStart = `${dateClean}T${startHour}00`;
      const dtEnd = `${endDateClean}T${endHour}00`;
      const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CathlabFlix SBHCI//Agenda Oficial//PT',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event.id || 'event'}-${dateClean}@cathlabflix.org`,
        `DTSTAMP:${now}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${(event.description || event.subtitle || '').replace(/\n/g, '\\n')}`,
        `LOCATION:${event.location || 'CathlabFlix Streaming'}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName || `${event.id || 'evento-cathlabflix'}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

  // Ouvinte de mensagens do Wix Velo (postMessage bidirecional com o site pai)
  if (typeof window !== 'undefined') {
    function requestWixData() {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'REQUEST_EVENTS', collection: 'eventos' }, '*');
          window.parent.postMessage({ type: 'REQUEST_EVENTS', collection: 'Eventos' }, '*');
          window.parent.postMessage('REQUEST_EVENTS', '*');
        }
      } catch (e) {}
    }

    EventsService.requestWixData = requestWixData;

    window.addEventListener('message', function(event) {
      if (!event.data) return;
      let data = event.data;

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return;
        }
      }

      let items = null;
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.items)) items = data.items;
        else if (Array.isArray(data.data)) items = data.data;
        else if (Array.isArray(data.payload)) items = data.payload;
        else if (Array.isArray(data.results)) items = data.results;
        else if (data.data && Array.isArray(data.data.items)) items = data.data.items;
        else if (data.type === 'EVENTS_DATA' && Array.isArray(data.items)) items = data.items;
      }

      if (Array.isArray(items) && items.length > 0) {
        EventsService.setEventsFromWix(items);
      }
    });
  }

  // Exportação para escopo global e módulos
  global.EventsService = EventsService;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsService;
  }
})(typeof window !== 'undefined' ? window : globalThis);

