/* =====================================================
   AgroPulse — Modal Module
   Handles modal open, close, and form submission.
   ===================================================== */

const Modal = (() => {
  'use strict';

  function _getOverlay() { return document.getElementById('modalOverlay'); }
  function _getTitle()   { return document.getElementById('modalTitle'); }
  function _getBody()    { return document.getElementById('modalBody'); }

  /**
   * Opens the modal for the current page/module.
   * Populates the title and form HTML from the module config.
   */
  function open() {
    const page   = Dashboard.getCurrentPage();
    const module = Dashboard.getModule(page);
    if (!module) return;

    const titleEl = _getTitle();
    const bodyEl  = _getBody();
    if (!titleEl || !bodyEl) return;

    titleEl.textContent = 'Novo — ' + module.title;
    bodyEl.innerHTML    = module.form;

    _getOverlay().classList.add('open');

    // Focus the first input
    setTimeout(() => {
      const firstInput = bodyEl.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }, 50);
  }

  /** Closes the modal. */
  function close() {
    const overlay = _getOverlay();
    if (overlay) overlay.classList.remove('open');
  }

  /**
   * Closes the modal when clicking directly on the overlay backdrop.
   */
  function closeOnOutsideClick(event) {
    if (event.target && event.target.id === 'modalOverlay') {
      close();
    }
  }

  /**
   * Submits the current form to the API via POST.
   */
  async function submit() {
    const page   = Dashboard.getCurrentPage();
    const module = Dashboard.getModule(page);
    if (!module) return;

    const saveBtn = document.querySelector('.modal-footer .btn-primary');
    if (saveBtn) {
      saveBtn.disabled    = true;
      saveBtn.textContent = 'Salvando...';
    }

    try {
      const payload = module.payload();

      // Basic validation: check for empty required string fields
      const emptyField = Object.entries(payload).find(
        ([, v]) => typeof v === 'string' && v === ''
      );
      if (emptyField) {
        Toast.show('Preencha todos os campos obrigatórios.', true);
        return;
      }

      await Api.post(module.endpoint, payload);
      Toast.show('✅ Registro salvo com sucesso!');
      close();
      Tables.load(page);

    } catch (error) {
      Toast.show('Erro ao salvar: ' + error.message, true);
    } finally {
      if (saveBtn) {
        saveBtn.disabled    = false;
        saveBtn.textContent = 'Salvar';
      }
    }
  }

  return { open, close, closeOnOutsideClick, submit };
})();
