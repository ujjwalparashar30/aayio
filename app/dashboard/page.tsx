'use client'

// import Navigation from '@/components/sections/Navigation'
import Footer from '@/components/sections/Footer'
import { motion } from 'framer-motion'
import { TrendingUp, Trophy, Settings, Bell, User, ChevronDown, Eye, Calendar, Target, Wallet } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Dashboard() {
  const [userInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    balance: 2450.75,
    avatar: null
  })

  const [showUserMenu, setShowUserMenu] = useState(false)

  // Static data for winnings graph
  const winningsData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1350 },
    { month: 'Mar', amount: 1100 },
    { month: 'Apr', amount: 1800 },
    { month: 'May', amount: 2100 },
    { month: 'Jun', amount: 2450 }
  ]

  // Static data for user's bets
  const userBets = [
    {
      id: 1,
      question: "Will Bitcoin reach $100k by end of 2024?",
      position: "Yes",
      amount: 500,
      odds: "2.5x",
      status: "active",
      endDate: "2024-12-31",
      currentValue: 625
    },
    {
      id: 2,
      question: "Will AI achieve AGI by 2025?",
      position: "No",
      amount: 300,
      odds: "1.8x",
      status: "active",
      endDate: "2025-12-31",
      currentValue: 285
    },
    {
      id: 3,
      question: "Will SpaceX land on Mars by 2026?",
      position: "Yes",
      amount: 750,
      odds: "3.2x",
      status: "won",
      endDate: "2026-12-31",
      currentValue: 2400
    },
    {
      id: 4,
      question: "Will the US have a recession in 2024?",
      position: "No",
      amount: 400,
      odds: "1.5x",
      status: "lost",
      endDate: "2024-12-31",
      currentValue: 0
    }
  ]

  const CustomUserButton = () => (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {userInfo.firstName[0]}{userInfo.lastName[0]}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {userInfo.firstName} {userInfo.lastName}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {userInfo.email}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {showUserMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
        >
          <div className="p-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <User className="w-4 h-4" />
              Profile
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      {/* <Navigation /> */}
      
      {/* Header with Balance */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Dashboard
          </h1>
          
          <div className="flex items-center gap-6">
            {/* Balance Display */}
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
              <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-right">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Balance</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  ${userInfo.balance.toLocaleString()}
                </p>
              </div>
            </div>
            <CustomUserButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Winnings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Winnings</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Winnings Stats */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8" />
                  <span className="text-sm opacity-90">This Month</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">$2,450</h3>
                <p className="text-sm opacity-90">+18.5% from last month</p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Performance Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Winnings</span>
                    <span className="font-semibold text-gray-800 dark:text-white">$8,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Win Rate</span>
                    <span className="font-semibold text-green-600">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Best Month</span>
                    <span className="font-semibold text-gray-800 dark:text-white">$3,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Winnings Graph */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Winnings Over Time</h4>
              <div className="h-64 flex items-end justify-between gap-2">
                {winningsData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-md transition-all duration-500 hover:from-blue-600 hover:to-purple-700"
                      style={{
                        height: `${(data.amount / Math.max(...winningsData.map(d => d.amount))) * 200}px`,
                        minHeight: '20px'
                      }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month}</span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">${data.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* User's Bets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Predictions</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userBets.map((bet) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
                      {bet.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Position:</span>
                      <span className={`font-semibold ${bet.position === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                        {bet.position}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bet.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    bet.status === 'won' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {bet.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount Bet</p>
                    <p className="font-semibold text-gray-800 dark:text-white">${bet.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Odds</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{bet.odds}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Value</p>
                    <p className={`font-semibold ${
                      bet.currentValue > bet.amount ? 'text-green-600' : 
                      bet.currentValue < bet.amount ? 'text-red-600' : 'text-gray-800 dark:text-white'
                    }`}>
                      ${bet.currentValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {new Date(bet.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {bet.status === 'active' ? 'Active' : bet.status === 'won' ? 'Won' : 'Lost'}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
