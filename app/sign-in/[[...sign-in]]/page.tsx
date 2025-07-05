'use client'

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/icons/Logo'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-transparent" />
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
            <span className="text-2xl font-bold text-white">PredictMarket</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue trading</p>
        </motion.div>

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
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #374151',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-white hover:text-gray-300 transition-colors">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
