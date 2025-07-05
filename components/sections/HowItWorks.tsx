'use client'

import { motion } from 'framer-motion'
import { Timeline } from '@/components/ui/timeline'
import { Search, TrendingUp, Zap } from 'lucide-react'

export default function HowItWorks() {
  const timelineData = [
    {
      title: "Select Market",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg p-6 bg-gray-900 border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-8 h-8 text-white" />
              <h3 className="text-xl font-semibold text-white">Choose Your Market</h3>
            </div>
            <p className="text-gray-300">
              Browse through active prediction markets covering politics, sports, crypto, and technology. 
              Each market shows real-time pricing and volume data.
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Example Market</span>
                <span className="text-white font-bold">Active</span>
              </div>
              <div className="text-lg font-semibold mt-2 text-white">Will Bitcoin reach $100k in 2024?</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Auto Price Discovery",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg p-6 bg-gray-900 border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
              <h3 className="text-xl font-semibold text-white">Smart Pricing</h3>
            </div>
            <p className="text-gray-300">
              Our automated market maker calculates fair prices based on supply and demand. 
              No need to wait for counterparties - prices adjust automatically.
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex justify-between">
                <span className="text-white">YES: $0.67</span>
                <span className="text-gray-400">NO: $0.33</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Instant Settlement",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg p-6 bg-gray-900 border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="w-8 h-8 text-white" />
              <h3 className="text-xl font-semibold text-white">Lightning Fast</h3>
            </div>
            <p className="text-gray-300">
              Execute trades instantly with guaranteed liquidity. Our AMM ensures you can always 
              buy or sell at fair market prices without slippage concerns.
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Trade Executed</div>
              <div className="flex justify-between">
                <span className="text-white">Amount: 100 shares</span>
                <span className="text-white">✓ Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            How Our AMM Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Simple, efficient, and powered by automated market making
          </p>
        </motion.div>
        
        <Timeline data={timelineData} />
      </div>
    </section>
  )
}
