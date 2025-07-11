'use client'

import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/icons/Logo'
import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Handle Clerk events
  useEffect(() => {
    const handleClerkLoaded = () => {
      setIsLoading(false)
    }

    const handleClerkError = (error: any) => {
      setError(error?.message || 'Something went wrong. Please try again.')
      setIsLoading(false)
    }

    const handleClerkSuccess = () => {
      setSuccess(true)
      setError(null)
      setIsLoading(false)
    }

    // Listen for Clerk events
    window.addEventListener('clerk:loaded', handleClerkLoaded)
    window.addEventListener('clerk:error', handleClerkError)
    window.addEventListener('clerk:success', handleClerkSuccess)

    return () => {
      window.removeEventListener('clerk:loaded', handleClerkLoaded)
      window.removeEventListener('clerk:error', handleClerkError)
      window.removeEventListener('clerk:success', handleClerkSuccess)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center px-4 py-8 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="transition-transform duration-200 group-hover:scale-110">
              <Logo />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              PredictMarket
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Join thousands of traders making smart predictions
          </p>
        </motion.div>

        {/* Status Messages */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-2"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">Setting up your account</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">This will only take a moment...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">Account creation failed</p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-700 dark:text-red-300 text-sm underline hover:no-underline mt-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-green-800 dark:text-green-200 font-medium">Account created successfully!</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">Welcome to PredictMarket</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sign Up Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: {
                    width: '100%',
                  },
                  card: {
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    padding: '2rem',
                  },
                  headerTitle: {
                    color: 'var(--clerk-text-primary)',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                  },
                  headerSubtitle: {
                    color: 'var(--clerk-text-secondary)',
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem',
                  },
                  formButtonPrimary: {
                    backgroundColor: 'var(--clerk-button-bg)',
                    color: 'var(--clerk-button-text)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'var(--clerk-button-hover)',
                      transform: 'translateY(-1px)',
                    },
                  },
                  formFieldInput: {
                    backgroundColor: 'var(--clerk-input-bg)',
                    border: '1px solid var(--clerk-border-color)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--clerk-text-primary)',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    '&:focus': {
                      borderColor: 'var(--clerk-focus-border)',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      outline: 'none',
                    },
                  },
                  formFieldLabel: {
                    color: 'var(--clerk-text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  },
                  socialButtonsBlockButton: {
                    backgroundColor: 'var(--clerk-social-bg)',
                    border: '1px solid var(--clerk-border-color)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--clerk-text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'var(--clerk-social-hover)',
                      transform: 'translateY(-1px)',
                    },
                  },
                  footerActionLink: {
                    color: 'var(--clerk-link-color)',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'var(--clerk-link-hover)',
                      textDecoration: 'underline',
                    },
                  },
                  dividerLine: {
                    backgroundColor: 'var(--clerk-border-color)',
                    height: '1px',
                  },
                  dividerText: {
                    color: 'var(--clerk-text-secondary)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--clerk-card-bg)',
                    padding: '0 1rem',
                  },
                },
              }}
              afterSignUpUrl="/dashboard"
              redirectUrl="/dashboard"
            />
          </div>
        </motion.div>

      </div>
    </div>
  )
}
