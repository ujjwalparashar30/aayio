'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Globe, Users, BarChart3 } from 'lucide-react'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'

const features = [
  {
    title: "Instant Liquidity",
    description: "Trade instantly with our automated market maker. No waiting for counterparties.",
    header: (
      <div className="rounded-lg p-8 bg-gray-900 border border-gray-800">
        <div className="flex justify-center">
          <Zap className="w-12 h-12 text-white" />
        </div>
      </div>
    ),
    icon: <Zap className="w-4 h-4 text-gray-400" />
  },
  {
    title: "Secure & Transparent",
    description: "Built on proven DeFi principles with full transparency and security.",
    header: (
      <div className="rounded-lg p-8 bg-gray-900 border border-gray-800">
        <div className="flex justify-center">
          <Shield className="w-12 h-12 text-white" />
        </div>
      </div>
    ),
    icon: <Shield className="w-4 h-4 text-gray-400" />
  },
  {
    title: "Fair Pricing",
    description: "Dynamic pricing ensures fair market value for all participants.",
    header: (
      <div className="rounded-lg p-8 bg-gray-900 border border-gray-800">
        <div className="flex justify-center">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
      </div>
    ),
    icon: <TrendingUp className="w-4 h-4 text-gray-400" />
  },
  {
    title: "Global Markets",
    description: "Access prediction markets from around the world, covering politics, sports, crypto, and more.",
    header: (
      <div className="rounded-lg p-8 bg-gray-900 border border-gray-800">
        <div className="flex justify-center">
          <Globe className="w-12 h-12 text-white" />
        </div>
      </div>
    ),
    icon: <Globe className="w-4 h-4 text-gray-400" />
  },
  {
    title: "Community Driven",
    description: "Join thousands of traders making predictions and earning rewards.",
    header: (
      <div className="rounded-lg p-8 bg-gray-900 border border-gray-800">
        <div className="flex justify-center">
          <Users className="w-12 h-12 text-white" />
        </div>
      </div>
    ),
    icon: <Users className="w-4 h-4 text-gray-400" />
  },
  {
    title: "Advanced Analytics",
    description: "Get detailed insights and analytics to make informed trading decisions.",
    header: (
      <div className="rounded-lg p-8 bg-gray-900 border border-gray-800">
        <div className="flex justify-center">
          <BarChart3 className="w-12 h-12 text-white" />
        </div>
      </div>
    ),
    icon: <BarChart3 className="w-4 h-4 text-gray-400" />
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 relative bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Built for the Future of Trading
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of prediction markets with cutting-edge technology
          </p>
        </motion.div>
        
        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
