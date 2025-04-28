"use client";

import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { usePathname } from 'next/navigation'
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={client}>
          <div className="flex h-screen bg-gray-50">
            {!isLoginPage && <Navigation />}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </ApolloProvider>
      </body>
    </html>
  )
} 