import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PredictMarket',
  description: 'Professional prediction markets powered by automated market makers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider>
          <ClerkProvider>
            <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
              {children}
            </div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
