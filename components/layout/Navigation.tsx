'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  BarChart3,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Target
} from 'lucide-react'
import { montserrat } from '@/lib/fonts'

const Navigation = () => {
  const pathname = usePathname()
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, protected: true },
    { href: '/markets', label: 'Markets', icon: TrendingUp },
    { href: '/wallet', label: 'Wallet', icon: Wallet, protected: true },
  ]

  const visibleNavItems = navItems.filter(item => !item.protected || isSignedIn)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-purple-900 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-semibold text-white tracking-tight ${montserrat.className}`}>
              PredictMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/10 text-white border border-white/20 shadow-lg hover:bg-white/15' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className={montserrat.className}>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 p-0 text-gray-300 hover:text-white hover:bg-white/10"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* User menu or auth buttons */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 p-2 h-auto text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
                  >
                    <Avatar className="w-8 h-8 ring-1 ring-white/20">
                      <AvatarImage src={user.imageUrl} alt={user.firstName || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-gray-800 to-purple-900 text-white">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className={`text-sm font-medium text-white ${montserrat.className}`}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-gray-900/95 backdrop-blur-lg border-white/20 text-white"
                >
                  <DropdownMenuLabel className={`text-gray-200 ${montserrat.className}`}>
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link href="/wallet" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-gray-300 hover:text-white hover:bg-white/10 ${montserrat.className}`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    size="sm" 
                    className={`bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 shadow-lg ${montserrat.className}`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0 text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              <div className="space-y-2">
                {visibleNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={`w-full justify-start flex items-center gap-2 ${
                          isActive 
                            ? 'bg-white/10 text-white border border-white/20' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className={montserrat.className}>{item.label}</span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navigation
