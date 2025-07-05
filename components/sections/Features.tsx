'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Globe, Users, BarChart3 } from 'lucide-react'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { BackgroundGradient } from '@/components/ui/background-gradient'

const features = [
  {
    title: "Instant Liquidity",
    description: "Trade instantly with our automated market maker. No waiting for counterparties.",
    header: (
      <BackgroundGradient className="rounded-[22px] p-8 bg-black">
        <div className="flex justify-center">
          <Zap className="w-12 h-12 text-blue-500" />
        </div>
      </BackgroundGradient>
    ),
    icon: <Zap className="w-4 h-4 text-neutral-500" />
  },
  {
    title: "Secure & Transparent",
    description: "Built on proven DeFi principles with full transparency and security.",
    header: (
      <BackgroundGradient className="rounded-[22px] p-8 bg-black">
        <div className="flex justify-center">
          <Shield className="w-12 h-12 text-green-500" />
        </div>
      </BackgroundGradient>
    ),
    icon: <Shield className="w-4 h-4 text-neutral-500" />
  },
  {
    title: "Fair Pricing",
    description: "Dynamic pricing ensures fair market value for all participants.",
    header: (
      <BackgroundGradient className="rounded-[22px] p-8 bg-black">
        <div className="flex justify-center">
          <TrendingUp className="w-12 h-12 text-purple-500" />
        </div>
      </BackgroundGradient>
    ),
    icon: <TrendingUp className="w-4 h-4 text-neutral-500" />
  },
  {
    title: "Global Markets",
    description: "Access prediction markets from around the world, covering politics, sports, crypto, and more.",
    header: (
      <BackgroundGradient className="rounded-[22px] p-8 bg-black">
        <div className="flex justify-center">
          <Globe className="w-12 h-12 text-cyan-500" />
        </div>
      </BackgroundGradient>
    ),
    icon: <Globe className="w-4 h-4 text-neutral-500" />
  },
  {
    title: "Community Driven",
    description: "Join thousands of traders making predictions and earning rewards.",
    header: (
      <BackgroundGradient className="rounded-[22px] p-8 bg-black">
        <div className="flex justify-center">
          <Users className="w-12 h-12 text-orange-500" />
        </div>
      </BackgroundGradient>
    ),
    icon: <Users className="w-4 h-4 text-neutral-500" />
  },
  {
    title: "Advanced Analytics",
    description: "Get detailed insights and analytics to make informed trading decisions.",
    header: (
      <BackgroundGradient className="rounded-[22px] p-8 bg-black">
        <div className="flex justify-center">
          <BarChart3 className="w-12 h-12 text-pink-500" />
        </div>
      </BackgroundGradient>
    ),
    icon: <BarChart3 className="w-4 h-4 text-neutral-500" />
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
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
