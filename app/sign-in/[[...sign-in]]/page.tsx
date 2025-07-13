'use client'

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/icons/Logo'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 dark:from-gray-900 to-transparent transition-colors duration-300" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Logo />
            <span className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">PredictMarket</span>
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2 transition-colors duration-300">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Sign in to your account to continue trading</p>
        </motion.div>

        {/* Loading State */}
        { (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              Setting up your account...
            </div>
          </motion.div>
        )}

        {/* Sign In Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <SignIn 
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                },
                card: {
                  backgroundColor: 'var(--clerk-card-bg)',
                  border: '1px solid var(--clerk-border-color)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                headerTitle: {
                  color: 'var(--clerk-text-primary)',
                },
                headerSubtitle: {
                  color: 'var(--clerk-text-secondary)',
                },
                formButtonPrimary: {
                  backgroundColor: 'var(--clerk-button-bg)',
                  color: 'var(--clerk-button-text)',
                  '&:hover': {
                    backgroundColor: 'var(--clerk-button-hover)',
                  },
                },
                formFieldInput: {
                  backgroundColor: 'var(--clerk-input-bg)',
                  border: '1px solid var(--clerk-border-color)',
                  color: 'var(--clerk-text-primary)',
                  '&:focus': {
                    borderColor: 'var(--clerk-focus-border)',
                  },
                },
                socialButtonsBlockButton: {
                  backgroundColor: 'var(--clerk-social-bg)',
                  border: '1px solid var(--clerk-border-color)',
                  color: 'var(--clerk-text-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--clerk-social-hover)',
                  },
                },
                footerActionLink: {
                  color: 'var(--clerk-link-color)',
                  '&:hover': {
                    color: 'var(--clerk-link-hover)',
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
            Do not have an account?{' '}
            <Link href="/sign-up" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
