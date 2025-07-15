// app/questions/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGetQuestionByIdQuery, useGetQuestionPriceHistoryQuery, useGetQuestionOrderBookQuery } from '@/lib/services/api';
import Navigation from '@/components/sections/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Activity,
  User,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import React from 'react';

// Define the types locally since you're importing Question from API
type Question = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  resolutionDate: string;
  isResolved: boolean;
  resolvedAnswer: string | null;
  constantValue: number;
  totalYesTokens: number;
  totalNoTokens: number;
  currentYesPrice: number;
  currentNoPrice: number;
  status: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  yesToken: {
    currentPrice: number;
    availableSupply: number;
    circulatingSupply: number;
    totalVolume: number;
  };
  noToken: {
    currentPrice: number;
    availableSupply: number;
    circulatingSupply: number;
    totalVolume: number;
  };
  yesTokenHoldings: Array<{
    quantity: number;
    averageBuyPrice: number;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
  noTokenHoldings: Array<{
    quantity: number;
    averageBuyPrice: number;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
  marketResolution: any;
};

type MarketStats = {
  totalParticipants: number;
  totalVolume: number;
  yesHolders: number;
  noHolders: number;
  totalYesTokens: number;
  totalNoTokens: number;
  yesPercentage: string;
  noPercentage: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'PAUSED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'RESOLVED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'sports': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'politics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'tech': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  }
  return `$${(volume / 1000).toFixed(1)}K`;
};

// Price Chart Component
const PriceChart = ({ questionId }: { questionId: string }) => {
  const { data: priceHistory, isLoading } = useGetQuestionPriceHistoryQuery({
    id: questionId,
    timeframe: '7d',
    interval: '1h'
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  // Mock chart data for demonstration
  const mockData = [
    { time: '7d ago', yes: 1.20, no: 1.90 },
    { time: '6d ago', yes: 1.22, no: 1.88 },
    { time: '5d ago', yes: 1.24, no: 1.86 },
    { time: '4d ago', yes: 1.23, no: 1.87 },
    { time: '3d ago', yes: 1.25, no: 1.85 },
    { time: '2d ago', yes: 1.26, no: 1.84 },
    { time: '1d ago', yes: 1.25, no: 1.85 },
    { time: 'Now', yes: 1.25, no: 2.00 },
  ];

  return (
    <div className="h-64 w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex items-end justify-around">
      {mockData.map((point, index) => (
        <div key={index} className="flex flex-col items-center space-y-1">
          <div className="flex flex-col space-y-1">
            <div 
              className="w-2 bg-green-500 rounded-t"
              style={{ height: `${point.yes * 40}px` }}
            />
            <div 
              className="w-2 bg-red-500 rounded-b"
              style={{ height: `${point.no * 30}px` }}
            />
          </div>
          <span className="text-xs text-gray-500 transform rotate-45 origin-bottom-left">
            {point.time}
          </span>
        </div>
      ))}
    </div>
  );
};

// Order Book Component
const OrderBook = ({ questionId }: { questionId: string }) => {
  const { data: orderBook, isLoading } = useGetQuestionOrderBookQuery(questionId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!orderBook?.success) {
    return (
      <Alert>
        <AlertDescription>
          {/* Error loading order book: {orderBook?.error || 'Unknown error'} */}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-400">
          YES Orders (Sells)
        </h3>
        {orderBook.data.yesOrders.sells.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No sell orders</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Seller</th>
                  <th className="text-left py-2">Expires</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.data.yesOrders.sells.map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">{order.quantity}</td>
                    <td className="py-2">${order.pricePerToken.toFixed(2)}</td>
                    <td className="py-2">{order.userName || order.userId}</td>
                    <td className="py-2">{formatDate(order.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-red-700 dark:text-red-400">
          NO Orders (Buys)
        </h3>
        {orderBook.data.noOrders.buys.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No buy orders</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Buyer</th>
                  <th className="text-left py-2">Expires</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.data.noOrders.buys.map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">{order.quantity}</td>
                    <td className="py-2">${order.pricePerToken.toFixed(2)}</td>
                    <td className="py-2">{order.userName || order.userId}</td>
                    <td className="py-2">{formatDate(order.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Token Holdings Component
const TokenHoldings = ({ yesHoldings, noHoldings }: { 
  yesHoldings: Question['yesTokenHoldings'], 
  noHoldings: Question['noTokenHoldings'] 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-400">
          YES Token Holdings
        </h3>
        {yesHoldings.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No YES token holders</div>
        ) : (
          <div className="space-y-2">
            {yesHoldings.map((holding, index) => (
              <Card key={index} className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {holding.user.firstName || holding.user.lastName 
                        ? `${holding.user.firstName || ''} ${holding.user.lastName || ''}`.trim()
                        : holding.user.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{holding.quantity} tokens</div>
                    <div className="text-sm text-gray-500">
                      Avg: ${holding.averageBuyPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-red-700 dark:text-red-400">
          NO Token Holdings
        </h3>
        {noHoldings.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No NO token holders</div>
        ) : (
          <div className="space-y-2">
            {noHoldings.map((holding, index) => (
              <Card key={index} className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {holding.user.firstName || holding.user.lastName 
                        ? `${holding.user.firstName || ''} ${holding.user.lastName || ''}`.trim()
                        : holding.user.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{holding.quantity} tokens</div>
                    <div className="text-sm text-gray-500">
                      {/* Avg: ${holding.averageBuyPrice.toFixed(2)} */}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

     

export default function QuestionDetails({
  params,
}:{
  params:Promise<{questionid:string}>
}) {
  const { questionid } = React.use(params)
  
  
  
  const { data, error, isLoading } = useGetQuestionByIdQuery(questionid as string);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !data?.success) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>
                {/* Error loading question: {error?.message || data?.error || 'Unknown error'} */}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  const question = data.data.question;
  const stats = data.data.marketStats;
  const yesPercentage = parseFloat(stats.yesPercentage);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={getCategoryColor(question.category)}>
                      {question.category}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(question.status)}>
                      {question.status}
                    </Badge>
                    {question.isResolved && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Resolved: {question.resolvedAnswer}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">{question.title}</h1>
                  <p className="text-muted-foreground text-lg mb-4">{question.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Ends: {formatDate(question.resolutionDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>By: {question.creator.firstName} {question.creator.lastName}</span>
                    </div>
                  </div>
                </div>
                {question.imageUrl && (
                  <div className="lg:w-64">
                    <img 
                      src={question.imageUrl} 
                      alt={question.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Price Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <ChevronUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        YES Price
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                      {/* ${question.currentYesPrice.toFixed(2)} */}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-500">
                      {question.yesToken?.circulatingSupply} tokens in circulation
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <ChevronDown className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        NO Price
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
                      {/* ${question.currentNoPrice.toFixed(2)} */}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-500">
                      {question.noToken?.circulatingSupply} tokens in circulation
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
              className="mb-8"
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Market Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                      <div className="text-sm text-muted-foreground">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatVolume(stats.totalVolume)}</div>
                      <div className="text-sm text-muted-foreground">Total Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.yesHolders}</div>
                      <div className="text-sm text-muted-foreground">YES Holders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.noHolders}</div>
                      <div className="text-sm text-muted-foreground">NO Holders</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chart">Price Chart</TabsTrigger>
                  <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                  <TabsTrigger value="holdings">Token Holdings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Price History (7 Days)
                      </CardTitle>
                      <CardDescription>
                        Historical price movement for YES and NO tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PriceChart questionId={question.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orderbook" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowUpDown className="w-5 h-5" />
                        Order Book
                      </CardTitle>
                      <CardDescription>
                        Current buy and sell orders from other traders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OrderBook questionId={question.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="holdings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Token Holdings
                      </CardTitle>
                      <CardDescription>
                        Current token holders and their positions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TokenHoldings 
                        yesHoldings={question.yesTokenHoldings} 
                        noHoldings={question.noTokenHoldings} 
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Trading Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Trade on This Market</CardTitle>
                  <CardDescription>
                    Buy YES or NO tokens to participate in this prediction market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {/* Buy YES at ${question.currentYesPrice.toFixed(2)} */}
                    </Button>
                    <Button size="lg" variant="destructive" className="flex-1">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {/* Buy NO at ${question.currentNoPrice.toFixed(2)} */}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
