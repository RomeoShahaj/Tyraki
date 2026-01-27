import { useEffect } from 'react'
import HeroSection from '../components/home/HeroSection'
import PricingSection from '../components/home/PricingSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import CTASection from '../components/home/CTASection'
import ResultsModal from '../components/modals/ResultsModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'

function HomePage() {
  // Scroll reveal animations
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')

    const revealOnScroll = () => {
      reveals.forEach(el => {
        const windowHeight = window.innerHeight
        const elementTop = el.getBoundingClientRect().top
        const revealPoint = 150

        if (elementTop < windowHeight - revealPoint) {
          el.classList.add('visible')
        }
      })
    }

    window.addEventListener('scroll', revealOnScroll)
    revealOnScroll() // Initial check

    return () => window.removeEventListener('scroll', revealOnScroll)
  }, [])

  return (
    <>
      <HeroSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <ResultsModal />
      <ConfirmationModal />
    </>
  )
}

export default HomePage
