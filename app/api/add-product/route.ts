import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client'; // Import your Sanity client

interface Product {
  name: string;
  price: number;
  slug: string;
  description: string;
  image: string;
  category: string[];  
  tags: string[];      
  discountPercent: number;
  new: boolean;
  colors: string[];
  sizes: string[];
  stock: number;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();  // Parse incoming request data
    const {
      name,
      price,
      slug,
      description,
      image,
      category,
      tags,
      discountPercent,
      new: isNew,
      colors,
      sizes,
      stock,
    }: Product = data;

    // Ensure all required fields are present
    if (!name || !price || !slug || !description || !image || !category || !tags || !stock) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Create the product in Sanity
    const newProduct = await client.create({
      _type: 'products',  // Change _type to match your schema
      name,
      price,
      slug: { current: slug },
      description,
      image,
      category,   // This will now accept an array of categories
      tags,       // This will now accept an array of tags
      discountPercent,
      new: isNew,
      colors,
      sizes,
      stock,
    });

    return NextResponse.json({ success: true, productId: newProduct._id });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, message: 'Failed to add product' }, { status: 500 });
  }
}
