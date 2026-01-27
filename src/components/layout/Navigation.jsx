import { useTranslation } from 'react-i18next'

function Navigation() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <nav>
      <div className="container nav-inner">
        <a href="/" className="logo">
          <span className="logo-icon">🧀</span>
          <span>{t('nav.logo')}</span>
        </a>
        <div className="nav-links">
          <a href="#pricing">{t('nav.pricing')}</a>
          <a href="#testimonials">{t('nav.testimonials')}</a>
          <a href="#tutorial">{t('nav.tutorial')}</a>
        </div>
        <div className="language-switcher">
          <button
            className={`lang-btn ${currentLang === 'el' ? 'active' : ''}`}
            onClick={() => switchLanguage('el')}
          >
            ΕΛ
          </button>
          <span className="lang-separator">/</span>
          <button
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => switchLanguage('en')}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
