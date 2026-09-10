const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const variablesCss = fs.readFileSync(path.join(baseDir, 'css/variables.css'), 'utf8');
let styleCss = fs.readFileSync(path.join(baseDir, 'css/style.css'), 'utf8');
styleCss = styleCss.replace("@import url('variables.css');", '');

const indexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const mainMatch = indexHtml.match(/<main class="container">[\s\S]*?<\/main>/);
const mainHtml = mainMatch ? mainMatch[0] : '';

const modalMatch = indexHtml.match(/<div class="modal-backdrop" id="settingsModal"[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/);
const modalHtml = modalMatch ? modalMatch[0] : '';

const configJs = fs.readFileSync(path.join(baseDir, 'js/config.js'), 'utf8');
const vimeoServiceJs = fs.readFileSync(path.join(baseDir, 'js/vimeoService.js'), 'utf8');
const accordionJs = fs.readFileSync(path.join(baseDir, 'js/accordion.js'), 'utf8');
const appJs = fs.readFileSync(path.join(baseDir, 'js/app.js'), 'utf8');

const combined = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acesse os conteúdos - Cathlabflix Sessions</title>
  <meta name="description" content="Grade científica e exibidor dinâmico de aulas e transmissões integrado à API do Vimeo com navegação por dias, salas e accordions responsivos 16:9.">

  <!-- Fonte Montserrat (Google Fonts) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet">

  <style>
/* ==========================================================================
   1. VARIÁVEIS E DESIGN TOKENS (MONTSERRAT, 980px, FUNDO TRANSPARENTE)
   ========================================================================== */
${variablesCss}

/* ==========================================================================
   2. ESTILOS PRINCIPAIS & RESPONSIVIDADE
   ========================================================================== */
${styleCss}
  </style>
</head>
<body>

  <!-- ==========================================================================
       CONTEÚDO PRINCIPAL (ÁREA CENTRAL 980px)
       ========================================================================== -->
${mainHtml}

  <!-- Modal de Configuração da API do Vimeo (Opcional) -->
${modalHtml}

  <!-- ==========================================================================
       SCRIPTS JAVASCRIPT INTEGRADOS (TUDO-EM-UM)
       ========================================================================== -->
  <script>
/* ==========================================================================
   Mapeamento de Pastas e Base de Vídeos Reais do Vimeo
   ========================================================================== */
${configJs}

/* ==========================================================================
   Serviço de Integração Vimeo API
   ========================================================================== */
${vimeoServiceJs}

/* ==========================================================================
   Gerenciador de Accordion e Injeção Dinâmica 16:9
   ========================================================================== */
${accordionJs}

/* ==========================================================================
   Orquestrador da Aplicação e Controle de Eventos
   ========================================================================== */
${appJs}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(baseDir, 'standalone.html'), combined, 'utf8');
console.log('standalone.html generated successfully! Length:', combined.length);
