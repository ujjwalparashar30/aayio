'use client'

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
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
  Gamepad2
} from 'lucide-react'
import Link from 'next/link'

const DashboardPage = () => {
  // const { user, isLoaded } = useUser()
  // const router = useRouter()
  const [activeTab, setActiveTab] = useState("markets")

  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  // 🔍 DEBUG: Keep this for now to see progress
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
      router.push('/sign-in')
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div>Redirecting to sign in...</div>
        </div>
      )
    }
  
    // ✅ NOW user.id is guaranteed to exist
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

  // ✅ CRITICAL: Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // ✅ CRITICAL: Redirect if not signed in

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

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 pb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <Gamepad2 className="w-10 h-10 text-blue-500" />
                Welcome back, {user.firstName}! 
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Ready to make some smart predictions today?
              </p>
            </div>
            
            {/* Balance Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-xl min-w-[300px]">
                <CardContent className="p-6">
                  {balanceLoading ? (
                    <div className="flex items-center gap-4">
                      <Wallet className="w-12 h-12" />
                      <div>
                        <p className="text-emerald-100 font-medium mb-2">Available Balance</p>
                        <Skeleton className="h-10 w-40 bg-white/20" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Wallet className="w-12 h-12" />
                        <div>
                          <p className="text-emerald-100 font-medium mb-1">Available Balance</p>
                          <p className="text-3xl font-bold">
                            ₹{balance.available.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Link href="/wallet">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Money
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Portfolio Value</p>
                  {portfolioLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      ₹{portfolioStats.totalValue.toLocaleString()}
                    </p>
                  )}
                </div>
                <BarChart3 className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${
            portfolioStats.pnl >= 0 
              ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800' 
              : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${
                    portfolioStats.pnl >= 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    Total P&L
                  </p>
                  {portfolioLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className={`text-3xl font-bold ${
                      portfolioStats.pnl >= 0 
                        ? 'text-emerald-700 dark:text-emerald-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {portfolioStats.pnl >= 0 ? '+' : ''}₹{portfolioStats.pnl.toLocaleString()}
                    </p>
                  )}
                </div>
                <TrendingUp className={`w-12 h-12 ${
                  portfolioStats.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">Active Positions</p>
                  {portfolioLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      {portfolioStats.activePositions}
                    </p>
                  )}
                </div>
                <Target className="w-12 h-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-2">Available Markets</p>
                  {questionsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                      {questions.length}
                    </p>
                  )}
                </div>
                <Activity className="w-12 h-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="markets" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Hot Markets
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                My Portfolio
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Activity
              </TabsTrigger>
            </TabsList>

            {/* Markets Tab */}
            <TabsContent value="markets" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  🔥 Trending Markets
                </h2>
                <Link href="/markets">
                  <Button variant="outline" className="flex items-center gap-2">
                    View All Markets
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {questionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-24 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : questionsError ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                      Unable to load markets. Please check your connection.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                    >
                      Retry Loading
                    </Button>
                  </CardContent>
                </Card>
              ) : questions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      No markets available
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      New prediction markets will appear here when they're created.
                    </p>
                  </CardContent>
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
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden"
                        onClick={() => router.push(`/markets/${question.id}`)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs font-medium">
                              {question.category || 'General'}
                            </Badge>
                            <Badge variant="outline" className={
                              question.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200'
                                : 'bg-gray-100 text-gray-800'
                            }>
                              {question.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {question.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                            {question.description}
                          </p>
                          
                          {/* Price Cards */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
                              <p className="text-green-600 dark:text-green-400 text-xs font-semibold mb-1">YES</p>
                              <p className="text-green-700 dark:text-green-300 font-bold text-lg">
                              ₹{Number(question?.currentYesPrice ?? question?.yesToken?.currentPrice ?? 1).toFixed(2)}

                              </p>
                            </div>
                            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-3 text-center border border-red-200 dark:border-red-800">
                              <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">NO</p>
                              <p className="text-red-700 dark:text-red-300 font-bold text-lg">
                                ₹{Number(question.currentNoPrice || question.noToken?.currentPrice || 1.0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Market Info */}
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  💼 My Trading Portfolio
                </h2>
                <div className="flex gap-2">
                  <Link href="/wallet">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Manage Wallet
                    </Button>
                  </Link>
                </div>
              </div>

              {portfolioLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : portfolioStats.activePositions === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Start Your Trading Journey
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                      You haven't made any trades yet. Browse our active markets and make your first prediction!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/markets">
                        <Button size="lg" className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Browse Markets
                        </Button>
                      </Link>
                      <Link href="/wallet">
                        <Button variant="outline" size="lg" className="flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Add Play Money
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Portfolio Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Invested</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          ₹{portfolioStats.totalInvested.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Value</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          ₹{portfolioStats.totalValue.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                          portfolioStats.pnl >= 0 
                            ? 'bg-green-100 dark:bg-green-900' 
                            : 'bg-red-100 dark:bg-red-900'
                        }`}>
                          <TrendingUp className={`w-6 h-6 ${
                            portfolioStats.pnl >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`} />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Unrealized P&L</p>
                        <p className={`text-2xl font-bold ${
                          portfolioStats.pnl >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {portfolioStats.pnl >= 0 ? '+' : ''}₹{portfolioStats.pnl.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Holdings Display */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Your Positions
                      </CardTitle>
                      <CardDescription>
                        Track your current holdings and their performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* YES Holdings */}
                      {portfolio.yesHoldings && portfolio.yesHoldings.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                            YES Positions
                          </h4>
                          {portfolio.yesHoldings.map((holding: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
                              <div>
                                <h5 className="font-medium text-slate-900 dark:text-white">
                                  {holding.question?.title || 'Question'}
                                </h5>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  {holding.quantity} YES tokens @ ₹{holding.averageBuyPrice?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900 dark:text-white">
                                  ₹{(holding.currentValue || 0).toLocaleString()}
                                </p>
                                <p className={`text-sm ${
                                  (holding.unrealizedPnL || 0) >= 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {(holding.unrealizedPnL || 0) >= 0 ? '+' : ''}₹{(holding.unrealizedPnL || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* NO Holdings */}
                      {portfolio.noHoldings && portfolio.noHoldings.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                            NO Positions
                          </h4>
                          {portfolio.noHoldings.map((holding: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                              <div>
                                <h5 className="font-medium text-slate-900 dark:text-white">
                                  {holding.question?.title || 'Question'}
                                </h5>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {holding.quantity} NO tokens @ ₹{holding.averageBuyPrice?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900 dark:text-white">
                                  ₹{(holding.currentValue || 0).toLocaleString()}
                                </p>
                                <p className={`text-sm ${
                                  (holding.unrealizedPnL || 0) >= 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {(holding.unrealizedPnL || 0) >= 0 ? '+' : ''}₹{(holding.unrealizedPnL || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  📈 Recent Activity
                </h2>
                <Link href="/wallet">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    View All Transactions
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {tradeHistoryLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : !recentTrades || recentTrades.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Activity className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      No activity yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                      Your trading activity and transaction history will appear here
                    </p>
                    <Link href="/markets">
                      <Button size="lg" className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Start Trading Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recentTrades.map((transaction: any, index: number) => (
                    <motion.div
                      key={transaction.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-4 h-4 rounded-full ${
                                transaction.type === 'BUY' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {transaction.type} {transaction.quantity} {transaction.tokenType} tokens
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {transaction.question?.title || 'Market'} • {' '}
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-lg ${
                                transaction.type === 'BUY' 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {transaction.type === 'BUY' ? '-' : '+'}₹{(transaction.totalAmount || 0).toLocaleString()}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                @ ₹{(transaction.pricePerToken || 0).toFixed(2)} per token
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
