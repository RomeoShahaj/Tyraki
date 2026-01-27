import { useTranslation } from 'react-i18next'
import UploadZone from './UploadZone'

function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>{t('hero.badge')}</span>
        </div>

        <h1>
          {t('hero.title')}<br />
          <span className="highlight">{t('hero.title_highlight')}</span>
        </h1>

        <p className="hero-subtitle">
          {t('hero.subtitle')}
        </p>

        <div className="upload-guidance">
          <div className="guidance-icon">💡</div>
          <div className="guidance-text">
            <strong>{t('guidance.title')}</strong>{' '}
            <span>{t('guidance.text')}</span>
          </div>
        </div>

        <UploadZone />

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">&lt;90"</div>
            <div className="hero-stat-label">{t('hero.stat_analysis')}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">€1,847</div>
            <div className="hero-stat-label">{t('hero.stat_savings')}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">{t('hero.stat_local')}</div>
          </div>
        </div>

        <div className="upload-trust">
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <div className="trust-text">
              <strong>{t('trust.security_title')}</strong>
              <p>{t('trust.security_desc')}</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">⚡</div>
            <div className="trust-text">
              <strong>{t('trust.fast_title')}</strong>
              <p>{t('trust.fast_desc')}</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">📅</div>
            <div className="trust-text">
              <strong>{t('trust.months_title')}</strong>
              <p>{t('trust.months_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
