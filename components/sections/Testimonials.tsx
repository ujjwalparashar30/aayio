'use client'

import { motion } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'
import { BackgroundGradient } from '@/components/ui/background-gradient'

const testimonials = [
  {
    quote: "Professional grade tools for serious traders. The AMM model is game-changing for prediction markets.",
    name: "Alex Chen",
    title: "Quantitative Trader"
  },
  {
    quote: "Finally, a platform that gets liquidity right. No more waiting for counterparties or dealing with slippage.",
    name: "Sarah Kim",
    title: "DeFi Researcher"
  },
  {
    quote: "The transparency and fair pricing make this my go-to prediction market platform. Highly recommended.",
    name: "Mike Ross",
    title: "Crypto Investor"
  },
  {
    quote: "Outstanding user experience and the automated market maker works flawlessly. This is the future of prediction markets.",
    name: "Emma Wilson",
    title: "Hedge Fund Manager"
  },
  {
    quote: "Love the instant settlement and 24/7 trading. Perfect for active traders who need reliable execution.",
    name: "David Park",
    title: "Day Trader"
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Join the Future of Trading
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Trusted by traders and institutions worldwide
          </p>
        </motion.div>
        
        {/* Infinite Moving Cards */}
        <div className="mb-16">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
        
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { number: "$50M+", label: "Total Volume Traded" },
            { number: "10K+", label: "Active Traders" },
            { number: "99.9%", label: "Uptime Guarantee" }
          ].map((stat, index) => (
            <BackgroundGradient key={index} className="rounded-lg p-[2px]">
              <div className="bg-black rounded-lg p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            </BackgroundGradient>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* <SignInButton mode="modal"> */}
            <BackgroundGradient className="rounded-lg p-[2px] bg-gradient-to-r from-blue-500 to-purple-600">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black rounded-lg font-semibold text-lg hover:bg-gray-900 transition-colors"
              >
                Get Early Access
              </motion.button>
            </BackgroundGradient>
          {/* </SignInButton> */}
        </motion.div>
      </div>
    </section>
  )
}
