// hooks/useClerkAuth.ts
import { useUser, useAuth } from "@clerk/nextjs";
import { 
  useSyncUserMutation, 
  useCheckOnboardingStatusQuery,
  useGetCurrentUserQuery 
} from "@/state/api";
import { useEffect, useState } from "react";

export function useClerkAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [syncUser, { isLoading: isSyncing }] = useSyncUserMutation();
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);

  // Check onboarding status
  const { 
    data: onboardingStatus, 
    isLoading: isCheckingOnboarding 
  } = useCheckOnboardingStatusQuery(undefined, {
    skip: !isSignedIn || !user
  });

  // Get current user profile from your database
  const { 
    data: userProfile, 
    isLoading: isLoadingProfile 
  } = useGetCurrentUserQuery(undefined, {
    skip: !isSignedIn || !user
  });

  // Auto-sync user data when they sign in
  useEffect(() => {
    const syncUserData = async () => {
      if (isLoaded && isSignedIn && user && !hasAttemptedSync) {
        try {
          await syncUser({
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            imageUrl: user.imageUrl,
          }).unwrap();
          setHasAttemptedSync(true);
        } catch (error) {
          console.error("Failed to sync user:", error);
          setHasAttemptedSync(true); // Prevent infinite retries
        }
      }
    };

    syncUserData();
  }, [isLoaded, isSignedIn, user, hasAttemptedSync, syncUser]);

  return {
    // Clerk data
    user,
    isLoaded,
    isSignedIn,
    getToken,
    
    // Your app data
    userProfile,
    onboardingStatus,
    
    // Loading states
    isLoadingProfile,
    isCheckingOnboarding,
    isSyncing,
    
    // Computed states
    isAuthenticated: isLoaded && isSignedIn,
    needsOnboarding: onboardingStatus && !onboardingStatus.isOnboarded,
    isReady: isLoaded && !isSyncing && !isCheckingOnboarding,
  };
}
