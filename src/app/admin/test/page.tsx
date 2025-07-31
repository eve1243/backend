'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export default function TestPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setCategories(data.data);
          setSelectedCategory(data.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setMessage('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !selectedCategory) {
      setMessage('Please fill in all fields');
      return;
    }
    
    try {
      setMessage('Creating product...');
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName,
          price: 19.99,
          description: 'Test product description',
          category: selectedCategory
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`Product created successfully with ID: ${data.data._id}`);
        setProductName('');
      } else {
        setMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const refreshCategoryCount = async () => {
    try {
      setMessage('Refreshing category counts...');
      
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        const counts = data.data.map((c: Category) => `${c.name}: ${c.productCount} products`).join(', ');
        setMessage(`Category counts: ${counts}`);
      } else {
        setMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error refreshing counts:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Category Product Association</h1>
      
      {message && (
        <div className="p-4 mb-4 bg-blue-100 border border-blue-300 rounded">
          {message}
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Test Product</h2>
        <form onSubmit={createProduct} className="space-y-4">
          <div>
            <label className="block mb-1">Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Product
          </button>
        </form>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <div className="space-x-4">
          <button
            onClick={refreshCategoryCount}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Refresh Category Counts
          </button>
          
          <button
            onClick={() => router.push('/admin/categories')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go to Categories
          </button>
        </div>
      </div>
    </div>
  );
}
