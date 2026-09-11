/**
 * Cathlabflix Sessions - Configuração Oficial e Mapeamento Real do Vimeo
 * 
 * Mapeamento extraído automaticamente via API oficial da pasta "Gravações" (ID: 30421333):
 * - Dia 29 (Folder ID: 30421713) -> Heart Team (30424545), INCOR (30423156)
 * - Dia 30 (Folder ID: 30421340) -> Heart Team (30424636)
 * - Dia 31 (Folder ID: 30423303) -> Heart Team (30424838), Dante Pazzanese (30423313)
 */

const VIMEO_CONFIG = {
  // Flag de fallback (usa dados reais locais instantâneos e consulta API para novidades)
  useMock: false,
  userId: "1803190",
  rootFolderId: "30421333", // Pasta "Gravações"
  accessToken: "dcfc518d6c38756016a3330df5ef8e5f",
  apiBaseUrl: "https://api.vimeo.com"
};

/**
 * Mapeamento da Grade do Evento (Hierarquia: Dias -> Salas -> folder_id)
 */
const EVENT_SCHEDULE = {
  days: [
    {
      id: "dia-29",
      label: "Dia 29",
      subtitle: "29 de Outubro",
      folder_id: "30421713",
      rooms: [
        {
          id: "sala-30424545",
          name: "Heart Team",
          folder_id: "30424545"
        },
        {
          id: "sala-30423156",
          name: "INCOR",
          folder_id: "30423156"
        }
      ]
    },
    {
      id: "dia-30",
      label: "Dia 30",
      subtitle: "30 de Outubro",
      folder_id: "30421340",
      rooms: [
        {
          id: "sala-30424636",
          name: "Heart Team",
          folder_id: "30424636"
        }
      ]
    },
    {
      id: "dia-31",
      label: "Dia 31",
      subtitle: "31 de Outubro",
      folder_id: "30423303",
      rooms: [
        {
          id: "sala-30424838",
          name: "Heart Team",
          folder_id: "30424838"
        },
        {
          id: "sala-30423313",
          name: "Dante Pazzanese",
          folder_id: "30423313"
        }
      ]
    }
  ]
};

/**
 * Base de Dados com todas as aulas reais extraídas do Vimeo
 * Garante carregamento instantâneo das 37 aulas mesmo em ambientes offline ou com restrições de CORS
 */
