import { NextResponse } from 'next/server';

const countries = [
  { code: 'US', name: 'Amerika Serikat', flag: '🇺🇸' },
  { code: 'JP', name: 'Jepang', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapura', flag: '🇸🇬' },
  { code: 'CN', name: 'Tiongkok', flag: '🇨🇳' },
  { code: 'KR', name: 'Korea Selatan', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Jerman', flag: '🇩🇪' },
  { code: 'GB', name: 'Inggris', flag: '🇬🇧' },
  { code: 'AE', name: 'Uni Emirat Arab', flag: '🇦🇪' },
  { code: 'SA', name: 'Arab Saudi', flag: '🇸🇦' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
];

export async function GET() {
  return NextResponse.json(countries);
}
