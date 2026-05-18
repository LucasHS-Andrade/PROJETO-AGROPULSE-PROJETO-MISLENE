/* =====================================================
   AgroPulse — API Module
   Handles all communication with the backend REST API.
   ===================================================== */

const Api = (() => {
  'use strict';

  let _baseUrl = 'http://localhost:8000';

  /** Returns the current base URL */
  function getUrl() {
    return _baseUrl;
  }

  /** Updates the base URL, stripping trailing slashes */
  function setUrl(url) {
    _baseUrl = (url || '').trim().replace(/\/+$/, '');
  }

  /**
   * Generic fetch wrapper. Throws on non-2xx responses.
   * Returns null for 204 No Content.
   */
  async function request(path, options = {}) {
    const response = await fetch(_baseUrl + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => `HTTP ${response.status}`);
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  /** GET shorthand */
  async function get(path) {
    return request(path);
  }

  /** POST shorthand */
  async function post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
  }

  /** PUT shorthand */
  async function put(path, body) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  /** DELETE shorthand */
  async function del(path) {
    return request(path, { method: 'DELETE' });
  }

  /**
   * Tests the API connection and updates the status indicator.
   */
  async function testConnection() {
    const dot    = document.getElementById('apiDot');
    const status = document.getElementById('apiStatus');
    if (!dot || !status) return;

    try {
      await fetch(_baseUrl + '/', { signal: AbortSignal.timeout(4000) });
      dot.className    = 'api-dot on';
      status.textContent = 'conectado';
    } catch {
      dot.className    = 'api-dot';
      status.textContent = 'sem conexão';
    }
  }

  return { getUrl, setUrl, request, get, post, put, del, testConnection };
})();
