import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genesis - AI-Powered Smart Contract Generator',
  description: 'Multi-agent AI system for dApp generation with real-time contract generation, security analysis, and auto-deployment',
  keywords: ['smart contracts', 'AI', 'blockchain', 'dApp', 'Web3', 'solidity'],
  authors: [{ name: 'Genesis Team' }],
  openGraph: {
    title: 'Genesis - AI-Powered Smart Contract Generator',
    description: 'Generate, analyze, and deploy smart contracts with AI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genesis - AI-Powered Smart Contract Generator',
    description: 'Generate, analyze, and deploy smart contracts with AI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
