'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <Provider store={store}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  )
}
