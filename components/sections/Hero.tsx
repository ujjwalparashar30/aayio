'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'
import { CardStack } from '@/components/ui/card-stack'
import Link from 'next/link'



export default function Hero() {
  const marketCards = [
    {
      id: 1,
      name: "2024 US Election",
      designation: "Political Market",
      content: (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white font-bold">YES: $0.67</span>
            <span className="text-gray-600 dark:text-gray-400 font-bold">NO: $0.33</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Volume: $2.4M</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-black dark:bg-white h-2 rounded-full transition-colors duration-300" style={{width: '67%'}}></div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: "Bitcoin $100k",
      designation: "Crypto Market",
      content: (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white font-bold">YES: $0.42</span>
            <span className="text-gray-600 dark:text-gray-400 font-bold">NO: $0.58</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Volume: $1.8M</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-black dark:bg-white h-2 rounded-full transition-colors duration-300" style={{width: '42%'}}></div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: "AI Breakthrough",
      designation: "Tech Market",
      content: (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white font-bold">YES: $0.78</span>
            <span className="text-gray-600 dark:text-gray-400 font-bold">NO: $0.22</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Volume: $950K</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-black dark:bg-white h-2 rounded-full transition-colors duration-300" style={{width: '78%'}}></div>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 dark:from-gray-900 to-transparent transition-colors duration-300" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroHighlight>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-6 text-black dark:text-white leading-tight transition-colors duration-300"
          >
            Predict. Trade.{" "}
            <Highlight className="text-gray-600 dark:text-gray-300">
              Own the Outcome.
            </Highlight>
          </motion.h1>
        </HeroHighlight>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto text-center leading-relaxed transition-colors duration-300"
        >
          Professional prediction markets powered by automated market makers. 
          Trade on real-world events with instant liquidity and fair pricing.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
        >
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
            >
              Start Trading <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </Link>
          
          <Link href="#features">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 rounded-lg font-semibold text-base sm:text-lg text-black dark:text-white transition-colors duration-200"
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Card Stack Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex justify-center px-4"
        >
          <div className="w-full max-w-sm sm:max-w-md">
            <CardStack items={marketCards} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
