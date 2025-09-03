'use client'

import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowRight, Users, BarChart3, Wallet, Target, Star, Sparkles, Rocket, Crown, LineChart, Clock, HandCoins, Building } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'
import { montserrat } from '@/lib/fonts'

export default function HomePage() {
  const { isSignedIn } = useUser()

  const features = [
    { icon: LineChart, title: 'Prediction Markets', description: 'Trade on real-world events and outcomes with dynamic pricing' },
    { icon: Clock, title: 'Instant Trading', description: 'Buy and sell prediction tokens instantly with automated market makers' },
    { icon: HandCoins, title: 'Play Money', description: 'Risk-free trading with virtual currency - learn without losing real money' },
    { icon: Building, title: 'P2P Trading', description: 'Trade directly with other users for better prices and liquidity' }
  ]

  const stats = [
    { label: 'Active Markets', value: '50+' },
    { label: 'Total Traders', value: '2,500+' },
    { label: 'Trade Volume', value: '₹10M+' },
    { label: 'Win Rate', value: '68%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-purple-950/40 transition-all duration-500">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
        {/* Animated gradient accents */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-24 left-10 w-72 h-72 bg-purple-800/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-24 right-10 w-96 h-96 bg-indigo-800/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center">
          <HeroHighlight>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className={`text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight ${montserrat.className}`}>
                Predict the Future..
              </h1>
              <div className="flex items-center justify-center gap-6 my-6">
                <Rocket className="w-16 h-16 md:w-20 md:h-20 text-white animate-bounce" />
              </div>
              <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight ${montserrat.className}`}>
                <Highlight className="text-gray-100">
                  Win Big!!
                </Highlight>
              </h1>
            </motion.div>
          </HeroHighlight>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Trade on real-world events with sleek prediction markets. Use play money to learn, compete, and sharpen your forecasting skills risk‑free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-200 hover:to-gray-300 flex items-center gap-2 shadow-2xl rounded-2xl">
                {isSignedIn ? 'Go to Dashboard' : 'Start Trading Free'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/markets">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-md rounded-2xl">
                Browse Markets
                <BarChart3 className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1 }}>
              <Card className="p-6 text-center bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:shadow-xl">
                <CardTitle className={`text-3xl font-bold text-white mb-2 ${montserrat.className}`}>{stat.value}</CardTitle>
                <CardDescription className="text-gray-400 font-medium">{stat.label}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-r from-zinc-900/60 to-gray-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 text-gray-100 tracking-tight ${montserrat.className}`}>
            Why Choose PredictMarket
            <Target className="inline-block w-8 h-8 ml-3 text-white" />
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to start prediction trading — beginner-friendly and powerful tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1 }}>
                <Card className="h-full text-center p-8 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`text-xl font-semibold text-white mb-3 ${montserrat.className}`}>{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">{feature.description}</CardDescription>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 text-gray-100 tracking-tight ${montserrat.className}`}>
            How It Works
            <Sparkles className="inline-block w-8 h-8 ml-3 text-white" />
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Get started in minutes with our simple 3‑step process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Sign Up Free', description: 'Create your account and get ₹1000 play money to start trading.', icon: Users },
            { step: '2', title: 'Browse Markets', description: 'Explore prediction markets on sports, crypto, politics, and more.', icon: Target },
            { step: '3', title: 'Start Trading', description: 'Buy YES or NO tokens and earn rewards based on your predictions.', icon: Wallet }
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.1 }} className="text-center p-8 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 text-white ${montserrat.className}`}>{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                  <span className={`text-sm font-bold text-white ${montserrat.className}`}>{item.step}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 text-center bg-gradient-to-r from-purple-950/30 to-zinc-900/30 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className={`text-4xl font-bold mb-6 text-gray-100 tracking-tight ${montserrat.className}`}>
            Ready to Predict the Future
            <Crown className="inline-block w-8 h-8 ml-3 text-white" />
          </h2>
          <p className="text-lg text-gray-400 mb-10">Join thousands of traders making smart predictions every day.</p>
          {!isSignedIn && (
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-200 hover:to-gray-300 px-12 py-6 flex items-center gap-2 mx-auto shadow-2xl rounded-2xl">
                Start Trading Now — It’s Free! <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-white/15">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md border border-white/30">
              <span className={`text-white font-bold text-sm ${montserrat.className}`}>PM</span>
            </div>
            <span className={`text-lg font-semibold text-white ${montserrat.className}`}>PredictMarket</span>
          </div>
          <p className="text-gray-400 mb-4">© 2025 PredictMarket. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-500">Made with ❤️ for prediction market enthusiasts</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
