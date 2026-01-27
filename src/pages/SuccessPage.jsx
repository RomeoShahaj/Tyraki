import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function SuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)

  const sessionId = searchParams.get('session_id')

  const copySessionId = async () => {
    if (sessionId) {
      try {
        await navigator.clipboard.writeText(sessionId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-icon">✅</div>
        <h1 className="page-title success">{t('success.title')}</h1>
        <p className="page-description">{t('success.description')}</p>

        <div className="session-box">
          <div className="session-label">{t('success.session_label')}</div>
          <div className="session-id">
            {sessionId || t('success.not_found')}
          </div>
          <button className="copy-btn" onClick={copySessionId}>
            {copied ? t('success.copied') : t('success.copy_button')}
          </button>
        </div>

        <div className="instructions-box">
          <h3>{t('success.next_steps')}</h3>
          <ol>
            <li>{t('success.step1')}</li>
            <li>{t('success.step2')}</li>
            <li>{t('success.step3')}</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
