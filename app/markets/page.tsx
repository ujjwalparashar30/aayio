'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { motion } from 'framer-motion'
import { useGetQuestionsQuery } from '@/lib/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Filter,
  Calendar, 
  Eye,
  TrendingUp,
  Target,
  ArrowUpDown,
  Grid3X3,
  List,
  Users
} from 'lucide-react'

const MarketsPage = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Fetch markets with filters
  const { 
    data: marketsData, 
    isLoading, 
    error 
  } = useGetQuestionsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    status: selectedStatus || undefined,
    sortBy,
    sortOrder
  })

  const markets = marketsData?.data?.questions || []
  const pagination = marketsData?.data?.pagination

  const categories = ['all', 'crypto', 'sports', 'politics', 'technology', 'entertainment', 'weather']
  const statuses = ['ACTIVE', 'RESOLVED', 'PAUSED']

  const handleMarketClick = (marketId: string) => {
    router.push(`/markets/${marketId}`)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <Target className="w-10 h-10 text-blue-500" />
              Prediction Markets
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Trade on real-world events and test your forecasting skills with our active prediction markets
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); setCurrentPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value); setCurrentPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field)
              setSortOrder(order as 'asc' | 'desc')
              setCurrentPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="resolutionDate-asc">Ending Soon</SelectItem>
                <SelectItem value="title-asc">A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex-1"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          {marketsData && (
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, pagination?.total || 0)} of {pagination?.total || 0} markets
              </span>
              <span>
                Page {currentPage} of {pagination?.totalPages || 1}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Unable to Load Markets
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                There was an error loading the prediction markets. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && markets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No Markets Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters to find more markets.'
                  : 'No prediction markets are currently available.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Markets Grid/List */}
        {!isLoading && !error && markets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {markets.map((market: any, index: number) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01, y: -5 }}
              >
                <Card 
                  className={`cursor-pointer group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'p-0' : ''
                  }`}
                  onClick={() => handleMarketClick(market.id)}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs font-medium">
                            {market.category || 'General'}
                          </Badge>
                          <Badge variant="outline" className={
                            market.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200'
                              : market.status === 'RESOLVED'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200'
                              : 'bg-gray-100 text-gray-800'
                          }>
                            {market.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {market.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                          {market.description}
                        </p>
                        
                        {/* Price Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
                            <p className="text-green-600 dark:text-green-400 text-xs font-semibold mb-1">YES</p>
                            <p className="text-green-700 dark:text-green-300 font-bold text-lg">
                              ₹{Number(market.currentYesPrice || market.yesToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-3 text-center border border-red-200 dark:border-red-800">
                            <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">NO</p>
                            <p className="text-red-700 dark:text-red-300 font-bold text-lg">
                              ₹{Number(market.currentNoPrice || market.noToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Market Info */}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(market.resolutionDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>
                              {((market._count?.yesTokenHoldings || 0) + (market._count?.noTokenHoldings || 0))} traders
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {market.category || 'General'}
                            </Badge>
                            <Badge variant="outline" className={
                              market.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800'
                            }>
                              {market.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                            {market.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                            {market.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(market.resolutionDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>
                                {((market._count?.yesTokenHoldings || 0) + (market._count?.noTokenHoldings || 0))} traders
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Prices */}
                        <div className="flex gap-3">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800 min-w-[80px]">
                            <p className="text-green-600 dark:text-green-400 text-xs font-semibold mb-1">YES</p>
                            <p className="text-green-700 dark:text-green-300 font-bold">
                              ₹{(market.currentYesPrice || market.yesToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center border border-red-200 dark:border-red-800 min-w-[80px]">
                            <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">NO</p>
                            <p className="text-red-700 dark:text-red-300 font-bold">
                              ₹{(market.currentNoPrice || market.noToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketsPage
