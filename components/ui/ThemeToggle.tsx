'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-9 h-9 flex items-center justify-center">
        <div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <motion.div
          initial={false}
          animate={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-5 h-5 text-gray-700" />
        </motion.div>
      ) : (
        <Moon className="w-5 h-5 text-gray-300" />
      )}
    </motion.button>
  )
}
