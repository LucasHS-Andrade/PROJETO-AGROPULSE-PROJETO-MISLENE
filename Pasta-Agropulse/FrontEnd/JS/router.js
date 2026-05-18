/* =====================================================
   AgroPulse — Router Module
   Simple hash-based client-side router.
   URLs like painel.html#fazendas navigate to the correct page.
   ===================================================== */

const Router = (() => {
  'use strict';

  const VALID_PAGES = [
    'painel', 'fazendas', 'talhoes', 'safras', 'colheitas',
    'funcionarios', 'equipamentos', 'insumos', 'clientes', 'fornecedores',
  ];

  /** Reads the current hash and returns a page slug. Falls back to 'painel'. */
  function _getCurrentPage() {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    return VALID_PAGES.includes(hash) ? hash : 'painel';
  }

  /** Programmatically navigates to a page by updating the URL hash. */
  function navigate(page) {
    if (VALID_PAGES.includes(page)) {
      window.location.hash = '#' + page;
    }
  }

  /** Initialises hash-change listener and triggers an initial route. */
  function init() {
    const handleRoute = () => {
      const page = _getCurrentPage();
      Dashboard.goTo(page);
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // handle the initial URL
  }

  return { navigate, init };
})();
