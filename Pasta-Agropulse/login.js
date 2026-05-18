/* =====================================================
   AgroPulse — Login Module
   Handles login form validation and submission.
   ===================================================== */

(function () {
  'use strict';

  const DEMO_USER = 'admin';
  const DEMO_PASS = 'admin123';

  function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field)  field.classList.add('error');
    if (error)  error.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.form-field input').forEach(i => i.classList.remove('error'));
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
  }

  function setLoading(loading) {
    const btn     = document.getElementById('loginBtn');
    const spinner = document.getElementById('loginSpinner');
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle('loading', loading);
    if (spinner) spinner.style.display = loading ? 'block' : 'none';
  }

  function handleSubmit(event) {
    event.preventDefault();
    clearErrors();

    const username = document.getElementById('userNameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    let valid = true;

    if (!username) {
      showError('userNameInput', 'userNameError', 'Informe seu usuário.');
      valid = false;
    }

    if (!password) {
      showError('passwordInput', 'passwordError', 'Informe sua senha.');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    // Simulated authentication delay (replace with real API call)
    setTimeout(() => {
      if (username === DEMO_USER && password === DEMO_PASS) {
        sessionStorage.setItem('agropulse_user', username);
        sessionStorage.setItem('agropulse_auth', 'true');
        window.location.href = 'pages/painel.html';
      } else {
        // Accept any non-empty credentials for demo purposes
        sessionStorage.setItem('agropulse_user', username);
        sessionStorage.setItem('agropulse_auth', 'true');
        window.location.href = 'pages/painel.html';
      }
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    // Remove error styling on input
    document.querySelectorAll('.form-field input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = document.getElementById(input.id.replace('Input', '') + 'Error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  });
})();
