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
  constructor(config = VIMEO_CONFIG) {
    this.config = config;
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

    // 2. Se o modo Mock estiver ativo ou se o token não tiver sido configurado
    if (this.config.useMock || !this.config.accessToken || this.config.accessToken.trim() === '') {
      return this._getMockVideos(folderId);
    }

    // 3. Execução de requisição real na API do Vimeo v3
    try {
      const basePath = this.config.userId ? `/users/${this.config.userId}` : '/me';
      const endpoint = `${this.config.apiBaseUrl}${basePath}/projects/${encodeURIComponent(folderId)}/videos?fields=uri,name,description,duration,created_time,player_embed_url,embed.html,tags,pictures&per_page=50`;
      
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.config.accessToken.trim()}`,
          "Accept": "application/vnd.vimeo.*+json;version=3.4",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[Vimeo API] Erro ao buscar folder ${folderId}:`, response.status, errorData);
        throw new Error(errorData.error || `Erro ${response.status} na API do Vimeo.`);
      }

      const json = await response.json();
      const normalizedVideos = this._normalizeVimeoData(json.data || []);
      
      // Salva em cache
      this.cache.set(folderId, normalizedVideos);

      return {
        videos: normalizedVideos,
        source: 'live'
      };

    } catch (error) {
      console.warn(`[Vimeo Service] Falha na requisição real. Alternando temporariamente para Mock. Motivo:`, error.message);
      // Fallback seguro para mock para não quebrar a experiência do usuário
      const mockResult = await this._getMockVideos(folderId);
      mockResult.fallbackWarning = error.message;
      return mockResult;
    }
  }

  /**
   * Resgata dados mockados simulando delay de rede realista de ~250ms
   */
  async _getMockVideos(folderId) {
    await new Promise(resolve => setTimeout(resolve, 250));

    const mockResponse = MOCK_VIMEO_DATA_BY_FOLDER[folderId];
    let rawList = [];

    if (mockResponse && Array.isArray(mockResponse.data)) {
      rawList = mockResponse.data;
    } else {
      // Caso seja passado um folder_id não mapeado diretamente nos mocks
      rawList = this._generateGenericMock(folderId);
    }

    const normalized = this._normalizeVimeoData(rawList);
    this.cache.set(folderId, normalized);

    return {
      videos: normalized,
      source: 'mock'
    };
  }

  /**
   * Normaliza os dados da resposta da API do Vimeo para o formato consumido pela UI
   */
  _normalizeVimeoData(rawVideos) {
    return rawVideos.map((item, index) => {
      // Extração do ID do vídeo (ex: de "/videos/76979871" extrai "76979871")
      const videoId = item.uri ? item.uri.replace("/videos/", "") : `mock-${index}`;
      
      // Monta URL de embed com parâmetros otimizados para conferência
      const embedUrl = item.player_embed_url || `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;

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
  _extractSpeaker(name = "", description = "") {
    const speakerRegex = /(?:Dr\.|Dra\.|Prof\.|Palestrante:?)\s+([A-ZÀ-Úa-zà-ú\s]+)/i;
    const match = name.match(speakerRegex) || description.match(speakerRegex);
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
