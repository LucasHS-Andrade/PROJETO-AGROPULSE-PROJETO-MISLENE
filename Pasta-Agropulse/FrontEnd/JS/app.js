/* =====================================================
   AgroPulse — Application Bootstrap
   Initialises all modules after the DOM is ready.
   ===================================================== */

/* --------------------------------------------------
   Toast Utility
   Global helper available to all modules.
-------------------------------------------------- */
const Toast = (() => {
  'use strict';

  let _timer = null;

  /**
   * Shows a toast notification.
   * @param {string}  message - Text to display
   * @param {boolean} isError - Whether to show as error (red)
   * @param {number}  duration - Auto-hide delay in ms (default 3200)
   */
  function show(message, isError = false, duration = 3200) {
    const el = document.getElementById('toast');
    if (!el) return;

    el.textContent = message;
    el.className   = 'toast show' + (isError ? ' error' : '');

    clearTimeout(_timer);
    _timer = setTimeout(() => {
      el.className = 'toast';
    }, duration);
  }

  return { show };
})();


/* --------------------------------------------------
   Application Bootstrap
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Restore user session ──────────────────────────
  const storedUser = sessionStorage.getItem('agropulse_user') || 'Admin';
  const nameEl     = document.getElementById('userName');
  const avatarEl   = document.getElementById('userAvatar');
  if (nameEl)   nameEl.textContent   = storedUser;
  if (avatarEl) avatarEl.textContent = storedUser.charAt(0).toUpperCase();

  // ── API URL field ─────────────────────────────────
  const apiInput = document.getElementById('apiUrl');
  if (apiInput) {
    apiInput.addEventListener('change', () => Api.setUrl(apiInput.value));
    apiInput.addEventListener('blur',   () => Api.testConnection());
  }

  // ── Topbar buttons ────────────────────────────────
  const refreshBtn = document.querySelector('[data-action="refresh"]');
  if (refreshBtn) refreshBtn.addEventListener('click', () => Dashboard.refresh());

  const newBtn = document.getElementById('btnNovo');
  if (newBtn) newBtn.addEventListener('click', () => Modal.open());

  // ── Modal events ─────────────────────────────────
  const overlay  = document.getElementById('modalOverlay');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.querySelector('.modal-footer .btn-ghost');
  const saveBtn   = document.querySelector('.modal-footer .btn-primary[data-action="save"]');

  if (overlay)   overlay.addEventListener('click',  (e) => Modal.closeOnOutsideClick(e));
  if (closeBtn)  closeBtn.addEventListener('click',  () => Modal.close());
  if (cancelBtn) cancelBtn.addEventListener('click', () => Modal.close());
  if (saveBtn)   saveBtn.addEventListener('click',   () => Modal.submit());

  // ── Keyboard: Escape closes modal ────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') Modal.close();
  });

  // ── Sidebar mobile overlay ────────────────────────
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => Sidebar.close());

  // ── User area: prompt for name ────────────────────
  const userArea = document.querySelector('.user-area');
  if (userArea) {
    userArea.addEventListener('click', () => {
      const name = prompt('Qual o seu nome?', storedUser);
      if (name && name.trim()) {
        const trimmed = name.trim();
        sessionStorage.setItem('agropulse_user', trimmed);
        if (nameEl)   nameEl.textContent   = trimmed;
        if (avatarEl) avatarEl.textContent = trimmed.charAt(0).toUpperCase();
      }
    });
  }

  // ── Initial API test ──────────────────────────────
  Api.testConnection();

  // ── Initial route & stats ─────────────────────────
  Router.init();
  Dashboard.loadStats();
});
