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
    // Stelle sicher, dass params vorhanden ist und id zugänglich ist
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }
    
    const product = await Product.findById(id);
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
    // Stelle sicher, dass params vorhanden ist und id zugänglich ist
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Handle Cloudinary upload if new image is provided
    if (body.image && body.image.startsWith('data:image')) {
      // Get the current product to check if we need to delete an existing image
      const existingProduct = await Product.findById(id);
      
      if (existingProduct && existingProduct.cloudinaryId) {
        // Delete the old image from Cloudinary
        await deleteImage(existingProduct.cloudinaryId);
      }
      
      // Upload the new image
      const cloudinaryResult = await uploadImage(body.image);
      
      // Add Cloudinary data to the product
      body.cloudinaryUrls = [cloudinaryResult.cloudinaryUrl];
      body.cloudinaryIds = [cloudinaryResult.cloudinaryId];
      
      // Remove the base64 image from the body to save DB space
      delete body.image;
    }
    
    // Handle case where we already have cloudinaryUrls and cloudinaryIds arrays
    if (body.cloudinaryUrls && Array.isArray(body.cloudinaryUrls) && 
        body.cloudinaryIds && Array.isArray(body.cloudinaryIds)) {
      // We're using the new multiple image format
      
      // Check if we need to delete any existing images
      const existingProduct = await Product.findById(id);
      
      if (existingProduct) {
        // Handle transition from old format to new format
        if (existingProduct.cloudinaryId && existingProduct.cloudinaryUrl &&
            !existingProduct.cloudinaryIds && !existingProduct.cloudinaryUrls) {
          // Convert old format to new format
          existingProduct.cloudinaryIds = [existingProduct.cloudinaryId];
          existingProduct.cloudinaryUrls = [existingProduct.cloudinaryUrl];
        }
        
        // If we have existing images, check if any need to be deleted
        if (existingProduct.cloudinaryIds && Array.isArray(existingProduct.cloudinaryIds)) {
          // Find IDs that are in the existing product but not in the updated body
          const idsToDelete: string[] = existingProduct.cloudinaryIds.filter(
            (id: string) => !body.cloudinaryIds.includes(id)
          );
          
          // Delete each removed image from Cloudinary
          for (const id of idsToDelete) {
            try {
              await deleteImage(id);
            } catch (err) {
              console.error(`Failed to delete image ${id}:`, err);
            }
          }
        }
      }
    }
    
    const product = await Product.findByIdAndUpdate(id, body, {
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
    // Stelle sicher, dass params vorhanden ist und id zugänglich ist
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }
    
    // Get the product first to retrieve Cloudinary ID if exists
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    // Delete image from Cloudinary if exists
    if (product.cloudinaryIds && Array.isArray(product.cloudinaryIds)) {
      // Delete all images in the array
      for (const id of product.cloudinaryIds) {
        try {
          await deleteImage(id);
        } catch (err) {
          console.error(`Failed to delete image ${id}:`, err);
        }
      }
    } else if (product.cloudinaryId) {
      // Legacy support for old format
      await deleteImage(product.cloudinaryId);
    }
    
    // Delete the product from database
    await Product.deleteOne({ _id: id });
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
