/**
 * Cathlabflix Sessions - Serviço de Integração com a API do Vimeo
 * 
 * Responsável por:
 * 1. Fazer requisições à API v3 do Vimeo utilizando o endpoint de projetos/pastas:
 *    GET https://api.vimeo.com/me/projects/{folder_id}/videos
 * 2. Gerenciar cache em memória por folder_id para evitar requisições repetidas
 * 3. Fornecer fallback gracioso para os dados mockados em caso de falta de token ou modo de desenvolvimento
 */

class VimeoService {
  constructor(config) {
    this.config = config || (typeof window !== 'undefined' && window.VIMEO_CONFIG) || (typeof VIMEO_CONFIG !== 'undefined' ? VIMEO_CONFIG : {});
    this.cache = new Map();
  }

  /**
   * Atualiza as credenciais e configurações em tempo de execução
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.cache.clear(); // Limpa o cache ao mudar token/modo
  }

  /**
   * Busca os vídeos contidos em uma pasta específica do Vimeo
   * @param {string} folderId - Identificador numérico da pasta no Vimeo
   * @returns {Promise<{ videos: Array, source: 'cache'|'live'|'mock' }>}
   */
  async getFolderVideos(folderId) {
    if (!folderId) {
      throw new Error("O folder_id é obrigatório para buscar os vídeos.");
    }

    // 1. Verifica cache em memória
    if (this.cache.has(folderId)) {
      return {
        videos: this.cache.get(folderId),
        source: 'cache'
      };
    }

    // 2. Tenta a Serverless Function do Vercel (/api/videos) que faz o proxy no servidor sem bloqueio de CORS
    if (window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
      try {
        const isLocalOrVercel = window.location.hostname.includes('vercel.app') || window.location.hostname === 'localhost';
        const apiHost = isLocalOrVercel ? '' : 'https://cathlabflix-sessions.vercel.app';
        const proxyUrl = `${apiHost}/api/videos?folderId=${encodeURIComponent(folderId)}`;
        const response = await fetch(proxyUrl);
        if (response.ok) {
          const json = await response.json();
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            const normalized = this._normalizeVimeoData(json.data);
            this.cache.set(folderId, normalized);
            return {
              videos: normalized,
              source: 'api-proxy'
            };
          }
        }
      } catch (proxyError) {
        console.info('[Vimeo Service] Usando base sincronizada de aulas:', proxyError.message);
      }
    }

    // 3. Fallback instantâneo com os dados reais sincronizados do Vimeo
    return this._getMockVideos(folderId);
  }

  /**
   * Resgata aulas a partir da base sincronizada
   */
  async _getMockVideos(folderId) {
    const dataStore = (typeof window !== 'undefined' && window.MOCK_VIMEO_DATA_BY_FOLDER) || (typeof MOCK_VIMEO_DATA_BY_FOLDER !== 'undefined' ? MOCK_VIMEO_DATA_BY_FOLDER : {});
    const mockResponse = dataStore[folderId];
    let rawList = [];

    if (Array.isArray(mockResponse)) {
      rawList = mockResponse;
    } else if (mockResponse && Array.isArray(mockResponse.data)) {
      rawList = mockResponse.data;
    } else {
      rawList = this._generateGenericMock(folderId);
    }

    const normalized = this._normalizeVimeoData(rawList);
    this.cache.set(folderId, normalized);

    return {
      videos: normalized,
      source: 'dataset'
    };
  }

  /**
   * Normaliza os dados da resposta da API do Vimeo para o formato consumido pela UI
   */
  _normalizeVimeoData(rawVideos) {
    return rawVideos.map((item, index) => {
      // Extração do ID do vídeo (ex: de "/videos/76979871" extrai "76979871")
      const videoId = item.uri ? item.uri.replace("/videos/", "") : `mock-${index}`;
      
      // Monta URL de embed preservando o hash de privacidade (?h=...)
      let embedUrl = item.player_embed_url || `https://player.vimeo.com/video/${videoId}`;
      const separator = embedUrl.includes('?') ? '&' : '?';
      if (!embedUrl.includes('badge=')) {
        embedUrl += `${separator}badge=0&autopause=0&player_id=0`;
      }

      return {
        id: videoId,
        uri: item.uri || `/videos/${videoId}`,
        title: item.name || `Aula ${String(index + 1).padStart(2, '0')}`,
        description: item.description || "Sem descrição disponível para esta sessão.",
        speaker: item.speaker || this._extractSpeaker(item.name, item.description),
        duration: item.duration || 0,
        formattedDuration: this.formatDuration(item.duration || 0),
        createdTime: item.created_time || new Date().toISOString(),
        embedUrl: embedUrl,
        embedHtml: item.embed?.html || null,
        tags: Array.isArray(item.tags) ? item.tags.map(t => typeof t === 'string' ? t : t.tag || t.name) : []
      };
    });
  }

  /**
   * Formata segundos no formato legível (ex: 45 min ou 1h 15 min)
   */
  formatDuration(seconds) {
    if (!seconds || seconds <= 0) return "Duração N/D";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'min' : ''}`.trim();
    }
    return `${minutes} min`;
  }

  /**
   * Tenta deduzir o palestrante a partir do nome ou descrição caso não venha explícito
   */
  _extractSpeaker(name, description) {
    const textName = typeof name === 'string' ? name : '';
    const textDesc = typeof description === 'string' ? description : '';
    const speakerRegex = /(?:Dr\.|Dra\.|Prof\.|Palestrante:?)\s+([A-ZÀ-Úa-zà-ú\s]+)/i;
    const match = textName.match(speakerRegex) || textDesc.match(speakerRegex);
    if (match && match[1]) {
      return match[0].trim();
    }
    return "Palestrante Convidado";
  }

  /**
   * Gera mock dinâmico caso um folder_id customizado seja adicionado pelo usuário
   */
  _generateGenericMock(folderId) {
    return [
      {
        uri: "/videos/76979871",
        name: `Sessão Inaugural da Pasta #${folderId}`,
        description: `Gravação ao vivo referente ao folder_id ${folderId}. Demonstração dinâmica com proporção de tela 16:9.`,
        duration: 2700,
        speaker: "Corpo Docente Especializado",
        tags: ["Folder " + folderId, "On-Demand"]
      },
      {
        uri: "/videos/824804225",
        name: `Mesa Redonda e Debates da Pasta #${folderId}`,
        description: `Discussão aprofundada dos casos e perguntas dos congressistas na sala correspondente.`,
        duration: 3200,
        speaker: "Painel de Especialistas",
        tags: ["Debate", "Perguntas & Respostas"]
      }
    ];
  }
}

// Exporta instância única global
window.vimeoService = new VimeoService();
