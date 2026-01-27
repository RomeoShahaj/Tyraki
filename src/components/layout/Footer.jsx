import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer>
      <div className="container footer-inner">
        <div className="footer-links">
          <a href="/privacy.html">{t('footer.privacy')}</a>
          <a href="/terms.html">{t('footer.terms')}</a>
          <a href="/faq.html">{t('footer.faq')}</a>
          <a href="mailto:hello@tyraki.gr">{t('footer.contact')}</a>
        </div>
        <div className="footer-copy">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
