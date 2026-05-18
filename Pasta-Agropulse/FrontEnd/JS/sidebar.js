/* =====================================================
   AgroPulse — Sidebar Module
   Handles sidebar visibility (mobile drawer) and nav-item clicks.
   ===================================================== */

const Sidebar = (() => {
  'use strict';

  function _getSidebar()  { return document.querySelector('.sidebar'); }
  function _getOverlay()  { return document.getElementById('sidebarOverlay'); }

  /** Toggles the sidebar open/closed (mobile). */
  function toggle() {
    const sidebar = _getSidebar();
    const overlay = _getOverlay();
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
  }

  /** Forces the sidebar closed. Used after nav item is clicked on mobile. */
  function close() {
    const sidebar = _getSidebar();
    const overlay = _getOverlay();
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  /**
   * Highlights the correct nav item for the given page slug.
   */
  function setActive(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // nav-items use onclick="Sidebar.navigate('page')" or data-page attribute
    const target = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (target) target.classList.add('active');
  }

  /**
   * Navigates to a page: closes sidebar, delegates to Dashboard.
   */
  function navigate(page, element) {
    close();
    Dashboard.goTo(page, element);
  }

  return { toggle, close, setActive, navigate };
})();
