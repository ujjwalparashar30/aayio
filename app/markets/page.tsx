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
import { montserrat } from '@/lib/fonts'
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
  Users,
  Rocket,
  BarChart3
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
            Prediction Markets
            <div className="inline-block ml-4">
              <Rocket className="w-12 h-12 text-white animate-pulse" />
            </div>
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Trade on real-world events and test your forecasting skills with our active prediction markets
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-sm bg-white/5 border border-white/15 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-gray-400 focus:bg-white/10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); setCurrentPage(1) }}>
              <SelectTrigger className="bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/20 text-white">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="focus:bg-white/10">
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value); setCurrentPage(1) }}>
              <SelectTrigger className="bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/20 text-white">
                {statuses.map(status => (
                  <SelectItem key={status} value={status} className="focus:bg-white/10">
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
              <SelectTrigger className="bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/20 text-white">
                <SelectItem value="createdAt-desc" className="focus:bg-white/10">Newest First</SelectItem>
                <SelectItem value="createdAt-asc" className="focus:bg-white/10">Oldest First</SelectItem>
                <SelectItem value="resolutionDate-asc" className="focus:bg-white/10">Ending Soon</SelectItem>
                <SelectItem value="title-asc" className="focus:bg-white/10">A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`flex-1 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' 
                    : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`flex-1 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' 
                    : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          {marketsData && (
            <div className="flex items-center justify-between text-sm text-gray-400 mt-4 pt-4 border-t border-white/10">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, pagination?.total || 0)} of {pagination?.total || 0} markets
              </span>
              <span>
                Page {currentPage} of {pagination?.totalPages || 1}
              </span>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-5 w-16 bg-white/20" />
                  <Skeleton className="h-5 w-20 bg-white/20" />
                </div>
                <Skeleton className="h-6 w-full mb-4 bg-white/20" />
                <Skeleton className="h-16 w-full mb-4 bg-white/20" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-16 w-full bg-white/20" />
                  <Skeleton className="h-16 w-full bg-white/20" />
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl text-center">
              <Target className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold text-white mb-2 ${montserrat.className}`}>
                Unable to Load Markets
              </h3>
              <p className="text-gray-400 mb-6">
                There was an error loading the prediction markets. Please try again.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800"
              >
                Retry Loading
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && markets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold text-white mb-2 ${montserrat.className}`}>
                No Markets Found
              </h3>
              <p className="text-gray-400 mb-6">
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
                  className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          </motion.div>
        )}

        {/* Markets Grid/List */}
        {!isLoading && !error && markets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
                  className={`cursor-pointer group bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl hover:bg-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 ${
                    viewMode === 'list' ? 'p-0' : ''
                  }`}
                  onClick={() => handleMarketClick(market.id)}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="text-xs font-medium bg-white/10 text-white border-white/20">
                            {market.category || 'General'}
                          </Badge>
                          <Badge className={`text-xs ${
                            market.status === 'ACTIVE' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : market.status === 'RESOLVED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}>
                            {market.status}
                          </Badge>
                        </div>
                        <CardTitle className={`text-lg leading-tight text-white group-hover:text-blue-300 transition-colors line-clamp-2 ${montserrat.className}`}>
                          {market.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {market.description}
                        </p>
                        
                        {/* Price Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-3 text-center border border-green-500/30">
                            <p className="text-green-300 text-xs font-semibold mb-1">YES</p>
                            <p className="text-green-200 font-bold text-lg">
                              ₹{Number(market.currentYesPrice || market.yesToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-3 text-center border border-red-500/30">
                            <p className="text-red-300 text-xs font-semibold mb-1">NO</p>
                            <p className="text-red-200 font-bold text-lg">
                              ₹{Number(market.currentNoPrice || market.noToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Market Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
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
                            <Badge className="text-xs bg-white/10 text-white border-white/20">
                              {market.category || 'General'}
                            </Badge>
                            <Badge className={`text-xs ${
                              market.status === 'ACTIVE' 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}>
                              {market.status}
                            </Badge>
                          </div>
                          <h3 className={`font-semibold text-lg text-white group-hover:text-blue-300 transition-colors mb-2 ${montserrat.className}`}>
                            {market.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {market.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
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
                          <div className="bg-green-500/20 rounded-lg p-3 text-center border border-green-500/30 min-w-[80px]">
                            <p className="text-green-300 text-xs font-semibold mb-1">YES</p>
                            <p className="text-green-200 font-bold">
                              ₹{Number(market.currentYesPrice || market.yesToken?.currentPrice || 1.0).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-red-500/20 rounded-lg p-3 text-center border border-red-500/30 min-w-[80px]">
                            <p className="text-red-300 text-xs font-semibold mb-1">NO</p>
                            <p className="text-red-200 font-bold">
                              ₹{Number(market.currentNoPrice || market.noToken?.currentPrice || 1.0).toFixed(2)}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="bg-white/5 border-white/15 text-white hover:bg-white/10 disabled:opacity-50"
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
                    className={`w-8 h-8 p-0 ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                        : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                    }`}
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
              className="bg-white/5 border-white/15 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MarketsPage
