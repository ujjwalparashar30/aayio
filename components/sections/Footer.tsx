'use client'

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
    <footer className="relative bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo />
            <span className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">
              PredictMarket
            </span>
          </div>
          <div className="flex space-x-8 text-gray-600 dark:text-gray-400">
            {footerLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
          © 2025 PredictMarket. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
