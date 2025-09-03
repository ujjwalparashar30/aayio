'use client'

import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Zap, Shield, Users, BarChart3, Wallet, Target, Star } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'

export default function HomePage() {
  const { isSignedIn } = useUser()

  const features = [
    { icon: TrendingUp, title: 'Prediction Markets', description: 'Trade on real-world events and outcomes with dynamic pricing' },
    { icon: Zap, title: 'Instant Trading', description: 'Buy and sell prediction tokens instantly with automated market makers' },
    { icon: Shield, title: 'Play Money', description: 'Risk-free trading with virtual currency - learn without losing real money' },
    { icon: Users, title: 'P2P Trading', description: 'Trade directly with other users for better prices and liquidity' }
  ]

  const stats = [
    { label: 'Active Markets', value: '50+' },
    { label: 'Total Traders', value: '2,500+' },
    { label: 'Trade Volume', value: '₹10M+' },
    { label: 'Win Rate', value: '68%' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navigation />

      {/* Hero Section with glowing background */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background gradient like in old version */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 dark:from-gray-900 to-transparent transition-colors duration-300" />
        </div>

        <div className="relative z-10 text-center">
          <HeroHighlight>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-black dark:text-white leading-tight"
            >
              Predict the Future,{" "}
              <Highlight className="text-gray-600 dark:text-gray-300">
                Win Big! 🚀
              </Highlight>
            </motion.h1>
          </HeroHighlight>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Trade on real-world events with our fun prediction markets. Use play money to learn, compete with friends, and test your forecasting skills without any risk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              <Button size="lg" className="text-lg px-8 py-6 bg-black dark:bg-white text-white dark:text-black flex items-center gap-2">
                {isSignedIn ? 'Go to Dashboard' : 'Start Trading Free'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/markets">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Browse Markets
                <BarChart3 className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1 }}>
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <CardTitle className="text-3xl font-bold text-black dark:text-white">{stat.value}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{stat.label}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Why Choose PredictMarket? 🎯</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to start prediction trading, from beginner-friendly interfaces to advanced trading tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1 }}>
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 p-6 bg-white dark:bg-slate-800 rounded-2xl">
                  <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white dark:text-black" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{feature.description}</CardDescription>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">How It Works ⚡</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Get started in minutes with our simple 3-step process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Sign Up Free', description: 'Create your account and get ₹1000 play money to start trading.', icon: Users },
            { step: '2', title: 'Browse Markets', description: 'Explore prediction markets on sports, crypto, politics, and more.', icon: Target },
            { step: '3', title: 'Start Trading', description: 'Buy YES or NO tokens based on your predictions and earn rewards.', icon: Wallet }
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1 }} className="text-center p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition relative">
                <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-black dark:border-white">
                  <span className="text-sm font-bold text-black dark:text-white">{item.step}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">Ready to Predict the Future? 🔮</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">Join thousands of traders making smart predictions and earning rewards.</p>
          {!isSignedIn && (
            <Link href="/sign-up">
              <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black px-12 py-6 flex items-center gap-2 mx-auto">
                Start Trading Now - It's Free! <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">PM</span>
            </div>
            <span className="text-lg font-bold text-black dark:text-white">PredictMarket</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">© 2025 PredictMarket. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Made with ❤️ for prediction market enthusiasts</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
