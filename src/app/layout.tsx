import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Game Show',
  description: 'Interactive game show platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans">
          <main className="flex-1 relative">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  )
}
