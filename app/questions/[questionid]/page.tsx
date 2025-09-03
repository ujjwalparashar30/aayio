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
import { montserrat } from '@/lib/fonts';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Activity,
  User,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Rocket
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
    case 'ACTIVE': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'PAUSED': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'RESOLVED': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'CANCELLED': return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'sports': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'politics': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'tech': return 'bg-green-500/20 text-green-300 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
    return <Skeleton className="h-64 w-full bg-white/20" />;
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
    <div className="h-64 w-full bg-white/5 backdrop-blur-sm rounded-lg p-4 flex items-end justify-around border border-white/15">
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
          <span className="text-xs text-gray-400 transform rotate-45 origin-bottom-left">
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
        <Skeleton className="h-32 w-full bg-white/20" />
        <Skeleton className="h-32 w-full bg-white/20" />
      </div>
    );
  }

  if (!orderBook?.success) {
    return (
      <Alert className="bg-red-500/10 border-red-500/30">
        <AlertDescription className="text-red-300">
          Error loading order book
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-3 text-green-400 ${montserrat.className}`}>
          YES Orders (Sells)
        </h3>
        {orderBook.data.yesOrders.sells.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No sell orders</div>
        ) : (
          <div className="overflow-x-auto bg-white/5 backdrop-blur-sm rounded-lg border border-white/15">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/15">
                  <th className="text-left py-2 px-4 text-gray-300">Quantity</th>
                  <th className="text-left py-2 px-4 text-gray-300">Price</th>
                  <th className="text-left py-2 px-4 text-gray-300">Seller</th>
                  <th className="text-left py-2 px-4 text-gray-300">Expires</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.data.yesOrders.sells.map((order: any) => (
                  <tr key={order.id} className="border-b border-white/10">
                    <td className="py-2 px-4 text-white">{order.quantity}</td>
                    <td className="py-2 px-4 text-white">${order.pricePerToken.toFixed(2)}</td>
                    <td className="py-2 px-4 text-gray-300">{order.userName || order.userId}</td>
                    <td className="py-2 px-4 text-gray-300">{formatDate(order.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-3 text-red-400 ${montserrat.className}`}>
          NO Orders (Buys)
        </h3>
        {orderBook.data.noOrders.buys.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No buy orders</div>
        ) : (
          <div className="overflow-x-auto bg-white/5 backdrop-blur-sm rounded-lg border border-white/15">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/15">
                  <th className="text-left py-2 px-4 text-gray-300">Quantity</th>
                  <th className="text-left py-2 px-4 text-gray-300">Price</th>
                  <th className="text-left py-2 px-4 text-gray-300">Buyer</th>
                  <th className="text-left py-2 px-4 text-gray-300">Expires</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.data.noOrders.buys.map((order: any) => (
                  <tr key={order.id} className="border-b border-white/10">
                    <td className="py-2 px-4 text-white">{order.quantity}</td>
                    <td className="py-2 px-4 text-white">${order.pricePerToken.toFixed(2)}</td>
                    <td className="py-2 px-4 text-gray-300">{order.userName || order.userId}</td>
                    <td className="py-2 px-4 text-gray-300">{formatDate(order.expiresAt)}</td>
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
        <h3 className={`text-lg font-semibold mb-3 text-green-400 ${montserrat.className}`}>
          YES Token Holdings
        </h3>
        {yesHoldings.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No YES token holders</div>
        ) : (
          <div className="space-y-2">
            {yesHoldings.map((holding, index) => (
              <Card key={index} className="p-3 bg-white/5 backdrop-blur-sm border-white/15">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">
                      {holding.user.firstName || holding.user.lastName 
                        ? `${holding.user.firstName || ''} ${holding.user.lastName || ''}`.trim()
                        : holding.user.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{holding.quantity} tokens</div>
                    <div className="text-sm text-gray-400">
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
        <h3 className={`text-lg font-semibold mb-3 text-red-400 ${montserrat.className}`}>
          NO Token Holdings
        </h3>
        {noHoldings.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">No NO token holders</div>
        ) : (
          <div className="space-y-2">
            {noHoldings.map((holding, index) => (
              <Card key={index} className="p-3 bg-white/5 backdrop-blur-sm border-white/15">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">
                      {holding.user.firstName || holding.user.lastName 
                        ? `${holding.user.firstName || ''} ${holding.user.lastName || ''}`.trim()
                        : holding.user.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{holding.quantity} tokens</div>
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
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4 bg-white/20" />
              <Skeleton className="h-64 w-full bg-white/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-32 bg-white/20" />
                <Skeleton className="h-32 bg-white/20" />
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
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertDescription className="text-red-300">
                Error loading question details
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
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950/30 pt-20">
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
                    <Badge className={getCategoryColor(question.category)}>
                      {question.category}
                    </Badge>
                    <Badge className={getStatusColor(question.status)}>
                      {question.status}
                    </Badge>
                    {question.isResolved && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Resolved: {question.resolvedAnswer}
                      </Badge>
                    )}
                  </div>
                  <h1 className={`text-3xl lg:text-4xl font-bold mb-4 text-white ${montserrat.className}`}>
                    {question.title}
                  </h1>
                  <p className="text-gray-300 text-lg mb-4">{question.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
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
                      className="w-full h-48 object-cover rounded-lg border border-white/15"
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
                <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_40px_rgba(16,185,129,0.3)] hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                        <ChevronUp className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium text-green-300 ${montserrat.className}`}>
                        YES Price
                      </span>
                    </div>
                    <div className={`text-3xl font-bold text-green-300 mb-2 ${montserrat.className}`}>
                      ${question.currentYesPrice?.toFixed(2) || '1.00'}
                    </div>
                    <div className="text-xs text-green-400">
                      {question.yesToken?.circulatingSupply || 0} tokens in circulation
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_40px_rgba(239,68,68,0.3)] hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium text-red-300 ${montserrat.className}`}>
                        NO Price
                      </span>
                    </div>
                    <div className={`text-3xl font-bold text-red-300 mb-2 ${montserrat.className}`}>
                      ${question.currentNoPrice?.toFixed(2) || '1.00'}
                    </div>
                    <div className="text-xs text-red-400">
                      {question.noToken?.circulatingSupply || 0} tokens in circulation
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
              <Card className="bg-white/5 backdrop-blur-sm border-white/15">
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
              <Card className="bg-white/5 backdrop-blur-sm border-white/15">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    Market Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-white ${montserrat.className}`}>{stats.totalParticipants}</div>
                      <div className="text-sm text-gray-400">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-white ${montserrat.className}`}>{formatVolume(stats.totalVolume)}</div>
                      <div className="text-sm text-gray-400">Total Volume</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-white ${montserrat.className}`}>{stats.yesHolders}</div>
                      <div className="text-sm text-gray-400">YES Holders</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-white ${montserrat.className}`}>{stats.noHolders}</div>
                      <div className="text-sm text-gray-400">NO Holders</div>
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
                <TabsList className="flex justify-center bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-1 grid w-full grid-cols-3">
                  <TabsTrigger 
                    value="chart" 
                    className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg"
                  >
                    Price Chart
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orderbook" 
                    className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg"
                  >
                    Order Book
                  </TabsTrigger>
                  <TabsTrigger 
                    value="holdings" 
                    className="px-6 py-3 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 data-[state=active]:text-white rounded-lg"
                  >
                    Token Holdings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="mt-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/15">
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        Price History (7 Days)
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Historical price movement for YES and NO tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PriceChart questionId={question.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orderbook" className="mt-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/15">
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <ArrowUpDown className="w-4 h-4 text-white" />
                        </div>
                        Order Book
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Current buy and sell orders from other traders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OrderBook questionId={question.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="holdings" className="mt-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/15">
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-white ${montserrat.className}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        Token Holdings
                      </CardTitle>
                      <CardDescription className="text-gray-400">
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
              <Card className="bg-white/5 backdrop-blur-sm border-white/15">
                <CardHeader>
                  <CardTitle className={`text-white ${montserrat.className}`}>Trade on This Market</CardTitle>
                  <CardDescription className="text-gray-400">
                    Buy YES or NO tokens to participate in this prediction market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Buy YES at ${question.currentYesPrice?.toFixed(2) || '1.00'}
                    </Button>
                    <Button size="lg" className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Buy NO at ${question.currentNoPrice?.toFixed(2) || '1.00'}
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
