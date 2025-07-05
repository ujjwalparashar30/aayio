'use client'

import { motion } from 'framer-motion'
// import { SignInButton } from '@clerk/nextjs'
import { TrendingUp, Info, BarChart, Menu, X } from 'lucide-react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { BackgroundBeams } from '@/components/ui/background-beams'
import Logo from '../icons/Logo'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navItems = [
    { title: "Features", icon: <TrendingUp className="h-4 w-4" />, href: "#features" },
    { title: "How It Works", icon: <Info className="h-4 w-4" />, href: "#how-it-works" },
    { title: "Why Us", icon: <BarChart className="h-4 w-4" />, href: "#comparison" },
  ]

  return (
    <div className="relative">
      <BackgroundBeams className="absolute inset-0 z-0 opacity-20" />
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Logo />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              PredictMarket
            </span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <FloatingDock items={navItems} />
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* <SignInButton mode="modal"> */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium overflow-hidden group"
            >
              <span className="relative z-10">Start Trading</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          {/* </SignInButton> */}
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </div>
  )
}
