import { createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromClerk } from '@/lib/TokenProvider'


// ====================== INTERFACES ======================

export interface Question {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  resolutionDate: string;
  isResolved: boolean;
  resolvedAnswer: boolean | null;
  constantValue: number;
  totalYesTokens: number;
  totalNoTokens: number;
  currentYesPrice: number;
  currentNoPrice: number;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'RESOLVED' | 'CANCELLED';
  creator: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  yesToken: {
    currentPrice: number;
    circulatingSupply: number;
    totalVolume: number;
  } | null;
  noToken: {
    currentPrice: number;
    circulatingSupply: number;
    totalVolume: number;
  } | null;
  _count: {
    yesTokenHoldings: number;
    noTokenHoldings: number;
  };
  noTokenHoldings: Array<{
    quantity: number;
    averageBuyPrice: number;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
  yesTokenHoldings: Array<{
    quantity: number;
    averageBuyPrice: number;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Question Interfaces
interface GetQuestionsResponse {
  success: boolean;
  data: {
    questions: Question[];
    pagination: PaginationData;
  };
}

interface GetQuestionsParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface MarketStats {
  totalParticipants: number;
  totalVolume: number;
  yesHolders: number;
  noHolders: number;
  totalYesTokens: number;
  totalNoTokens: number;
  yesPercentage: string;
  noPercentage: string;
}

interface GetQuestionByIdResponse {
  success: boolean;
  data: {
    question: Question;
    marketStats: MarketStats;
  };
}

interface PricePoint {
  timestamp: string;
  yesPrice: number | null;
  noPrice: number | null;
}

interface GetPriceHistoryResponse {
  success: boolean;
  data: {
    priceHistory: PricePoint[];
    timeframe: string;
    interval: string;
  };
}

// Trading Interfaces
interface BuyTokenRequest {
  userId: string;
  questionId: string;
  tokenType: 'YES' | 'NO';
  quantity: number;
}

interface BuyTokenResponse {
  success: boolean;
  data: {
    transaction: any;
    newPrice: number;
    totalCost: number;
    platformFee: number;
    totalAmount: number;
  };
}

interface PreviewTradeRequest {
  questionId: string;
  tokenType: 'YES' | 'NO';
  quantity: number;
}

interface PreviewTradeResponse {
  success: boolean;
  data: {
    questionId: string;
    tokenType: string;
    quantity: number;
    action: string;
    pricePerToken: number;
    totalAmount: number;
    platformFee: number;
    totalCost: number;
    availableSupply: number;
  };
}

interface GetTokenPricesResponse {
  success: boolean;
  data: {
    questionId: string;
    yesPrice: number;
    noPrice: number;
    yesAvailableSupply: number;
    noAvailableSupply: number;
    lastUpdated: string;
  };
}

interface GetMarketStatsResponse {
  success: boolean;
  data: {
    questionId: string;
    totalYesTokens: number;
    totalNoTokens: number;
    yesHolders: number;
    noHolders: number;
    totalVolume: number;
    collectedFees: number;
    yesPrice: number;
    noPrice: number;
    yesAvailableSupply: number;
    noAvailableSupply: number;
  };
}

interface GetUserPortfolioResponse {
  success: boolean;
  data: {
    userId: string;
    yesHoldings: any[];
    noHoldings: any[];
  };
}

interface GetTradeHistoryResponse {
  success: boolean;
  data: {
    userId: string;
    transactions: any[];
    pagination: PaginationData;
  };
}

// P2P Interfaces
interface CreateP2POrderRequest {
  userId: string;
  questionId: string;
  orderType: 'BUY' | 'SELL';
  tokenType: 'YES' | 'NO';
  quantity: number;
  pricePerToken: number;
  expiresAt?: string;
}

interface CreateP2POrderResponse {
  success: boolean;
  data: any;
}

interface MatchOrderRequest {
  buyerUserId: string;
  quantity: number;
}

interface MatchOrderResponse {
  success: boolean;
  data: any;
}

interface OrderData {
  id: string;
  userId: string;
  userName: string;
  quantity: number;
  pricePerToken: number;
  totalAmount: number;
  createdAt: string;
  expiresAt: string | null;
}

interface OrderBook {
  yesOrders: {
    buys: OrderData[];
    sells: OrderData[];
  };
  noOrders: {
    buys: OrderData[];
    sells: OrderData[];
  };
}

interface GetOrderBookResponse {
  success: boolean;
  data: OrderBook;
}

interface GetUserOrdersResponse {
  success: boolean;
  data: {
    userId: string;
    orders: any[];
    pagination: PaginationData;
  };
}

interface GetOrderDetailsResponse {
  success: boolean;
  data: any;
}

// Wallet Interfaces
interface GetBalanceResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
    };
    balances: {
      available: number;
      locked: number;
      p2pEscrow: number;
      total: number;
    };
    lifetime: {
      totalAdded: number;
      totalSpent: number;
      netGain: number;
    };
  };
}

