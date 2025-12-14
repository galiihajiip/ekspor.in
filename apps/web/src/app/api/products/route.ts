import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (resets on redeploy)
let products: any[] = [
  {
    id: '1',
    name: 'Kopi Arabika Gayo',
    description: 'Kopi premium dari dataran tinggi Gayo, Aceh',
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
    description: 'Batik tulis tradisional dengan motif klasik',
    category: 'APPAREL',
    userId: 'demo-user',
    targetMarkets: [{ countryCode: 'SG', countryName: 'Singapura' }],
    _count: { gaps: 1, checklistItems: 3 },
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newProduct = {
    id: Date.now().toString(),
    ...body,
    targetMarkets: [],
    _count: { gaps: 0, checklistItems: 0 },
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
