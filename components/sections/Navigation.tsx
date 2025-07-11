// components/sections/Navigation.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth, useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Logo from '../icons/Logo'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  
  const navItems = [
    { title: "Features", href: "#features" },
    { title: "How It Works", href: "#how-it-works" },
    { title: "Why Us", href: "#comparison" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  const userFirstName = user?.firstName || user?.username || 'User'

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <Link href="/" className="flex items-center gap-2 z-50">
              <Logo />
              <span className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
                PredictMarket
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.title} href={item.href}>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 rounded-md">
                    {item.title}
                  </button>
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              {isLoaded && (
                <>
                  {isSignedIn && user ? (
                    <div className="flex items-center gap-3">
                      <Link href="/dashboard">
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                          Dashboard
                        </button>
                      </Link>
                      <span className="text-sm text-gray-600 dark:text-gray-400 hidden xl:block">
                        Welcome, {userFirstName}
                      </span>
                      <UserButton />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link href="/sign-in">
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                          Sign In
                        </button>
                      </Link>
                      <Link href="/sign-up">
                        <button className="px-4 py-2 text-sm font-medium bg-gray-800 dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-200">
                          Get Started
                        </button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(!isMenuOpen)
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 z-50"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-l border-gray-200 dark:border-gray-800 z-50 lg:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">Menu</span>
                </div>

                <div className="flex-1 px-6 py-8">
                  <div className="space-y-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  {isLoaded && (
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                      {isSignedIn && user ? (
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Welcome, {userFirstName}!
                          </div>
                          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full text-left text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                              Dashboard
                            </button>
                          </Link>
                          <div className="flex items-center gap-3 pt-4">
                            <UserButton />
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Account</span>
                              {user.emailAddresses?.[0]?.emailAddress && (
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  {user.emailAddresses[0].emailAddress}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full text-left text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                              Sign In
                            </button>
                          </Link>
                          <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full px-4 py-3 text-sm font-medium bg-gray-800 dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-200 text-center">
                              Get Started
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
