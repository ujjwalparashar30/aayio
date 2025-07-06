import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
export type ClerkUser = {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  username: string | null;
};


// Define your app's user types (adjust as needed)
export type AppUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role?: string;
  isOnboarded?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Create a base query with dynamic token injection
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState, extra }) => {
    // Token will be injected per request
    const token = (extra as any)?.token;
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Add retry logic with exponential backoff
const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const api = createApi({
  baseQuery: baseQueryWithRetry,
  reducerPath: "api",
  tagTypes: ["Users", "Auth", "Profile"],
  endpoints: (build) => ({
    // Get authenticated user with role-based data
    getAuthUser: build.query<
      {
        clerkInfo: Pick<ClerkUser, 'id' | 'emailAddresses' | 'firstName' | 'lastName' | 'imageUrl' | 'username'>;
        userInfo: AppUser;
        userRole: string;
      },
      { token: string | null }
    >({
      query: ({ token }) => ({
        url: '/auth/me',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: ["Auth"],
      transformErrorResponse: (response: FetchBaseQueryError) => {
        if (response.status === 401) {
          return { message: "Authentication required" };
        }
        return response;
      },
    }),

    // Sync user data with your database (called after Clerk authentication)
    syncUser: build.mutation<
      AppUser,
      {
        clerkId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        imageUrl?: string;
        token: string | null;
      }
    >({
      query: ({ token, ...userData }) => ({
        url: '/auth/sync',
        method: 'POST',
        body: userData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      invalidatesTags: ["Auth", "Users"],
      transformErrorResponse: (response: FetchBaseQueryError) => {
        if (response.status === 409) {
          return { message: "User already exists" };
        }
        return response;
      },
    }),

    // Complete user onboarding
    completeOnboarding: build.mutation<
      AppUser,
      {
        role?: string;
        additionalData?: Record<string, any>;
        token: string | null;
      }
    >({
      query: ({ token, ...onboardingData }) => ({
        url: '/auth/onboarding',
        method: 'POST',
        body: onboardingData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      invalidatesTags: ["Auth", "Users", "Profile"],
    }),

    // Get current user profile
    getCurrentUser: build.query<
      AppUser, 
      { token: string | null }
    >({
      query: ({ token }) => ({
        url: '/users/me',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: ["Users", "Profile"],
    }),

    // Update user profile
    updateUserProfile: build.mutation<
      AppUser,
      Partial<AppUser> & { token: string | null }
    >({
      query: ({ token, ...updates }) => ({
        url: '/users/me',
        method: 'PUT',
        body: updates,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      invalidatesTags: ["Users", "Auth", "Profile"],
    }),

    // Check if user has completed onboarding
    checkOnboardingStatus: build.query<
      { isOnboarded: boolean; role?: string },
      { token: string | null }
    >({
      query: ({ token }) => ({
        url: '/auth/onboarding-status',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: ["Auth"],
    }),

    // Get user by ID (for admin/public profiles)
    getUserById: build.query<
      Omit<AppUser, 'email'>, // Don't expose email in public profiles
      { id: string; token?: string | null }
    >({
      query: ({ id, token }) => ({
        url: `/users/${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: (result, error, arg) => 
        result ? [{ type: 'Users', id: arg.id }] : [],
    }),

    // Search users (with pagination)
    searchUsers: build.query<
      {
        users: Omit<AppUser, 'email'>[];
        total: number;
        page: number;
        limit: number;
      },
      {
        query?: string;
        page?: number;
        limit?: number;
        token: string | null;
      }
    >({
      query: ({ query = '', page = 1, limit = 10, token }) => ({
        url: '/users/search',
        params: { q: query, page, limit },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: ["Users"],
    }),
  }),
});

// Export individual hooks
export const {
  useGetAuthUserQuery,
  useSyncUserMutation,
  useCompleteOnboardingMutation,
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useCheckOnboardingStatusQuery,
  useGetUserByIdQuery,
  useSearchUsersQuery,
} = api;

// Custom hooks that automatically inject auth token
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

// Authenticated versions of the hooks
export const useAuthenticatedApi = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const authenticatedHooks = useMemo(() => ({
    // Get authenticated user
    useGetAuthUser: (options?: any) => {
      const [trigger, result] = api.endpoints.getAuthUser.useLazyQuery();
      
      const executeQuery = async () => {
        if (!isLoaded || !isSignedIn) return;
        const token = await getToken();
        return trigger({ token }, options);
      };
      
      return [executeQuery, result] as const;
    },

    // Sync user
    useSyncUser: () => {
      const [trigger, result] = api.endpoints.syncUser.useMutation();
      
      const syncUser = async (userData: Omit<Parameters<typeof trigger>[0], 'token'>) => {
        const token = await getToken();
        return trigger({ ...userData, token });
      };
      
      return [syncUser, result] as const;
    },

    // Complete onboarding
    useCompleteOnboarding: () => {
      const [trigger, result] = api.endpoints.completeOnboarding.useMutation();
      
      const completeOnboarding = async (data: Omit<Parameters<typeof trigger>[0], 'token'>) => {
        const token = await getToken();
        return trigger({ ...data, token });
      };
      
      return [completeOnboarding, result] as const;
    },

    // Get current user
    useGetCurrentUser: (options?: any) => {
      const [trigger, result] = api.endpoints.getCurrentUser.useLazyQuery();
      
      const getCurrentUser = async () => {
        if (!isLoaded || !isSignedIn) return;
        const token = await getToken();
        return trigger({ token }, options);
      };
      
      return [getCurrentUser, result] as const;
    },

    // Update profile
    useUpdateUserProfile: () => {
      const [trigger, result] = api.endpoints.updateUserProfile.useMutation();
      
      const updateProfile = async (updates: Omit<Parameters<typeof trigger>[0], 'token'>) => {
        const token = await getToken();
        return trigger({ ...updates, token });
      };
      
      return [updateProfile, result] as const;
    },

    // Check onboarding status
    useCheckOnboardingStatus: (options?: any) => {
      const [trigger, result] = api.endpoints.checkOnboardingStatus.useLazyQuery();
      
      const checkStatus = async () => {
        if (!isLoaded || !isSignedIn) return;
        const token = await getToken();
        return trigger({ token }, options);
      };
      
      return [checkStatus, result] as const;
    },
  }), [getToken, isLoaded, isSignedIn]);

  return authenticatedHooks;
};

// Helper hook for automatic authenticated queries
export const useAutoAuthQuery = <T extends any>(
  queryHook: any,
  args: any = {},
  options: any = {}
) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const enhancedArgs = useMemo(async () => {
    if (!isLoaded || !isSignedIn) return null;
    const token = await getToken();
    return { ...args, token };
  }, [args, getToken, isLoaded, isSignedIn]);

  return queryHook(enhancedArgs, {
    skip: !isLoaded || !isSignedIn,
    ...options,
  });
};

// Export the api as default
export default api;