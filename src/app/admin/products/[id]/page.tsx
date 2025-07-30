'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FileUploader from '@/components/ui/FileUploader';

interface CloudinaryImage {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  size?: number;
}

interface ProductParams {
  params: {
    id: string;
  };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  cloudinaryUrl?: string;
  cloudinaryId?: string;
}

export default function EditProduct({ params }: ProductParams) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [cloudinaryImage, setCloudinaryImage] = useState<CloudinaryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.data);
          setName(data.data.name);
          setPrice(data.data.price.toString());
          setDescription(data.data.description);
          
          // Set cloudinary image if available
          if (data.data.cloudinaryUrl && data.data.cloudinaryId) {
            setCloudinaryImage({
              url: data.data.cloudinaryUrl,
              publicId: data.data.cloudinaryId
            });
          }
        } else {
          setError(data.error || 'Failed to fetch product');
        }
      } catch (err) {
        setError('An error occurred while fetching the product');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProduct();
    }
  }, [id, session]);

  // Handle successful file upload
  const handleUploadComplete = (imageData: CloudinaryImage) => {
    setCloudinaryImage(imageData);
    setError('');
  };

  // Handle upload errors
  const handleUploadError = (errorMessage: string) => {
    setError(`Upload error: ${errorMessage}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!name.trim() || !price.trim() || !description.trim()) {
        throw new Error('Please fill in all required fields');
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error('Please enter a valid price');
      }

      const productData: any = {
        name,
        price: priceNum,
        description,
      };

      // Add cloudinary data if available
      if (cloudinaryImage) {
        productData.cloudinaryUrl = cloudinaryImage.url;
        productData.cloudinaryId = cloudinaryImage.publicId;
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
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
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Product not found
        </div>
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Produkt bearbeiten: {product.name}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Produktname *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Preis (€) *
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produktbild
          </label>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-full md:w-1/2">
              <FileUploader 
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
                label="Bild hochladen"
                acceptedFileTypes="image/*"
                className="mb-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Unterstützte Formate: JPEG, PNG, WebP. Maximale Größe: 5MB.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              {cloudinaryImage?.url ? (
                <div className="relative">
                  <img 
                    src={cloudinaryImage.url} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded border border-gray-300" 
                  />
                  <button
                    type="button"
                    onClick={() => setCloudinaryImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : product.cloudinaryUrl ? (
                <div className="relative">
                  <img 
                    src={product.cloudinaryUrl} 
                    alt={product.name} 
                    className="h-20 w-20 object-cover rounded border border-gray-300" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Current image</p>
                </div>
              ) : (
                <div className="h-20 w-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
