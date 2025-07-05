'use client'

import { WavyBackground } from '@/components/ui/wavy-background'
import Logo from '../icons/Logo'

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'Twitter', href: '#' }
]

export default function Footer() {
  return (
    <footer className="relative">
      <WavyBackground className="max-w-full mx-auto pb-40" backgroundFill="black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Logo />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                PredictMarket
              </span>
            </div>
            <div className="flex space-x-8 text-gray-400">
              {footerLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="hover:text-white transition-colors relative z-10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 relative z-10">
            © 2025 PredictMarket. All rights reserved.
          </div>
        </div>
      </WavyBackground>
    </footer>
  )
}
