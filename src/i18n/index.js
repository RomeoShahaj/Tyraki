import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import el from './locales/el.json'
import en from './locales/en.json'

const savedLanguage = typeof localStorage !== 'undefined'
  ? localStorage.getItem('language')
  : null

const detectBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return 'el'
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang?.startsWith('el')) return 'el'
  if (browserLang?.startsWith('en')) return 'en'
  return 'el'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      el: { translation: el },
      en: { translation: en }
    },
    lng: savedLanguage || detectBrowserLanguage(),
    fallbackLng: 'el',
    interpolation: {
      escapeValue: false
    }
  })

// Persist language changes
i18n.on('languageChanged', (lng) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('language', lng)
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
})

export default i18n
