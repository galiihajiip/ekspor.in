import { NextRequest, NextResponse } from 'next/server';

// Sample products data
const products: any[] = [
  {
    id: '1',
    name: 'Kopi Arabika Gayo',
    description: 'Kopi premium dari dataran tinggi Gayo, Aceh. Single origin dengan profil rasa fruity dan wine-like.',
    category: 'FOOD',
    userId: 'demo-user',
    targetMarkets: [
      { countryCode: 'US', countryName: 'Amerika Serikat' },
      { countryCode: 'JP', countryName: 'Jepang' },
    ],
    _count: { gaps: 2, checklistItems: 5 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Batik Tulis Solo',
    description: 'Batik tulis tradisional dengan motif klasik Parang dan Kawung. Pewarna alami.',
    category: 'APPAREL',
    userId: 'demo-user',
    targetMarkets: [
      { countryCode: 'SG', countryName: 'Singapura' },
      { countryCode: 'JP', countryName: 'Jepang' },
    ],
    _count: { gaps: 1, checklistItems: 3 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Minyak Kelapa VCO',
    description: 'Virgin Coconut Oil organik dari Sulawesi. Cold-pressed, unrefined.',
    category: 'FOOD',
    userId: 'demo-user',
    targetMarkets: [
      { countryCode: 'AU', countryName: 'Australia' },
      { countryCode: 'DE', countryName: 'Jerman' },
    ],
    _count: { gaps: 3, checklistItems: 6 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Skincare Bali Alus',
    description: 'Rangkaian skincare dengan bahan alami Bali - lulur, masker, dan body butter.',
    category: 'COSMETICS',
    userId: 'demo-user',
    targetMarkets: [
      { countryCode: 'KR', countryName: 'Korea Selatan' },
      { countryCode: 'CN', countryName: 'Tiongkok' },
    ],
    _count: { gaps: 4, checklistItems: 8 },
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || '',
      category: body.category,
      hsCode: body.hsCode || '',
      userId: body.userId || 'demo-user',
      targetMarkets: [],
      _count: { gaps: 0, checklistItems: 0 },
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
