'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
// import { SignInButton } from '@clerk/nextjs'
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'
import { SparklesCore } from '@/components/ui/sparkles'
import { CardStack } from '@/components/ui/card-stack'
import { BackgroundGradient } from '@/components/ui/background-gradient'

export default function Hero() {
  const marketCards = [
    {
      id: 1,
      name: "2024 US Election",
      designation: "Political Market",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-green-400 font-bold">YES: $0.67</span>
            <span className="text-red-400 font-bold">NO: $0.33</span>
          </div>
          <div className="text-sm text-gray-400">Volume: $2.4M</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '67%'}}></div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: "Bitcoin $100k",
      designation: "Crypto Market",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-green-400 font-bold">YES: $0.42</span>
            <span className="text-red-400 font-bold">NO: $0.58</span>
          </div>
          <div className="text-sm text-gray-400">Volume: $1.8M</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '42%'}}></div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: "AI Breakthrough",
      designation: "Tech Market",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-green-400 font-bold">YES: $0.78</span>
            <span className="text-red-400 font-bold">NO: $0.22</span>
          </div>
          <div className="text-sm text-gray-400">Volume: $950K</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#3B82F6"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <HeroHighlight>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-center mb-6"
          >
            Predict. Trade.{" "}
            <Highlight className="text-black dark:text-white">
              Own the Outcome.
            </Highlight>
          </motion.h1>
        </HeroHighlight>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto text-center"
        >
          Professional prediction markets powered by automated market makers. 
          Trade on real-world events with instant liquidity and fair pricing.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          {/* <SignInButton mode="modal"> */}
            <BackgroundGradient className="rounded-lg p-[2px] bg-gradient-to-r from-blue-500 to-purple-600">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black rounded-lg font-semibold text-lg flex items-center gap-2 hover:bg-gray-900 transition-colors"
              >
                Start Trading <ArrowRight className="w-5 h-5" />
              </motion.button>
            </BackgroundGradient>
          {/* </SignInButton> */}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold text-lg transition-colors"
          >
            Learn More
          </motion.button>
        </motion.div>
        
        {/* Card Stack Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex justify-center"
        >
          <CardStack items={marketCards} />
        </motion.div>
      </div>
    </section>
  )
}
