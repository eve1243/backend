'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-xl font-bold text-blue-600">
              Sport Liesbauer Admin
            </Link>
            
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/api/auth/signout" className="text-gray-600 hover:text-blue-600">
                    Abmelden
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="py-4">
            <ul>
              <li>
                <Link 
                  href="/admin" 
                  className={`flex items-center px-6 py-3 ${
                    pathname === '/admin' 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/products" 
                  className={`flex items-center px-6 py-3 ${
                    pathname?.includes('/admin/products') 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  Produkte
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/categories" 
                  className={`flex items-center px-6 py-3 ${
                    pathname?.includes('/admin/categories') 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v1H5V4zm4 3V6h2v1h-2zm-3 0V6h2v1H6zm7 0V6h1v1h-1zm-4 7a1 1 0 11-2 0 1 1 0 012 0zm-3 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    <path d="M9 6a3 3 0 00-2.83 4h5.66A3 3 0 009 6zM3 8.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" />
                  </svg>
                  Kategorien
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/analytics" 
                  className={`flex items-center px-6 py-3 ${
                    pathname === '/admin/analytics' 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Analysen
                </Link>
              </li>
              <li>
                <Link 
                  href="/api/documentation" 
                  className={`flex items-center px-6 py-3 ${
                    pathname?.includes('/api/documentation') 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  API Docs
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
