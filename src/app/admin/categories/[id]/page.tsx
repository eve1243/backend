'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CategoryForm from '@/components/admin/CategoryForm';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/categories/${params.id}`);
        
        if (response.data.success) {
          setCategory(response.data.data);
        } else {
          setError('Kategorie konnte nicht geladen werden');
        }
      } catch (error: any) {
        console.error('Fehler beim Laden der Kategorie:', error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Ein Fehler ist aufgetreten beim Laden der Kategorie');
        }
        toast.error('Kategorie konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kategorie bearbeiten</h1>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2">Kategorie wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kategorie bearbeiten</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Fehler: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kategorie bearbeiten</h1>
      {category ? (
        <CategoryForm initialData={category} isEditing={true} />
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hinweis: </strong>
          <span className="block sm:inline">Kategorie nicht gefunden.</span>
        </div>
      )}
    </div>
  );
}
