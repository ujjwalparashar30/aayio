'use client'

import { motion } from 'framer-motion'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { BackgroundGradient } from '@/components/ui/background-gradient'

const comparisonData = [
  ["Instant Liquidity", "✓", "✗"],
  ["Fair Pricing", "✓", "✗"],
  ["No Counterparty Risk", "✓", "✗"],
  ["24/7 Trading", "✓", "✗"],
  ["Low Fees", "✓", "✗"],
  ["Transparent Mechanics", "✓", "✗"]
]

const teamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    designation: "Quantitative Trader",
    image: "/api/placeholder/100/100"
  },
  {
    id: 2,
    name: "Sarah Kim",
    designation: "DeFi Researcher",
    image: "/api/placeholder/100/100"
  },
  {
    id: 3,
    name: "Mike Ross",
    designation: "Crypto Investor",
    image: "/api/placeholder/100/100"
  }
]

export default function Comparison() {
  return (
    <section id="comparison" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Why Choose Our Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Trusted by leading traders and researchers
          </p>
          <div className="flex justify-center">
            <AnimatedTooltip items={teamMembers} />
          </div>
        </motion.div>
        
        <BackgroundGradient className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 to-purple-600">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-lg font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-blue-400 text-lg font-semibold">Our Platform</th>
                    <th className="px-6 py-4 text-center text-gray-400 text-lg font-semibold">Traditional Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map(([feature, ours, theirs], index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-lg">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-2xl ${ours === "✓" ? "text-green-400" : "text-red-400"}`}>
                          {ours}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-2xl ${theirs === "✓" ? "text-green-400" : "text-red-400"}`}>
                          {theirs}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </BackgroundGradient>
      </div>
    </section>
  )
}
