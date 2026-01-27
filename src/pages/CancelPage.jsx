import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function CancelPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-icon">↩️</div>
        <h1 className="page-title cancel">{t('cancel_page.title')}</h1>
        <p className="page-description">{t('cancel_page.description')}</p>

        <div className="page-buttons">
          <a href="/api/create-checkout" className="btn btn-primary">
            {t('cancel_page.retry')}
          </a>
          <Link to="/" className="btn btn-secondary">
            {t('cancel_page.return')}
          </Link>
        </div>

        <div className="info-box">
          <h3>{t('cancel_page.remember')}</h3>
          <ul>
            <li>{t('cancel_page.point1')}</li>
            <li>{t('cancel_page.point2')}</li>
            <li>{t('cancel_page.point3')}</li>
            <li>{t('cancel_page.point4')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CancelPage
