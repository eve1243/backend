// CategoryForm Komponente für das Erstellen und Bearbeiten von Kategorien
'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface CategoryFormProps {
  initialData?: Category;
  isEditing?: boolean;
}

interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  parent?: string;
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Category>({
    name: '',
    slug: '',
    description: '',
    isActive: true,
    parent: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Kategorien vom Server laden
     const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    if (response.data.success) {
      setCategories(response.data.data);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Kategorien:', error);
  }
}
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        order: initialData.order,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  // Funktion zum Erzeugen eines slug aus dem Namen
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')  // Entfernt alle Sonderzeichen
      .replace(/[\s_-]+/g, '-')  // Ersetzt Leerzeichen durch Bindestriche
      .replace(/^-+|-+$/g, '');  // Entfernt Bindestriche am Anfang und Ende
  };

  // Bei Änderung des Namens automatisch den Slug generieren
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && initialData?._id) {
        // Kategorie aktualisieren
        await axios.put(`/api/categories/${initialData._id}`, formData);
        toast.success('Kategorie erfolgreich aktualisiert');
      } else {
        // Neue Kategorie erstellen
        await axios.post('/api/categories', formData);
        toast.success('Kategorie erfolgreich erstellt');
      }
      router.push('/admin/categories');
      router.refresh();
    } catch (error: any) {
      console.error('Fehler beim Speichern der Kategorie:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Validierungsfehler anzeigen
        const errorMessages = Object.values(error.response.data.errors)
          .map((err: any) => err.message)
          .join(', ');
        toast.error(`Validierungsfehler: ${errorMessages}`);
      } else {
        toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kategoriename"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          URL-Slug *
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="kategorie-url-slug"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Der Slug wird in der URL verwendet. Bitte nur Kleinbuchstaben, Zahlen und Bindestriche verwenden.
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Beschreibung der Kategorie (optional)"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Aktiv
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Deaktivierte Kategorien werden im Shop nicht angezeigt.
        </p>
      </div>

      {/* Parent/Child Auswahl */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie-Typ</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="categoryType"
              value="parent"
              checked={!formData.parent}
              onChange={() => setFormData({ ...formData, parent: '' })}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Hauptkategorie</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="categoryType"
              value="child"
              checked={!!formData.parent}
              onChange={() => {
                if (categories.length > 0) {
                  setFormData({ ...formData, parent: categories[0]._id });
                }
              }}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Unterkategorie</span>
          </label>
        </div>
      </div>

      {/* Parent-Auswahl nur anzeigen, wenn Unterkategorie gewählt */}
      {formData.parent !== undefined && formData.parent !== '' && (
        <div className="mb-4">
          <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
            Übergeordnete Kategorie
          </label>
          <select
            id="parent"
            name="parent"
            value={formData.parent}
            onChange={e => setFormData({ ...formData, parent: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Bitte wählen…</option>
            {categories
              .filter(cat => !isEditing || cat._id !== initialData?._id)
              .map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Wählen Sie die übergeordnete Kategorie.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Wird gespeichert...' : isEditing ? 'Aktualisieren' : 'Erstellen'}
        </button>
      </div>
    </form>
  );
}
