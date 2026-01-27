import { useTranslation } from 'react-i18next'

const testimonials = [
  {
    initials: 'ΜΚ',
    name: 'Μαρία Κ.',
    handle: '@maria_kwnst',
    content: 'Δεν πίστευα ότι είχα τόσες συνδρομές! Netflix, Spotify, 3 gym memberships που ξέχασα να ακυρώσω... Το Τυράκι τα βρήκε όλα 🔥',
    savings: '€2,847',
    likes: '234',
    shares: '45',
    date: '12 Δεκ 2024'
  },
  {
    initials: 'ΓΠ',
    name: 'Γιώργος Π.',
    handle: '@giwrgos_pap',
    content: 'Cosmote TV, Wind συνδρομή που δεν χρησιμοποιούσα, κάτι Adobe που είχα ξεχάσει από το 2021... €180/μήνα πήγαιναν χαμένα!',
    savings: '€2,160',
    likes: '189',
    shares: '38',
    date: '8 Δεκ 2024'
  },
  {
    initials: 'ΕΛ',
    name: 'Ελένη Λ.',
    handle: '@eleni_leon',
    content: 'Μου βρήκε 12 συνδρομές! Κράτησα μόνο 4. Η ακύρωση του γυμναστηρίου ήταν εφιάλτης αλλά το Τυράκι μου έδωσε τα βήματα 🙌',
    savings: '€1,524',
    likes: '312',
    shares: '67',
    date: '5 Δεκ 2024'
  },
  {
    initials: 'ΝΜ',
    name: 'Νίκος Μ.',
    handle: '@nikos_mak',
    content: 'Ήμουν σκεπτικός αλλά τα €3 άξιζαν 1000%. Βρήκε iCloud, YouTube Premium, LinkedIn Premium που ποτέ δεν χρησιμοποίησα 😅',
    savings: '€756',
    likes: '156',
    shares: '29',
    date: '2 Δεκ 2024'
  },
  {
    initials: 'ΑΣ',
    name: 'Αντώνης Σ.',
    handle: '@antonis_sot',
    content: 'Ρε παιδιά είχα 2 Netflix accounts 🤦‍♂️ Το ένα από τότε που χώρισα και ξέχασα να αλλάξω κάρτα. 2 χρόνια το πλήρωνα!',
    savings: '€311',
    likes: '423',
    shares: '89',
    date: '28 Νοε 2024'
  },
  {
    initials: 'ΚΒ',
    name: 'Κατερίνα Β.',
    handle: '@katerina_vas',
    content: 'Τέλειο για όποιον έχει χάσει τον έλεγχο με τις συνδρομές. Εγώ είχα 18 συνδρομές!!! Κράτησα 6. Τώρα ξέρω ακριβώς τι πληρώνω.',
    savings: '€3,240',
    likes: '567',
    shares: '124',
    date: '25 Νοε 2024'
  }
]

function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="social-proof reveal" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>{t('testimonials.title')}</h2>
          <p>{t('testimonials.subtitle')}</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.initials}</div>
                <div className="testimonial-author">
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-handle">{testimonial.handle}</div>
                </div>
                <span className="testimonial-x-logo">𝕏</span>
              </div>
              <p className="testimonial-content">{testimonial.content}</p>
              <div className="testimonial-savings">
                💰 Εξοικονόμηση: {testimonial.savings}/χρόνο
              </div>
              <div className="testimonial-meta">
                <span>❤️ {testimonial.likes}</span>
                <span>🔄 {testimonial.shares}</span>
                <span>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
