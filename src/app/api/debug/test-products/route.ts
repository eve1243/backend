import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET() {
  await dbConnect();

  try {
    // Get all products
    const products = await Product.find({});
    
    // Get all categories
    const categories = await Category.find({});
    
    return NextResponse.json({ 
      success: true, 
      products: products.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        category: p.category ? p.category.toString() : null
      })),
      categories: categories.map(c => ({
        _id: c._id.toString(),
        name: c.name
      }))
    });
  } catch (error: any) {
    console.error("Error in debug API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  await dbConnect();

  try {
    // Create a test product for each category
    const categories = await Category.find({});
    
    const results = [];
    
    for (const category of categories) {
      const testProduct = await Product.create({
        name: `Test Product for ${category.name}`,
        price: 19.99,
        description: `This is a test product for the ${category.name} category`,
        category: category._id
      });
      
      results.push({
        productId: testProduct._id.toString(),
        productName: testProduct.name,
        categoryId: category._id.toString(),
        categoryName: category.name
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test products created',
      results
    });
  } catch (error: any) {
    console.error("Error creating test products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
