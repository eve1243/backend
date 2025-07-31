import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET - Produkte nach Kategorien gruppiert abrufen
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Alle Kategorien abrufen
    const categories = await Category.find({}).sort({ order: 1, name: 1 });
    
    // Für jede Kategorie die zugehörigen Produkte abrufen
    const result = await Promise.all(categories.map(async (category) => {
      const products = await Product.find({ category: category._id })
        .select('_id name price cloudinaryUrls cloudinaryUrl createdAt');
      
      return {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        productCount: products.length,
        products: products
      };
    }));
    
    // Statistiken berechnen
    const statistics = {
      totalCategories: categories.length,
      totalProducts: result.reduce((sum, category) => sum + category.productCount, 0),
      categoriesWithProducts: result.filter(cat => cat.productCount > 0).length,
      categoriesWithoutProducts: result.filter(cat => cat.productCount === 0).length,
      averageProductsPerCategory: result.length > 0 ? 
        (result.reduce((sum, cat) => sum + cat.productCount, 0) / result.length).toFixed(2) : 0
    };
    
    return NextResponse.json({ 
      success: true,
      statistics,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
