import { useTranslation } from 'react-i18next'
import { useApp } from '../../contexts/AppContext'

function ConfirmationModal() {
  const { t } = useTranslation()
  const {
    state,
    closeModal,
    openModal,
    setUnknownChargeConfirmation,
    setResults,
    clearUnknownConfirmations
  } = useApp()

  const { pendingResults, unknownChargesConfirmation } = state
  const isActive = state.activeModal === 'confirmation'

  if (!isActive || !pendingResults) return null

  const unknowns = pendingResults.unknowns || []
  const allAnswered = unknowns.every(u => unknownChargesConfirmation.hasOwnProperty(u.name))

  const handleConfirm = (name, isSubscription) => {
    setUnknownChargeConfirmation(name, isSubscription)
  }

  const handleProceed = () => {
    // Filter unknowns based on user confirmation
    const confirmedUnknowns = unknowns.filter(u => unknownChargesConfirmation[u.name] === true)

    // Combine known + confirmed unknowns
    const allSubscriptions = [...(pendingResults.known || []), ...confirmedUnknowns]

    // Recalculate totals
    const totalMonthly = allSubscriptions.reduce((sum, s) => sum + (s.monthly_cost || 0), 0)
    const totalYearly = totalMonthly * 12

    // Clear confirmation state
    clearUnknownConfirmations()

    // Set results and open results modal
    setResults({
      subscriptions: allSubscriptions,
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalYearly * 100) / 100,
      transactionsAnalyzed: pendingResults.transactionsAnalyzed
    })

    openModal('results')
  }

  const handleClose = () => {
    clearUnknownConfirmations()
    closeModal()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div className="modal-overlay active" onClick={handleOverlayClick}>
      <div className="modal confirmation-modal">
        <button className="modal-close" onClick={handleClose}>✕</button>
        <div className="modal-body">
          <div className="confirmation-header">
            <h2>{t('confirm.title')}</h2>
            <p>{t(unknowns.length === 1 ? 'confirm.subtitle_one' : 'confirm.subtitle', { count: unknowns.length })}</p>
          </div>

          <div className="unknown-charge-list">
            {unknowns.map((charge, index) => {
              const isConfirmed = unknownChargesConfirmation[charge.name] === true
              const isRejected = unknownChargesConfirmation[charge.name] === false
              const displayName = charge.name.length > 50
                ? charge.name.substring(0, 47) + '...'
                : charge.name

              return (
                <div
                  key={index}
                  className={`unknown-charge-item ${isConfirmed ? 'confirmed' : ''} ${isRejected ? 'rejected' : ''}`}
                >
                  <div className="charge-info">
                    <div className="charge-name">{displayName}</div>
                    <div className="charge-details">
                      <span>💰 €{charge.monthly_cost.toFixed(2)}{t('results.per_month')}</span>
                      <span>🔄 {t('confirm.times', { count: charge.occurrences })}</span>
                    </div>
                  </div>
                  <div className="charge-actions">
                    <button
                      className={`btn-confirm-charge ${isRejected ? 'no' : ''}`}
                      onClick={() => handleConfirm(charge.name, false)}
                    >
                      ❌ {t('confirm.no')}
                    </button>
                    <button
                      className={`btn-confirm-charge ${isConfirmed ? 'yes' : ''}`}
                      onClick={() => handleConfirm(charge.name, true)}
                    >
                      ✅ {t('confirm.yes_subscription')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            className="btn-proceed-results"
            onClick={handleProceed}
            disabled={!allAnswered}
          >
            {t('confirm.proceed')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
