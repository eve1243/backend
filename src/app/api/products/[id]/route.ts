import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getSession } from 'next-auth/react';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
    const session = await getSession({ req });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

  await dbConnect();

  try {
    const product = await Product.findByIdAndUpdate(params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
    const session = await getSession({ req });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
  await dbConnect();

  try {
    const deletedProduct = await Product.deleteOne({ _id: params.id });
    if (!deletedProduct) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
