'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, redirect } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { 
  useGetQuestionsQuery, 
  useGetBalanceQuery,
  useGetUserPortfolioQuery,
  useGetTradeHistoryQuery
} from '@/lib/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { montserrat } from '@/lib/fonts'
import { 
  TrendingUp, 
  Wallet, 
  Trophy, 
  Target, 
  Calendar, 
  ArrowUpRight,
  Eye,
  BarChart3,
  Plus,
  Activity,
  LineChart,
  Clock,
  HandCoins,
  Building
} from 'lucide-react'
import Link from 'next/link'

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("markets")
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  console.log('🔍 Clerk State:', { isLoaded, isSignedIn, userId: user?.id })

  // RTK Query hooks
  const { 
    data: questionsData, 
    isLoading: questionsLoading, 
    error: questionsError 
  } = useGetQuestionsQuery({ 
    page: 1, 
    limit: 8, 
    status: 'ACTIVE' 
  })

  if (!isSignedIn || !user) {
    redirect('/sign-in')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Redirecting to sign in...</div>
      </div>
    )
  }
  
  const userId = user?.id 
  console.log('👤 Using userId for API calls:', userId)

  const { 
    data: balanceData, 
    isLoading: balanceLoading 
  } = useGetBalanceQuery(userId || "hello")

  const { 
    data: portfolioData, 
    isLoading: portfolioLoading 
  } = useGetUserPortfolioQuery(userId || "hello")

  const { 
    data: tradeHistoryData, 
    isLoading: tradeHistoryLoading 
  } = useGetTradeHistoryQuery({ 
    userId: userId || "hello", 
    page: 1, 
    limit: 5 
  })

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white/30"></div>
      </div>
    )
  }

  // Extract data safely
  const questions = questionsData?.data?.questions || []
  const balance = balanceData?.data?.balances || { available: 0, locked: 0, total: 0 }
  const portfolio = portfolioData?.data || { yesHoldings: [], noHoldings: [] }
  const recentTrades = tradeHistoryData?.data?.transactions || []

  // Calculate portfolio stats
  const portfolioStats = React.useMemo(() => {
    const yesHoldings = portfolio.yesHoldings || []
    const noHoldings = portfolio.noHoldings || []
    
    const totalValue = [...yesHoldings, ...noHoldings]
      .reduce((sum: number, holding: any) => sum + (holding.currentValue || 0), 0)
    
    const totalInvested = [...yesHoldings, ...noHoldings]
      .reduce((sum: number, holding: any) => sum + (holding.totalInvested || 0), 0)
    
    return {
      totalValue,
      totalInvested,
      pnl: totalValue - totalInvested,
      activePositions: yesHoldings.length + noHoldings.length
    }
  }, [portfolio])

  // Beautiful stats with real data
  const stats = [
    { 
      label: 'Portfolio Value', 
      value: balanceLoading ? '₹--,---' : `₹${portfolioStats.totalValue.toLocaleString()}`, 
      icon: Wallet, 
      gradient: 'from-emerald-400 to-green-600',
      loading: portfolioLoading 
    },
    { 
      label: 'Available Balance', 
      value: balanceLoading ? '₹--,---' : `₹${balance.available.toLocaleString()}`, 
      icon: LineChart, 
      gradient: 'from-blue-400 to-blue-600',
      loading: balanceLoading 
    },
    { 
      label: 'Active Positions', 
      value: portfolioLoading ? '--' : `${portfolioStats.activePositions}`, 
      icon: BarChart3, 
      gradient: 'from-purple-400 to-purple-600',
      loading: portfolioLoading 
    },
    { 
      label: 'Total P&L', 
      value: portfolioLoading ? '₹--,---' : `${portfolioStats.pnl >= 0 ? '+' : ''}₹${portfolioStats.pnl.toLocaleString()}`, 
      icon: Activity, 
      gradient: portfolioStats.pnl >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600',
      loading: portfolioLoading 
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className={`text-4xl md:text-5xl font-bold text-white ${montserrat.className}`}>
            Welcome back, {user?.firstName || 'Trader'}
            <div className="inline-block ml-4 animate-pulse">👋</div>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Here's a quick overview of your trading performance and portfolio.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <Card className="p-6 backdrop-blur-sm bg-white/5 border border-white/15 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:-translate-y-1">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-4`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  {stat.loading ? (
                    <Skeleton className="h-8 w-24 mb-2 bg-white/20" />
                  ) : (
                    <CardTitle className={`text-2xl font-bold text-white ${montserrat.className}`}>
                      {stat.value}
                    </CardTitle>
                  )}
                  <CardDescription className="text-gray-400 font-medium mt-1">
                    {stat.label}
                  </CardDescription>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center mb-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-1">
            <TabsTrigger 
              value="markets" 
              className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg"
            >
              Hot Markets
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 data-[state=active]:text-white rounded-lg"
            >
              My Portfolio
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg"
            >
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* Markets Tab */}
          <TabsContent value="markets">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold text-white ${montserrat.className}`}>
                  🔥 Trending Markets
                </h2>
                <Link href="/markets">
                  <Button 
                    variant="outline" 
                    className="bg-white/5 border-white/15 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    View All Markets
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {questionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                      <Skeleton className="h-6 w-24 mb-4 bg-white/20" />
                      <Skeleton className="h-8 w-full mb-4 bg-white/20" />
                      <Skeleton className="h-20 w-full bg-white/20" />
                    </Card>
                  ))}
                </div>
              ) : questionsError ? (
                <Card className="p-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl text-center">
                  <p className="text-red-400 mb-4">
                    Unable to load markets. Please check your connection.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                  >
                    Retry Loading
                  </Button>
                </Card>
              ) : questions.length === 0 ? (
                <Card className="p-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl text-center">
                  <Target className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className={`text-2xl font-bold text-white mb-4 ${montserrat.className}`}>
                    No markets available
                  </h3>
                  <p className="text-gray-400">
                    New prediction markets will appear here when they're created.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {questions.map((question: any) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        onClick={() => router.push(`/markets/${question.id}`)}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="text-xs font-medium bg-white/10 text-white border-white/20">
                            {question.category || 'General'}
                          </Badge>
                          <Badge className={`text-xs ${
                            question.status === 'ACTIVE' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}>
                            {question.status}
                          </Badge>
                        </div>
                        
                        <CardTitle className={`text-lg leading-tight text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-4 ${montserrat.className}`}>
                          {question.title}
                        </CardTitle>
                        
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                          {question.description}
                        </p>
                        
                        {/* Price Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-3 text-center border border-green-500/30">
                            <p className="text-green-300 text-xs font-semibold mb-1">YES</p>
                            <p className="text-green-200 font-bold text-lg">
                              ₹{Number(question?.currentYesPrice ?? question?.yesToken?.currentPrice ?? 1).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-3 text-center border border-red-500/30">
                            <p className="text-red-300 text-xs font-semibold mb-1">NO</p>
                            <p className="text-red-200 font-bold text-lg">
                              ₹{Number(question.currentNoPrice || question.noToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Market Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(question.resolutionDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>
                              {((question._count?.yesTokenHoldings || 0) + (question._count?.noTokenHoldings || 0))} traders
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold text-white ${montserrat.className}`}>
                  💼 My Trading Portfolio
                </h2>
                <Link href="/wallet">
                  <Button 
                    variant="outline" 
                    className="bg-white/5 border-white/15 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Manage Wallet
                  </Button>
                </Link>
              </div>

              {portfolioLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                      <Skeleton className="h-6 w-24 mb-4 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </Card>
                  ))}
                </div>
              ) : portfolioStats.activePositions === 0 ? (
                <Card className="p-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl text-center">
                  <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className={`text-2xl font-bold text-white mb-4 ${montserrat.className}`}>
                    Start Your Trading Journey
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    You haven't made any trades yet. Browse our active markets and make your first prediction!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/markets">
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                        <Target className="w-5 h-5 mr-2" />
                        Browse Markets
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Holdings Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* YES Holdings */}
                    {portfolio.yesHoldings && portfolio.yesHoldings.map((holding: any, index: number) => (
                      <Card key={`yes-${index}`} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            YES Position
                          </Badge>
                          <div className="text-right">
                            <p className="text-white font-bold">
                              ₹{(holding.currentValue || 0).toLocaleString()}
                            </p>
                            <p className={`text-sm ${
                              (holding.unrealizedPnL || 0) >= 0 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              {(holding.unrealizedPnL || 0) >= 0 ? '+' : ''}₹{(holding.unrealizedPnL || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <CardTitle className={`text-white font-semibold mb-2 ${montserrat.className}`}>
                          {holding.question?.title || 'Question'}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {holding.quantity} YES tokens @ ₹{Number(holding.averageBuyPrice)?.toFixed(2) || '0.00'}
                        </CardDescription>
                      </Card>
                    ))}

                    {/* NO Holdings */}
                    {portfolio.noHoldings && portfolio.noHoldings.map((holding: any, index: number) => (
                      <Card key={`no-${index}`} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                            NO Position
                          </Badge>
                          <div className="text-right">
                            <p className="text-white font-bold">
                              ₹{(holding.currentValue || 0).toLocaleString()}
                            </p>
                            <p className={`text-sm ${
                              (holding.unrealizedPnL || 0) >= 0 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              {(holding.unrealizedPnL || 0) >= 0 ? '+' : ''}₹{(holding.unrealizedPnL || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <CardTitle className={`text-white font-semibold mb-2 ${montserrat.className}`}>
                          {holding.question?.title || 'Question'}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {holding.quantity} NO tokens @ ₹{Number(holding.averageBuyPrice)?.toFixed(2) || '0.00'}
                        </CardDescription>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold text-white ${montserrat.className}`}>
                  📈 Recent Activity
                </h2>
                <Link href="/wallet">
                  <Button 
                    variant="outline" 
                    className="bg-white/5 border-white/15 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    View All Transactions
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {tradeHistoryLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                      <Skeleton className="h-6 w-24 mb-4 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </Card>
                  ))}
                </div>
              ) : !recentTrades || recentTrades.length === 0 ? (
                <Card className="p-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl text-center">
                  <Activity className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className={`text-2xl font-bold text-white mb-4 ${montserrat.className}`}>
                    No activity yet
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Your trading activity and transaction history will appear here
                  </p>
                  <Link href="/markets">
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                      <Target className="w-5 h-5 mr-2" />
                      Start Trading Now
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentTrades.map((transaction: any, index: number) => (
                    <motion.div
                      key={transaction.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={`${
                            transaction.type === 'BUY' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {transaction.type} {transaction.tokenType}
                          </Badge>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              transaction.type === 'BUY' 
                                ? 'text-red-400' 
                                : 'text-green-400'
                            }`}>
                              {transaction.type === 'BUY' ? '-' : '+'}₹{(transaction.totalAmount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <CardTitle className={`text-white font-semibold mb-2 ${montserrat.className}`}>
                          {transaction.question?.title || 'Trade'}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {transaction.quantity} tokens @ ₹{Number(transaction.pricePerToken || 0).toFixed(2)} • {' '}
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardPage
