/**
 * Cathlabflix Sessions - Configuração Oficial e Mapeamento Real do Vimeo
 * 
 * Mapeamento extraído automaticamente via API oficial da pasta 'Gravações' (ID: 30421333):
 * - Dia 29 (Folder ID: 30421713) -> Heart Team (30424545), INCOR (30423156)
 * - Dia 30 (Folder ID: 30421340) -> Heart Team (30424636)
 * - Dia 31 (Folder ID: 30423303) -> Heart Team (30424838), Dante Pazzanese (30423313)
 */

const VIMEO_CONFIG = {
  // Ativado para consumir a API oficial em tempo real
  useMock: false,
  // Dados do canal Vimeo oficial
  userId: "1803190",
  rootFolderId: "30421333", // Pasta 'Gravações'
  // Personal Access Token oficial
  accessToken: "dcfc518d6c38756016a3330df5ef8e5f",
  // Endpoint oficial da API v3 do Vimeo
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
 * Fallback de segurança para dados mockados (caso a rede oscile)
 */
const MOCK_VIMEO_DATA_BY_FOLDER = {};
