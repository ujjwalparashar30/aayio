import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


interface Question {
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
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

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

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  }),
  refetchOnFocus: true,
  tagTypes: ['Question', 'OrderBook', 'PriceHistory'],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "users/create",
        method: "POST",
        body: newUser,
      }),
    }),
    // Mutation to update a user (user.updated event)
    updateUser: builder.mutation({
      query: (updatedUser) => ({
        url: "users/update",
        method: "PUT",
        body: updatedUser,
      }),
    }),
    // Mutation to delete a user (user.deleted event)
    deleteUser: builder.mutation({
      query: (userToDelete) => ({
        url: "users/delete",
        method: "DELETE",
        body: userToDelete,
      }),
    }),

    getQuestions: builder.query<GetQuestionsResponse, GetQuestionsParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        // Add all parameters to search params
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
      query: (id) => `/${id}`,
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
        return `/${id}/price-history?${params.toString()}`;
      },
      providesTags: (result, error, { id }) => [{ type: 'PriceHistory', id }],
      keepUnusedDataFor: 60,
    }),
    getQuestionOrderBook: builder.query<GetOrderBookResponse, string>({
      query: (id) => `/${id}/order-book`,
      providesTags: (result, error, id) => [{ type: 'OrderBook', id }],
      keepUnusedDataFor: 30,
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,


  // added my sanchit
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useGetQuestionPriceHistoryQuery,
  useGetQuestionOrderBookQuery
} = api;
