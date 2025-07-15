'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGetQuestionsQuery } from '@/lib/services/api' // Adjust path as needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, TrendingUp, Users, Timer } from 'lucide-react'

type Question = {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  resolutionDate: string
  isResolved: boolean
  resolvedAnswer: string | null
  constantValue: number
  totalYesTokens: number
  totalNoTokens: number
  currentYesPrice: number
  currentNoPrice: number
  status: string
  creator: {
    id: string
    firstName: string
    lastName: string
  }
  yesToken: {
    currentPrice: number
    circulatingSupply: number
    totalVolume: number
  }
  noToken: {
    currentPrice: number
    circulatingSupply: number
    totalVolume: number
  }
  _count: {
    yesTokenHoldings: number
    noTokenHoldings: number
  }
}

const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatVolume = (volume: number): string => {
  return volume >= 1000000
    ? `$${(volume / 1_000_000).toFixed(1)}M`
    : `$${(volume / 1000).toFixed(1)}K`
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'PAUSED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'RESOLVED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'sports': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'politics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'tech': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const QuestionCard  = ({ question, index }) => {
  const yesPercentage = Math.round(
    (question.currentYesPrice / (question.currentYesPrice + question.currentNoPrice)) * 100
  )
  
  const totalParticipants = question._count.yesTokenHoldings + question._count.noTokenHoldings
  const totalVolume = question.yesToken.totalVolume + question.noToken.totalVolume
console.log(question.id)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link href={`/questions/${question.id}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex gap-2">
                <Badge variant="outline" className={getCategoryColor(question.category)}>
                  {question.category}
                </Badge>
                <Badge variant="outline" className={getStatusColor(question.status)}>
                  {question.status}
                </Badge>
              </div>
              {question.imageUrl && (
                <img 
                  src={question.imageUrl} 
                  alt={question.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {question.title}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {question.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">YES</span>
                <span className="text-lg font-bold text-green-600">
                  {/* ${question.currentYesPrice.toFixed(2)} */}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">NO</span>
                <span className="text-lg font-bold text-red-600">
                  {/* ${question.currentNoPrice.toFixed(2)} */}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>YES {yesPercentage}%</span>
                <span>NO {100 - yesPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${yesPercentage}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Vol: {formatVolume(totalVolume)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{totalParticipants} traders</span>
              </div>
              <div className="flex items-center space-x-1">
                <Timer className="w-3 h-3" />
                <span>{formatDate(question.resolutionDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

const QuestionCardSkeleton: React.FC = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-2 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardContent>
  </Card>
)

const Questions: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  const { 
    data, 
    error, 
    isLoading, 
    isFetching 
  } = useGetQuestionsQuery({
    
  })

  const handleLoadMore = () => {
    if (data?.data?.pagination?.hasNext) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <section className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Prediction Markets
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trade on real-world events with instant liquidity and transparent pricing
          </p>
        </motion.div>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              Failed to load questions. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {isLoading ? (
            // Show skeleton cards while loading
            Array.from({ length: 6 }).map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))
          ) : (
            data?.data?.questions?.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))
          )}
        </div>

        {data?.data?.pagination?.hasNext && (
          <div className="flex justify-center">
            <Button 
              onClick={handleLoadMore}
              disabled={isFetching}
              variant="outline"
              size="lg"
            >
              {isFetching ? 'Loading...' : 'Load More Questions'}
            </Button>
          </div>
        )}

        {data?.data?.questions?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No questions found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Questions
