/**
 * Cathlabflix Sessions - Configuração e Mapeamento do Evento
 * 
 * Arquitetura de Mapeamento em 3 Níveis:
 * Nível 1: Dias do Evento (ex: Dia 19, Dia 20, Dia 21)
 * Nível 2: Salas dentro de cada Dia (ex: Sala 01, Sala 02, Sala 03)
 * Nível 3: folder_id específico do Vimeo associado à combinação Dia + Sala
 * 
 * NOTA: Para adaptar para o seu evento real no Vimeo, basta alterar os nomes das
 * salas, dias e inserir os IDs numéricos reais das pastas (folder_id) obtidos no Vimeo.
 */

const VIMEO_CONFIG = {
  // Alterne para false quando inserir seu token de acesso real do Vimeo
  useMock: true,
  // Token da API do Vimeo (Bearer Token gerado em developer.vimeo.com)
  accessToken: "",
  // Endpoint oficial da API v3 do Vimeo
  apiBaseUrl: "https://api.vimeo.com"
};

/**
 * Mapeamento da Grade do Evento (Hierarquia: Dias -> Salas -> folder_id)
 */
const EVENT_SCHEDULE = {
  days: [
    {
      id: "dia-19",
      label: "Dia 19",
      subtitle: "19 de Outubro • Abertura e Plenárias",
      rooms: [
        {
          id: "sala-01",
          name: "Sala 01 - Plenária Principal & Abertura",
          folder_id: "21495801",
          description: "Sessões magnas, diretrizes internacionais e discussões ao vivo de casos desafiadores."
        },
        {
          id: "sala-02",
          name: "Sala 02 - Inovação & TAVI Estrutural",
          folder_id: "21495802",
          description: "Novas próteses aórticas, anatomias anulares bicuspides e técnicas de proteção coronariana."
        },
        {
          id: "sala-03",
          name: "Sala 03 - Oclusões Totais Crônicas (CTO)",
          folder_id: "21495803",
          description: "Técnicas retrógradas, guias dedicados, microcateteres e gerenciamento de complicações."
        }
      ]
    },
    {
      id: "dia-20",
      label: "Dia 20",
      subtitle: "20 de Outubro • Sessões Especializadas",
      rooms: [
        {
          id: "sala-01",
          name: "Sala 01 - Imagem Intracoronária (OCT & IVUS)",
          folder_id: "21495804",
          description: "Otimização de implante de stent, caracterização de placa e avaliação fisiológica (iFR/FFR)."
        },
        {
          id: "sala-02",
          name: "Sala 02 - Intervenção Periférica & Carótidas",
          folder_id: "21495805",
          description: "Tratamento de isquemia crítica de membros inferiores, stents carotídeos e filtros cerebrais."
        },
        {
          id: "sala-03",
          name: "Sala 03 - Choque Cardiogênico & Suporte (ECMO/Impella)",
          folder_id: "21495806",
          description: "Manejo hemodinâmico invasivo, suporte circulatório mecânico e desmame gradual."
        }
      ]
    },
    {
      id: "dia-21",
      label: "Dia 21",
      subtitle: "21 de Outubro • Highlights & Hands-on",
      rooms: [
        {
          id: "sala-01",
          name: "Sala 01 - Masterclass dos Melhores Casos",
          folder_id: "21495807",
          description: "Apresentação dos casos mais emblemáticos do ano com painel internacional de debatedores."
        },
        {
          id: "sala-02",
          name: "Sala 02 - Complicações: Como Evitar e Como Sair",
          folder_id: "21495808",
          description: "Perfuração coronária, no-reflow, perda de stent e trombose aguda tratadas passo a passo."
        }
      ]
    }
  ]
};

/**
 * Base de Dados Mockada Simulando Retorno da API v3 do Vimeo
 * Endpoint equivalente: GET https://api.vimeo.com/me/projects/{folder_id}/videos
 * Cada vídeo possui o player_embed_url funcional para teste visual imediato do iframe 16:9.
 */
