import { NextResponse } from 'next/server';

const stats = [
  { countryCode: 'US', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'US', category: 'COSMETICS', _count: { _all: 1 } },
  { countryCode: 'JP', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'SG', category: 'FOOD', _count: { _all: 1 } },
  { countryCode: 'CN', category: 'FOOD', _count: { _all: 1 } },
  { countryCode: 'CN', category: 'COSMETICS', _count: { _all: 1 } },
  { countryCode: 'KR', category: 'FOOD', _count: { _all: 1 } },
  { countryCode: 'KR', category: 'COSMETICS', _count: { _all: 1 } },
  { countryCode: 'AU', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'DE', category: 'FOOD', _count: { _all: 1 } },
  { countryCode: 'DE', category: 'COSMETICS', _count: { _all: 1 } },
  { countryCode: 'GB', category: 'FOOD', _count: { _all: 1 } },
  { countryCode: 'AE', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'SA', category: 'FOOD', _count: { _all: 2 } },
  { countryCode: 'MY', category: 'FOOD', _count: { _all: 1 } },
  { countryCode: 'TH', category: 'FOOD', _count: { _all: 1 } },
];

export async function GET() {
  return NextResponse.json(stats);
}
