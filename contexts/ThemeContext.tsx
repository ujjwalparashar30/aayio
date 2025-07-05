"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    const initialTheme = savedTheme || systemTheme
    setTheme(initialTheme)
    
    // Apply theme immediately
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(initialTheme)
    
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
