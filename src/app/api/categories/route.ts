import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET - Alle Kategorien abrufen
export async function GET() {
  await dbConnect();

  try {
    // Alle Kategorien abrufen
    const categories = await Category.find({}).sort({ order: 1, name: 1 });
    console.log('Found categories:', categories.length);
    
    // Alle Produkte abrufen
    const allProducts = await Product.find({});
    console.log('Found products:', allProducts.length);
    
    // Debug: Produkte mit Kategorien anzeigen
    allProducts.forEach(product => {
      console.log(`Product: ${product.name}, Category: ${product.category || 'none'}`);
    });
    
    // Für jede Kategorie die Anzahl der Produkte berechnen
    const categoriesWithProductCount = await Promise.all(categories.map(async (category) => {
      // Mit Mongoose direkt abfragen
      const count = await Product.countDocuments({ 
        category: category._id 
      });
      
      console.log(`Category ${category.name} (${category._id}): found ${count} products`);
      
      // Kategorie in ein einfaches JavaScript-Objekt umwandeln
      const categoryData = category.toObject();
      
      // Produktanzahl hinzufügen
      return {
        ...categoryData,
        productCount: count
      };
    }));

    return NextResponse.json({ success: true, data: categoriesWithProductCount });
  } catch (error: any) {
    console.error("Error in categories GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST - Neue Kategorie erstellen
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    
    // Slug generieren, wenn nicht vorhanden
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    
    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    // Wenn es ein Duplikat ist (z.B. gleicher Name oder Slug)
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Eine Kategorie mit diesem Namen oder Slug existiert bereits.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
