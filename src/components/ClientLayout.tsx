'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  return (
    <div className="flex h-screen bg-gray-50">
      {!isLoginPage && <Navigation />}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 