interface AddPlayMoneyRequest {
  userId: string;
  amount: number;
  description?: string;
}

interface AddPlayMoneyResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      newBalance: number;
      totalAdded: number;
    };
    transaction: any;
    message: string;
  };
}

interface TransferMoneyRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
}

interface TransferMoneyResponse {
  success: boolean;
  data: {
    transfer: any;
    transactions: any;
    message: string;
  };
}

interface GetTransactionHistoryResponse {
  success: boolean;
  data: {
    userId: string;
    transactions: any[];
    summary: {
      totalTransactions: number;
      totalDeposits: number;
      totalWithdrawals: number;
    };
    pagination: PaginationData;
  };
}

// Admin Interfaces
interface CreateQuestionRequest {
  adminId: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  resolutionDate: string;
  initialTokenSupply?: number;
  initialTokenPrice?: number;
  platformFeeRate?: number;
}

interface CreateQuestionResponse {
  success: boolean;
  data: {
    question: any;
    yesToken: any;
    noToken: any;
    summary: any;
  };
}

interface ResolveQuestionRequest {
  adminId: string;
  resolvedAnswer: boolean;
}

interface ResolveQuestionResponse {
  success: boolean;
  data: {
    question: any;
    marketResolution: any;
    payouts: any[];
    summary: any;
  };
}

interface GetDashboardStatsResponse {
  success: boolean;
  data: {
    overview: {
      totalQuestions: number;
      activeQuestions: number;
      resolvedQuestions: number;
      totalUsers: number;
      totalTransactions: number;
      totalVolume: number;
      totalFeesCollected: number;
    };
    recentQuestions: any[];
    topQuestions: any[];
  };
}

interface GetAllQuestionsAdminResponse {
  success: boolean;
  data: {
    questions: any[];
    pagination: PaginationData;
  };
}

interface UpdateQuestionRequest {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  resolutionDate?: string;
  status?: string;
}

interface UpdateQuestionResponse {
  success: boolean;
  data: any;
}

interface GetQuestionStatsResponse {
  success: boolean;
  data: {
    question: any;
    analytics: {
      totalHolders: number;
      totalVolume: number;
      feesCollected: number;
      yesHolders: number;
      noHolders: number;
      yesTokensCirculating: number;
      noTokensCirculating: number;
    };
  };
}

interface GetPlatformRevenueResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    revenueByTimeframe: any[];
    revenueByCategory: any[];
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  credentials: 'include',
});

const toHeaders = (h?: HeadersInit): Headers => {
  const headers = new Headers()
  if (!h) return headers
  if (h instanceof Headers) {
    h.forEach((v, k) => headers.set(k, v))
  } else if (Array.isArray(h)) {
    for (const [k, v] of h) headers.set(k, v)
  } else {
    for (const k of Object.keys(h)) {
      const v = (h as Record<string, string | undefined>)[k]
      if (v !== undefined) headers.set(k, v)
    }
  }
  return headers
}

const authedBaseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const token = await getTokenFromClerk()

  if (typeof args === 'string') {
    const headers = new Headers()
    if (token) headers.set('authorization', `Bearer ${token}`)
    headers.set('content-type', 'application/json')
    const finalArgs: FetchArgs = { url: args, headers }
    return rawBaseQuery(finalArgs, api, extraOptions)
  } else {
    const headers = toHeaders(args.headers)
    if (token) headers.set('authorization', `Bearer ${token}`)
    headers.set('content-type', 'application/json')
    const finalArgs: FetchArgs = { ...args, headers }
    return rawBaseQuery(finalArgs, api, extraOptions)
  }
}
// ====================== API SLICE ======================

