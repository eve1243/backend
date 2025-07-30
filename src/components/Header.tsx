'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Sport Liesbauer
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  href="/shop" 
                  className={`hover:text-blue-600 ${pathname === '/shop' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                >
                  Shop
                </Link>
              </li>
              {session ? (
                <>
                  <li>
                    <Link 
                      href="/admin" 
                      className={`hover:text-blue-600 ${pathname === '/admin' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/api/auth/signout"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      Abmelden
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link 
                    href="/api/auth/signin"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Anmelden
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
