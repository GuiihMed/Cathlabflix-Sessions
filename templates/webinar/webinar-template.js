/**
 * ============================================================================
 * CathlabFlix by SBHCI - Template Oficial para Cadastro de Novos Webinares
 * ============================================================================
 * 
 * Este arquivo serve como referência direta para Inteligências Artificiais e 
 * desenvolvedores adicionarem novos webinares na plataforma CathlabFlix.
 * 
 * ONDE INSERIR:
 * Copie o objeto abaixo e adicione dentro do array `WEBINARES_DATA` no arquivo:
 * -> /js/webinares-data.js
 * 
 * COMO ACESSAR:
 * Após cadastrado, o webinar estará imediatamente disponível nas rotas:
 * -> /new/webinares (Aparecerá automaticamente na grade com filtros e busca)
 * -> /new/webinar?id={id-do-webinar} (Página individual completa com abas e player)
 * ============================================================================
 */

const NOVO_WEBINAR_TEMPLATE = {
  // --------------------------------------------------------------------------
  // 1. IDENTIFICAÇÃO E ROTEAMENTO (Obrigatórios)
  // --------------------------------------------------------------------------
  
  /**
   * Identificador único em minúsculas, sem espaços ou acentos.
   * Usado na URL: /new/webinar?id=seu-slug-aqui
   * @type {string}
   * @example "stent-bifurcacoes-2026"
   */
  id: "identificador-unico-do-webinar",

  /**
   * Slug completo da rota ou URL original (para compatibilidade retroativa)
   * @type {string}
   * @example "20-08-26-stent-em-bifurcacoes"
   */
  slug: "slug-completo-do-webinar",

  /**
   * Título completo da sessão com subtítulo
   * @type {string}
   * @example "Tratamento de Lesões de Bifurcação: Técnicas Avançadas de Provisional e DK-Crush"
   */
  title: "Título Completo do Webinar - Tema e Subtítulo Científico",

  /**
   * Título curto para breadcrumbs, seletor de abas e pílulas de navegação
   * @type {string}
   * @example "Bifurcações: DK-Crush"
   */
  shortTitle: "Título Curto (Máx 35 caracteres)",

  // --------------------------------------------------------------------------
  // 2. METADADOS, DATAS E CATEGORIZAÇÃO (Obrigatórios)
  // --------------------------------------------------------------------------

  /**
   * Data no formato brasileiro (DD/MM/AAAA)
   * @type {string}
   * @example "15/08/2026"
   */
  date: "DD/MM/AAAA",

  /**
   * Data no padrão ISO 8601 (AAAA-MM-DD) para ordenação cronológica
   * @type {string}
   * @example "2026-08-15"
   */
  dateISO: "AAAA-MM-DD",

  /**
   * Data por extenso formatada em português
   * @type {string}
   * @example "15 de Agosto de 2026"
   */
  dateFormatted: "15 de Mês de 2026",

  /**
   * Nome legível da categoria científica
   * @type {string}
   * @example "Balões Farmacológicos", "Intervenção Estrutural", "Coronária", "SBHCI Jovem"
   */
  category: "Nome da Categoria",

  /**
   * Slug da categoria para filtro dinâmico no Hub (/new/webinares)
   * Categorias padrão do sistema: "baloes" | "estrutural" | "coronaria" | "jovem"
   * @type {string}
   * @example "baloes"
   */
  categorySlug: "baloes",

  /**
   * Texto da etiqueta de destaque sobre a miniatura do card
   * @type {string}
   * @example "Lançamento Oficial", "Estudo Clínico", "Destaque", "Novo"
   */
  badge: "Lançamento Oficial",

  /**
   * Tempo total estimado da gravação
   * @type {string}
   * @example "1h 15m", "1h 30m"
   */
  duration: "1h 15m",

  // --------------------------------------------------------------------------
  // 3. MÍDIAS PRINCIPAIS: THUMBNAIL E VÍDEO (Obrigatórios)
  // --------------------------------------------------------------------------

  /**
   * URL da imagem de capa (Thumbnail) na proporção 16:9 em alta resolução
   * @type {string}
   * @example "https://static.wixstatic.com/media/.../Prancheta%201.png"
   */
  thumbnail: "https://url-da-imagem-de-capa.png",

  /**
   * ID numérico do vídeo hospedado no Vimeo (CathlabFlix Oficial)
   * @type {string}
   * @example "1210589447"
   */
  vimeoId: "1210589447",

  /**
   * URL de incorporação direta do player
   * @type {string}
   * @example "https://player.vimeo.com/video/1210589447"
   */
  videoEmbedUrl: "https://player.vimeo.com/video/1210589447",

  // --------------------------------------------------------------------------
  // 4. INFOGRÁFICO CIENTÍFICO EM ALTA RESOLUÇÃO (HD)
  // --------------------------------------------------------------------------

  /**
   * URL da imagem do infográfico em alta definição (suporta zoom interativo)
   * @type {string}
   * @example "https://static.wixstatic.com/media/.../Infografico_HD.png"
   */
  infographicUrl: "https://url-do-infografico-em-alta-resolucao.png",

  /**
   * Título ou legenda do infográfico
   * @type {string}
   * @example "Infográfico Oficial: Mecanismos de Ação e Passo a Passo Cirúrgico"
   */
  infographicTitle: "Infográfico Científico em Alta Resolução",

  // --------------------------------------------------------------------------
  // 5. DOCUMENTOS CIENTÍFICOS E SLIDES EM PDF
  // --------------------------------------------------------------------------

  /**
   * Link direto para download do relatório ou lâminas em PDF
   * @type {string}
   * @example "https://www.cathlabflix.org/_files/ugd/...arquivo.pdf"
   */
  pdfUrl: "https://www.cathlabflix.org/_files/ugd/link-do-arquivo.pdf",

  /**
   * Nome legível do documento
   * @type {string}
   * @example "Guia de Prática Clínica e Protocolo Técnico (PDF Oficial)"
   */
  pdfTitle: "Nome do Documento em PDF Oficial",

  // --------------------------------------------------------------------------
  // 6. INTEGRAÇÃO COM IA NOTEBOOKLM (Google)
  // --------------------------------------------------------------------------
  notebookLm: {
    /**
     * Link do caderno de anotações no Google NotebookLM
     * @type {string}
     * @example "https://notebooklm.google.com/notebook/797d1f51-4a06-4efb-9410-2edaf02fdf04"
     */
    notebookUrl: "https://notebooklm.google.com/notebook/ID_DO_NOTEBOOK",

    /**
     * Link direto para o artefato de Quiz gerado no NotebookLM
     * @type {string}
     * @example "https://notebooklm.google.com/notebook/.../artifact/eeefdf9e-..."
     */
    quizUrl: "https://notebooklm.google.com/notebook/ID_DO_NOTEBOOK/artifact/ID_DO_QUIZ",

    /**
     * Link direto para os Flashcards gerados no NotebookLM
     * @type {string}
     * @example "https://notebooklm.google.com/notebook/.../artifact/2513a738-..."
     */
    flashcardsUrl: "https://notebooklm.google.com/notebook/ID_DO_NOTEBOOK/artifact/ID_DOS_FLASHCARDS"
  },

  // --------------------------------------------------------------------------
  // 7. FAIXAS DE ÁUDIO E PODCASTS (Player Interativo com Waveform)
  // --------------------------------------------------------------------------
  audios: [
    {
      id: "audio-resumo-1",
      title: "Nome_da_Faixa_Resumo_em_Audio",
      artist: "IA CathlabFlix - NotebookLM",
      duration: "02:15",
      durationSec: 135,
      type: "Resumo em Áudio",
      desc: "Síntese dos tópicos mais relevantes da aula produzida pela IA da CathlabFlix."
    },
    {
      id: "audio-debate-1",
      title: "Nome_da_Faixa_Debate_em_Podcast",
      artist: "IA CathlabFlix - NotebookLM",
      duration: "18:40",
      durationSec: 1120,
      type: "Debate em Podcast",
      desc: "Discussão aprofundada em formato podcast abordando controvérsias técnicas e casos desafiadores."
    }
  ],

  // --------------------------------------------------------------------------
  // 8. RESUMO EXECUTIVO (Aba 'Resumo' - HTML Formatado)
  // --------------------------------------------------------------------------
  // Classes CSS utilitárias prontas para uso:
  // - .webinar-lead: Parágrafo introdutório de destaque com tipografia ampliada
  // - .webinar-callout: Caixa lateral de destaque com borda vermelha e fundo sutil
  // - .webinar-highlights-grid: Grade automática com cartões numerados
  // - .highlight-card, .highlight-num, .highlight-content: Elementos do cartão
  summary: `
    <p class="webinar-lead">Parágrafo introdutório apresentando o tema principal da sessão e o impacto na prática clínica contemporânea da cardiologia intervencionista.</p>
    
    <div class="webinar-callout">
      <h4><span class="callout-icon">💡</span> Mensagem-Chave dos Especialistas</h4>
      <p>Mensagem central ou diretriz prática recomendada pelo painel de operadores e debatedores da SBHCI.</p>
    </div>

    <div class="webinar-highlights-grid">
      <div class="highlight-card">
        <div class="highlight-num">01</div>
        <div class="highlight-content">
          <strong>Primeiro Pilar Clínico</strong>
          <p>Descrição objetiva da técnica, evidência científica ou critério anatômico determinante.</p>
        </div>
      </div>
      <div class="highlight-card">
        <div class="highlight-num">02</div>
        <div class="highlight-content">
          <strong>Segundo Pilar Clínico</strong>
          <p>Especificação de dispositivo, preparo de lesão ou ajuste farmacológico necessário.</p>
        </div>
      </div>
      <div class="highlight-card">
        <div class="highlight-num">03</div>
        <div class="highlight-content">
          <strong>Terceiro Pilar Clínico</strong>
          <p>Resultados esperados no seguimento tardio e redução de eventos adversos maiores.</p>
        </div>
      </div>
    </div>
  `,

  // --------------------------------------------------------------------------
  // 9. RELATÓRIO COMPLETO DA AULA (Aba 'Relatório da Aula' - Conteúdo Acadêmico)
  // --------------------------------------------------------------------------
  // Classes CSS utilitárias para tabelas comparativas:
  // - .table-responsive: Envoltório com rolagem horizontal automática no mobile
  // - .webinar-comparison-table: Tabela moderna estilizada
  // - .badge-status.success (verde) | .badge-status.warning (amarelo)
  fullReport: `
    <h3>1. Contexto Clínico e Fisiopatologia</h3>
    <p>Apresentação detalhada da patologia, dados epidemiológicos e justificativa para a intervenção percutânea.</p>

    <h4>2. Tabela de Comparação Técnica</h4>
    <div class="table-responsive">
      <table class="webinar-comparison-table">
        <thead>
          <tr>
            <th>Parâmetro</th>
            <th>Técnica / Dispositivo A</th>
            <th>Técnica / Dispositivo B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Mecanismo Biológico</strong></td>
            <td><span class="badge-status success">Citostático</span> (Reversível)</td>
            <td><span class="badge-status warning">Citotóxico</span> (Irreversível)</td>
          </tr>
          <tr>
            <td><strong>Taxa de Sucesso Procedimental</strong></td>
            <td>Superior a 95% em anatomias favoráveis</td>
            <td>85% - 90% em lesões complexas</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4>3. Passo a Passo do Procedimento</h4>
    <ol>
      <li><strong>Preparo do Acesso Vascular:</strong> Punção guiada por ultrassom e escolha do introdutor adequado.</li>
      <li><strong>Navegação e Cruzamento da Lesão:</strong> Seleção do fio-guia com suporte apropriado.</li>
      <li><strong>Critérios de Sucesso Angiográfico:</strong> Ausência de recoil, fluxo coronário TIMI 3 e ausência de dissecções limitantes.</li>
    </ol>
  `,

  // --------------------------------------------------------------------------
  // 10. QUIZ CLÍNICO INTERATIVO COM IA (Aba 'Quiz com IA')
  // --------------------------------------------------------------------------
  // Cada questão contém:
  // - question: Enunciado clínico baseado nos ensinamentos da aula
  // - options: Array de 4 alternativas (strings)
  // - correctIndex: Índice da resposta correta (0 = A, 1 = B, 2 = C, 3 = D)
  // - explanation: Justificativa didática que aparece instantaneamente após a resposta
  quiz: [
    {
      question: "Qual é a conduta técnica inicial preconizada antes da aplicação do dispositivo farmacológico?",
      options: [
        "Insuflar imediatamente o balão farmacológico sem preparo prévio do vaso.",
        "Realizar preparo rigoroso da lesão com balão não complacente em relação 1:1 por no mínimo 30 segundos.",
        "Proceder sempre com a troca valvar cirúrgica de urgência.",
        "Administrar dose dobrada de heparina sem pré-dilatação."
      ],
      correctIndex: 1,
      explanation: "O preparo meticuloso da lesão em proporção balão-vaso de 1:1 é fundamental para vencer a resistência elástica e permitir a absorção eficiente do fármaco na íntima vascular."
    },
    {
      question: "Qual exame de imagem complementar é considerado indispensável na avaliação de falhas prévias de stents (reestenose intrastent)?",
      options: [
        "Radiografia simples de tórax em decúbito dorsal.",
        "Eletrocardiograma ambulatorial de 24 horas.",
        "Imagem intravascular de alta definição (IVUS ou OCT) para identificar o mecanismo de falha (subexpansão, fratura ou neoaterosclerose).",
        "Ressonância magnética de abdome total."
      ],
      correctIndex: 2,
      explanation: "A imagem intravascular (IVUS ou OCT) é mandatória para guiar a terapia personalizada e esclarecer a etiologia subjacente da reestenose."
    }
  ]
};

// Exportação para Node.js / Testes se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NOVO_WEBINAR_TEMPLATE };
}
