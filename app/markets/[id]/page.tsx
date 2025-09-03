'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { 
  useGetQuestionByIdQuery,
  useGetTokenPricesQuery,
  useGetP2POrderBookQuery,
  useBuyTokenFromPlatformMutation,
  usePreviewTradeMutation
} from '@/lib/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { montserrat } from '@/lib/fonts'
import { 
  TrendingUp, 
  Calendar, 
  Users,
  BarChart3,
  Activity,
  ArrowUpDown,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Loader2,
  Rocket
} from 'lucide-react'

const MarketDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  
  const marketId = params.id as string
  
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeType, setTradeType] = useState<'YES' | 'NO'>('YES')
  const [isTrading, setIsTrading] = useState(false)

  // RTK Query hooks - ALL PRESERVED
  const { 
    data: marketData, 
    isLoading: marketLoading, 
    error: marketError 
  } = useGetQuestionByIdQuery(marketId)

  const { 
    data: pricesData 
  } = useGetTokenPricesQuery(marketId)

  const { 
    data: orderBookData 
  } = useGetP2POrderBookQuery(marketId)

  const [buyToken, { isLoading: buyLoading }] = useBuyTokenFromPlatformMutation()
  const [previewTrade, { data: previewData, isLoading: previewLoading }] = usePreviewTradeMutation()

  const market = marketData?.data?.question
  const marketStats = marketData?.data?.marketStats
  const prices = pricesData?.data
  const orderBook = orderBookData?.data

  // Calculate market sentiment percentage - PRESERVED
  const yesPercentage = marketStats ? parseFloat(marketStats.yesPercentage) : 50

  // ALL HANDLERS PRESERVED EXACTLY
  const handlePreviewTrade = async () => {
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) return

    try {
      await previewTrade({
        questionId: marketId,
        tokenType: tradeType,
        quantity: parseInt(tradeAmount)
      }).unwrap()
    } catch (error) {
      console.error('Preview trade error:', error)
    }
  }

  const handleTrade = async () => {
    if (!user || !tradeAmount || parseFloat(tradeAmount) <= 0) return

    setIsTrading(true)
    try {
      await buyToken({
        userId: user.id,
        questionId: marketId,
        tokenType: tradeType,
        quantity: parseInt(tradeAmount)
      }).unwrap()

      toast.success("Trade Successful! 🎉", {
        description: `You bought ${tradeAmount} ${tradeType} tokens`,
      })

      setTradeAmount('')
      router.refresh()
    } catch (error: any) {
        toast.error("Trade Failed", {
            description: error.data?.error || "Something went wrong",
        })
    } finally {
      setIsTrading(false)
    }
  }

  React.useEffect(() => {
    if (tradeAmount && parseFloat(tradeAmount) > 0) {
      const debounce = setTimeout(() => {
        handlePreviewTrade()
      }, 500)
      return () => clearTimeout(debounce)
    }
  }, [tradeAmount, tradeType])

  if (marketLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30">
        <Navigation />
        <div className="pt-20 max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 bg-white/20" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 bg-white/20" />
              <Skeleton className="h-64 bg-white/20" />
            </div>
            <Skeleton className="h-48 bg-white/20" />
          </div>
        </div>
      </div>
    )
  }

  if (marketError || !market) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30">
        <Navigation />
        <div className="pt-20 max-w-6xl mx-auto px-6 py-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold text-white mb-2 ${montserrat.className}`}>
                Market Not Found
              </h3>
              <p className="text-gray-400 mb-6">
                The requested prediction market could not be found.
              </p>
              <Button 
                onClick={() => router.push('/markets')}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              >
                Back to Markets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/10 text-white border-white/20">
              {market.category || 'General'}
            </Badge>
            <Badge className={
              market.status === 'ACTIVE' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
            }>
              {market.status}
            </Badge>
            {market.isResolved && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Resolved: {market.resolvedAnswer ? 'YES' : 'NO'}
              </Badge>
            )}
          </div>
          
          <h1 className={`text-3xl lg:text-4xl font-bold text-white mb-4 ${montserrat.className}`}>
            {market.title}
          </h1>
          
          <p className="text-lg text-gray-300 mb-6 max-w-4xl">
            {market.description}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Ends: {new Date(market.resolutionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{marketStats?.totalParticipants || 0} participants</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>₹{(marketStats?.totalVolume || 0).toLocaleString()} volume</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium text-green-300 ${montserrat.className}`}>
                        YES Price
                      </span>
                    </div>
                    <div className={`text-3xl font-bold text-green-200 mb-2 ${montserrat.className}`}>
                      ₹{(prices?.yesPrice || market.currentYesPrice || 1.0).toFixed(2)}
                    </div>
                    <div className="text-xs text-green-400">
                      {market.yesToken?.circulatingSupply || 0} tokens in circulation
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_40px_rgba(239,68,68,0.3)] hover:-translate-y-1 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium text-red-300 ${montserrat.className}`}>
                        NO Price
                      </span>
                    </div>
                    <div className={`text-3xl font-bold text-red-200 mb-2 ${montserrat.className}`}>
                      ₹{(prices?.noPrice || market.currentNoPrice || 1.0).toFixed(2)}
                    </div>
                    <div className="text-xs text-red-400">
                      {market.noToken?.circulatingSupply || 0} tokens in circulation
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Market Sentiment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400 font-medium">YES {yesPercentage.toFixed(1)}%</span>
                      <span className="text-red-400 font-medium">NO {(100 - yesPercentage).toFixed(1)}%</span>
                    </div>
                    <Progress value={yesPercentage} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">YES Holders: </span>
                        <span className="font-medium text-white">{marketStats?.yesHolders || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">NO Holders: </span>
                        <span className="font-medium text-white">{marketStats?.noHolders || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Book */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Tabs defaultValue="orderbook" className="w-full">
                <TabsList className="flex justify-center bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-1 grid w-full grid-cols-2">
                  <TabsTrigger 
                    value="orderbook" 
                    className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg"
                  >
                    Order Book
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 data-[state=active]:text-white rounded-lg"
                  >
                    Recent Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orderbook" className="mt-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <ArrowUpDown className="w-4 h-4 text-white" />
                        </div>
                        P2P Order Book
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Current buy and sell orders from other traders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!orderBook || (
                        orderBook.yesOrders.sells.length === 0 && 
                        orderBook.noOrders.sells.length === 0 &&
                        orderBook.yesOrders.buys.length === 0 && 
                        orderBook.noOrders.buys.length === 0
                      ) ? (
                        <div className="text-center py-8 text-gray-400">
                          No active orders in the order book
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* YES Orders */}
                          {(orderBook.yesOrders.sells.length > 0 || orderBook.yesOrders.buys.length > 0) && (
                            <div>
                              <h4 className={`text-lg font-semibold text-green-400 mb-3 ${montserrat.className}`}>
                                YES Token Orders
                              </h4>
                              <div className="space-y-2">
                                {orderBook.yesOrders.sells.slice(0, 3).map((order: any) => (
                                  <div key={order.id} className="flex justify-between items-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                                    <div>
                                      <span className="text-sm font-medium text-white">SELL {order.quantity} tokens</span>
                                      <p className="text-xs text-green-400">
                                        @ ₹{order.pricePerToken.toFixed(2)} each
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-white">₹{order.totalAmount.toFixed(2)}</p>
                                      <p className="text-xs text-gray-400">
                                        {order.userName || order.userId.slice(0, 8)}...
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* NO Orders */}
                          {(orderBook.noOrders.sells.length > 0 || orderBook.noOrders.buys.length > 0) && (
                            <div>
                              <h4 className={`text-lg font-semibold text-red-400 mb-3 ${montserrat.className}`}>
                                NO Token Orders
                              </h4>
                              <div className="space-y-2">
                                {orderBook.noOrders.sells.slice(0, 3).map((order: any) => (
                                  <div key={order.id} className="flex justify-between items-center p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                                    <div>
                                      <span className="text-sm font-medium text-white">SELL {order.quantity} tokens</span>
                                      <p className="text-xs text-red-400">
                                        @ ₹{Number(order.pricePerToken).toFixed(2)} each
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-white">₹{Number(order.totalAmount).toFixed(2)}</p>
                                      <p className="text-xs text-gray-400">
                                        {order.userName || order.userId.slice(0, 8)}...
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity" className="mt-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-white" />
                        </div>
                        Recent Market Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-400">
                        Recent trading activity will appear here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Trading Interface */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-green-600 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    Trade on This Market
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Buy YES or NO tokens to participate in this prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!user ? (
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-300">
                        Please sign in to trade on this market.
                      </AlertDescription>
                    </Alert>
                  ) : market.status !== 'ACTIVE' ? (
                    <Alert className="bg-red-500/10 border-red-500/30">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        This market is no longer active for trading.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      {/* Token Type Selection */}
                      <div className="space-y-2">
                        <Label className="text-white">Choose Your Prediction</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={tradeType === 'YES' ? 'default' : 'outline'}
                            onClick={() => setTradeType('YES')}
                            className={tradeType === 'YES' 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                              : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                            }
                          >
                            YES
                          </Button>
                          <Button
                            variant={tradeType === 'NO' ? 'default' : 'outline'}
                            onClick={() => setTradeType('NO')}
                            className={tradeType === 'NO' 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                              : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                            }
                          >
                            NO
                          </Button>
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div className="space-y-2">
                        <Label className="text-white">Number of Tokens</Label>
                        <Input
                          type="number"
                          placeholder="Enter quantity..."
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          min="1"
                          className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                        />
                      </div>

                      {/* Trade Preview - PRESERVED EXACTLY */}
                      {previewLoading && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Calculating trade...
                        </div>
                      )}

                      {previewData?.data && (
                        <Alert className="bg-green-500/10 border-green-500/30">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <AlertDescription className="text-green-300">
                            <div className="space-y-1">
                              <p><strong>Total Cost:</strong> ₹{previewData.data.totalCost.toFixed(2)}</p>
                              <p><strong>Price per Token:</strong> ₹{previewData.data.pricePerToken.toFixed(2)}</p>
                              <p><strong>Platform Fee:</strong> ₹{previewData.data.platformFee.toFixed(2)}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Trade Button - PRESERVED EXACTLY */}
                      <Button
                        onClick={handleTrade}
                        disabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || isTrading || buyLoading}
                        className={`w-full ${
                          tradeType === 'YES' 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        } text-white`}
                        size="lg"
                      >
                        {isTrading || buyLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Buy {tradeAmount || '0'} {tradeType} Token{parseInt(tradeAmount) !== 1 ? 's' : ''}
                            {previewData?.data && ` for ₹${previewData.data.totalCost.toFixed(2)}`}
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-400 text-center">
                        Prices may change based on market activity
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    Market Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Volume</span>
                      <span className="font-semibold text-white">₹{(marketStats?.totalVolume || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants</span>
                      <span className="font-semibold text-white">{marketStats?.totalParticipants || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">YES Tokens</span>
                      <span className="font-semibold text-white">{marketStats?.totalYesTokens || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">NO Tokens</span>
                      <span className="font-semibold text-white">{marketStats?.totalNoTokens || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resolution Date</span>
                      <span className="font-semibold text-white">{new Date(market.resolutionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketDetailPage
