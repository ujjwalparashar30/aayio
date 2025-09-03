'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { 
  useGetP2POrderBookQuery,
  useGetUserOrdersQuery,
  useCreateP2POrderMutation,
  useMatchOrderMutation,
  useCancelOrderMutation,
  useGetQuestionsQuery
} from '@/lib/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from "sonner"
import { montserrat } from '@/lib/fonts'
import { 
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Clock,
  Users,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
  Rocket
} from 'lucide-react'

const P2PPage = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  
  // State
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [selectedTokenType, setSelectedTokenType] = useState<'YES' | 'NO'>('YES')
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY')
  const [quantity, setQuantity] = useState('')
  const [pricePerToken, setPricePerToken] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  const userId = user?.id

  // API Queries
  const { 
    data: questionsData, 
    isLoading: questionsLoading 
  } = useGetQuestionsQuery({
    status: 'ACTIVE',
    limit: 50
  })

  const { 
    data: orderBookData, 
    isLoading: orderBookLoading,
    refetch: refetchOrderBook 
  } = useGetP2POrderBookQuery(selectedQuestion, {
    skip: !selectedQuestion,
    pollingInterval: 5000 // Refresh every 5 seconds
  })

  const { 
    data: userOrdersData, 
    isLoading: userOrdersLoading,
    refetch: refetchUserOrders 
  } = useGetUserOrdersQuery({
    userId: userId!,
    page: 1,
    limit: 20
  }, {
    skip: !userId
  })

  // Mutations
  const [createOrder, { isLoading: createOrderLoading }] = useCreateP2POrderMutation()
  const [matchOrder, { isLoading: matchOrderLoading }] = useMatchOrderMutation()
  const [cancelOrder, { isLoading: cancelOrderLoading }] = useCancelOrderMutation()

  const questions = questionsData?.data?.questions || []
  const orderBook = orderBookData?.data
  const userOrders = userOrdersData?.data?.orders || []

  const selectedQuestionData = questions.find(q => q.id === selectedQuestion)

  // Filter questions based on search
  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateOrder = async () => {
    if (!selectedQuestion || !quantity || !pricePerToken) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      await createOrder({
          questionId: selectedQuestion,
          orderType,
          tokenType: selectedTokenType,
          quantity: parseInt(quantity),
          pricePerToken: parseFloat(pricePerToken),
      }).unwrap()

      toast.success("Order created successfully! 🎉")
      setQuantity('')
      setPricePerToken('')
      refetchOrderBook()
      refetchUserOrders()
    } catch (error: any) {
      toast.error(error.data?.error || "Failed to create order")
    }
  }

  const handleMatchOrder = async (orderId: string, orderQuantity: number) => {
    try {
      await matchOrder({
        orderId,
        quantity: orderQuantity
      }).unwrap()

      toast.success("Order matched successfully! 💸")
      refetchOrderBook()
      refetchUserOrders()
    } catch (error: any) {
      toast.error(error.data?.error || "Failed to match order")
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId).unwrap()
      toast.success("Order cancelled successfully")
      refetchUserOrders()
      refetchOrderBook()
    } catch (error: any) {
      toast.error(error.data?.error || "Failed to cancel order")
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white/30"></div>
      </div>
    )
  }

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
            P2P Trading
            <div className="inline-block ml-4">
              <ArrowUpDown className="w-12 h-12 text-white animate-pulse" />
            </div>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Trade tokens directly with other users at your preferred prices
          </p>
        </motion.div>

        {/* Question Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                Select a Market
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose a question to view its order book and start trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search" className="text-white">Search Questions</Label>
                <Input
                  id="search"
                  placeholder="Search for questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                />
              </div>
              
              <div>
                <Label htmlFor="question" className="text-white">Select Question</Label>
                <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                  <SelectTrigger className="bg-white/5 border-white/15 text-white">
                    <SelectValue placeholder="Choose a question to trade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/20 text-white">
                    {filteredQuestions.map((question) => (
                      <SelectItem key={question.id} value={question.id} className="focus:bg-white/10">
                        <div className="flex flex-col">
                          <span className="font-medium">{question.title}</span>
                          <span className="text-xs text-gray-400">
                            YES: ₹{Number(question.currentYesPrice).toFixed(2)} | NO: ₹{Number(question.currentNoPrice).toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedQuestionData && (
                <Alert className="bg-green-500/10 border-green-500/30">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">
                    Trading <strong>{selectedQuestionData.title}</strong> - 
                    Current YES: ₹{Number(selectedQuestionData.currentYesPrice).toFixed(2)}, 
                    NO: ₹{Number(selectedQuestionData.currentNoPrice).toFixed(2)}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {selectedQuestion && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Order Book */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2"
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Order Book
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchOrderBook()}
                    disabled={orderBookLoading}
                    className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                  >
                    <RefreshCw className={`w-4 h-4 ${orderBookLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="YES">
                    <TabsList className="flex justify-center bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-1 grid w-full grid-cols-2">
                      <TabsTrigger 
                        value="YES" 
                        className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg"
                      >
                        YES Orders
                      </TabsTrigger>
                      <TabsTrigger 
                        value="NO" 
                        className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg"
                      >
                        NO Orders
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="YES" className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* YES Buy Orders */}
                        <div>
                          <h4 className={`font-semibold text-green-400 mb-2 flex items-center gap-2 ${montserrat.className}`}>
                            <TrendingUp className="w-4 h-4" />
                            Buy Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full bg-white/20" />
                              ))}
                            </div>
                          ) : orderBook?.yesOrders.buys.length ? (
                            <div className="space-y-2">
                              {orderBook.yesOrders.buys.map((order: any) => (
                                <div key={order.id} className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-white">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-green-300">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                      className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                                    >
                                      Sell to
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-4">No buy orders</p>
                          )}
                        </div>

                        {/* YES Sell Orders */}
                        <div>
                          <h4 className={`font-semibold text-red-400 mb-2 flex items-center gap-2 ${montserrat.className}`}>
                            <TrendingDown className="w-4 h-4" />
                            Sell Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full bg-white/20" />
                              ))}
                            </div>
                          ) : orderBook?.yesOrders.sells.length ? (
                            <div className="space-y-2">
                              {orderBook.yesOrders.sells.map((order: any) => (
                                <div key={order.id} className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-white">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-red-300">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                      className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                                    >
                                      Buy from
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-4">No sell orders</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="NO" className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* NO Buy Orders */}
                        <div>
                          <h4 className={`font-semibold text-green-400 mb-2 flex items-center gap-2 ${montserrat.className}`}>
                            <TrendingUp className="w-4 h-4" />
                            Buy Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full bg-white/20" />
                              ))}
                            </div>
                          ) : orderBook?.noOrders.buys.length ? (
                            <div className="space-y-2">
                              {orderBook.noOrders.buys.map((order: any) => (
                                <div key={order.id} className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-white">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-green-300">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                      className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                                    >
                                      Sell to
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-4">No buy orders</p>
                          )}
                        </div>

                        {/* NO Sell Orders */}
                        <div>
                          <h4 className={`font-semibold text-red-400 mb-2 flex items-center gap-2 ${montserrat.className}`}>
                            <TrendingDown className="w-4 h-4" />
                            Sell Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full bg-white/20" />
                              ))}
                            </div>
                          ) : orderBook?.noOrders.sells.length ? (
                            <div className="space-y-2">
                              {orderBook.noOrders.sells.map((order: any) => (
                                <div key={order.id} className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-white">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-red-300">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                      className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                                    >
                                      Buy from
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-4">No sell orders</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {/* Create Order + My Orders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {/* Create Order Form */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-green-600 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    Create Order
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Place a buy or sell order at your preferred price
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Order Type</Label>
                    <Select value={orderType} onValueChange={(value) => setOrderType(value as 'BUY' | 'SELL')}>
                      <SelectTrigger className="bg-white/5 border-white/15 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/20 text-white">
                        <SelectItem value="BUY" className="focus:bg-white/10">Buy Order</SelectItem>
                        <SelectItem value="SELL" className="focus:bg-white/10">Sell Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Token Type</Label>
                    <Select value={selectedTokenType} onValueChange={(value) => setSelectedTokenType(value as 'YES' | 'NO')}>
                      <SelectTrigger className="bg-white/5 border-white/15 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/20 text-white">
                        <SelectItem value="YES" className="focus:bg-white/10">YES Tokens</SelectItem>
                        <SelectItem value="NO" className="focus:bg-white/10">NO Tokens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-white">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Number of tokens"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-white">Price per Token (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Price in rupees"
                      value={pricePerToken}
                      onChange={(e) => setPricePerToken(e.target.value)}
                      min="0.01"
                      className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                    />
                  </div>

                  {quantity && pricePerToken && (
                    <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <p className={`text-sm font-medium text-white ${montserrat.className}`}>
                        Total: ₹{Number(parseInt(quantity || '0') * parseFloat(pricePerToken || '0')).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleCreateOrder}
                    disabled={!quantity || !pricePerToken || createOrderLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                    size="lg"
                  >
                    {createOrderLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create {orderType} Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* My Orders */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/15 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    My Orders
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchUserOrders()}
                    disabled={userOrdersLoading}
                    className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                  >
                    <RefreshCw className={`w-4 h-4 ${userOrdersLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  {userOrdersLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full bg-white/20" />
                      ))}
                    </div>
                  ) : userOrders.length ? (
                    <div className="space-y-3">
                      {userOrders.map((order: any) => (
                        <div key={order.id} className="p-3 bg-white/5 backdrop-blur-sm border border-white/15 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={order.orderType === 'BUY' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}>
                                  {order.orderType}
                                </Badge>
                                <Badge className="bg-white/10 text-white border-white/20">
                                  {order.tokenType}
                                </Badge>
                                <Badge className={
                                  order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                  order.status === 'FILLED' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                  order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                }>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className={`text-sm font-medium text-white ${montserrat.className}`}>
                                {order.remainingQuantity}/{order.quantity} @ ₹{Number(order.pricePerToken).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {order.question?.title}
                              </p>
                            </div>
                            {order.status === 'PENDING' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancelOrderLoading}
                                className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">No orders yet</p>
                      <p className="text-xs text-gray-500">Create your first order above</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {!selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <ArrowUpDown className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-2xl font-semibold text-white mb-2 ${montserrat.className}`}>
              Select a Market to Start Trading
            </h3>
            <p className="text-gray-400">
              Choose a question from the dropdown above to view its order book and start P2P trading
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default P2PPage
