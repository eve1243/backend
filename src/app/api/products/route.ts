
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadImage } from '@/utils/cloudinary';
import mongoose from 'mongoose';

export async function GET() {
  await dbConnect();

  try {
    // Hole Produkte und fülle die Kategorie-Referenz mit den Category-Daten
    const products = await Product.find({}).populate('category');
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    
    // Handle Cloudinary upload if image is provided
    if (body.image && body.image.startsWith('data:image')) {
      const cloudinaryResult = await uploadImage(body.image);
      
      // Add Cloudinary data to the product
      body.cloudinaryUrls = [cloudinaryResult.cloudinaryUrl];
      body.cloudinaryIds = [cloudinaryResult.cloudinaryId];
      
      // Remove the base64 image from the body to save DB space
      delete body.image;
    }
    
    // For direct cloudinaryUrls from the frontend (multiple images)
    if (body.cloudinaryUrls && Array.isArray(body.cloudinaryUrls)) {
      // We already have the URLs array from the frontend
      // This handles the case where images were uploaded directly via the FileUploader
    }
    
    // Ensure category is present and is a valid ObjectId
    if (!body.category) {
      return NextResponse.json({ success: false, error: 'Kategorie ist erforderlich.' }, { status: 400 });
    }
    let categoryId;
    try {
      categoryId = new mongoose.Types.ObjectId(body.category);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Ungültige Kategorie-ID.' }, { status: 400 });
    }

    // Baue das Produkt-Objekt explizit
    const productData = {
      name: body.name,
      price: body.price,
      description: body.description,
      category: categoryId,
      cloudinaryUrls: Array.isArray(body.cloudinaryUrls) ? body.cloudinaryUrls : [],
      cloudinaryIds: Array.isArray(body.cloudinaryIds) ? body.cloudinaryIds : [],
    };
    // Debug: Log productData before saving
    console.log('Saving product with productData:', JSON.stringify(productData));
    const product = await Product.create(productData);
    // Debug: Log saved product
    console.log('Saved product:', JSON.stringify(product));
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
