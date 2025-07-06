'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuthenticatedApi } from '@/state/api'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { useCompleteOnboarding } = useAuthenticatedApi()
  const [completeOnboarding] = useCompleteOnboarding()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await completeOnboarding({
        role: role || 'user',
        additionalData: {
          onboardingCompletedAt: new Date().toISOString()
        }
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-6 text-center transition-colors duration-300">
            Complete Your Profile
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a role</option>
                <option value="trader">Trader</option>
                <option value="investor">Investor</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Completing...' : 'Complete Onboarding'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
