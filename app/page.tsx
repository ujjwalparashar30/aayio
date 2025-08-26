'use client'

import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Zap,
  Shield,
  Users,
  ArrowRight,
  BarChart3,
  Wallet,
  Target,
  Star
} from 'lucide-react'

const HomePage = () => {
  const { isSignedIn } = useUser()

  const features = [
    {
      icon: TrendingUp,
      title: 'Prediction Markets',
      description: 'Trade on real-world events and outcomes with dynamic pricing'
    },
    {
      icon: Zap,
      title: 'Instant Trading',
      description: 'Buy and sell prediction tokens instantly with automated market makers'
    },
    {
      icon: Shield,
      title: 'Play Money',
      description: 'Risk-free trading with virtual currency - learn without losing real money'
    },
    {
      icon: Users,
      title: 'P2P Trading',
      description: 'Trade directly with other users for better prices and liquidity'
    }
  ]

  const stats = [
    { label: 'Active Markets', value: '50+' },
    { label: 'Total Traders', value: '2,500+' },
    { label: 'Trade Volume', value: '₹10M+' },
    { label: 'Win Rate', value: '68%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-6 text-sm font-medium px-4 py-2">
              🎮 Now in Beta - Join the Fun!
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Predict the Future,
              <br />
              Win Big! 🚀
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Trade on real-world events with our fun prediction markets. Use play money to learn, 
              compete with friends, and test your forecasting skills without any risk.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Start Trading Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              
              <Link href="/markets">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Browse Markets
                  <BarChart3 className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose PredictMarket? 🎯
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to start prediction trading, from beginner-friendly interfaces to advanced trading tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              How It Works ⚡
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple 3-step process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up Free',
                description: 'Create your account and get ₹1000 play money to start trading',
                icon: Users
              },
              {
                step: '2',
                title: 'Browse Markets',
                description: 'Explore prediction markets on sports, crypto, politics, and more',
                icon: Target
              },
              {
                step: '3',
                title: 'Start Trading',
                description: 'Buy YES or NO tokens based on your predictions and earn rewards',
                icon: Wallet
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                  className="text-center"
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-blue-500">
                      <span className="text-sm font-bold text-blue-500">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Predict the Future? 🔮
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of traders making smart predictions and earning rewards
            </p>
            
            {!isSignedIn && (
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Start Trading Now - It's Free! 🚀
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="text-lg font-bold">PredictMarket</span>
          </div>
          <p className="text-muted-foreground mb-4">
            © 2025 PredictMarket. All rights reserved. Trade responsibly with play money.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-muted-foreground">
              Made with ❤️ for prediction market enthusiasts
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
