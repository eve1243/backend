import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { uploadImage, deleteImage } from '@/utils/cloudinary';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

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
    const body = await req.json();
    
    // Handle Cloudinary upload if new image is provided
    if (body.image && body.image.startsWith('data:image')) {
      // Get the current product to check if we need to delete an existing image
      const existingProduct = await Product.findById(params.id);
      
      if (existingProduct && existingProduct.cloudinaryId) {
        // Delete the old image from Cloudinary
        await deleteImage(existingProduct.cloudinaryId);
      }
      
      // Upload the new image
      const cloudinaryResult = await uploadImage(body.image);
      
      // Add Cloudinary data to the product
      body.cloudinaryUrl = cloudinaryResult.cloudinaryUrl;
      body.cloudinaryId = cloudinaryResult.cloudinaryId;
      
      // Remove the base64 image from the body to save DB space
      delete body.image;
    }
    
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

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
    // Get the product first to retrieve Cloudinary ID if exists
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    // Delete image from Cloudinary if exists
    if (product.cloudinaryId) {
      await deleteImage(product.cloudinaryId);
    }
    
    // Delete the product from database
    await Product.deleteOne({ _id: params.id });
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
