import { NextResponse } from 'next/server';

const countries = [
  { code: 'US', name: 'Amerika Serikat', flag: '🇺🇸' },
  { code: 'JP', name: 'Jepang', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapura', flag: '🇸🇬' },
];

export async function GET() {
  return NextResponse.json(countries);
}
