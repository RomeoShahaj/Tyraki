import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../contexts/AppContext'
import { categoryIcons, CANCEL_URLS, FREE_LIMIT } from '../../utils/constants'

function ResultsModal() {
  const { t, i18n } = useTranslation()
  const { state, closeModal, setSubscriptionCategory } = useApp()
  const [showCancellationGuide, setShowCancellationGuide] = useState(false)

  const {
    subscriptions,
    totalMonthly,
    totalYearly,
    transactionsAnalyzed,
    subscriptionCategories
  } = state

  const isActive = state.activeModal === 'results'
  const count = subscriptions.length
  const showPaywall = count > FREE_LIMIT
  const visibleCount = showPaywall ? 4 : count

  // Calculate savings from "cancel" subscriptions
  const totalMonthlySavings = subscriptions
    .filter(sub => subscriptionCategories[sub.name] === 'cancel')
    .reduce((sum, sub) => sum + sub.monthly_cost, 0)
  const totalYearlySavings = totalMonthlySavings * 12

  const getCategoryName = (category) => {
    return t(`category.${category || 'other'}`)
  }

  const handleCategorize = (name, category) => {
    setSubscriptionCategory(name, category)
  }

  const handleShowGuide = () => {
    setShowCancellationGuide(true)
  }

  const handleBackToResults = () => {
    setShowCancellationGuide(false)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
      setShowCancellationGuide(false)
    }
  }

  const toCancel = subscriptions.filter(sub => subscriptionCategories[sub.name] === 'cancel')

  if (!isActive) return null

  // Cancellation Guide View
  if (showCancellationGuide && toCancel.length > 0) {
    return (
      <div className="modal-overlay active" onClick={handleOverlayClick}>
        <div className="modal">
          <div className="modal-header">
            <h2>🎯 {t('cancel_guide.how_to_cancel')}</h2>
            <button className="modal-close" onClick={() => { closeModal(); setShowCancellationGuide(false) }}>×</button>
          </div>
          <div className="modal-body">
            <div className="cancellation-guide">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {t('cancel_guide.subtitle')}
              </p>

              {toCancel.map((sub, index) => {
                const cancelInfo = CANCEL_URLS[sub.name]
                const icon = categoryIcons[sub.category] || categoryIcons.other

                return (
                  <div key={index} className="cancel-card">
                    <h4>
                      <span>{icon}</span>
                      {sub.name}
                    </h4>
                    <p>
                      <strong>{t('cancel_guide.monthly_cost', { amount: sub.monthly_cost.toFixed(2) })}</strong>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {' '}({t('cancel_guide.yearly_cost', { amount: (sub.monthly_cost * 12).toFixed(2) })})
                      </span>
                    </p>

                    {cancelInfo ? (
                      cancelInfo.url ? (
                        <>
                          <p><strong>{t('cancel_guide.instructions')}</strong></p>
                          <a href={cancelInfo.url} target="_blank" rel="noopener noreferrer" className="cancel-url">
                            {t('action.cancel').replace('❌ ', '')} {sub.name}
                            <span>→</span>
                          </a>
                          {cancelInfo.notes && (
                            <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>{cancelInfo.notes}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <p><strong>{t('cancel_guide.how_to_cancel')}</strong></p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                            {cancelInfo.notes}
                          </p>
                        </>
                      )
                    ) : (
                      <>
                        <p><strong>{t('cancel_guide.general_title')}</strong></p>
                        <p style={{ fontSize: '0.85rem' }}>
                          {t('cancel_guide.general_steps').split('\n').map((step, i) => (
                            <span key={i}>{step}<br /></span>
                          ))}
                        </p>
                      </>
                    )}
                  </div>
                )
              })}

              <button className="guide-back-btn" onClick={handleBackToResults}>
                {t('cancel_guide.back_button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No subscriptions
  if (count === 0) {
    return (
      <div className="modal-overlay active" onClick={handleOverlayClick}>
        <div className="modal">
          <div className="modal-header">
            <h2>{t('results.modal_title')}</h2>
            <button className="modal-close" onClick={closeModal}>×</button>
          </div>
          <div className="modal-body">
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>{t('results.no_subscriptions')}</h3>
              <p>{t('results.no_subscriptions_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results View
  return (
    <div className="modal-overlay active" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{t('results.modal_title')}</h2>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="results-summary">
            <h3>{t(count === 1 ? 'results.title_one' : 'results.title', { count })}</h3>
            <div className="amount">€{totalYearly.toFixed(2)}{t('results.per_year')}</div>
            <div className="monthly">(€{totalMonthly.toFixed(2)}{t('results.per_month')})</div>
            <div className="results-stats">
              <div className="results-stat">
                <div className="results-stat-value">{count}</div>
                <div className="results-stat-label">{t('results.subscriptions')}</div>
              </div>
              <div className="results-stat">
                <div className="results-stat-value">{transactionsAnalyzed || '—'}</div>
                <div className="results-stat-label">transactions</div>
              </div>
            </div>
          </div>

          <div className="subscription-list">
            {subscriptions.map((sub, index) => {
              const isLocked = showPaywall && index >= visibleCount
              const icon = categoryIcons[sub.category] || categoryIcons.other
              const catName = getCategoryName(sub.category)
              const category = subscriptionCategories[sub.name]

              return (
                <div key={index} className="subscription-item-wrapper">
                  <div
                    className={`subscription-item ${isLocked ? 'locked' : ''} ${category ? `categorized category-${category}` : ''}`}
                    data-subscription={sub.name}
                  >
                    <div className="subscription-info">
                      <div className="subscription-icon">{icon}</div>
                      <div>
                        <div className="subscription-name">{sub.name}</div>
                        <div className="subscription-category">{catName}</div>
                      </div>
                    </div>
                    <div className="subscription-cost">
                      <div className="subscription-monthly">€{sub.monthly_cost.toFixed(2)}{t('results.per_month')}</div>
                      <div className="subscription-yearly">€{(sub.monthly_cost * 12).toFixed(2)}{t('results.per_year')}</div>
                    </div>
                  </div>
                  {!isLocked && (
                    <div className="subscription-actions">
                      <button
                        className={`btn-categorize cancel ${category === 'cancel' ? 'active' : ''}`}
                        onClick={() => handleCategorize(sub.name, 'cancel')}
                      >
                        {t('action.cancel')}
                      </button>
                      <button
                        className={`btn-categorize investigate ${category === 'investigate' ? 'active' : ''}`}
                        onClick={() => handleCategorize(sub.name, 'investigate')}
                      >
                        {t('action.investigate')}
                      </button>
                      <button
                        className={`btn-categorize keep ${category === 'keep' ? 'active' : ''}`}
                        onClick={() => handleCategorize(sub.name, 'keep')}
                      >
                        {t('action.keep')}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {showPaywall && (
            <div className="paywall-banner">
              <h4>{t('results.paywall_title')}</h4>
              <p>{t('results.paywall_desc', { count: count - visibleCount })}</p>
              <a href="/api/create-checkout" className="paywall-button">
                {t('results.paywall_button')}
                <span>→</span>
              </a>
            </div>
          )}

          {!showPaywall && (
            <div className="categorization-section">
              <h3>{t('results.categorization_title')}</h3>
              <p>{t('results.categorization_desc')}</p>

              {totalMonthlySavings > 0 && (
                <div className="savings-summary">
                  <h4>{t('results.savings_title')}</h4>
                  <div className="savings-amount">€{totalMonthlySavings.toFixed(2)}{t('results.per_month')}</div>
                  <div className="savings-yearly">(€{totalYearlySavings.toFixed(2)}{t('results.per_year')})</div>
                </div>
              )}

              <button
                className="btn-next-step"
                onClick={handleShowGuide}
                disabled={totalMonthlySavings === 0}
              >
                <span>{t('results.next_step')}</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultsModal
