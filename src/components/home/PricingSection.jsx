import { useTranslation } from 'react-i18next'

function PricingSection() {
  const { t } = useTranslation()

  return (
    <section className="pricing reveal" id="pricing">
      <div className="container">
        <div className="pricing-card">
          <div className="pricing-label">{t('pricing.label')}</div>
          <div className="pricing-value">
            <span>{t('pricing.value')}</span>
            <span>{t('pricing.per_analysis')}</span>
          </div>
          <p className="pricing-desc">{t('pricing.desc')}</p>
          <div className="pricing-free">{t('pricing.free')}</div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
