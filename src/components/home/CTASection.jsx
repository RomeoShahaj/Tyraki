import { useTranslation } from 'react-i18next'

function CTASection() {
  const { t } = useTranslation()

  const handleClick = (e) => {
    e.preventDefault()
    document.getElementById('uploadZone')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="cta-section reveal">
      <div className="container">
        <div className="cta-box">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <button className="cta-button" onClick={handleClick}>
            <span>{t('cta.button')}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CTASection
