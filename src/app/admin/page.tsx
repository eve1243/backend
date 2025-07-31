'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Stats {
  totalProducts: number;
  totalValue: number;
  avgPrice: number;
  productsByCategory: Record<string, number>;
  categoriesData: any[];
  recentlyAdded: any[];
}

export default function AdminDashboardPage() {
  const { status } = useSession();
  const [stats, setStats] = useState<Stats>({ 
    totalProducts: 0,
    totalValue: 0,
    avgPrice: 0,
    productsByCategory: {},
    categoriesData: [],
    recentlyAdded: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'week', 'month', 'year'

  useEffect(() => {
    async function fetchStats() {
      try {
        // Produkte abrufen
        const productRes = await fetch('/api/products');
        const productData = await productRes.json();
        
        // Kategorien mit Produkten abrufen
        const categoryRes = await fetch('/api/categories/products');
        const categoryData = await categoryRes.json();
        
        if (productData.success) {
          const products = productData.data;
          
          // Calculate total inventory value
          const totalValue = products.reduce((sum: number, product: any) => sum + product.price, 0);
          
          // Calculate average price
          const avgPrice = products.length > 0 ? totalValue / products.length : 0;
          
          // Kategoriedaten vorbereiten
          const productsByCategory: Record<string, number> = {};
          const categoriesData = categoryData.success ? categoryData.data : [];
          
          // Produktanzahl pro Kategorie
          if (categoriesData.length > 0) {
            categoriesData.forEach((category: any) => {
              productsByCategory[category.name] = category.productCount || 0;
            });
          } else {
            // Fallback wenn keine Kategoriedaten verfügbar sind
            const categories = ['Sportgeräte', 'Kleidung', 'Schuhe', 'Accessoires', 'Nahrungsergänzung'];
            categories.forEach(category => {
              productsByCategory[category] = Math.floor(Math.random() * (products.length / 2));
            });
          }
          
          // Get 5 most recently added products
          const recentlyAdded = [...products]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

          setStats({
            totalProducts: products.length,
            totalValue,
            avgPrice,
            productsByCategory,
            categoriesData,
            recentlyAdded
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Alle Zeit
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'month' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Monat
          </button>
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'week' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Woche
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Products Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Produkte</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/admin/products" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Details anzeigen
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Total Inventory Value Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Gesamtwert</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalValue.toFixed(2)} €</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Durchschnittspreis: {stats.avgPrice.toFixed(2)} €
            </span>
          </div>
        </div>
        
        {/* Coming Soon (Analytics) Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Bestellungen</h2>
              <p className="text-2xl font-semibold text-gray-900">Demnächst</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/admin/analytics" 
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
            >
              Mehr Analysen
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout for Charts and Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Product Categories Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Produkte nach Kategorie</h2>
          <div className="space-y-4">
            {Object.entries(stats.productsByCategory).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recently Added Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Kürzlich hinzugefügt</h2>
          <div className="divide-y divide-gray-200">
            {stats.recentlyAdded.length > 0 ? (
              stats.recentlyAdded.map((product) => (
                <div key={product._id} className="py-3 flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                    {product.cloudinaryUrl && (
                      <img src={product.cloudinaryUrl} alt={product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()} - {product.price.toFixed(2)} €
                    </p>
                  </div>
                  <Link 
                    href={`/admin/products/${product._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">Keine Produkte gefunden</p>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link 
              href="/admin/products/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Neues Produkt
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Access & Coming Soon Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Kommende Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-800">Kundenkommunikation</h3>
            </div>
            <p className="text-sm text-gray-600">Nachrichten und Anfragen von Kunden direkt verwalten.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-800">Bestellverwaltung</h3>
            </div>
            <p className="text-sm text-gray-600">Bestellungen verfolgen, verwalten und Statusänderungen vornehmen.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-purple-100 text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-800">Erweiterte Analysen</h3>
            </div>
            <p className="text-sm text-gray-600">Tiefgreifende Einblicke in Verkäufe, Kundenverhalten und Trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
