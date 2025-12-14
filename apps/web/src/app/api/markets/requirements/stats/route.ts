import { NextResponse } from 'next/server';

const stats = [
  { countryCode: 'US', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'US', category: 'COSMETICS', _count: { _all: 1 } },
  { countryCode: 'JP', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'SG', category: 'FOOD', _count: { _all: 1 } },
];

export async function GET() {
  return NextResponse.json(stats);
}
