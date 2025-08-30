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
  Search
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <ArrowUpDown className="w-10 h-10 text-blue-500" />
              P2P Trading
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Trade tokens directly with other users at your preferred prices
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Question Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Select a Market
              </CardTitle>
              <CardDescription>
                Choose a question to view its order book and start trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search Questions</Label>
                <Input
                  id="search"
                  placeholder="Search for questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="question">Select Question</Label>
                <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a question to trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredQuestions.map((question) => (
                      <SelectItem key={question.id} value={question.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{question.title}</span>
                          <span className="text-xs text-slate-500">
                            YES: ₹{Number(question.currentYesPrice).toFixed(2)} | NO: ₹{Number(question.currentNoPrice).toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedQuestionData && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
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
              className="xl:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Order Book
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchOrderBook()}
                    disabled={orderBookLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${orderBookLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="YES">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="YES">YES Orders</TabsTrigger>
                      <TabsTrigger value="NO">NO Orders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="YES" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* YES Buy Orders */}
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Buy Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                              ))}
                            </div>
                          ) : orderBook?.yesOrders.buys.length ? (
                            <div className="space-y-2">
                              {orderBook.yesOrders.buys.map((order: any) => (
                                <div key={order.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-slate-600">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                    >
                                      Sell to
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-center py-4">No buy orders</p>
                          )}
                        </div>

                        {/* YES Sell Orders */}
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Sell Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                              ))}
                            </div>
                          ) : orderBook?.yesOrders.sells.length ? (
                            <div className="space-y-2">
                              {orderBook.yesOrders.sells.map((order: any) => (
                                <div key={order.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-slate-600">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                    >
                                      Buy from
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-center py-4">No sell orders</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="NO" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* NO Buy Orders */}
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Buy Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                              ))}
                            </div>
                          ) : orderBook?.noOrders.buys.length ? (
                            <div className="space-y-2">
                              {orderBook.noOrders.buys.map((order: any) => (
                                <div key={order.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-slate-600">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                    >
                                      Sell to
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-center py-4">No buy orders</p>
                          )}
                        </div>

                        {/* NO Sell Orders */}
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Sell Orders
                          </h4>
                          {orderBookLoading ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                              ))}
                            </div>
                          ) : orderBook?.noOrders.sells.length ? (
                            <div className="space-y-2">
                              {orderBook.noOrders.sells.map((order: any) => (
                                <div key={order.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">₹{Number(order.pricePerToken).toFixed(2)}</p>
                                      <p className="text-sm text-slate-600">{order.remainingQuantity} tokens</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMatchOrder(order.id, order.remainingQuantity)}
                                      disabled={matchOrderLoading}
                                    >
                                      Buy from
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-center py-4">No sell orders</p>
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
              className="space-y-6"
            >
              {/* Create Order Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Order
                  </CardTitle>
                  <CardDescription>
                    Place a buy or sell order at your preferred price
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Order Type</Label>
                    <Select value={orderType} onValueChange={(value) => setOrderType(value as 'BUY' | 'SELL')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUY">Buy Order</SelectItem>
                        <SelectItem value="SELL">Sell Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Token Type</Label>
                    <Select value={selectedTokenType} onValueChange={(value) => setSelectedTokenType(value as 'YES' | 'NO')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">YES Tokens</SelectItem>
                        <SelectItem value="NO">NO Tokens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Number of tokens"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price per Token (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Price in rupees"
                      value={pricePerToken}
                      onChange={(e) => setPricePerToken(e.target.value)}
                      min="0.01"
                    />
                  </div>

                  {quantity && pricePerToken && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium">
                        Total: ₹{Number(parseInt(quantity || '0') * parseFloat(pricePerToken || '0')).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleCreateOrder}
                    disabled={!quantity || !pricePerToken || createOrderLoading}
                    className="w-full"
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    My Orders
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchUserOrders()}
                    disabled={userOrdersLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${userOrdersLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  {userOrdersLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : userOrders.length ? (
                    <div className="space-y-3">
                      {userOrders.map((order: any) => (
                        <div key={order.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={order.orderType === 'BUY' ? 'default' : 'secondary'}>
                                  {order.orderType}
                                </Badge>
                                <Badge variant="outline">
                                  {order.tokenType}
                                </Badge>
                                <Badge 
                                  variant={
                                    order.status === 'PENDING' ? 'default' :
                                    order.status === 'FILLED' ? 'default' :
                                    order.status === 'CANCELLED' ? 'destructive' : 'secondary'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">
                                {order.remainingQuantity}/{order.quantity} @ ₹{Number(order.pricePerToken).toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {order.question?.title}
                              </p>
                            </div>
                            {order.status === 'PENDING' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancelOrderLoading}
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
                      <Clock className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">No orders yet</p>
                      <p className="text-xs text-slate-400">Create your first order above</p>
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
            className="text-center py-12"
          >
            <ArrowUpDown className="w-24 h-24 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Select a Market to Start Trading
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Choose a question from the dropdown above to view its order book and start P2P trading
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default P2PPage
