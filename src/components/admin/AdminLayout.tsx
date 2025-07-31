'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { 
  FaHome, 
  FaBoxOpen, 
  FaListUl, 
  FaChartLine, 
  FaCog, 
  FaShoppingCart 
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-blue-600">Admin Dashboard</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin') && pathname === '/admin'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaHome className="mr-3 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/products')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaBoxOpen className="mr-3 h-4 w-4" />
                <span>Produkte</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/categories')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaListUl className="mr-3 h-4 w-4" />
                <span>Kategorien</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/orders')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaShoppingCart className="mr-3 h-4 w-4" />
                <span>Bestellungen</span>
                <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  Bald
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/analytics"
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/analytics')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaChartLine className="mr-3 h-4 w-4" />
                <span>Analysen</span>
                <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  Bald
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/settings')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaCog className="mr-3 h-4 w-4" />
                <span>Einstellungen</span>
                <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  Bald
                </span>
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Schnellzugriff
            </h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/admin/products/new"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  + Neues Produkt
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories/new"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  + Neue Kategorie
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
      {/* Mobile Sidebar Toggle - For responsive design */}
      <div className="md:hidden bg-white w-full shadow-sm">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-600">Admin</h1>
          <button className="text-gray-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Links */}
        <nav className="px-4 pb-4 flex space-x-4 overflow-x-auto">
          <Link
            href="/admin"
            className={`px-3 py-2 text-sm rounded-md ${isActive('/admin') && pathname === '/admin'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700'}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`px-3 py-2 text-sm rounded-md ${isActive('/admin/products')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700'}`}
          >
            Produkte
          </Link>
          <Link
            href="/admin/categories"
            className={`px-3 py-2 text-sm rounded-md ${isActive('/admin/categories')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700'}`}
          >
            Kategorien
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
