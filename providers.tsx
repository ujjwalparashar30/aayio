"use client";

import StoreProvider from "@/state/redux";
import { ClerkProvider } from "@clerk/nextjs";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </StoreProvider>
  );
};

export default Providers;
