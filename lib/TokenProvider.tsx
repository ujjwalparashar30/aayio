'use client'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'

let tokenGetter: null | (() => Promise<string | null>) = null

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  tokenGetter = fn
}
export const getTokenFromClerk = async () => (tokenGetter ? tokenGetter() : null)

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()
  // Wrap getToken so the assigned function signature matches () => Promise<string | null>
  useEffect(() => {
    setTokenGetter(() => getToken()) // CALL getToken inside the wrapper
  }, [getToken])
  return <>{children}</>
}
