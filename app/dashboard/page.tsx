'use client'

import { UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react'
import { useAuthenticatedApi } from '@/state/api'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { useGetAuthUser } = useAuthenticatedApi()
  const [getAuthUser, { data: authData, isLoading, error }] = useGetAuthUser()
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getAuthUser()
        if (result?.data) {
          setUserInfo(result.data)
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      }
    }

    fetchUserData()
  }, [getAuthUser])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors duration-300">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors duration-300">
        <div className="text-red-600 dark:text-red-400">Failed to load dashboard</div>
      </div>
    )
  }

  const firstName = userInfo?.clerkInfo?.firstName || userInfo?.userInfo?.firstName || 'User'

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Welcome, {firstName}!
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* User Info Display */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8 transition-colors duration-300"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white mb-2 transition-colors duration-300">
              Account Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Role: </span>
                <span className="text-black dark:text-white font-medium">
                  {userInfo.userInfo?.role || 'User'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Onboarded: </span>
                <span className="text-black dark:text-white font-medium">
                  {userInfo.userInfo?.isOnboarded ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Member Since: </span>
                <span className="text-black dark:text-white font-medium">
                  {userInfo.userInfo?.createdAt 
                    ? new Date(userInfo.userInfo.createdAt).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </motion.div>
        )}

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
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-black dark:text-white transition-colors duration-300" />
                <span className="text-sm text-green-600 dark:text-green-400 transition-colors duration-300">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-1 transition-colors duration-300">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-colors duration-300"
        >
          <h2 className="text-xl font-bold text-black dark:text-white mb-4 transition-colors duration-300">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Bought', market: 'Bitcoin $100k by 2024', amount: '$500', time: '2 hours ago' },
              { action: 'Sold', market: '2024 US Election', amount: '$250', time: '1 day ago' },
              { action: 'Bought', market: 'AI Breakthrough', amount: '$750', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0 transition-colors duration-300">
                <div>
                  <p className="text-black dark:text-white font-medium transition-colors duration-300">{activity.action} - {activity.market}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{activity.time}</p>
                </div>
                <span className="text-black dark:text-white font-bold transition-colors duration-300">{activity.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
