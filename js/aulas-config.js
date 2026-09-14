/**
 * Cathlabflix Sessions - Configuração e Estrutura da Grade de Aulas PPTX (/solaci/aulas)
 * 
 * Estrutura:
 * - Apenas as abas dos dias: Dia 29, Dia 30, Dia 31
 * - Conteúdo limpo aguardando sincronização com a pasta do Google Drive
 * 
 * Hook preparado para integração com a API da pasta do Google Drive.
 */

// Configuração para futura conexão com a API do Google Drive
const GOOGLE_DRIVE_CONFIG = {
  enabled: false,
  folderId: '', // Será preenchido com o ID da pasta do Google Drive
  apiKey: '',   // Chave de API caso necessário
  driveEndpoint: 'https://www.googleapis.com/drive/v3/files'
};

// Grade Estrutural por Dias (sem conteúdo por enquanto a pedido do usuário)
const AULAS_SCHEDULE = {
  days: [
    {
      id: "dia-29",
      name: "Dia 29",
      label: "Dia 29",
      subtitle: "29 de Outubro",
      aulas: []
    },
    {
      id: "dia-30",
      name: "Dia 30",
      label: "Dia 30",
      subtitle: "30 de Outubro",
      aulas: []
    },
    {
      id: "dia-31",
      name: "Dia 31",
      label: "Dia 31",
      subtitle: "31 de Outubro",
      aulas: []
    }
  ]
};