export const api = createApi({
  reducerPath: "api",
  baseQuery: authedBaseQuery,
  refetchOnFocus: true,
  
  tagTypes: [
    'Question', 
    'OrderBook', 
    'PriceHistory', 
    'User', 
    'Balance', 
    'Transaction', 
    'Order', 
    'Admin'
  ],
  
  endpoints: (builder) => ({
    // ====================== AUTH ENDPOINTS ======================
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "users/create",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (updatedUser) => ({
        url: "users/update",
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userToDelete) => ({
        url: "users/delete",
        method: "DELETE",
        body: userToDelete,
      }),
      invalidatesTags: ['User'],
    }),

    // ====================== QUESTION ENDPOINTS ======================
    getQuestions: builder.query<GetQuestionsResponse, GetQuestionsParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        return `/question?${searchParams.toString()}`;
      },
      providesTags: ['Question'],
      keepUnusedDataFor: 300,
    }),

    getQuestionById: builder.query<GetQuestionByIdResponse, string>({
      query: (id) => `/question/${id}`,
      providesTags: (result, error, id) => [{ type: 'Question', id }],
      keepUnusedDataFor: 300,
    }),

    getQuestionPriceHistory: builder.query<GetPriceHistoryResponse, { 
      id: string; 
      timeframe?: '1h' | '1d' | '7d' | '30d'; 
      interval?: string; 
    }>({
      query: ({ id, timeframe = '7d', interval = '1h' }) => {
        const params = new URLSearchParams({ timeframe, interval });
        return `/question/${id}/price-history?${params.toString()}`;
      },
      providesTags: (result, error, { id }) => [{ type: 'PriceHistory', id }],
      keepUnusedDataFor: 60,
    }),

    getQuestionOrderBook: builder.query<GetOrderBookResponse, string>({
      query: (id) => `/question/${id}/order-book`,
      providesTags: (result, error, id) => [{ type: 'OrderBook', id }],
      keepUnusedDataFor: 30,
    }),

    // ====================== TRADING ENDPOINTS ======================
    buyTokenFromPlatform: builder.mutation<BuyTokenResponse, BuyTokenRequest>({
      query: (body) => ({
        url: '/trading/buy',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Question', 'Balance', 'User'],
    }),

    previewTrade: builder.mutation<PreviewTradeResponse, PreviewTradeRequest>({
      query: (body) => ({
        url: '/trading/preview',
        method: 'POST',
        body,
      }),
    }),

    getTokenPrices: builder.query<GetTokenPricesResponse, string>({
      query: (questionId) => `/trading/price/${questionId}`,
      providesTags: (result, error, questionId) => [{ type: 'Question', id: questionId }],
      keepUnusedDataFor: 60,
    }),

    getMarketStats: builder.query<GetMarketStatsResponse, string>({
      query: (questionId) => `/trading/stats/${questionId}`,
      providesTags: (result, error, questionId) => [{ type: 'Question', id: questionId }],
      keepUnusedDataFor: 120,
    }),

    getUserPortfolio: builder.query<GetUserPortfolioResponse, string>({
      query: (userId) => `/trading/portfolio/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      keepUnusedDataFor: 180,
    }),

    getTradeHistory: builder.query<GetTradeHistoryResponse, { userId: string; page?: number; limit?: number }>({
      query: ({ userId, page = 1, limit = 20 }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        return `/trading/history/${userId}?${params.toString()}`;
      },
      providesTags: (result, error, { userId }) => [{ type: 'Transaction', id: userId }],
      keepUnusedDataFor: 300,
    }),

    // ====================== P2P ENDPOINTS ======================
    createP2POrder: builder.mutation<CreateP2POrderResponse, CreateP2POrderRequest>({
      query: (body) => ({
        url: '/p2p/create-order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrderBook', 'User', 'Balance'],
    }),

    matchOrder: builder.mutation<MatchOrderResponse, { orderId: string; body: MatchOrderRequest }>({
      query: ({ orderId, body }) => ({
        url: `/p2p/match/${orderId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrderBook', 'User', 'Balance', 'Transaction'],
    }),

    cancelOrder: builder.mutation<{ success: boolean; data: any }, string>({
      query: (orderId) => ({
        url: `/p2p/cancel/${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['OrderBook', 'User', 'Balance'],
    }),

    getP2POrderBook: builder.query<GetOrderBookResponse, string>({
      query: (questionId) => `/p2p/orders/${questionId}`,
      providesTags: (result, error, questionId) => [{ type: 'OrderBook', id: questionId }],
      keepUnusedDataFor: 30,
    }),

    getUserOrders: builder.query<GetUserOrdersResponse, { userId: string; status?: string; page?: number; limit?: number }>({
      query: ({ userId, status, page = 1, limit = 20 }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (status) params.append('status', status);
        return `/p2p/my-orders/${userId}?${params.toString()}`;
      },
      providesTags: (result, error, { userId }) => [{ type: 'Order', id: userId }],
      keepUnusedDataFor: 120,
    }),

    getOrderDetails: builder.query<GetOrderDetailsResponse, string>({
      query: (orderId) => `/p2p/order/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
      keepUnusedDataFor: 300,
    }),

    // ====================== WALLET ENDPOINTS ======================
    getBalance: builder.query<GetBalanceResponse, string>({
      query: (userId) => `/wallet/balance/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Balance', id: userId }],
      keepUnusedDataFor: 120,
    }),

    addPlayMoney: builder.mutation<AddPlayMoneyResponse, AddPlayMoneyRequest>({
      query: (body) => ({
        url: '/wallet/add-money',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Balance', 'Transaction'],
    }),

    transferMoney: builder.mutation<TransferMoneyResponse, TransferMoneyRequest>({
      query: (body) => ({
        url: '/wallet/transfer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Balance', 'Transaction'],
    }),

    getTransactionHistory: builder.query<GetTransactionHistoryResponse, { userId: string; page?: number; limit?: number; type?: string }>({
      query: ({ userId, page = 1, limit = 20, type }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (type) params.append('type', type);
        return `/wallet/transactions/${userId}?${params.toString()}`;
      },
      providesTags: (result, error, { userId }) => [{ type: 'Transaction', id: userId }],
      keepUnusedDataFor: 300,
    }),

    // ====================== ADMIN ENDPOINTS ======================
    createQuestion: builder.mutation<CreateQuestionResponse, CreateQuestionRequest>({
      query: (body) => ({
        url: '/admin/create-question',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Question', 'Admin'],
    }),

    resolveQuestion: builder.mutation<ResolveQuestionResponse, { questionId: string; body: ResolveQuestionRequest }>({
      query: ({ questionId, body }) => ({
        url: `/admin/resolve-question/${questionId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Question', 'Balance', 'Transaction', 'Admin'],
    }),

    getDashboardStats: builder.query<GetDashboardStatsResponse, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Admin'],
      keepUnusedDataFor: 300,
    }),

    getAllQuestionsAdmin: builder.query<GetAllQuestionsAdminResponse, { 
      status?: string; 
      category?: string; 
      page?: number; 
      limit?: number; 
      sortBy?: string; 
      sortOrder?: 'asc' | 'desc' 
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        return `/admin/questions?${searchParams.toString()}`;
      },
      providesTags: ['Admin', 'Question'],
      keepUnusedDataFor: 300,
    }),

    updateQuestion: builder.mutation<UpdateQuestionResponse, { questionId: string; body: UpdateQuestionRequest }>({
      query: ({ questionId, body }) => ({
        url: `/admin/update-question/${questionId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Question', 'Admin'],
    }),

    getQuestionStats: builder.query<GetQuestionStatsResponse, string>({
      query: (questionId) => `/admin/question-stats/${questionId}`,
      providesTags: (result, error, questionId) => [{ type: 'Admin', id: questionId }],
      keepUnusedDataFor: 300,
    }),

    getPlatformRevenue: builder.query<GetPlatformRevenueResponse, { startDate?: string; endDate?: string }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        return `/admin/revenue?${searchParams.toString()}`;
      },
      providesTags: ['Admin'],
      keepUnusedDataFor: 600,
    }),
  }),
});

// ====================== EXPORT HOOKS ======================
export const {
  // Auth hooks
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Question hooks
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useGetQuestionPriceHistoryQuery,
  useGetQuestionOrderBookQuery,

  // Trading hooks
  useBuyTokenFromPlatformMutation,
  usePreviewTradeMutation,
  useGetTokenPricesQuery,
  useGetMarketStatsQuery,
  useGetUserPortfolioQuery,
  useGetTradeHistoryQuery,

  // P2P hooks
  useCreateP2POrderMutation,
  useMatchOrderMutation,
  useCancelOrderMutation,
  useGetP2POrderBookQuery,
  useGetUserOrdersQuery,
  useGetOrderDetailsQuery,

  // Wallet hooks
  useGetBalanceQuery,
  useAddPlayMoneyMutation,
  useTransferMoneyMutation,
  useGetTransactionHistoryQuery,

  // Admin hooks
  useCreateQuestionMutation,
  useResolveQuestionMutation,
  useGetDashboardStatsQuery,
  useGetAllQuestionsAdminQuery,
  useUpdateQuestionMutation,
  useGetQuestionStatsQuery,
  useGetPlatformRevenueQuery,
} = api;
