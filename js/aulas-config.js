/**
 * Cathlabflix Sessions - Configuração e Estrutura da Grade de Aulas PPTX (/solaci/aulas)
 * 
 * Hierarquia de Navegação:
 * 1. Salas (Nível 1): HEART TEAM ARENA, HALL NOBRE, ICOACH, SPOTLIGHT, SCIENTFIC CORNER
 * 2. Períodos (Nível 2): 19-03 - Manhã, 19-03 - Tarde, 20-03 - Manhã...
 * 3. Apresentações PPTX (Nível 3): Arquivos para download/visualização
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

// Grade Estrutural das Salas e Períodos
const AULAS_SCHEDULE = {
  rooms: [
    {
      id: "arena",
      name: "HEART TEAM ARENA",
      periods: [
        {
          id: "19-manha-arena",
          label: "19-03 - Manhã - Arena",
          aulas: [
            {
              id: "aula-01",
              title: "8:50am - TAVI degeneration: the new Achilleas heel of contemporary interventional cardiology? Speaker - NICOLAS MARIA D VAN MIEGHEM",
              speaker: "NICOLAS MARIA D VAN MIEGHEM",
              file: {
                name: "ARENA 19-03 08H50 NICOLAS VAN.pptx",
                size: "38.39MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-02",
              title: "9:00am - Technique and Valve Choice for Redo TAVI: Speaker - PEDRO VILLABLANCA",
              speaker: "PEDRO VILLABLANCA",
              file: {
                name: "ARENA 19-03 09H00 PEDRO VILLABLANCA.pptx",
                size: "24.15MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-03",
              title: "9:10am - Live Case in a Box 1 - TAV-in-TAV: Left Main Protection in a High Coronary Obstruction Risk Patient: Operator - FÁBIO SÂNDOLI DE BRITO JÚNIOR",
              speaker: "FÁBIO SÂNDOLI DE BRITO JÚNIOR",
              file: {
                name: "ARENA 19-03 09H10 FABIO SANDOLI.pptx",
                size: "42.10MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-04",
              title: "10:02am - TCT PLUS LATAM Valves 2026: Program Highlights: Speaker - JOSÉ AIRTON DE ARRUDA",
              speaker: "JOSÉ AIRTON DE ARRUDA",
              file: {
                name: "ARENA 19-03 10H02 JOSE AIRTON.pptx",
                size: "18.50MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-05",
              title: "10:10am - LIVE Cases 2025 Revisited: Clinical Follow Up and Lessons Learned: Speaker - ALBERTO COLELLA CERVONE",
              speaker: "ALBERTO COLELLA CERVONE",
              file: {
                name: "ARENA 19-03 10H10 ALBERTO CERVONE.pptx",
                size: "31.20MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-06",
              title: "10:10am - LIVE Cases 2025 Revisited: Clinical Follow Up and Lessons Learned: Speaker - CARLOS AUGUSTO HOMEM DE MAGALHÃES CAMPOS",
              speaker: "CARLOS AUGUSTO HOMEM DE MAGALHÃES CAMPOS",
              file: {
                name: "ARENA 19-03 10H10 CARLOS CAMPOS.pptx",
                size: "27.80MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-07",
              title: "10:18am - Structural Heart Disease Interventions: How Advanced Imaging Will Continue to Shape the Field: Speaker - REBECCA HAHN",
              speaker: "REBECCA HAHN",
              file: {
                name: "ARENA 19-03 10H18 REBECCA HAHN.pptx",
                size: "52.40MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-08",
              title: "10:40am - AI-Power Structural Heart Care: Reinventing the Structuralist for a New Era: Speaker - JUAN F. GRANADA",
              speaker: "JUAN F. GRANADA",
              file: {
                name: "ARENA 19-03 10H40 JUAN F GRANADA.pptx",
                size: "45.10MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            },
            {
              id: "aula-09",
              title: "11:00am - Tricuspid replacement: Are We Entering in a New Era? Speaker - JUAN F. GRANADA",
              speaker: "JUAN F. GRANADA",
              file: {
                name: "ARENA 19-03 11H00 JUAN F GRANADA.pptx",
                size: "39.90MB",
                format: "PPTX",
                downloadUrl: "#",
                driveFileId: ""
              }
            }
          ]
        },
        {
          id: "19-tarde-arena",
          label: "19-03 - Tarde - Arena",
          aulas: []
        },
        {
          id: "20-manha-arena",
          label: "20-03 - Manhã - Arena",
          aulas: []
        },
        {
          id: "20-tarde-arena",
          label: "20-03 - Tarde - Arena",
          aulas: []
        },
        {
          id: "21-manha-arena",
          label: "21-03 - Manhã - Arena",
          aulas: []
        }
      ]
    },
    {
      id: "hall-nobre",
      name: "HALL NOBRE",
      periods: [
        {
          id: "19-manha-hall",
          label: "19-03 - Manhã - Hall Nobre",
          aulas: []
        },
        {
          id: "19-tarde-hall",
          label: "19-03 - Tarde - Hall Nobre",
          aulas: []
        },
        {
          id: "20-manha-hall",
          label: "20-03 - Manhã - Hall Nobre",
          aulas: []
        }
      ]
    },
    {
      id: "icoach",
      name: "ICOACH",
      periods: [
        {
          id: "19-manha-icoach",
          label: "19-03 - Manhã - iCoach",
          aulas: []
        },
        {
          id: "20-manha-icoach",
          label: "20-03 - Manhã - iCoach",
          aulas: []
        }
      ]
    },
    {
      id: "spotlight",
      name: "SPOTLIGHT",
      periods: [
        {
          id: "19-manha-spotlight",
          label: "19-03 - Manhã - Spotlight",
          aulas: []
        },
        {
          id: "20-manha-spotlight",
          label: "20-03 - Manhã - Spotlight",
          aulas: []
        }
      ]
    },
    {
      id: "scientific-corner",
      name: "SCIENTFIC CORNER",
      periods: [
        {
          id: "19-manha-corner",
          label: "19-03 - Manhã - Corner",
          aulas: []
        },
        {
          id: "20-manha-corner",
          label: "20-03 - Manhã - Corner",
          aulas: []
        }
      ]
    }
  ]
};
