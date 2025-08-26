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
  Loader2
} from 'lucide-react'

const MarketDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
//   const { toast } = useToast()
  
  const marketId = params.id as string
  
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeType, setTradeType] = useState<'YES' | 'NO'>('YES')
  const [isTrading, setIsTrading] = useState(false)

  // RTK Query hooks
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

  // Calculate market sentiment percentage
  const yesPercentage = marketStats ? parseFloat(marketStats.yesPercentage) : 50

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Navigation />
        <div className="pt-20 max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (marketError || !market) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Navigation />
        <div className="pt-20 max-w-6xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Market Not Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The requested prediction market could not be found.
              </p>
              <Button onClick={() => router.push('/markets')}>
                Back to Markets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 pb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm">
              {market.category || 'General'}
            </Badge>
            <Badge variant="outline" className={
              market.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800'
            }>
              {market.status}
            </Badge>
            {market.isResolved && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Resolved: {market.resolvedAnswer ? 'YES' : 'NO'}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {market.title}
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-4xl">
            {market.description}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
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
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-8">
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
                <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        YES Price
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                      ₹{(prices?.yesPrice || market.currentYesPrice || 1.0).toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-500">
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
                <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        NO Price
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
                      ₹{(prices?.noPrice || market.currentNoPrice || 1.0).toFixed(2)}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-500">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">YES {yesPercentage.toFixed(1)}%</span>
                      <span className="text-red-600 font-medium">NO {(100 - yesPercentage).toFixed(1)}%</span>
                    </div>
                    <Progress value={yesPercentage} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">YES Holders: </span>
                        <span className="font-medium">{marketStats?.yesHolders || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">NO Holders: </span>
                        <span className="font-medium">{marketStats?.noHolders || 0}</span>
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="orderbook" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowUpDown className="w-5 h-5" />
                        P2P Order Book
                      </CardTitle>
                      <CardDescription>
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
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          No active orders in the order book
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* YES Orders */}
                          {(orderBook.yesOrders.sells.length > 0 || orderBook.yesOrders.buys.length > 0) && (
                            <div>
                              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                                YES Token Orders
                              </h4>
                              <div className="space-y-2">
                                {orderBook.yesOrders.sells.slice(0, 3).map((order: any) => (
                                  <div key={order.id} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                                    <div>
                                      <span className="text-sm font-medium">SELL {order.quantity} tokens</span>
                                      <p className="text-xs text-green-600 dark:text-green-400">
                                        @ ₹{order.pricePerToken.toFixed(2)} each
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold">₹{order.totalAmount.toFixed(2)}</p>
                                      <p className="text-xs text-slate-500">
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
                              <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                                NO Token Orders
                              </h4>
                              <div className="space-y-2">
                                {orderBook.noOrders.sells.slice(0, 3).map((order: any) => (
                                  <div key={order.id} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                                    <div>
                                      <span className="text-sm font-medium">SELL {order.quantity} tokens</span>
                                      <p className="text-xs text-red-600 dark:text-red-400">
                                        @ ₹{Number(order.pricePerToken).toFixed(2)} each
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold">₹{Number(order.totalAmount).toFixed(2)}</p>
                                      <p className="text-xs text-slate-500">
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Market Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Trade on This Market
                  </CardTitle>
                  <CardDescription>
                    Buy YES or NO tokens to participate in this prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!user ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please sign in to trade on this market.
                      </AlertDescription>
                    </Alert>
                  ) : market.status !== 'ACTIVE' ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This market is no longer active for trading.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      {/* Token Type Selection */}
                      <div className="space-y-2">
                        <Label>Choose Your Prediction</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={tradeType === 'YES' ? 'default' : 'outline'}
                            onClick={() => setTradeType('YES')}
                            className={tradeType === 'YES' ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            YES
                          </Button>
                          <Button
                            variant={tradeType === 'NO' ? 'default' : 'outline'}
                            onClick={() => setTradeType('NO')}
                            className={tradeType === 'NO' ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            NO
                          </Button>
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div className="space-y-2">
                        <Label>Number of Tokens</Label>
                        <Input
                          type="number"
                          placeholder="Enter quantity..."
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          min="1"
                        />
                      </div>

                      {/* Trade Preview */}
                      {previewLoading && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Calculating trade...
                        </div>
                      )}

                      {previewData?.data && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-1">
                              <p><strong>Total Cost:</strong> ₹{previewData.data.totalCost.toFixed(2)}</p>
                              <p><strong>Price per Token:</strong> ₹{previewData.data.pricePerToken.toFixed(2)}</p>
                              <p><strong>Platform Fee:</strong> ₹{previewData.data.platformFee.toFixed(2)}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Trade Button */}
                      <Button
                        onClick={handleTrade}
                        disabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || isTrading || buyLoading}
                        className={`w-full ${tradeType === 'YES' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
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

                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Market Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Total Volume</span>
                      <span className="font-semibold">₹{(marketStats?.totalVolume || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Participants</span>
                      <span className="font-semibold">{marketStats?.totalParticipants || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">YES Tokens</span>
                      <span className="font-semibold">{marketStats?.totalYesTokens || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">NO Tokens</span>
                      <span className="font-semibold">{marketStats?.totalNoTokens || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Resolution Date</span>
                      <span className="font-semibold">{new Date(market.resolutionDate).toLocaleDateString()}</span>
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
