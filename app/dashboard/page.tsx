'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.firstName}!</span>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: {
                    width: '40px',
                    height: '40px',
                  },
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Stats Cards */}
          {[
            { title: 'Portfolio Value', value: '$2,450.00', icon: DollarSign, change: '+12.5%' },
            { title: 'Active Positions', value: '8', icon: TrendingUp, change: '+2' },
            { title: 'Total Trades', value: '142', icon: BarChart3, change: '+15' },
            { title: 'Win Rate', value: '68%', icon: Users, change: '+3.2%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-white" />
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Bought', market: 'Bitcoin $100k by 2024', amount: '$500', time: '2 hours ago' },
              { action: 'Sold', market: '2024 US Election', amount: '$250', time: '1 day ago' },
              { action: 'Bought', market: 'AI Breakthrough', amount: '$750', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                <div>
                  <p className="text-white font-medium">{activity.action} - {activity.market}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                <span className="text-white font-bold">{activity.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
