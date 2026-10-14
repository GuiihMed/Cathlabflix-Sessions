/**
 * CathlabFlix Events Service
 * Gerenciamento centralizado de eventos, persistência local, integração com Wix Data e exportação de calendários (.ics / Google)
 */

(function(global) {
  'use strict';

  const STORAGE_KEY = 'cathlabflix_custom_events';

  const EventsService = {
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
      return all.find(ev => ev.id.toLowerCase() === cleanId) || null;
    },

    /**
     * Salva ou atualiza um evento no banco local (localStorage)
     */
    saveEvent(eventData) {
      if (!eventData || !eventData.title || !eventData.date) {
        throw new Error('Título e Data são campos obrigatórios para o evento.');
      }

      const id = eventData.id || this.slugify(eventData.title) + '-' + Date.now().toString(36);
      const isApoio = eventData.type === 'apoio_sbhci' || eventData.type === 'apoio';

      const normalized = {
        id: id,
        title: eventData.title.trim(),
        subtitle: (eventData.subtitle || eventData.description || '').substring(0, 160),
        description: eventData.description || eventData.subtitle || 'Detalhes sobre o evento da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista.',
        date: eventData.date,
        endDate: eventData.endDate || null,
        time: eventData.time || 'Horário a definir',
        location: eventData.location || 'Transmissão Oficial CathlabFlix',
        modality: eventData.modality || (eventData.location && eventData.location.toLowerCase().includes('wtc') ? 'Presencial e On-line' : 'Transmissão Online'),
        type: isApoio ? 'apoio_sbhci' : 'evento',
        badge: isApoio ? 'APOIO SBHCI' : 'EVENTO OFICIAL',
        category: eventData.category || (isApoio ? 'Apoio SBHCI' : 'Congresso'),
        color: isApoio ? 'blue' : 'red',
        image: eventData.image || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
        actionUrl: eventData.actionUrl || `/new/evento?id=${encodeURIComponent(id)}`,
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
        eventDate: ev.date,
        endDate: ev.endDate || '',
        timeText: ev.time,
        location: ev.location,
        modality: ev.modality,
        eventType: ev.type === 'apoio_sbhci' ? 'Apoio SBHCI' : 'Evento Oficial',
        badge: ev.badge,
        bannerImage: ev.image,
        actionUrl: ev.actionUrl,
        buttonText: 'Confira'
      }));
    },

    /**
     * Gera snippet de código Velo (Wix Code) para backend ou página
     */
    generateWixVeloSnippet() {
      return `// Wix Velo Backend: Integração de Eventos CathlabFlix
import wixData from 'wix-data';

export async function getCathlabflixEvents() {
  const results = await wixData.query('CathlabflixEvents')
    .ascending('eventDate')
    .find();
  return results.items;
}

export async function insertEvent(eventItem) {
  return await wixData.insert('CathlabflixEvents', eventItem);
}`;
    },

    /**
     * Cria slug amigável a partir do título
     */
    slugify(str) {
      return String(str)
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
      const details = encodeURIComponent((event.subtitle || event.description || '') + '\n\nMais informações: https://cathlabflix-sessions.vercel.app' + (event.actionUrl || ''));
      const location = encodeURIComponent(event.location || 'CathlabFlix');

      const dateClean = (event.date || '').replace(/-/g, '');
      const startHour = (event.startTime || '09:00').replace(':', '');
      const endHour = (event.endTime || '18:00').replace(':', '');

      const startIso = `${dateClean}T${startHour}00Z`;
      const endIso = `${dateClean}T${endHour}00Z`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
    },

    /**
     * Gera e dispara download do arquivo .ics (Apple Agenda, Outlook, etc.)
     */
    downloadIcs(event, fileName) {
      if (!event) return;
      const dateClean = (event.date || '').replace(/-/g, '');
      const startHour = (event.startTime || '09:00').replace(':', '');
      const endHour = (event.endTime || '18:00').replace(':', '');

      const dtStart = `${dateClean}T${startHour}00`;
      const dtEnd = `${dateClean}T${endHour}00`;
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
        `DESCRIPTION:${(event.subtitle || event.description || '').replace(/\n/g, '\\n')}`,
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

  // Exportação para escopo global e módulos
  global.EventsService = EventsService;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsService;
  }
})(typeof window !== 'undefined' ? window : globalThis);
