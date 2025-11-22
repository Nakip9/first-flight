const translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
  if (translations[lang]) return translations[lang];
  const response = await fetch(`/static/translations/${lang}.json`);
  if (!response.ok) throw new Error('Failed to load translations');
  const data = await response.json();
  translations[lang] = data;
  return data;
}

function applyTranslations(dictionary) {
  document.documentElement.lang = currentLang;
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = key.split('.').reduce((obj, part) => obj && obj[part], dictionary);
    if (value) el.textContent = value;
  });
}

export async function setLanguage(lang) {
  currentLang = lang;
  const dict = await loadLanguage(lang);
  applyTranslations(dict);
}

export function initI18n(defaultLang = 'en') {
  const switcher = document.getElementById('language-switcher');
  if (!switcher) return;

  switcher.value = defaultLang;
  setLanguage(defaultLang);

  switcher.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });
}
