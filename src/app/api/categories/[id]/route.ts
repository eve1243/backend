import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET - Eine Kategorie abrufen
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }
    
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    // Produkte in dieser Kategorie zählen
    const productCount = await Product.countDocuments({ category: id });
    
    // Antwort mit Kategorie und Produktanzahl
    const categoryData = category.toObject();
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...categoryData,
        productCount
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT - Kategorie aktualisieren
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Slug aktualisieren, wenn der Name geändert wurde und kein Slug angegeben wurde
    if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: category });
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

// DELETE - Kategorie löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  
  await dbConnect();

  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }
    
    // Überprüfen, ob Produkte in dieser Kategorie existieren
    const productCount = await Product.countDocuments({ category: id });
    
    if (productCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Diese Kategorie kann nicht gelöscht werden, da sie ${productCount} Produkte enthält. Bitte weisen Sie diese Produkte zuerst einer anderen Kategorie zu.`
      }, { status: 400 });
    }
    
    // Kategorie löschen, wenn keine Produkte vorhanden sind
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
