'use client'

import { motion } from 'framer-motion'

export default function Logo() {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-500"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <motion.path
        d="M16 2L28 8v16L16 30L4 24V8L16 2z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      <motion.path
        d="M16 10v12M10 16h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
    </motion.svg>
  )
}
