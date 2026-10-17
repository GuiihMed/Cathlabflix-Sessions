// ==============================================================================
// Wix Velo Backend: backend/http-functions.js
// API REST pública para expor e sincronizar a Coleção "Eventos" do Wix CMS
// Documentação: https://www.wix.com/velo/reference/wix-http-functions
// ==============================================================================

import { ok, created, notFound, serverError } from 'wix-http-functions';
import wixData from 'wix-data';

/**
 * Endpoint GET: https://seu-dominio.wixsite.com/site/_functions/eventos
 * Retorna todos os eventos cadastrados na Coleção "Eventos" ordenados por data
 */
export function get_eventos(request) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  };

  return wixData.query('Eventos')
    .ascending('date')
    .limit(100)
    .find()
    .then(results => {
      options.body = {
        success: true,
        count: results.items.length,
        items: results.items
      };
      return ok(options);
    })
    .catch(error => {
      options.body = {
        success: false,
        error: error.message || String(error)
      };
      return serverError(options);
    });
}

/**
 * Endpoint POST: https://seu-dominio.wixsite.com/site/_functions/eventos
 * Permite cadastrar um novo evento diretamente na Coleção "Eventos"
 */
export function post_eventos(request) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  };

  return request.body.json()
    .then(body => {
      if (!body || !body.title) {
        options.body = { success: false, error: 'Título é obrigatório.' };
        return notFound(options);
      }
      return wixData.insert('Eventos', body);
    })
    .then(result => {
      options.body = {
        success: true,
        item: result
      };
      return created(options);
    })
    .catch(error => {
      options.body = {
        success: false,
        error: error.message || String(error)
      };
      return serverError(options);
    });
}

/**
 * Suporte a pre-flight CORS OPTIONS para navegadores modernos
 */
export function options_eventos(request) {
  return ok({
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
