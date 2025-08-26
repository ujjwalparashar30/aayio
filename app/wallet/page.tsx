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
  Target
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

  const userId = user?.id || "test-user-id"

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
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <Wallet className="w-10 h-10 text-blue-500" />
              Your Game Wallet
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Manage your play money and track your trading transactions
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {balanceLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium mb-1">Available Balance</p>
                      <p className="text-3xl font-bold">
                        ₹{(balance?.available || 0).toLocaleString()}
                      </p>
                    </div>
                    <Wallet className="w-10 h-10" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium mb-1">Locked in Trades</p>
                      <p className="text-3xl font-bold">
                        ₹{(balance?.locked || 0).toLocaleString()}
                      </p>
                    </div>
                    <Target className="w-10 h-10" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-1">P2P Escrow</p>
                      <p className="text-3xl font-bold">
                        ₹{(balance?.p2pEscrow || 0).toLocaleString()}
                      </p>
                    </div>
                    <Send className="w-10 h-10" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
                      <p className="text-3xl font-bold">
                        ₹{(balance?.total || 0).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="add-money" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-money" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Money
              </TabsTrigger>
              <TabsTrigger value="transfer" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Transfer
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Add Money Tab */}
            <TabsContent value="add-money">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Add Play Money
                  </CardTitle>
                  <CardDescription>
                    Add virtual money to your account for trading. It's completely free!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      🎮 This is play money! No real money is involved. Add as much as you need for trading.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount..."
                          value={addMoneyAmount}
                          onChange={(e) => setAddMoneyAmount(e.target.value)}
                          min="1"
                          max="100000"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Maximum ₹1,00,000 per transaction
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                          id="description"
                          placeholder="e.g., Starting balance, Top up..."
                          value={addMoneyDescription}
                          onChange={(e) => setAddMoneyDescription(e.target.value)}
                        />
                      </div>

                      <Button
                        onClick={handleAddMoney}
                        disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0 || addMoneyLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
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
                      <h4 className="font-medium">Quick Add Options:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[1000, 5000, 10000, 25000].map(amount => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setAddMoneyAmount(amount.toString())}
                          >
                            ₹{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      
                      {lifetime && (
                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h5 className="font-medium mb-2">Lifetime Stats</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Total Added:</span>
                              <span className="font-medium">₹{lifetime.totalAdded.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Spent:</span>
                              <span className="font-medium">₹{lifetime.totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Net Gain:</span>
                              <span className={`font-medium ${
                                lifetime.netGain >= 0 ? 'text-green-600' : 'text-red-600'
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Transfer Money
                  </CardTitle>
                  <CardDescription>
                    Send play money to another user on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Make sure you have the correct user ID. Transfers cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="transfer-amount">Amount (₹)</Label>
                        <Input
                          id="transfer-amount"
                          type="number"
                          placeholder="Enter amount..."
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          min="1"
                          max={balance?.available || 0}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Available: ₹{(balance?.available || 0).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="recipient">Recipient User ID</Label>
                        <Input
                          id="recipient"
                          placeholder="Enter user ID..."
                          value={transferUserId}
                          onChange={(e) => setTransferUserId(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="transfer-description">Message (Optional)</Label>
                        <Textarea
                          id="transfer-description"
                          placeholder="Add a message..."
                          value={transferDescription}
                          onChange={(e) => setTransferDescription(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={handleTransfer}
                        disabled={!transferAmount || !transferUserId || parseFloat(transferAmount) <= 0 || transferLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
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

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h4 className="font-medium mb-3">Transfer Limits</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Maximum per transfer:</span>
                          <span className="font-medium">₹50,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily limit:</span>
                          <span className="font-medium">Unlimited</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing time:</span>
                          <span className="font-medium">Instant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    Your complete wallet activity and trading history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                          <Skeleton className="h-6 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No transactions yet
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
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
                          className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${
                              transaction.type === 'DEPOSIT' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {transaction.description || (transaction.type === 'DEPOSIT' ? 'Money Added' : 'Money Spent')}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                                {new Date(transaction.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              transaction.type === 'DEPOSIT' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'DEPOSIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </p>
                            <Badge variant="outline" className="text-xs">
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