const MOCK_VIMEO_DATA_BY_FOLDER = {
  "30423156": [
    {
      "uri": "/videos/1223707542",
      "name": "02_SOLACI_INCOR_Dr Raul Arrieta-003",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223707542?h=7bc3c51775",
      "duration": 2614,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223707542?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"02_SOLACI_INCOR_Dr Raul Arrieta-003\"></iframe>"
      },
      "created_time": "2026-09-03T14:51:09+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223707532",
      "name": "04_SOLACI_INCOR_Dr Raul Arrieta-004",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223707532?h=68b6c52dd8",
      "duration": 2795,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223707532?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"04_SOLACI_INCOR_Dr Raul Arrieta-004\"></iframe>"
      },
      "created_time": "2026-09-03T14:51:08+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223707531",
      "name": "03_SOLACI_INCOR_Dr Carlos Campos-002",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223707531?h=44d5b84a4c",
      "duration": 2453,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223707531?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"03_SOLACI_INCOR_Dr Carlos Campos-002\"></iframe>"
      },
      "created_time": "2026-09-03T14:51:07+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223707530",
      "name": "01_SOLACI_INCOR_Dr Carlos Campos",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223707530?h=a5d6ac5fcd",
      "duration": 1444,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223707530?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"01_SOLACI_INCOR_Dr Carlos Campos\"></iframe>"
      },
      "created_time": "2026-09-03T14:51:07+00:00",
      "tags": []
    }
  ],
  "30423313": [
    {
      "uri": "/videos/1223744925",
      "name": "MEDITRONIC-001",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223744925?h=1a6523d787",
      "duration": 2895,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223744925?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"MEDITRONIC-001\"></iframe>"
      },
      "created_time": "2026-09-03T16:59:23+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223744924",
      "name": "SMT-002",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223744924?h=357d8a2fb7",
      "duration": 2085,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223744924?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"SMT-002\"></iframe>"
      },
      "created_time": "2026-09-03T16:59:23+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223744923",
      "name": "DANTE-003",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223744923?h=17586492c7",
      "duration": 2522,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223744923?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"DANTE-003\"></iframe>"
      },
      "created_time": "2026-09-03T16:59:23+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223744922",
      "name": "MERIL-004",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223744922?h=3fe57bcdee",
      "duration": 2806,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223744922?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"MERIL-004\"></iframe>"
      },
      "created_time": "2026-09-03T16:59:23+00:00",
      "tags": []
    }
  ],
  "30424545": [
    {
      "uri": "/videos/1223778332",
      "name": "14-00 - 15-00- Lecture & International Live Case - Support- Boston Scientific",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223778332?h=f8364cb68b",
      "duration": 2842,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223778332?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"14-00 - 15-00- Lecture &amp; International Live Case - Support- Boston Scientific\"></iframe>"
      },
      "created_time": "2026-09-03T19:04:19+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223777539",
      "name": "16-00 - 17-00- Mechanical Circulatory Support- From High-Risk Pci To Cardiogenic Shock",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223777539?h=e34142425c",
      "duration": 3493,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223777539?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"16-00 - 17-00- Mechanical Circulatory Support- From High-Risk Pci To Cardiogenic Shock\"></iframe>"
      },
      "created_time": "2026-09-03T19:01:13+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223777407",
      "name": "13-00 - 14-00- Lecture & International Case - Support- Medtronic",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223777407?h=dfa8122a7c",
      "duration": 3423,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223777407?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"13-00 - 14-00- Lecture &amp; International Case - Support- Medtronic\"></iframe>"
      },
      "created_time": "2026-09-03T19:00:42+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223777350",
      "name": "12-00 - 13-00- Scientific Talk- Advancing From Long-Term Evidence To Next-Generation Design - Support- Venus",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223777350?h=364d45a51c",
      "duration": 3598,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223777350?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"12-00 - 13-00- Scientific Talk- Advancing From Long-Term Evidence To Next-Generation Design - Support- Venus\"></iframe>"
      },
      "created_time": "2026-09-03T19:00:30+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223776147",
      "name": "11-00 - 12-00- Lecture & National Live Case - Support- Lepu",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223776147?h=2f422a015d",
      "duration": 3134,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223776147?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"11-00 - 12-00- Lecture &amp; National Live Case - Support- Lepu\"></iframe>"
      },
      "created_time": "2026-09-03T18:56:13+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223775830",
      "name": "18-00 - 19-00- Solaci-Sbhci Awards Ceremony",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223775830?h=cb5a5c8ef1",
      "duration": 3064,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223775830?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"18-00 - 19-00- Solaci-Sbhci Awards Ceremony\"></iframe>"
      },
      "created_time": "2026-09-03T18:55:17+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223775461",
      "name": "15-30 - 16-00- Pulmonary Embolism- From Risk Stratification To Advanced Therapies - Support- Penumbra",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223775461?h=6c1a5e1f3b",
      "duration": 1719,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223775461?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"15-30 - 16-00- Pulmonary Embolism- From Risk Stratification To Advanced Therapies - Support- Penumbra\"></iframe>"
      },
      "created_time": "2026-09-03T18:53:51+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223775458",
      "name": "17-00 - 18-00- Coronary Physiology In Debate- Wires, Algorithms, And The Battle For Guidance",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223775458?h=aec33eaa75",
      "duration": 3563,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223775458?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"17-00 - 18-00- Coronary Physiology In Debate- Wires, Algorithms, And The Battle For Guidance\"></iframe>"
      },
      "created_time": "2026-09-03T18:53:50+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223775457",
      "name": "08-45 - 10-00- Opening & Vision- The Future Of Interventional Cardiology 2026",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223775457?h=cd3e553bb0",
      "duration": 4836,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223775457?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"08-45 - 10-00- Opening &amp; Vision- The Future Of Interventional Cardiology 2026\"></iframe>"
      },
      "created_time": "2026-09-03T18:53:50+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223775456",
      "name": "10-00 - 11-00- Lecture & National Live Case - Support- Meril Life Science",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223775456?h=cf10a1be55",
      "duration": 3771,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223775456?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"10-00 - 11-00- Lecture &amp; National Live Case - Support- Meril Life Science\"></iframe>"
      },
      "created_time": "2026-09-03T18:53:50+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223768684",
      "name": "Dr. Edgar",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223768684?h=c323431ac8",
      "duration": 2597,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223768684?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"Dr. Edgar\"></iframe>"
      },
      "created_time": "2026-09-03T18:27:25+00:00",
      "tags": []
    }
  ],
  "30424636": [
    {
      "uri": "/videos/1223788581",
      "name": "13-00 - 14-00- Lecture & International Live Case - Support- Boston Scientific",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223788581?h=8d1f6e2efb",
      "duration": 3687,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223788581?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"13-00 - 14-00- Lecture &amp; International Live Case - Support- Boston Scientific\"></iframe>"
      },
      "created_time": "2026-09-03T19:43:59+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223788580",
      "name": "12-00 - 13-00- Scientific Talk- Modern Pci In Practice- See. Prep. Treat. From Strategy To Case Discussion - Support- Boston Sci",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223788580?h=000d3f1631",
      "duration": 2736,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223788580?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"12-00 - 13-00- Scientific Talk- Modern Pci In Practice- See. Prep. Treat. From Strategy To Case Discussion - Support- Boston Sci\"></iframe>"
      },
      "created_time": "2026-09-03T19:43:59+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223788579",
      "name": "08-00 - 09-00- From Calcium To Compliance- Contemporary Atherectomy Strategies",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223788579?h=a50599241e",
      "duration": 3259,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223788579?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"08-00 - 09-00- From Calcium To Compliance- Contemporary Atherectomy Strategies\"></iframe>"
      },
      "created_time": "2026-09-03T19:43:59+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782745",
      "name": "17-00 - 18-00- Updates In Mitral Valve-In-Valve Interventions & Live Case - Support- Edwards Lifesciences",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782745?h=841c224455",
      "duration": 3455,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782745?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"17-00 - 18-00- Updates In Mitral Valve-In-Valve Interventions &amp; Live Case - Support- Edwards Lifesciences\"></iframe>"
      },
      "created_time": "2026-09-03T19:21:14+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782744",
      "name": "11-15 - 12-00- National Live Case - Support- Shockwave",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782744?h=fa689b035b",
      "duration": 2553,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782744?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"11-15 - 12-00- National Live Case - Support- Shockwave\"></iframe>"
      },
      "created_time": "2026-09-03T19:21:14+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782743",
      "name": "10-30 - 11-15- Non-Left Main Bifurcation Pci - Strategy, Devices, And Decision-Making At The Edge",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782743?h=78de018565",
      "duration": 2908,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782743?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"10-30 - 11-15- Non-Left Main Bifurcation Pci - Strategy, Devices, And Decision-Making At The Edge\"></iframe>"
      },
      "created_time": "2026-09-03T19:21:14+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223780659",
      "name": "14-00 - 14-30- Shockwave Ivl In Complex Pci- From Procedural Strategy To Proven Clinical Impact - Support- Shockwave",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223780659?h=e2d62fd7ab",
      "duration": 2108,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223780659?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"14-00 - 14-30- Shockwave Ivl In Complex Pci- From Procedural Strategy To Proven Clinical Impact - Support- Shockwave\"></iframe>"
      },
      "created_time": "2026-09-03T19:13:54+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223780658",
      "name": "16-15 - 17-00- Joint Session Crf - Tavi Durability In 2026- Evidence, Gaps, And What Comes Next",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223780658?h=338811e3de",
      "duration": 2764,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223780658?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"16-15 - 17-00- Joint Session Crf - Tavi Durability In 2026- Evidence, Gaps, And What Comes Next\"></iframe>"
      },
      "created_time": "2026-09-03T19:13:54+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223780657",
      "name": "14-30 - 15-00- Coronary Calcium Case Theater- Cracking The Toughest Lesions",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223780657?h=15b9ffeae1",
      "duration": 2314,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223780657?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"14-30 - 15-00- Coronary Calcium Case Theater- Cracking The Toughest Lesions\"></iframe>"
      },
      "created_time": "2026-09-03T19:13:54+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223780656",
      "name": "09-00 - 10-00- Live Case - Support- Microport",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223780656?h=a5ba2f8707",
      "duration": 4287,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223780656?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"09-00 - 10-00- Live Case - Support- Microport\"></iframe>"
      },
      "created_time": "2026-09-03T19:13:54+00:00",
      "tags": []
    }
  ],
  "30424838": [
    {
      "uri": "/videos/1223784655",
      "name": "10-30 - 11-00- The Future Of Pci- Technology, Intelligence, And The End Of Conventional Workflows - Part 2",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223784655?h=f50ead4afa",
      "duration": 1867,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223784655?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"10-30 - 11-00- The Future Of Pci- Technology, Intelligence, And The End Of Conventional Workflows - Part 2\"></iframe>"
      },
      "created_time": "2026-09-03T19:28:32+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223784580",
      "name": "16-15 - 16-30- Closing Ceremony",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223784580?h=b897c3fa19",
      "duration": 1017,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223784580?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"16-15 - 16-30- Closing Ceremony\"></iframe>"
      },
      "created_time": "2026-09-03T19:28:20+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223783349",
      "name": "12-00 - 13-00- Scientific Talk - Crdn- Innovations In Cardiovascular Intervention - Support- Medtronic",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223783349?h=02cb727be5",
      "duration": 3371,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223783349?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"12-00 - 13-00- Scientific Talk - Crdn- Innovations In Cardiovascular Intervention - Support- Medtronic\"></iframe>"
      },
      "created_time": "2026-09-03T19:23:28+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223783065",
      "name": "08-00 - 09-00- Stable Cad And Multivessel Disease",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223783065?h=e51ebb5596",
      "duration": 3281,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223783065?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"08-00 - 09-00- Stable Cad And Multivessel Disease\"></iframe>"
      },
      "created_time": "2026-09-03T19:22:27+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782937",
      "name": "09-00 - 10-00- Lecture & Live Case",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782937?h=36d1b06d0c",
      "duration": 3848,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782937?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"09-00 - 10-00- Lecture &amp; Live Case\"></iframe>"
      },
      "created_time": "2026-09-03T19:21:57+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782508",
      "name": "13-30 - 13-56- Boston Scientific Calcium Challenge",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782508?h=4edf89a100",
      "duration": 488,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782508?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"13-30 - 13-56- Boston Scientific Calcium Challenge\"></iframe>"
      },
      "created_time": "2026-09-03T19:20:25+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782507",
      "name": "13-00 - 13-30- Complex Acs Presentation",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782507?h=11f6429c5a",
      "duration": 2010,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782507?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"13-00 - 13-30- Complex Acs Presentation\"></iframe>"
      },
      "created_time": "2026-09-03T19:20:25+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782506",
      "name": "13-56 - 14-30- Best Elca Cases Biomedical-Philips",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782506?h=ced000e8f8",
      "duration": 474,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782506?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"13-56 - 14-30- Best Elca Cases Biomedical-Philips\"></iframe>"
      },
      "created_time": "2026-09-03T19:20:25+00:00",
      "tags": []
    },
    {
      "uri": "/videos/1223782505",
      "name": "15-00 - 16-15- Solaci-Sbhci Best Case And Abstract Award Cerimony",
      "description": null,
      "player_embed_url": "https://player.vimeo.com/video/1223782505?h=6a09a868c6",
      "duration": 2920,
      "embed": {
        "html": "<iframe src=\"https://player.vimeo.com/video/1223782505?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=544935\" width=\"1920\" height=\"1080\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" title=\"15-00 - 16-15- Solaci-Sbhci Best Case And Abstract Award Cerimony\"></iframe>"
      },
      "created_time": "2026-09-03T19:20:25+00:00",
      "tags": []
    }
  ]
};

if (typeof window !== 'undefined') {
  window.VIMEO_CONFIG = VIMEO_CONFIG;
  window.EVENT_SCHEDULE = EVENT_SCHEDULE;
  window.MOCK_VIMEO_DATA_BY_FOLDER = MOCK_VIMEO_DATA_BY_FOLDER;
}

