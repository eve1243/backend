'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ProductAnalytics {
  totalProducts: number;
  totalValue: number;
  avgPrice: number;
  priceRanges: {
    range: string;
    count: number;
  }[];
  mockData: {
    months: string[];
    sales: number[];
    revenue: number[];
  };
  mockPopular: {
    name: string;
    views: number;
    conversion: number;
  }[];
}

export default function AnalyticsPage() {
  const { status } = useSession();
  const [analytics, setAnalytics] = useState<ProductAnalytics>({
    totalProducts: 0,
    totalValue: 0,
    avgPrice: 0,
    priceRanges: [],
    mockData: {
      months: [],
      sales: [],
      revenue: []
    },
    mockPopular: []
  });
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('overview'); // 'overview', 'products', 'sales'

  useEffect(() => {
    async function fetchData() {
      try {
        // Get real product data from API
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          const products = data.data;
          
          // Calculate real analytics from products
          const totalValue = products.reduce((sum: number, product: any) => sum + product.price, 0);
          const avgPrice = products.length > 0 ? totalValue / products.length : 0;
          
          // Create price ranges
          const priceRanges = [
            { range: '0-10 €', count: 0 },
            { range: '10-25 €', count: 0 },
            { range: '25-50 €', count: 0 },
            { range: '50-100 €', count: 0 },
            { range: '100+ €', count: 0 }
          ];
          
          products.forEach((product: any) => {
            const price = product.price;
            if (price <= 10) priceRanges[0].count++;
            else if (price <= 25) priceRanges[1].count++;
            else if (price <= 50) priceRanges[2].count++;
            else if (price <= 100) priceRanges[3].count++;
            else priceRanges[4].count++;
          });
          
          // Generate mock data for visualization
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
          const sales = months.map(() => Math.floor(Math.random() * 50) + 10);
          const revenue = sales.map(sale => sale * (Math.random() * 30 + 20));
          
          // Generate mock popular products
          const mockPopular = products.slice(0, Math.min(5, products.length)).map((product: any) => ({
            name: product.name,
            views: Math.floor(Math.random() * 500) + 100,
            conversion: Math.random() * 10 + 1
          }));
          
          setAnalytics({
            totalProducts: products.length,
            totalValue,
            avgPrice,
            priceRanges,
            mockData: {
              months,
              sales,
              revenue
            },
            mockPopular
          });
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produktanalysen</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewType('overview')}
            className={`px-3 py-2 text-sm font-medium rounded ${viewType === 'overview' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Übersicht
          </button>
          <button 
            onClick={() => setViewType('products')}
            className={`px-3 py-2 text-sm font-medium rounded ${viewType === 'products' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Produkte
          </button>
          <button 
            onClick={() => setViewType('sales')}
            className={`px-3 py-2 text-sm font-medium rounded ${viewType === 'sales' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Verkäufe
          </button>
        </div>
      </div>
      
      {viewType === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-600 mb-2">Gesamtprodukte</h2>
              <p className="text-3xl font-semibold text-gray-900">{analytics.totalProducts}</p>
              <div className="text-xs text-green-500 mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>+{Math.floor(Math.random() * 10) + 1}% gegenüber letztem Monat</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-600 mb-2">Gesamtwert</h2>
              <p className="text-3xl font-semibold text-gray-900">{analytics.totalValue.toFixed(2)} €</p>
              <div className="text-xs text-green-500 mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>+{Math.floor(Math.random() * 15) + 5}% gegenüber letztem Monat</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-600 mb-2">Durchschnittspreis</h2>
              <p className="text-3xl font-semibold text-gray-900">{analytics.avgPrice.toFixed(2)} €</p>
              <div className="text-xs text-red-500 mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>-{Math.floor(Math.random() * 5) + 1}% gegenüber letztem Monat</span>
              </div>
            </div>
          </div>
          
          {/* Charts - Mock Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Verkäufe über Zeit (Demovisualisierung)</h2>
            <div className="h-64 relative">
              {/* Simple mock chart with CSS */}
              <div className="flex items-end h-48 space-x-4 mt-4 border-b border-l border-gray-200 relative">
                {analytics.mockData.months.map((month, index) => (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(analytics.mockData.sales[index] / Math.max(...analytics.mockData.sales)) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{month}</span>
                  </div>
                ))}
                
                {/* Y-axis labels */}
                <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Verkäufe</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price Range Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Preisverteilung</h2>
            <div className="space-y-4">
              {analytics.priceRanges.map((range) => (
                <div key={range.range}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{range.range}</span>
                    <span className="text-sm font-medium text-gray-900">{range.count} Produkte</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(range.count / analytics.totalProducts) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {viewType === 'products' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-6">Beliebte Produkte (Demodaten)</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produkt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aufrufe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konversionsrate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.mockPopular.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.views}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.conversion.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Math.random() > 0.3 ? (
                          <span className="text-green-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            Steigend
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Fallend
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md max-w-2xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      Diese Daten sind Demodaten. In einer vollständigen Implementierung würden hier echte Verkaufs- und Besucherdaten angezeigt werden, die aus einem Frontend-Shop gesammelt wurden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Produktempfehlungen</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-2">Preisoptimierung</h3>
                <p className="text-sm text-gray-700">
                  {analytics.avgPrice < 30
                    ? "Ihre Produktpreise liegen unter dem Branchendurchschnitt. Erwägen Sie eine moderate Preiserhöhung für ausgewählte Produkte."
                    : "Ihre Produktpreise scheinen wettbewerbsfähig zu sein. Behalten Sie die Marktbedingungen im Auge für mögliche Anpassungen."
                  }
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                <h3 className="font-medium text-green-800 mb-2">Bestandsempfehlung</h3>
                <p className="text-sm text-gray-700">
                  Dieses Feature wird in einer zukünftigen Version verfügbar sein, wenn Bestandsmanagement implementiert ist.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-purple-50">
                <h3 className="font-medium text-purple-800 mb-2">Marketing-Tipp</h3>
                <p className="text-sm text-gray-700">
                  Überlegen Sie, Bildmaterial und Beschreibungen für die am häufigsten aufgerufenen Produkte zu verbessern, um die Konversionsrate zu steigern.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {viewType === 'sales' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-medium text-gray-800">Umsatzanalyse (Demodaten)</h2>
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Demo-Feature
              </div>
            </div>
            
            <div className="h-64 relative">
              {/* Simple mock chart for revenue */}
              <div className="flex items-end h-48 space-x-4 mt-4 border-b border-l border-gray-200 relative">
                {analytics.mockData.months.map((month, index) => (
                  <div key={`${month}-revenue`} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(analytics.mockData.revenue[index] / Math.max(...analytics.mockData.revenue)) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{month}</span>
                  </div>
                ))}
                
                {/* Y-axis labels */}
                <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
                  <span>1.500€</span>
                  <span>750€</span>
                  <span>0€</span>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Umsatz</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-6">Umsatzquellen (Demofunktion)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Umsatz nach Zahlungsart</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Kreditkarte</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">PayPal</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Sofortüberweisung</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Andere</span>
                      <span className="text-sm font-medium">3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "3%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Umsatz nach Verkaufskanal</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Webshop</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Mobile App</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Marktplätze</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-yellow-50 text-yellow-700 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    Diese Daten sind Simulationen. In der Vollversion werden hier tatsächliche Verkaufsdaten angezeigt. Diese Daten werden in zukünftigen Versionen verfügbar sein, wenn die Bestellfunktionalität implementiert ist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
