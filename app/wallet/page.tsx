'use client'

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { 
  useGetBalanceQuery,
  useAddPlayMoneyMutation,
  useGetTransactionHistoryQuery,
  useTransferMoneyMutation
} from '@/lib/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { montserrat } from '@/lib/fonts'
import { 
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  CreditCard,
  TrendingUp,
  Target,
  Rocket
} from 'lucide-react'

const WalletPage = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  
  const [addMoneyAmount, setAddMoneyAmount] = useState('')
  const [addMoneyDescription, setAddMoneyDescription] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferUserId, setTransferUserId] = useState('')
  const [transferDescription, setTransferDescription] = useState('')

  // Redirect if not signed in
  React.useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  const userId = user?.id || "cmeyovx9e0000k4af1qcjost7"
  
  // RTK Query hooks
  const { 
    data: balanceData, 
    isLoading: balanceLoading,
    refetch: refetchBalance 
  } = useGetBalanceQuery(userId)

  const { 
    data: transactionData, 
    isLoading: transactionsLoading 
  } = useGetTransactionHistoryQuery({ 
    userId, 
    page: 1, 
    limit: 20 
  })

  const [addMoney, { isLoading: addMoneyLoading }] = useAddPlayMoneyMutation()
  const [transferMoney, { isLoading: transferLoading }] = useTransferMoneyMutation()

  const balance = balanceData?.data?.balances
  const lifetime = balanceData?.data?.lifetime
  const transactions = transactionData?.data?.transactions || []

  const handleAddMoney = async () => {
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid amount to add",
      })
      return
    }

    try {
      await addMoney({
        userId,
        amount: parseFloat(addMoneyAmount),
        description: addMoneyDescription || undefined
      }).unwrap()

      toast.success("Money Added! 🎉", {
        description: `Successfully added ₹${parseFloat(addMoneyAmount).toLocaleString()} to your wallet`,
      })

      setAddMoneyAmount('')
      setAddMoneyDescription('')
      refetchBalance()
    } catch (error: any) {
      toast.error("Failed to Add Money", {
        description: error.data?.error || "Something went wrong",
      })
    }
  }

  const handleTransfer = async () => {
    if (!transferAmount || !transferUserId) {
      toast.error("Missing Information", {
        description: "Please enter both amount and recipient user ID"
      })
      return
    }

    try {
      await transferMoney({
        fromUserId: userId,
        toUserId: transferUserId,
        amount: parseFloat(transferAmount),
        description: transferDescription || undefined
      }).unwrap()

      toast.success("Transfer Successful! 💸", {
        description: `Successfully transferred ₹${parseFloat(transferAmount).toLocaleString()}`,
      })

      setTransferAmount('')
      setTransferUserId('')
      setTransferDescription('')
      refetchBalance()
    } catch (error: any) {
      toast.error("Transfer Failed", {
        description: error.data?.error || "Something went wrong",
      })
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
      
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className={`text-4xl md:text-5xl font-bold text-white ${montserrat.className}`}>
            Your Game Wallet
            <div className="inline-block ml-4">
              <Wallet className="w-12 h-12 text-white animate-pulse" />
            </div>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Manage your play money and track your trading transactions
          </p>
        </motion.div>

        {/* Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {balanceLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                <Skeleton className="h-8 w-24 mb-2 bg-white/20" />
                <Skeleton className="h-6 w-32 bg-white/20" />
              </Card>
            ))
          ) : (
            <>
              <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(16,185,129,0.3)] hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium mb-1">Available Balance</p>
                    <p className={`text-3xl font-bold text-white ${montserrat.className}`}>
                      ₹{(balance?.available || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(249,115,22,0.3)] hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-sm font-medium mb-1">Locked in Trades</p>
                    <p className={`text-3xl font-bold text-white ${montserrat.className}`}>
                      ₹{(balance?.locked || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(147,51,234,0.3)] hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium mb-1">P2P Escrow</p>
                    <p className={`text-3xl font-bold text-white ${montserrat.className}`}>
                      ₹{(balance?.p2pEscrow || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(59,130,246,0.3)] hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium mb-1">Total Balance</p>
                    <p className={`text-3xl font-bold text-white ${montserrat.className}`}>
                      ₹{(balance?.total || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>
            </>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="add-money" className="space-y-6">
            <TabsList className="flex justify-center bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-1 grid w-full grid-cols-3">
              <TabsTrigger 
                value="add-money" 
                className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Money
              </TabsTrigger>
              <TabsTrigger 
                value="transfer" 
                className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Transfer
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 data-[state=active]:text-white rounded-lg flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Add Money Tab */}
            <TabsContent value="add-money">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-green-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    Add Play Money
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Add virtual money to your account for trading. It's completely free!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-500/10 border-green-500/30">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      🎮 This is play money! No real money is involved. Add as much as you need for trading.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount" className="text-white">Amount (₹)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount..."
                          value={addMoneyAmount}
                          onChange={(e) => setAddMoneyAmount(e.target.value)}
                          min="1"
                          max="100000"
                          className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Maximum ₹1,00,000 per transaction
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                        <Input
                          id="description"
                          placeholder="e.g., Starting balance, Top up..."
                          value={addMoneyDescription}
                          onChange={(e) => setAddMoneyDescription(e.target.value)}
                          className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                        />
                      </div>

                      <Button
                        onClick={handleAddMoney}
                        disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0 || addMoneyLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
                        size="lg"
                      >
                        {addMoneyLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding Money...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add ₹{addMoneyAmount || '0'} to Wallet
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className={`font-medium text-white ${montserrat.className}`}>Quick Add Options:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[1000, 5000, 10000, 25000].map(amount => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setAddMoneyAmount(amount.toString())}
                            className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                          >
                            ₹{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      
                      {lifetime && (
                        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/15">
                          <h5 className={`font-medium mb-2 text-white ${montserrat.className}`}>Lifetime Stats</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Added:</span>
                              <span className="font-medium text-white">₹{lifetime.totalAdded.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Spent:</span>
                              <span className="font-medium text-white">₹{lifetime.totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Net Gain:</span>
                              <span className={`font-medium ${
                                lifetime.netGain >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {lifetime.netGain >= 0 ? '+' : ''}₹{lifetime.netGain.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transfer Tab */}
            <TabsContent value="transfer">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    Transfer Money
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Send play money to another user on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-yellow-500/10 border-yellow-500/30">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300">
                      Make sure you have the correct user ID. Transfers cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="transfer-amount" className="text-white">Amount (₹)</Label>
                        <Input
                          id="transfer-amount"
                          type="number"
                          placeholder="Enter amount..."
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          min="1"
                          max={balance?.available || 0}
                          className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Available: ₹{(balance?.available || 0).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="recipient" className="text-white">Recipient User ID</Label>
                        <Input
                          id="recipient"
                          placeholder="Enter user ID..."
                          value={transferUserId}
                          onChange={(e) => setTransferUserId(e.target.value)}
                          className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                        />
                      </div>

                      <div>
                        <Label htmlFor="transfer-description" className="text-white">Message (Optional)</Label>
                        <Textarea
                          id="transfer-description"
                          placeholder="Add a message..."
                          value={transferDescription}
                          onChange={(e) => setTransferDescription(e.target.value)}
                          rows={3}
                          className="bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
                        />
                      </div>

                      <Button
                        onClick={handleTransfer}
                        disabled={!transferAmount || !transferUserId || parseFloat(transferAmount) <= 0 || transferLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg"
                        size="lg"
                      >
                        {transferLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Transferring...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Transfer ₹{transferAmount || '0'}
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/15">
                      <h4 className={`font-medium mb-3 text-white ${montserrat.className}`}>Transfer Limits</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Maximum per transfer:</span>
                          <span className="font-medium text-white">₹50,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Daily limit:</span>
                          <span className="font-medium text-white">Unlimited</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Processing time:</span>
                          <span className="font-medium text-white">Instant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <History className="w-4 h-4 text-white" />
                    </div>
                    Transaction History
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your complete wallet activity and trading history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/15 rounded-xl">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48 bg-white/20" />
                            <Skeleton className="h-3 w-32 bg-white/20" />
                          </div>
                          <Skeleton className="h-6 w-20 bg-white/20" />
                        </div>
                      ))}
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className={`text-lg font-semibold text-white mb-2 ${montserrat.className}`}>
                        No transactions yet
                      </h3>
                      <p className="text-gray-400">
                        Your wallet activity will appear here once you start trading
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction: any, index: number) => (
                        <motion.div
                          key={transaction.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${
                              transaction.type === 'DEPOSIT' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className={`font-medium text-white ${montserrat.className}`}>
                                {transaction.description || (transaction.type === 'DEPOSIT' ? 'Money Added' : 'Money Spent')}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                                {new Date(transaction.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              transaction.type === 'DEPOSIT' 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              {transaction.type === 'DEPOSIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </p>
                            <Badge className="text-xs bg-white/10 text-white border-white/20">
                              {transaction.paymentMethod === 'PLAY_MONEY' ? 'Play Money' : transaction.paymentMethod}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default WalletPage
