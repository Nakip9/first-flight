import { initI18n } from './i18n.js';

function handleContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending...';
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
      status.textContent = 'Thanks! We received your message.';
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please try again later.';
      status.style.color = '#b00020';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initI18n('en');
  handleContactForm();
});
