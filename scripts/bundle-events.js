/**
 * CathlabFlix - Script de Empacotamento Standalone para Eventos & Cadastro de Eventos (Embed Wix)
 * Gera arquivos 100% autônomos sem dependências de caminhos relativos para funcionar em qualquer iframe/embed do Wix.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Ler base de dados e serviço
const eventsDataCode = fs.readFileSync(path.join(ROOT_DIR, 'js/events-data.js'), 'utf8');
const eventsServiceCode = fs.readFileSync(path.join(ROOT_DIR, 'js/events-service.js'), 'utf8');

// 2. Empacotar embed-cadastrar-evento.html
const cadastrarSource = fs.readFileSync(path.join(ROOT_DIR, 'new/cadastrar-evento.html'), 'utf8');

// Substituir as tags de script externas pelo código inlined
let cadastrarBundled = cadastrarSource
  .replace('<script src="/js/events-data.js"></script>', `<script>\n${eventsDataCode}\n</script>`)
  .replace('<script src="/js/events-service.js"></script>', `<script>\n${eventsServiceCode}\n</script>`);

fs.writeFileSync(path.join(ROOT_DIR, 'embed-cadastrar-evento.html'), cadastrarBundled, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'cadastrar-evento.html'), cadastrarBundled, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'new/cadastrar-evento.html'), cadastrarBundled, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'new/embed-cadastrar-evento.html'), cadastrarBundled, 'utf8');

const cadastrarDir = path.join(ROOT_DIR, 'new/cadastrar-evento');
if (!fs.existsSync(cadastrarDir)) fs.mkdirSync(cadastrarDir, { recursive: true });
fs.writeFileSync(path.join(cadastrarDir, 'index.html'), cadastrarBundled, 'utf8');

console.log('✓ cadastrar-evento.html e embed-cadastrar-evento.html gerados com sucesso!');

// 3. Empacotar embed-evento-detalhe.html
const detalheSource = fs.readFileSync(path.join(ROOT_DIR, 'embed-evento-detalhe.html'), 'utf8');

let detalheBundled = detalheSource
  .replace('<script src="/js/events-data.js"></script>', `<script>\n${eventsDataCode}\n</script>`)
  .replace('<script src="/js/events-service.js"></script>', `<script>\n${eventsServiceCode}\n</script>`);

fs.writeFileSync(path.join(ROOT_DIR, 'embed-evento-detalhe.html'), detalheBundled, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'new/embed-evento-detalhe.html'), detalheBundled, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'new/evento.html'), detalheBundled, 'utf8');

const eventoDetalheDir = path.join(ROOT_DIR, 'new/embed-evento-detalhe');
if (!fs.existsSync(eventoDetalheDir)) fs.mkdirSync(eventoDetalheDir, { recursive: true });
fs.writeFileSync(path.join(eventoDetalheDir, 'index.html'), detalheBundled, 'utf8');

const eventoDir = path.join(ROOT_DIR, 'new/evento');
if (!fs.existsSync(eventoDir)) fs.mkdirSync(eventoDir, { recursive: true });
fs.writeFileSync(path.join(eventoDir, 'index.html'), detalheBundled, 'utf8');

console.log('✓ embed-evento-detalhe.html e new/evento.html gerados com sucesso!');
