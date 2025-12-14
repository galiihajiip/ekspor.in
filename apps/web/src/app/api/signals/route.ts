import { NextResponse } from 'next/server';

let signals = [
  {
    id: '1',
    countryCode: 'US',
    countryName: 'Amerika Serikat',
    category: 'FOOD',
    demandOverview: 'Permintaan tinggi untuk kopi specialty dan produk organik Indonesia.',
    competitorLandscape: 'Kompetisi ketat dengan kopi dari Ethiopia, Colombia, dan Vietnam.',
    entryBarriers: 'Regulasi FDA ketat, perlu sertifikasi organik USDA untuk premium market.',
    opportunities: 'Segmen specialty coffee tumbuh 20% per tahun, konsumen mencari single-origin.',
    pricingInsights: 'Harga retail $15-25/lb untuk specialty grade, margin 40-60%.',
    generatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    countryCode: 'JP',
    countryName: 'Jepang',
    category: 'FOOD',
    demandOverview: 'Pasar kopi Jepang senilai $4B, preferensi untuk light roast.',
    competitorLandscape: 'Dominasi brand lokal seperti UCC dan Key Coffee.',
    entryBarriers: 'Standar kualitas sangat tinggi, label bahasa Jepang wajib.',
    opportunities: 'Third wave coffee culture berkembang, cafe specialty meningkat.',
    pricingInsights: 'Premium pricing diterima, ¥2000-4000 per 200g.',
    generatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(signals);
}
