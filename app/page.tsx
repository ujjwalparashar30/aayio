import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import Comparison from '@/components/sections/Comparison'
import Testimonials from '@/components/sections/Testimonials'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <Footer />
    </div>
  )
}
