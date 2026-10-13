/**
 * CathlabFlix by SBHCI - Base de Dados Oficial de Webinares
 * Contém informações ricas de aulas, resumos com IA, relatórios técnicos,
 * infográficos em alta definição, áudios, podcasts, links de NotebookLM e quizzes.
 */

const WEBINARES_DATA = [
  {
    id: "magic-touch",
    slug: "15-07-26-lacamento-magic-touch",
    title: "Lançamento Magic Touch - A nova era dos balões farmacológicos",
    shortTitle: "Lançamento Magic Touch",
    date: "15/07/2026",
    dateISO: "2026-07-15",
    dateFormatted: "15 de Julho de 2026",
    category: "Balões Farmacológicos",
    categorySlug: "baloes",
    badge: "Lançamento Oficial",
    duration: "1h 15m",
    thumbnail: "https://static.wixstatic.com/media/1d3d47_6e980fde42ca4733be1368e874014f4c~mv2.png/v1/fill/w_976,h_550,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Prancheta%201.png",
    vimeoId: "1223707542",
    videoEmbedUrl: "https://player.vimeo.com/video/1223707542",
    infographicUrl: "https://static.wixstatic.com/media/1d3d47_208e26e0f96c4b90bcd183ad95f7e383~mv2.png/v1/crop/x_0,y_0,w_1536,h_2751/fill/w_1536,h_2751,al_c,q_95,enc_avif,quality_auto/Ci%C3%AAncia_dos_Bal%C3%B5es_Farmacol%C3%B3gicos_Sirolimus.png",
    infographicTitle: "Ciência dos Balões Farmacológicos: Sirolimus vs Paclitaxel",
    pdfUrl: "https://www.cathlabflix.org/_files/ugd/1d3d47_c7bacf33e2274ad8b896cd50b0d03a31.pdf",
    pdfTitle: "Magic Touch Intervention Blueprint (PDF Oficial)",
    notebookLm: {
      notebookUrl: "https://notebooklm.google.com/notebook/797d1f51-4a06-4efb-9410-2edaf02fdf04",
      quizUrl: "https://notebooklm.google.com/notebook/797d1f51-4a06-4efb-9410-2edaf02fdf04/artifact/eeefdf9e-8760-45a0-b8c1-bea6ecac2e63",
      flashcardsUrl: "https://notebooklm.google.com/notebook/797d1f51-4a06-4efb-9410-2edaf02fdf04/artifact/2513a738-c3e3-4b65-8c40-acedb9ebae21"
    },
    audios: [
      {
        id: "mt-audio-1",
        title: "Magic_Touch_e_o_preparo_do_vaso",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "01:53",
        durationSec: 113,
        type: "Resumo em Áudio",
        desc: "Síntese executiva focada nos critérios de preparo de lesão e cinética do Sirolimus com nanotecnologia Nanolute."
      },
      {
        id: "mt-audio-2",
        title: "Sirolimus_versus_Paclitaxel_em_balões_farmacológicos",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "05:53",
        durationSec: 353,
        type: "Debate em Podcast",
        desc: "Discussão aprofundada comparando os efeitos citostático vs citotóxico, janela terapêutica e evidências clínicas TRANSFORM."
      }
    ],
    summary: `
      <p class="webinar-lead">A transição para balões farmacológicos revestidos com <strong>Sirolimus</strong> marca um avanço fundamental na busca por restabelecer a fisiologia vascular natural, preservando a vasomotricidade e a pulsatilidade arterial sem a permanência de próteses metálicas.</p>
      
      <div class="webinar-callout">
        <h4><span class="callout-icon">💡</span> Ponto Chave da Sessão</h4>
        <p>Na prática clínica, o sucesso do tratamento com balões farmacológicos depende crucialmente de um rigoroso preparo da lesão — processo comparado à <em>"preparação cuidadosa de uma parede antes da pintura"</em>. Sem o preparo adequado da placa (relação 1:1, balões NC ou cutting), nenhum fármaco é capaz de atingir sua eficácia biológica máxima.</p>
      </div>

      <div class="webinar-highlights-grid">
        <div class="highlight-card">
          <div class="highlight-num">01</div>
          <div class="highlight-content">
            <strong>Relação Balão-Vaso 1:1</strong>
            <p>Uso inicial obrigatório de balões não complacentes (NC) com insuflação prolongada (&ge; 30 segundos) para superar o recoil elástico.</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">02</div>
          <div class="highlight-content">
            <strong>Tecnologia Nanolute</strong>
            <p>Carreador lipofílico nano-encapsulado que permite a transferência eficiente do Sirolimus, mantendo droga ativa na parede por até 120 dias.</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">03</div>
          <div class="highlight-content">
            <strong>Evidências TRANSFORM</strong>
            <p>Estudos clínicos demonstrando não-inferioridade clínica e novos horizontes para lesões de novo em vasos médios e grandes.</p>
          </div>
        </div>
      </div>
    `,
    fullReport: `
      <h3>Comparação Teórica e Mecanismos de Ação: Sirolimus vs. Paclitaxel</h3>
      <p>A transição para balões com sirolimus busca restaurar a fisiologia vascular, permitindo vasodilatação, vasoconstrição e, crucialmente, a pulsatilidade da artéria, o que pode prevenir a neoaterosclerose causada pela rigidez de corpos estranhos permanentes.</p>

      <h4>1. Diferenças Bioquímicas e Celulares</h4>
      <div class="table-responsive">
        <table class="webinar-comparison-table">
          <thead>
            <tr>
              <th>Parâmetro</th>
              <th>Sirolimus (Magic Touch)</th>
              <th>Paclitaxel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Fase do Ciclo Celular</strong></td>
              <td>Fase G1 (Inibe mTOR1 antes da replicação do DNA)</td>
              <td>Fase G2/M (Estabiliza microtúbulos, impede mitose)</td>
            </tr>
            <tr>
              <td><strong>Mecanismo Biológico</strong></td>
              <td><span class="badge-status success">Citostático</span> (Efeito reversível)</td>
              <td><span class="badge-status warning">Citotóxico</span> (Morte celular irreversível)</td>
            </tr>
            <tr>
              <td><strong>Janela Terapêutica</strong></td>
              <td>Ampla, elevada tolerabilidade tecidual</td>
              <td>Estreita; risco de necrose medial e aneurismas</td>
            </tr>
            <tr>
              <td><strong>Ação Anti-inflamatória</strong></td>
              <td>Potente inibição inflamatória endotelial</td>
              <td>Ausente</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2. Desafios de Entrega da Droga e a Solução Nanolute</h4>
      <p>O paclitaxel é altamente lipofílico por natureza, permitindo rápida retenção tecidual. Já o sirolimus possui maior hidrossolubilidade relativa e requer formulações carreadoras complexas para vencer a barreira da íntima arterial.</p>
      <p>O <strong>Magic Touch</strong> supera essa limitação utilizando a tecnologia patenteada <em>Nanolute</em> (nano-fosfolipídios biocompatíveis):</p>
      <ul>
        <li>Envelope lipofílico que encapsula os cristais de Sirolimus submicrométricos.</li>
        <li>Absorção rápida durante a insuflação nominal de 30 a 60 segundos.</li>
        <li>Retenção prolongada detectável na parede arterial por até <strong>120 dias</strong>, cobrindo com segurança toda a janela de cicatrização vascular.</li>
        <li>Dose tecidual otimizada: 1,27 &mu;g/mm&sup2;.</li>
      </ul>

      <h4>3. Protocolo Clínico de Preparo de Lesão</h4>
      <p>O preparo minucioso é a etapa mais determinante para o sucesso do DCB coronário:</p>
      <ol>
        <li><strong>Relação de Diâmetro 1:1:</strong> Utilizar balão de preparo NC com diâmetro rigorosamente proporcional ao vaso de referência distal.</li>
        <li><strong>Tempo de Insuflação Adequado:</strong> Manter insuflado por no mínimo 30 segundos para avaliar acomodação elástica e estabilidade hemodinâmica.</li>
        <li><strong>Dispositivos Especializados:</strong> Em reestenose intrastent (ISR) e calcificações severas, o uso de <em>cutting balloons</em> ou scoring balloons é altamente recomendado para criar fraturas controladas na neointima.</li>
        <li><strong>Critérios de Sucesso Angiográfico:</strong> Ausência de recoil elástico significante, fluxo TIMI 3 preservado e dissecções restritas aos tipos A ou B. Dissecções do tipo C a F exigem stent de resgate.</li>
      </ol>

      <h4>4. Imagem Intravascular (IVUS / OCT)</h4>
      <p>Na reestenose intrastent (ISR), a avaliação tomográfica (OCT) ou ultrassonográfica (IVUS) é considerada indispensável para identificar a causa da falha (subexpansão do stent original, fratura de hastes ou hiperplasia neointimal), direcionando o tratamento correto antes da infusão da droga.</p>
    `,
    quiz: [
      {
        question: "Qual é a principal diferença biológica do Sirolimus em relação ao Paclitaxel quando utilizado em balões farmacológicos?",
        options: [
          "O Sirolimus é um agente citotóxico de ação irreversível na fase G2 do ciclo celular.",
          "O Sirolimus atua de forma citostática na fase G1 via inibição de mTOR, apresentando efeito reversível e potente ação anti-inflamatória.",
          "O Sirolimus atua exclusivamente promovendo necrose acelerada da camada média arterial.",
          "O Sirolimus não necessita de carreador lipofílico por ser naturalmente mais lipofílico que o Paclitaxel."
        ],
        correctIndex: 1,
        explanation: "O Sirolimus atua na fase G1 do ciclo celular inibindo o complexo mTOR1 de forma citostática (reversível) com ampla janela terapêutica e propriedades anti-inflamatórias, diferindo da citotoxicidade do Paclitaxel."
      },
      {
        question: "Por quanto tempo a droga Sirolimus permanece detectável na parede arterial após o uso do balão com tecnologia Nanolute?",
        options: [
          "Apenas por 24 horas após o procedimento.",
          "Aproximadamente 7 a 14 dias.",
          "Até 120 dias, cobrindo o período crítico de cicatrização vascular.",
          "Por mais de 5 anos de forma permanente."
        ],
        correctIndex: 2,
        explanation: "A tecnologia Nanolute garante uma retenção tecidual prolongada de Sirolimus por até 120 dias na parede arterial, garantindo supressão da reestenose durante o pico do remodelamento vascular."
      },
      {
        question: "Qual é a conduta recomendada quanto ao preparo da lesão antes de utilizar o balão farmacológico?",
        options: [
          "Utilizar diretamente o balão farmacológico sem preparo prévio para economizar tempo.",
          "Preparar a lesão com balão não complacente (NC) na relação 1:1, reservando cutting/scoring para casos de recoil ou calcificação, antes de insuflar o DCB.",
          "Sempre implantar um stent previamente e usar o balão farmacológico apenas dentro dele.",
          "Subdimensionar o balão de preparo para 0.5:1 para evitar qualquer dissecção."
        ],
        correctIndex: 1,
        explanation: "O preparo adequado é comparado a 'preparar a parede antes da pintura': deve-se utilizar balão NC 1:1 com insuflação prolongada (&ge;30s), considerando cutting/scoring para fratura de placa antes da entrega da droga."
      }
    ]
  },
  {
    id: "evidencia",
    slug: "01-06-26-da-evidencia-ao-paciente",
    title: "Da evidência ao paciente: a jornada do AGENT™ DCB",
    shortTitle: "Da Evidência ao Paciente: AGENT™ DCB",
    date: "01/06/2026",
    dateISO: "2026-06-01",
    dateFormatted: "01 de Junho de 2026",
    category: "Balões Farmacológicos",
    categorySlug: "baloes",
    badge: "Estudo Clínico",
    duration: "1h 19m",
    thumbnail: "https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fill/w_976,h_550,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/thumb%20(1)%202.jpg",
    vimeoId: "1223707532",
    videoEmbedUrl: "https://player.vimeo.com/video/1223707532",
    infographicUrl: "https://static.wixstatic.com/media/1d3d47_e668aa6d49d240e5b028007493610344~mv2.png/v1/crop/x_0,y_0,w_1536,h_2751/fill/w_1536,h_2751,al_c,q_95,enc_avif,quality_auto/Nova_era_do_bal%C3%A3o_farmacol%C3%B3gico.png",
    infographicTitle: "Nova Era do Balão Farmacológico: Tecnologia Transpax e Evidências",
    pdfUrl: "https://www.cathlabflix.org/_files/ugd/1d3d47_52ea0cbd44004b6280fa544c2508f043.pdf",
    pdfTitle: "Da Evidência ao Paciente: A Jornada do AGENT DCB (Relatório Oficial)",
    notebookLm: {
      notebookUrl: "https://notebooklm.google.com/notebook/0fb21f5a-e17a-40c2-9dd6-24b5a2541c83",
      quizUrl: "https://notebooklm.google.com/notebook/0fb21f5a-e17a-40c2-9dd6-24b5a2541c83/artifact/40eb10d9-d65f-4812-820f-53b40e7d06e2",
      flashcardsUrl: "https://notebooklm.google.com/notebook/0fb21f5a-e17a-40c2-9dd6-24b5a2541c83/artifact/601c7059-924f-47e5-b9ce-c26aa8779a86"
    },
    audios: [
      {
        id: "ev-audio-1",
        title: "Balão_farmacológico_em_reestenoses_e_vasos_finos",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "01:45",
        durationSec: 105,
        type: "Resumo em Áudio",
        desc: "Síntese dos ensaios clínicos do AGENT DCB e o papel no tratamento de reestenose intra-stent e anatomias de difícil acesso."
      },
      {
        id: "ev-audio-2",
        title: "Tratar_artérias_sem_deixar_metal_para_trás",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "15:38",
        durationSec: 938,
        type: "Debate em Podcast",
        desc: "Debate clínico aprofundado sobre o conceito 'Leaving Nothing Behind' e a mudança de paradigma na cardiologia intervencionista."
      },
      {
        id: "ev-audio-3",
        title: "01-06-2026_-_webinar_sbhci_-_da_evidência_ao_paciente",
        artist: "Webinar SBHCI Completo",
        duration: "1:19:07",
        durationSec: 4747,
        type: "Áudio do Webinar",
        desc: "Gravação integral em áudio da sessão com todas as discussões dos painelistas e perguntas da audiência."
      }
    ],
    summary: `
      <p class="webinar-lead">A cardiologia intervencionista vivencia uma expressiva virada cultural: a busca ativa por <strong>tratar artérias sem deixar metal permanente para trás</strong> (<em>leaving nothing behind</em>), priorizando a preservação da vasomotricidade, ramificações laterais e opções terapêuticas futuras.</p>

      <div class="webinar-callout">
        <h4><span class="callout-icon">🎯</span> Tecnologia Transpax com ATBC</h4>
        <p>O balão <strong>AGENT™ DCB</strong> introduz uma matriz carreadora inovadora composta por citrato acetil tributil (ATBC), que assegura a integridade do fármaco durante a navegação tortuosa e transfere eficientemente a dose precisa de Paclitaxel sem perdas distais de partículas.</p>
      </div>

      <div class="webinar-highlights-grid">
        <div class="highlight-card">
          <div class="highlight-num">01</div>
          <div class="highlight-content">
            <strong>Tratamento de Reestenose (ISR)</strong>
            <p>Primeiro DCB aprovado pelo FDA para reestenose coronária intrastent, com redução drástica de novas intervenções (TLR).</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">02</div>
          <div class="highlight-content">
            <strong>Plataforma Emerge</strong>
            <p>Construído sobre uma das plataformas de balão de maior cruzabilidade e perfil reduzido para alcançar lesões distais e bifurcações.</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">03</div>
          <div class="highlight-content">
            <strong>Dica de Prática Clínica</strong>
            <p>Especialistas recomendam evitar passagem repetida de cateteres de imagem após a dilatação do DCB para não arranhar a camada medicamentosa absorvida.</p>
          </div>
        </div>
      </div>
    `,
    fullReport: `
      <h3>Mudança de Paradigma: Menos Metal, Mais Fisiologia</h3>
      <p>A intervenção coronária percutânea atravessa uma mudança de mentalidade (mindset), priorizando, sempre que possível, a redução da carga de metal implantada no paciente. O balão farmacológico surge como uma alternativa terapêutica de primeira linha que preserva a vasomotricidade do vaso e promove o remodelamento positivo (efeito <em>late lumen enlargement</em>).</p>

      <h4>1. Não há Efeito de Classe em Balões Farmacológicos</h4>
      <p>A literatura reforça que balões farmacológicos diferem substancialmente entre si. A performance depende da tríade:</p>
      <ul>
        <li><strong>Fármaco ativo:</strong> afinidade lipofílica e mecanismo de supressão da neointima.</li>
        <li><strong>Excipiente / Carreador:</strong> solubilidade e estabilidade da matriz carreadora na corrente sanguínea.</li>
        <li><strong>Plataforma mecânica:</strong> capacidade de cruzar anatomias calcificadas e bifurcações desafiadoras.</li>
      </ul>

      <h4>2. O Diferencial do Excipiente ATBC (Tecnologia Transpax)</h4>
      <p>O excipiente ATBC (citrato acetil tributil) confere ao balão AGENT™ vantagens mecânicas e farmacológicas cruciais:</p>
      <div class="table-responsive">
        <table class="webinar-comparison-table">
          <thead>
            <tr>
              <th>Característica</th>
              <th>Impacto Clínico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Baixa Embolização Distal</strong></td>
              <td>Partículas microscópicas que evitam microinfartos e fenômeno de <em>no-reflow</em> em leitos distais.</td>
            </tr>
            <tr>
              <td><strong>Tempo de Entrega Flexível</strong></td>
              <td>Diferente de balões antigos que exigiam insuflação em menos de 60 segundos após entrar no corpo, o AGENT™ mantém a camada íntegra por até 2 minutos no sangue.</td>
            </tr>
            <tr>
              <td><strong>Transferência Rápida</strong></td>
              <td>Liberação da dose terapêutica na parede vascular em insuflação de apenas 30 segundos.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>3. Evidências do Ensaio Clínico AGENT IDE</h4>
      <p>O ensaio randomizado pivô AGENT IDE avaliou pacientes com reestenose intrastent coronária desafiadora contra balão convencional:</p>
      <ul>
        <li>Redução estatisticamente significante de <strong>Falha da Lesão Alvo (TLF)</strong> aos 12 meses.</li>
        <li>Baixíssimas taxas de trombose ou necessidade de revascularização de urgência.</li>
        <li>Consolidação como padrão-ouro para reestenose de stents farmacológicos prévios em bifurcações e vasos finos.</li>
      </ul>
    `,
    quiz: [
      {
        question: "Qual é a principal função do excipiente ATBC (citrato acetil tributil) presente no balão AGENT™ DCB?",
        options: [
          "Destruir diretamente a placa aterosclerótica através de ação química ácida.",
          "Estabilizar a camada de Paclitaxel durante a navegação sanguínea, facilitando a transferência e minimizando a perda distal de partículas.",
          "Substituir o uso de heparina durante a angioplastia coronária.",
          "Atuar como contraste radiopaco na fluoroscopia."
        ],
        correctIndex: 1,
        explanation: "O excipiente ATBC equilibra características hidrofílicas e lipofílicas, evitando perdas da droga na corrente sanguínea durante a navegação e garantindo transferência eficiente sem embolização distal."
      },
      {
        question: "Por que os especialistas recomendam cautela ao realizar imagem intravascular imediatamente após a aplicação do balão farmacológico?",
        options: [
          "Porque o contraste do ultrassom neutraliza quimicamente o medicamento.",
          "Para evitar que o atrito do cateter de imagem remova mecanicamente a droga recém-depositada ou cause perturbações mecânicas desnecessárias.",
          "Porque os balões farmacológicos tornam as artérias transparentes ao IVUS.",
          "Porque a imagem intravascular é proibida em lesões tratadas com balão."
        ],
        correctIndex: 1,
        explanation: "O atrito de múltiplos cateteres de imagem após a deposição superficial do fármaco pode arranhar a droga transferida para a íntima. A imagem deve ser idealmente realizada no pré-tratamento e para guiar o preparo da lesão."
      }
    ]
  },
  {
    id: "valve-in-valve",
    slug: "valve-in-valve-mitral",
    title: "Valve in valve Mitral: da prática ao randomizado - o Marco Brasileiro do Surviv",
    shortTitle: "Valve in Valve Mitral: Estudo SurViv",
    date: "27/04/2026",
    dateISO: "2026-04-27",
    dateFormatted: "27 de Abril de 2026",
    category: "Intervenção Estrutural",
    categorySlug: "estrutural",
    badge: "Marco Científico",
    duration: "1h 18m",
    thumbnail: "https://static.wixstatic.com/media/1d3d47_5b0c15d034334fcf8bcc28981279a1c8~mv2.jpg/v1/fill/w_976,h_550,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Zoom.jpg",
    vimeoId: "1223707531",
    videoEmbedUrl: "https://player.vimeo.com/video/1223707531",
    infographicUrl: "https://static.wixstatic.com/media/a8daef_152c47673d14421e912453a2032483d0~mv2.png/v1/crop/x_0,y_2,w_1536,h_2750/fill/w_1535,h_2750,al_c,q_95,enc_avif,quality_auto/unnamed%20(5).png",
    infographicTitle: "Infográfico Oficial: Valve-in-Valve Mitral e Estudo SurViv",
    pdfUrl: "https://www.cathlabflix.org/_files/ugd/a8daef_5311462eaa6e44b789aed59370a3967a.pdf",
    pdfTitle: "Estudo SurViv: Valve-in-Valve Mitral vs Reoperação Cirúrgica (PDF)",
    notebookLm: {
      notebookUrl: "https://notebooklm.google.com/notebook/3f8ec930-656a-436b-af1b-fe8329d93f57?pli=1&authuser=0&pageId=none",
      quizUrl: "https://notebooklm.google.com/notebook/3f8ec930-656a-436b-af1b-fe8329d93f57/artifact/f87d4691-7d04-4d98-a61b-ebc62286042c",
      flashcardsUrl: "https://notebooklm.google.com/notebook/3f8ec930-656a-436b-af1b-fe8329d93f57/artifact/85ff4f98-4fa0-45ac-8130-d9ad2c46faab"
    },
    audios: [
      {
        id: "viv-audio-1",
        title: "Cateter supera cirurgia no estudo SurViv",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "01:45",
        durationSec: 105,
        type: "Resumo em Áudio",
        desc: "Os resultados inovadores do primeiro estudo randomizado mundial comparando ViV mitral transcateter versus cirurgia aberta."
      },
      {
        id: "viv-audio-2",
        title: "Cateter ou cirurgia na válvula mitral",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "22:24",
        durationSec: 1344,
        type: "Debate em Podcast",
        desc: "Debate detalhado sobre a evolução da via transeptal, mensuração do True ID e impacto na população brasileira com febre reumática."
      },
      {
        id: "viv-audio-3",
        title: "27-04-2026 - Webinar SBHCI - Valve-in-valve mitral da prática ao randomizado",
        artist: "Webinar SBHCI Completo",
        duration: "1:18:36",
        durationSec: 4716,
        type: "Áudio do Webinar",
        desc: "Sessão científica completa com apresentação de casos clínicos, discussão de complicações e desfechos do estudo SurViv."
      }
    ],
    summary: `
      <p class="webinar-lead">O estudo brasileiro <strong>SurViv</strong> posicionou a cardiologia estrutural do Brasil no centro do cenário mundial ao conduzir o <strong>primeiro ensaio clínico randomizado do planeta</strong> comparando o implante transcateter Valve-in-Valve (ViV) mitral com a reoperação cirúrgica convencional.</p>

      <div class="webinar-callout">
        <h4><span class="callout-icon">🏆</span> Pioneirismo do Ensaio Randomizado SurViv</h4>
        <p>Em uma coorte de 150 pacientes com disfunção severa de bioprótese mitral — população brasileira jovem (média de 58 anos) acometida por febre reumática e com múltiplas cirurgias prévias —, a abordagem percutânea transcateter demonstrou superioridade evidente na fase aguda com recuperação substancialmente mais rápida.</p>
      </div>

      <div class="webinar-highlights-grid">
        <div class="highlight-card">
          <div class="highlight-num">01</div>
          <div class="highlight-content">
            <strong>Menor Mortalidade Peroperatória</strong>
            <p>Redução marcante de sangramentos maiores, menor permanência em UTI e recuperação clínica significativamente acelerada.</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">02</div>
          <div class="highlight-content">
            <strong>Via Transeptal Consolidada</strong>
            <p>A punção transeptal substituiu definitivamente o acesso transapical na quase totalidade dos centros brasileiros de excelência.</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">03</div>
          <div class="highlight-content">
            <strong>Planejamento Tomográfico Rigoroso</strong>
            <p>Cálculo do Neo-LVOT e determinação milimétrica do True ID da bioprótese cirúrgica para prevenir obstrução da via de saída do VE.</p>
          </div>
        </div>
      </div>
    `,
    fullReport: `
      <h3>Valve-in-Valve Mitral: Análise Técnica e Impacto Clínico do Estudo Brasileiro SurViv</h3>
      <p>A degeneração de biopróteses valvares mitrais é um processo inexorável que ocorre entre 10 a 15 anos após o implante. Em pacientes submetidos a reoperações cirúrgicas sucessivas (terceira ou quarta toracotomia), a mortalidade cirúrgica acumulada pode atingir patamares superiores a 12-15%.</p>

      <h4>1. Desenho Metodológico do Estudo SurViv</h4>
      <div class="table-responsive">
        <table class="webinar-comparison-table">
          <thead>
            <tr>
              <th>Critério</th>
              <th>Especificação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>População</strong></td>
              <td>150 pacientes randomizados 1:1 (75 ViV Transcateter vs 75 Cirurgia Convencional)</td>
            </tr>
            <tr>
              <td><strong>Centros Participantes</strong></td>
              <td>7 hospitais terciários brasileiros de alta complexidade cardiológica</td>
            </tr>
            <tr>
              <td><strong>Perfil Demográfico</strong></td>
              <td>Idade média de 58 anos, prevalência acentuada de etiologia reumática</td>
            </tr>
            <tr>
              <td><strong>Acesso Percutâneo</strong></td>
              <td>Predominantemente transeptal com auxílio de ecocardiograma transesofágico (ECO-TE 3D)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2. Resultados Clínicos em 1 Ano</h4>
      <ul>
        <li><strong>Redução Significativa de Sangramentos:</strong> Diferença estatisticamente marcante nas necessidades de hemotransfusão a favor do ViV.</li>
        <li><strong>Tempo de Hospitalização:</strong> Média de internação de 3 a 5 dias no grupo ViV contra mais de 12 a 18 dias no grupo de reoperação cirúrgica.</li>
        <li><strong>Desempenho Hemodinâmico:</strong> Gradientes médios mitrais equivalentes entre os dois grupos, com melhora acentuada da classe funcional (NYHA I/II).</li>
      </ul>

      <h4>3. Planejamento Tomográfico e Prevenção do Neo-LVOT</h4>
      <p>A complicação mais temida no ViV mitral é a obstrução da via de saída do ventrículo esquerdo (LVOT). Os especialistas destacaram os critérios tomográficos obrigatórios:</p>
      <ol>
        <li><strong>Área do Neo-LVOT prevista:</strong> Deve ser idealmente superior a 1,7 a 2,0 cm&sup2;. Áreas abaixo de 1,5 cm&sup2; aumentam o risco de gradientes de via de saída proibitivos.</li>
        <li><strong>Ângulo Mitro-Aórtico:</strong> Ângulos mais agudos projetam o folheto cirúrgico em direção ao septo interventricular.</li>
        <li><strong>Verificação do True ID:</strong> Utilização da tabela e aplicativo <em>Mitral Valve in Valve App</em> para selecionar o diâmetro exato da prótese transcateter balão-expansível.</li>
      </ol>
    `,
    quiz: [
      {
        question: "Qual foi a grande inovação metodológica trazida pelo estudo brasileiro SurViv na cardiologia estrutural?",
        options: [
          "Foi o primeiro registro observacional de pacientes idosos octogenários.",
          "Foi o primeiro ensaio clínico randomizado do mundo a comparar o procedimento Valve-in-Valve mitral transcateter com a reoperação cirúrgica convencional.",
          "Demonstrou que próteses mecânicas são preferíveis em pacientes com disfunção valvar.",
          "Substituiu o uso de ecocardiograma durante o procedimento."
        ],
        correctIndex: 1,
        explanation: "O estudo SurViv foi o primeiro ensaio clínico randomizado internacional a comparar diretamente ViV mitral transcateter versus reoperação cirúrgica convencional em pacientes com bioprótese disfuncionante."
      },
      {
        question: "Qual complicação anatômica é considerada a mais crítica para rastrear durante o planejamento por angiotomografia no ViV mitral?",
        options: [
          "Regurgitação aórtica leve.",
          "Obstrução da via de saída do ventrículo esquerdo (Neo-LVOT).",
          "Hipertensão venosa periférica.",
          "Calcificação da artéria carótida."
        ],
        correctIndex: 1,
        explanation: "A projeção do folheto cirúrgico degenerado em direção ao septo interventricular pode causar obstrução severa da via de saída do ventrículo esquerdo (Neo-LVOT), sendo o principal parâmetro analisado na tomografia pré-operatória."
      }
    ]
  },
  {
    id: "jovem-sbhci",
    slug: "23-03-2026-webinar-jovem-sbhci",
    title: "Webinar SBHCI Jovem - Inovações e Estratégias em Intervenção Estrutural",
    shortTitle: "Webinar SBHCI Jovem: ViV Aórtico",
    date: "23/03/2026",
    dateISO: "2026-03-23",
    dateFormatted: "23 de Março de 2026",
    category: "SBHCI Jovem",
    categorySlug: "jovem",
    badge: "SBHCI Jovem",
    duration: "1h 10m",
    thumbnail: "https://static.wixstatic.com/media/a8daef_a738f34dc0394993922f0f6871591c61~mv2.jpg/v1/fill/w_718,h_404,al_c,lg_1,q_80,enc_avif,quality_auto/a8daef_a738f34dc0394993922f0f6871591c61~mv2.jpg",
    vimeoId: "1223707530",
    videoEmbedUrl: "https://player.vimeo.com/video/1223707530",
    infographicUrl: "https://static.wixstatic.com/media/a8daef_0422ada66f9d43a8825b3710f7b85b35~mv2.png/v1/crop/x_0,y_0,w_1536,h_2751/fill/w_1536,h_2751,al_c,q_95,enc_avif,quality_auto/infografico-valve-in-valve.png",
    infographicTitle: "Infográfico Oficial: Planejamento Estrutural do Valve-in-Valve Aórtico",
    pdfUrl: "https://www.cathlabflix.org/_files/ugd/a8daef_fcaf5f2b41254cb0ac064a1b232ac201.pdf",
    pdfTitle: "A Engenharia do Valve-in-Valve: Iniciativa NEXSIM SBHCI (PDF)",
    notebookLm: {
      notebookUrl: "https://notebooklm.google.com/notebook/3f8ec930-656a-436b-af1b-fe8329d93f57?pli=1&authuser=0&pageId=none",
      quizUrl: "https://notebooklm.google.com/notebook/3f8ec930-656a-436b-af1b-fe8329d93f57/artifact/f87d4691-7d04-4d98-a61b-ebc62286042c",
      flashcardsUrl: "https://notebooklm.google.com/notebook/3f8ec930-656a-436b-af1b-fe8329d93f57/artifact/85ff4f98-4fa0-45ac-8130-d9ad2c46faab"
    },
    audios: [
      {
        id: "jv-audio-1",
        title: "Simulação e precisão na cardiologia intervencionista",
        artist: "SBHCI Jovem",
        duration: "01:55",
        durationSec: 115,
        type: "Resumo em Áudio",
        desc: "Apresentação dos benefícios aos jovens intervencionistas e o papel do centro de simulação avançada NEXSIM."
      },
      {
        id: "jv-audio-2",
        title: "Webinar Jovem SBHCI - Protocolo ou instinto no Valve-in-Valve",
        artist: "IA CathlabFlix - NotebookLM",
        duration: "26:14",
        durationSec: 1574,
        type: "Debate em Podcast",
        desc: "Debate minucioso sobre prevenção de oclusão coronariana, técnicas de laceração de folhetos (BASILICA vs UNICORN) e planejamento."
      },
      {
        id: "jv-audio-3",
        title: "Webinar Jovem - Audio do Webinar - 23 de Março de 2026",
        artist: "Webinar SBHCI Jovem Completo",
        duration: "1:10:43",
        durationSec: 4243,
        type: "Áudio do Webinar",
        desc: "Gravação na íntegra com a sessão de apresentação de casos e discussão interativa com os orientadores da SBHCI."
      }
    ],
    summary: `
      <p class="webinar-lead">O webinar da <strong>SBHCI Jovem</strong> foca no planejamento e execução de <strong>Valve-in-Valve (ViV) aórtico</strong>, detalhando os preditores anatômicos de oclusão coronariana e as estratégias avançadas de modificação de folhetos para garantir segurança procedimental.</p>

      <div class="webinar-callout">
        <h4><span class="callout-icon">🚀</span> Princípio Fundamental de Segurança</h4>
        <p><em>"Não se deve tocar no paciente antes de estar proficiente na simulação tomográfica."</em> O conteúdo reforça a necessidade imperativa de simular virtualmente a posição da prótese e mensurar com exatidão a distância <strong>VTC (Valve-to-Coronary)</strong> e <strong>VTSTJ (Valve-to-Sinotubular Junction)</strong>.</p>
      </div>

      <div class="webinar-highlights-grid">
        <div class="highlight-card">
          <div class="highlight-num">01</div>
          <div class="highlight-content">
            <strong>Métricas VTC e Classificação VIVID</strong>
            <p>VTC &lt; 4 mm configura alto risco de oclusão aguda dos óstios coronários, demandando proteção mecânica ou laceração.</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">02</div>
          <div class="highlight-content">
            <strong>Técnicas de Modificação de Folheto</strong>
            <p>Comparativo técnico entre a técnica BASILICA (eletrificação controlada em V) e UNICORN (dilatação por balão).</p>
          </div>
        </div>
        <div class="highlight-card">
          <div class="highlight-num">03</div>
          <div class="highlight-content">
            <strong>Iniciativa NEXSIM SBHCI</strong>
            <p>Capacitação prática em simuladores e redução de 70% na anuidade de novos membros da sociedade de hemodinâmica.</p>
          </div>
        </div>
      </div>
    `,
    fullReport: `
      <h3>1. Análise Técnica: Valve-in-Valve (ViV) Aórtico</h3>
      <p>O implante transcateter dentro de uma bioprótese aórtica cirúrgica degenerada difere do implante em anel nativo: os postes da prótese cirúrgica e os folhetos existentes criam uma barreira rígida que pode ser empurrada em direção aos óstios coronarianos ou aprisionar o seio de Valsalva.</p>

      <h4>2. Preditores de Risco Anatômico na Angiotomografia</h4>
      <div class="table-responsive">
        <table class="webinar-comparison-table">
          <thead>
            <tr>
              <th>Parâmetro</th>
              <th>Zona de Alto Risco</th>
              <th>Zona de Baixo Risco</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>VTC (Valve-to-Coronary)</strong></td>
              <td>&lt; 4.0 mm</td>
              <td>&gt; 6.0 mm</td>
            </tr>
            <tr>
              <td><strong>VTSTJ (Distância à Junção Sinotubular)</strong></td>
              <td>&lt; 2.5 mm</td>
              <td>&gt; 3.5 mm</td>
            </tr>
            <tr>
              <td><strong>Altura do Óstio Coronariano</strong></td>
              <td>&lt; 10 mm a partir do anel valvar</td>
              <td>&gt; 12 mm</td>
            </tr>
            <tr>
              <td><strong>Tipo de Prótese Cirúrgica</strong></td>
              <td>Folhetos montados por fora dos postes / Próteses bovinas</td>
              <td>Folhetos internos / Prótese sem postes rígidos</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>3. Técnicas de Modificação de Folhetos</h4>
      <p>Quando o planejamento virtual aponta alto risco de sequestro do seio ou oclusão do óstio coronariano, as técnicas de preservação ativa são mandatórias:</p>
      <ul>
        <li><strong>Técnica BASILICA (Bioprosthetic Aortic Scallop Intentional Laceration to prevent Iatrogenic Coronary Artery obstruction):</strong>
          Utiliza guia de angioplastia 0.014" eletrificado por eletrocautério para perfurar e lacerar o folheto em formato de "V", criando uma fenda para manter o fluxo na coronária. Altamente previsível quando há alinhamento comissural.
        </li>
        <li><strong>Técnica UNICORN:</strong>
          Punção mecânica do folheto seguida de dilatações seriadas com balões. É tecnicamente mais rápida, porém com padrão de laceração menos homogêneo.
        </li>
        <li><strong>Novas Tecnologias (Shortcut):</strong>
          Dispositivo dedicado em fase clínica para padronizar e automatizar a incisão de folhetos sem necessidade de improvisação de eletrodos.
        </li>
      </ul>

      <h4>4. Mensagens aos Jovens Intervencionistas</h4>
      <blockquote>
        "A angiotomografia é o pilar fundamental pra gente prever e prevenir a catástrofe da oclusão coronariana. O minimalismo não se aplica a casos de Valve-in-Valve complexos: proteção coronariana e planejamento multidisciplinar vêm sempre em primeiro lugar."
      </blockquote>
    `,
    quiz: [
      {
        question: "Qual valor da distância VTC (Valve-to-Coronary) na angiotomografia prediz alto risco de oclusão coronariana durante o ViV aórtico?",
        options: [
          "Distância VTC > 10 mm.",
          "Distância VTC entre 6 e 8 mm.",
          "Distância VTC < 4 mm.",
          "A distância VTC não tem relevância clínica no ViV aórtico."
        ],
        correctIndex: 2,
        explanation: "Uma distância VTC menor que 4 mm indica que o folheto cirúrgico deslocado pela nova prótese transcateter ficará perigosamente próximo ao óstio da coronária, configurando alto risco de oclusão coronariana aguda."
      },
      {
        question: "Em que consiste a técnica BASILICA utilizada em procedimentos estruturais complexos?",
        options: [
          "Implante simultâneo de três stents na artéria descendente anterior.",
          "Laceração longitudinal intencional do folheto da bioprótese usando um guia eletrificado para manter o fluxo coronariano pérvio.",
          "Troca cirúrgica da válvula sob hipotermia profunda.",
          "Oclusão do apêndice atrial esquerdo associada a TAVI."
        ],
        correctIndex: 1,
        explanation: "A técnica BASILICA utiliza um guia de angioplastia eletrificado para perfurar e lacerar o folheto que se sobreporia ao óstio da coronária, preservando o fluxo sanguíneo coronário após o implante da prótese transcateter."
      }
    ]
  }
];

// Helper functions for easy lookup
function getWebinarById(id) {
  if (!id) return WEBINARES_DATA[0];
  const normalized = id.toLowerCase().trim();
  return WEBINARES_DATA.find(w => w.id === normalized || w.slug === normalized) || WEBINARES_DATA[0];
}

function getAllWebinares() {
  return WEBINARES_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WEBINARES_DATA, getWebinarById, getAllWebinares };
}
