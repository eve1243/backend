import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET() {
  await dbConnect();

  try {
    // Get all categories
    const categories = await Category.find({});
    
    // Get all products to analyze
    const products = await Product.find({});
    
    // Analyze products and categories
    const analysis = {
      categories: categories.map(category => ({
        id: category._id.toString(),
        name: category.name
      })),
      products: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        categoryId: product.category ? product.category.toString() : 'none'
      }))
    };

    // Fix the GET categories endpoint
    const fixCategories = async () => {
      try {
        // Update the Category model's API route
        const categoriesWithProductCount = await Promise.all(
          categories.map(async (category) => {
            const count = await Product.countDocuments({ category: category._id });
            console.log(`Category ${category.name} (${category._id}): ${count} products`);
            
            const sampleProducts = await Product.find({ category: category._id }).limit(3);
            console.log(`Sample products:`, sampleProducts.map(p => p.name));
            
            return {
              id: category._id.toString(),
              name: category.name,
              productCount: count
            };
          })
        );
        
        return categoriesWithProductCount;
      } catch (error) {
        console.error("Error fixing categories:", error);
        return [];
      }
    };
    
    const fixedCategories = await fixCategories();

    return NextResponse.json({ 
      success: true, 
      analysis,
      fixedCategories,
      totalCategories: categories.length,
      totalProducts: products.length
    });
  } catch (error: any) {
    console.error("Error in debug API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
