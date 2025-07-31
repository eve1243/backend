'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
  cloudinaryUrl?: string;
  cloudinaryUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProducts();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        setError(data.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('An error occurred while deleting the product');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
        <Link href="/admin" className="text-blue-500 hover:underline">
          Back to Admin Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produkte verwalten</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Neues Produkt
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bild
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Erstellt am
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Keine Produkte gefunden
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.cloudinaryUrls && product.cloudinaryUrls.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          {/* Hauptbild (immer das erste im Array) */}
                          <div className="h-16 w-16 relative">
                            <Image
                              src={product.cloudinaryUrls[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md border border-gray-300"
                            />
                          </div>
                          
                          {/* Weitere Bilder als kleine Thumbnails, falls vorhanden */}
                          {product.cloudinaryUrls.length > 1 && (
                            <div className="flex -space-x-1">
                              {product.cloudinaryUrls.slice(1, 3).map((url, index) => (
                                <div key={index} className="h-8 w-8 relative border border-white rounded-full overflow-hidden shadow-sm">
                                  <Image
                                    src={url}
                                    alt={`${product.name} ${index + 2}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                              {product.cloudinaryUrls.length > 3 && (
                                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border border-white shadow-sm">
                                  <span className="text-gray-700 text-xs">+{product.cloudinaryUrls.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : product.cloudinaryUrl ? (
                        <div className="h-16 w-16 relative">
                          <Image
                            src={product.cloudinaryUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      ) : product.imageUrl ? (
                        <div className="h-16 w-16 relative">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center border border-gray-300">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        €{product.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Bearbeiten
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin" className="text-blue-500 hover:underline">
          Zurück zum Dashboard
        </Link>
      </div>
    </div>
  );
}
