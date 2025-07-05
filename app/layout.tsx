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
    <ClerkProvider
      appearance={{
        // baseTheme: 'light',
        variables: {
          colorPrimary: '#000000',
          colorBackground: '#ffffff',
          colorInputBackground: '#f8f9fa',
          colorInputText: '#000000',
          colorText: '#000000',
          colorTextSecondary: '#6b7280',
          colorDanger: '#dc2626',
          colorSuccess: '#059669',
          colorWarning: '#d97706',
          colorNeutral: '#6b7280',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1f2937',
            },
          },
          card: {
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          headerTitle: {
            color: '#000000',
          },
          headerSubtitle: {
            color: '#6b7280',
          },
          socialButtonsBlockButton: {
            backgroundColor: '#f8f9fa',
            border: '1px solid #e5e7eb',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f3f4f6',
            },
          },
          formFieldInput: {
            backgroundColor: '#f8f9fa',
            border: '1px solid #e5e7eb',
            color: '#000000',
            '&:focus': {
              borderColor: '#000000',
            },
          },
          footerActionLink: {
            color: '#000000',
            '&:hover': {
              color: '#374151',
            },
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
