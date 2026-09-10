/**
 * Cathlabflix Sessions - Configuração e Mapeamento do Evento
 * 
 * Estrutura exata baseada na grade oficial do evento:
 * - Nível 1: Dias (Dia 19, Dia 20, Dia 21)
 * - Nível 2: Salas (ex: Dia 19 - Sala 01, Dia 19 - Sala 02...)
 * - Nível 3: folder_id do Vimeo associado
 */

const VIMEO_CONFIG = {
  // Alterne para false assim que colar seu Personal Access Token
  useMock: true,
  // Dados do seu canal Vimeo fornecidos
  userId: "1803190",
  rootFolderId: "30421333", // Pasta 'Gravações' (https://vimeo.com/user/1803190/folder/30421333)
  // Token de Acesso da API (Bearer Token gerado em developer.vimeo.com/apps)
  accessToken: "",
  // Endpoint oficial da API v3 do Vimeo
  apiBaseUrl: "https://api.vimeo.com"
};

/**
 * Mapeamento da Grade do Evento (Hierarquia: Dias -> Salas -> folder_id)
 * Dias oficiais: Dia 29, Dia 30 e Dia 31
 */
const EVENT_SCHEDULE = {
  days: [
    {
      id: "dia-29",
      label: "Dia 29",
      subtitle: "29 de Outubro",
      rooms: [
        {
          id: "sala-01",
          name: "Dia 29 - Sala 01",
          folder_id: "21495801" // Substitua pelo ID da subpasta da Sala 01 do Dia 29
        },
        {
          id: "sala-02",
          name: "Dia 29 - Sala 02",
          folder_id: "21495802"
        },
        {
          id: "sala-03",
          name: "Dia 29 - Sala 03",
          folder_id: "21495803"
        },
        {
          id: "sala-04",
          name: "Dia 29 - Sala 04",
          folder_id: "21495804"
        },
        {
          id: "sala-07",
          name: "Dia 29 - Sala 07",
          folder_id: "21495805"
        },
        {
          id: "sala-08",
          name: "Dia 29 - Sala 08",
          folder_id: "21495806"
        }
      ]
    },
    {
      id: "dia-30",
      label: "Dia 30",
      subtitle: "30 de Outubro",
      rooms: [
        {
          id: "sala-01",
          name: "Dia 30 - Sala 01",
          folder_id: "21495807"
        },
        {
          id: "sala-02",
          name: "Dia 30 - Sala 02",
          folder_id: "21495808"
        },
        {
          id: "sala-03",
          name: "Dia 30 - Sala 03",
          folder_id: "21495809"
        },
        {
          id: "sala-04",
          name: "Dia 30 - Sala 04",
          folder_id: "21495810"
        }
      ]
    },
    {
      id: "dia-31",
      label: "Dia 31",
      subtitle: "31 de Outubro",
      rooms: [
        {
          id: "sala-01",
          name: "Dia 31 - Sala 01",
          folder_id: "21495811"
        },
        {
          id: "sala-02",
          name: "Dia 31 - Sala 02",
          folder_id: "21495812"
        },
        {
          id: "sala-03",
          name: "Dia 31 - Sala 03",
          folder_id: "21495813"
        }
      ]
    }
  ]
};

/**
 * Base de Dados Mockada Simulando Retorno da API v3 do Vimeo
 * Endpoint equivalente: GET https://api.vimeo.com/me/projects/{folder_id}/videos
 * Contém exatamente as aulas visíveis no design oficial de referência.
 */
const MOCK_VIMEO_DATA_BY_FOLDER = {
  // --- DIA 19 / SALA 01 (folder_id: 21495801) ---
  "21495801": {
    total: 3,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Nicolas Van Mieghem - TAVI degeneration",
        description: "CRF TCT PLUS LATAM VALVES - The Structural Heart Summit #TCTLATAM2026",
        duration: 2580,
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479"
      },
      {
        uri: "/videos/824804225",
        name: "Pedro Villablanca - Redo TAVI",
        description: "CRF TCT PLUS LATAM VALVES - The Structural Heart Summit #TCTLATAM2026",
        duration: 3120,
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479"
      },
      {
        uri: "/videos/649872580",
        name: "Live Case in a Box 1 – TAV-in-TAV",
        description: "CRF TCT PLUS LATAM VALVES - The Structural Heart Summit #TCTLATAM2026",
        duration: 2700,
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479"
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
        name: "Sessão TAVI Avançado - Desafios Anatômicos e Vias Alternativas",
        description: "Apresentação e discussão de casos estruturais complexos.",
        duration: 2400,
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479"
      },
      {
        uri: "/videos/649872580",
        name: "Válvulas Auto-Expansíveis em Anel Pequeno",
        description: "Análise hemodinâmica tardia e gradientes transvalvares.",
        duration: 2820,
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479"
      }
    ]
  },

  // --- DIA 19 / SALA 03 (folder_id: 21495803) ---
  "21495803": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Algoritmo Híbrido Contemporâneo para Recanalização de CTO",
        description: "Abordagem retrógrada e anterógrada passo a passo.",
        duration: 2950,
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479"
      },
      {
        uri: "/videos/824804225",
        name: "Microcateteres e Guias Dedicados em Colaterais Septais",
        description: "Técnicas de segurança e navegabilidade vascular.",
        duration: 2760,
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479"
      }
    ]
  },

  // --- DIA 19 / SALA 04 (folder_id: 21495804) ---
  "21495804": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/649872580",
        name: "OCT vs IVUS em Lesões de Tronco de Coronária Esquerda",
        description: "Critérios de preparo de placa e otimização de stent.",
        duration: 2450,
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479"
      },
      {
        uri: "/videos/76979871",
        name: "Fisiologia Coronariana: FFR Angiográfico sem Fio-Guia",
        description: "Validação clínica de ferramentas de modelagem 3D.",
        duration: 2800,
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479"
      }
    ]
  },

  // --- DIA 19 / SALA 07 (folder_id: 21495805) ---
  "21495805": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/824804225",
        name: "Tratamento Endovascular do Território Fêmoro-Poplíteo",
        description: "Balões farmacológicos e sistemas de aterectomia.",
        duration: 2750,
        player_embed_url: "https://player.vimeo.com/video/824804225?badge=0&autopause=0&player_id=0&app_id=58479"
      },
      {
        uri: "/videos/649872580",
        name: "Angioplastia de Carótida com Neuroproteção Cerebral",
        description: "Filtros distais vs reversão de fluxo (TCAR).",
        duration: 3150,
        player_embed_url: "https://player.vimeo.com/video/649872580?badge=0&autopause=0&player_id=0&app_id=58479"
      }
    ]
  },

  // --- DIA 19 / SALA 08 (folder_id: 21495806) ---
  "21495806": {
    total: 2,
    page: 1,
    per_page: 25,
    data: [
      {
        uri: "/videos/76979871",
        name: "Indicação Precoce de Suporte Circulatório Mecânico",
        description: "Descarregamento ventricular no choque pós-IAM.",
        duration: 3350,
        player_embed_url: "https://player.vimeo.com/video/76979871?badge=0&autopause=0&player_id=0&app_id=58479"
      }
    ]
  }
};