const MOCK_VIMEO_DATA_BY_FOLDER = {
  // --- DIA 19 / SALA 01 (folder_id: 21495801) ---
  "21495801": {
    total: 4,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Aula 01: Estado da Arte no Implante de Stents Farmacológicos de 4ª Geração",
        description: "Revisão abrangente sobre polímeros bioabsorvíveis, cinética de eluição e evidências clínicas comparativas em cenários de alto risco hemorrágico.",
        duration: 2580, // 43min
        speaker: "Dr. Carlos Mendonça (InCor - SP)",
        created_time: "2026-10-19T08:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Stents", "Farmacologia", "Ensaios Clínicos"]
      },
      {
        uri: "/videos/824804225",
        name: "Aula 02: Desafios em Tronco de Coronária Esquerda: Quando Indicar PCI vs CABG",
        description: "Análise dos escores SYNTAX estendido, critérios de elegibilidade para angioplastia e técnicas cirúrgicas minimamente invasivas de revascularização.",
        duration: 3120, // 52min
        speaker: "Dra. Renata Vasconcellos (CardioDF)",
        created_time: "2026-10-19T09:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Tronco de Coronária", "SYNTAX", "Diretrizes"]
      },
      {
        uri: "/videos/649872580",
        name: "Aula 03: Técnica DK-Crush Passo a Passo em Lesões de Bifurcação Complexas",
        description: "Protocolo de double-kissing crush com otimização proximal (POT), seleção de fios dedicados e reconstrução tridimensional guiada por imagem.",
        duration: 2700, // 45min
        speaker: "Dr. Marcos Guimarães (Hospital Pró-Cardíaco)",
        created_time: "2026-10-19T11:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["DK-Crush", "Bifurcação", "Intervenção Guiada"]
      },
      {
        uri: "/videos/76979871",
        name: "Aula 04: Mesa Redonda & Discussão Interativa de Casos ao Vivo",
        description: "Debate com especialistas convidados sobre estratégias de revascularização em pacientes diabéticos multiarteriais com disfunção ventricular severa.",
        duration: 3600, // 60min
        speaker: "Painel de Especialistas Cathlabflix",
        created_time: "2026-10-19T14:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Mesa Redonda", "Debate", "Casos Clínicos"]
      }
    ]
  },

  // --- DIA 19 / SALA 02 (folder_id: 21495802) ---
  "21495802": {
    total: 3,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/824804225",
        name: "Aula 01: Planejamento por Tomografia Computadorizada Multislice para TAVI",
        description: "Mensuração de anel valvar, altura de óstios coronarianos, risco de oclusão coronária e avaliação de vias de acesso transfemoral.",
        duration: 2400,
        speaker: "Dr. Leonardo Castilho (Hospital Albert Einstein)",
        created_time: "2026-10-19T09:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["TAVI", "Tomografia", "Planejamento"]
      },
      {
        uri: "/videos/649872580",
        name: "Aula 02: Válvulas Balão-Expansíveis vs Auto-Expansíveis: Seleção Personalizada",
        description: "Critérios anatômicos para escolha de prótese em anéis calcificados, risco de bloqueio atrioventricular e gradientes hemodinâmicos tardios.",
        duration: 2820,
        speaker: "Dra. Patrícia Silveira (Hospital Sírio-Libanês)",
        created_time: "2026-10-19T10:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["TAVI", "Próteses", "Hemodinâmica"]
      },
      {
        uri: "/videos/76979871",
        name: "Aula 03: Técnica BASILICA e Chimney Stent para Prevenção de Obstrução Coronária",
        description: "Lacerativação de folhetos nativos com eletrificação por radiofrequência antes do implante de TAVI em anatomias coronarianas de alto risco.",
        duration: 3300,
        speaker: "Dr. Alexandre Fontoura (Rede D'Or)",
        created_time: "2026-10-19T14:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["BASILICA", "TAVI", "Prevenção"]
      }
    ]
  },

  // --- DIA 19 / SALA 03 (folder_id: 21495803) ---
  "21495803": {
    total: 3,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Aula 01: Algoritmo Híbrido Contemporâneo para Recanalização de CTO",
        description: "Abordagem anterógrada vs retrógrada, escalonamento e desescalonamento de guias, e técnicas de reentrada por dissecção (ADR).",
        duration: 2950,
        speaker: "Dr. Guilherme Siqueira (Hospital Moinhos de Vento)",
        created_time: "2026-10-19T09:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["CTO", "Algoritmo Híbrido", "Recanalização"]
      },
      {
        uri: "/videos/824804225",
        name: "Aula 02: O Papel dos Microcateteres e Guias Poliméricos em Colaterais Septais",
        description: "Como navegar em canais septais e epicárdicos tortuosos mantendo estabilidade e evitando perfuração de ramos de conexão colateral.",
        duration: 2760,
        speaker: "Dr. Marcelo Bittencourt (Beneficência Portuguesa)",
        created_time: "2026-10-19T11:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Microcateteres", "Colaterais", "Técnica Retrógrada"]
      },
      {
        uri: "/videos/649872580",
        name: "Aula 03: Manejo Imediato de Perfurações Coronarianas Tipo Ellis III",
        description: "Uso de balões de hemostasia prolongada, implante rápido de stents revestidos com PTFE e técnicas de embolização com coils.",
        duration: 3100,
        speaker: "Dr. Fernando Teles (HC-FMUSP)",
        created_time: "2026-10-19T14:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Emergência", "Complicações", "Stents Cobertos"]
      }
    ]
  },

  // --- DIA 20 / SALA 01 (folder_id: 21495804) ---
  "21495804": {
    total: 3,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/649872580",
        name: "Aula 01: Mapeamento de Placas Vulneráveis por Tomografia de Coerência Óptica (OCT)",
        description: "Critérios de fibroateroma de capa fina (TCFA), identificação de neoaterosclerose intrastent e erosão de placa sem ruptura evidente.",
        duration: 2450,
        speaker: "Dra. Juliana Prado (Instituto Dante Pazzanese)",
        created_time: "2026-10-20T08:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["OCT", "Placa Vulnerável", "Imagem"]
      },
      {
        uri: "/videos/76979871",
        name: "Aula 02: IVUS de Alta Resolução (HD-IVUS 60MHz): Quando Supera o OCT?",
        description: "Avaliação de lesões ostiais em tronco da coronária esquerda e vasos calibrosos onde o clearance de sangue pelo contraste é restrito.",
        duration: 2800,
        speaker: "Dr. Tiago Meireles (Unifesp)",
        created_time: "2026-10-20T10:15:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["IVUS", "HD-IVUS", "Tronco Esquerdo"]
      },
      {
        uri: "/videos/824804225",
        name: "Aula 03: FFR Angiográfico (sem Fio-Guia de Pressão): O Futuro Chegou?",
        description: "Validação clínica de ferramentas de modelagem fluídica 3D (QFR / vFFR) em comparação direta com hiperemia induzida por adenosina.",
        duration: 2600,
        speaker: "Dr. Lucas Fontes (Hospital Barra D'Or)",
        created_time: "2026-10-20T13:45:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["FFR", "Fisiologia", "Inteligência Artificial"]
      }
    ]
  },

  // --- DIA 20 / SALA 02 (folder_id: 21495805) ---
  "21495805": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/824804225",
        name: "Aula 01: Tratamento Endovascular do Território Fêmoro-Poplíteo com Balão Farmacológico",
        description: "Critérios de preparo de vaso com aterectomia rotacional e eluição de paclitaxel vs sirolimus em lesões TASC C e D.",
        duration: 2750,
        speaker: "Dr. André Antunes (Sociedade Brasileira de Angiologia)",
        created_time: "2026-10-20T09:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Periférico", "Balão Farmacológico", "Aterectomia"]
      },
      {
        uri: "/videos/649872580",
        name: "Aula 02: Angioplastia de Artérias Carótidas sob Proteção Cerebral com Filtros",
        description: "Seleção entre filtros de proteção distal vs fluxo retrógrado reverso (TCAR) em placas carotídeas friáveis e sintomáticas.",
        duration: 3150,
        speaker: "Dra. Camila Nogueira (Hospital Samaritano)",
        created_time: "2026-10-20T11:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Carótida", "TCAR", "Neuroproteção"]
      }
    ]
  },

  // --- DIA 20 / SALA 03 (folder_id: 21495806) ---
  "21495806": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Aula 01: Indicação Precoce de Impella CP no Choque Cardiogênico Pós-IAM",
        description: "Timing ideal para descarregamento ventricular antes da reperfusão coronária para redução do tamanho do infarto.",
        duration: 3350,
        speaker: "Dr. Eduardo Barreto (InCor - SP)",
        created_time: "2026-10-20T09:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Choque Cardiogênico", "Impella", "Suporte Circulatório"]
      },
      {
        uri: "/videos/824804225",
        name: "Aula 02: V-A ECMO na Sala de Hemodinâmica: Canulação e Monitorização Invasiva",
        description: "Cuidados para prevenção de isquemia de membro inferior, descompressão ventricular esquerda e manejo de anticoagulação plena.",
        duration: 2900,
        speaker: "Dr. Rodrigo Fagundes (Hospital Israelita Albert Einstein)",
        created_time: "2026-10-20T11:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["ECMO", "Canulação", "Terapia Intensiva"]
      }
    ]
  },

  // --- DIA 21 / SALA 01 (folder_id: 21495807) ---
  "21495807": {
    total: 3,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Aula 01: Masterclass Internacional: O Futuro da Cardiologia Intervencionista",
        description: "Perspectivas sobre terapias gênicas, robótica endovascular teleoperada e novos biomateriais autorregenerativos.",
        duration: 3600,
        speaker: "Prof. Dr. Antônio Moreira (Universidade de Coimbra)",
        created_time: "2026-10-21T09:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Masterclass", "Robótica", "Inovação"]
      },
      {
        uri: "/videos/649872580",
        name: "Aula 02: Sessão de Casos Clínicos Premiados: Soluções Fora da Caixa",
        description: "Apresentação e votação interativa dos casos clínicos mais complexos submetidos pelos congressistas com soluções inovadoras.",
        duration: 3200,
        speaker: "Comissão Científica Cathlabflix",
        created_time: "2026-10-21T10:45:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Casos Clínicos", "Premiação", "Discussão"]
      },
      {
        uri: "/videos/824804225",
        name: "Aula 03: Cerimônia de Encerramento e Apresentação dos Guidelines 2027",
        description: "Síntese dos consensos estabelecidos durante o congresso e apresentação do calendário de imersões da próxima edição.",
        duration: 2100,
        speaker: "Diretoria Científica",
        created_time: "2026-10-21T13:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Encerramento", "Guidelines", "Consensos"]
      }
    ]
  },

  // --- DIA 21 / SALA 02 (folder_id: 21495808) ---
  "21495808": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/649872580",
        name: "Aula 01: Dispositivos de Fechamento Vascular de Grande Calibre (ProGlide vs Manta)",
        description: "Hands-on virtual com dicas para hemostasia segura pós-TAVI e EVAR e resgate em caso de falha de captura do nó arterial.",
        duration: 2650,
        speaker: "Dr. Gustavo Ramos (Hospital Santa Catarina)",
        created_time: "2026-10-21T09:30:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["Hemostasia", "Fechamento", "ProGlide"]
      },
      {
        uri: "/videos/76979871",
        name: "Aula 02: No-Reflow e Espasmo Microvascular Agudo: Protocolos Farmacológicos Intracoronários",
        description: "Doses recomendadas de adenosina, nitroprussiato, verapamil e epinefrina diluída durante a angioplastia primária no infarto com supra.",
        duration: 2890,
        speaker: "Dra. Mariana Costa (Hospital de Base)",
        created_time: "2026-10-21T11:00:00+00:00",
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479",
        tags: ["No-Reflow", "Farmacologia", "Infarto Agudo"]
      }
    ]
  }
};
