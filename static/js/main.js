import { initI18n, setLanguage } from './i18n.js';

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
}

function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.08;
    hero.style.setProperty('--parallax', `${offset}px`);
  });
}

function initLazyImages() {
  const lazyImages = document.querySelectorAll('.lazy-image');
  if (!lazyImages.length) return;

  const loader = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.onload = () => img.parentElement?.classList.remove('skeleton');
      }
      obs.unobserve(img);
    });
  });

  lazyImages.forEach((img) => loader.observe(img));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString();
        }, 16);
        obs.unobserve(el);
      });
    },
    { threshold: 0.2 }
  );

  counters.forEach((el) => observer.observe(el));
}

function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      if (!target) return;

      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${target}`);
      });
    });
  });
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('language-switcher');
  const wrap = document.getElementById('switcher-wrap');
  if (!switcher || !wrap) return;

  switcher.addEventListener('change', (event) => {
    wrap.classList.add('flipping');
    const lang = event.target.value;
    setLanguage(lang).finally(() => {
      setTimeout(() => wrap.classList.remove('flipping'), 450);
    });
  });
}

function initPageTransitions() {
  document.body.classList.add('page-ready');
}

window.addEventListener('DOMContentLoaded', () => {
  initI18n('en');
  initScrollReveal();
  initParallax();
  initLazyImages();
  initCounters();
  initTabs();
  initLanguageSwitcher();
  initPageTransitions();
});
