import { NextResponse } from 'next/server';

// Sample signals data
const signals = [
  {
    id: '1',
    countryCode: 'US',
    countryName: 'Amerika Serikat',
    category: 'FOOD',
    demandOverview: 'Permintaan tinggi untuk kopi specialty dan produk organik Indonesia. Pasar senilai $30B dengan pertumbuhan 8% per tahun.',
    competitorLandscape: 'Kompetisi ketat dengan kopi dari Ethiopia, Colombia, dan Vietnam. Brand lokal seperti Starbucks mendominasi.',
    entryBarriers: 'Regulasi FDA ketat, perlu sertifikasi organik USDA untuk premium market. Biaya compliance tinggi.',
    opportunities: 'Segmen specialty coffee tumbuh 20% per tahun. Konsumen mencari single-origin dan sustainable products.',
    pricingInsights: 'Harga retail $15-25/lb untuk specialty grade. Margin distributor 40-60%.',
    generatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    countryCode: 'JP',
    countryName: 'Jepang',
    category: 'FOOD',
    demandOverview: 'Pasar kopi Jepang senilai $4B. Preferensi untuk light roast dan single-origin meningkat.',
    competitorLandscape: 'Dominasi brand lokal seperti UCC, Key Coffee, dan AGF. Third wave coffee culture berkembang.',
    entryBarriers: 'Standar kualitas sangat tinggi. Label bahasa Jepang wajib. JAS certification untuk organik.',
    opportunities: 'Cafe specialty meningkat 15% per tahun. Indonesian coffee sudah dikenal (Mandheling, Toraja).',
    pricingInsights: 'Premium pricing diterima. ¥2000-4000 per 200g untuk specialty.',
    generatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    countryCode: 'AE',
    countryName: 'Uni Emirat Arab',
    category: 'FOOD',
    demandOverview: 'Hub perdagangan Timur Tengah. Permintaan tinggi untuk produk halal certified.',
    competitorLandscape: 'Kompetisi dengan produk dari Malaysia, Turki, dan negara Arab lain.',
    entryBarriers: 'Halal certification wajib. Label Arabic required. ESMA compliance.',
    opportunities: 'Re-export ke negara GCC lain. Expo dan trade fair rutin di Dubai.',
    pricingInsights: 'Margin 30-50%. Premium untuk certified organic halal.',
    generatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    countryCode: 'CN',
    countryName: 'Tiongkok',
    category: 'COSMETICS',
    demandOverview: 'Pasar kosmetik China $70B, tercepat pertumbuhannya. Gen Z consumers sangat aktif.',
    competitorLandscape: 'C-beauty lokal naik pesat. Korean brands kuat. Western brands premium segment.',
    entryBarriers: 'NMPA registration kompleks. Animal testing issues. Approval 12-18 bulan.',
    opportunities: 'Cross-border e-commerce bypass animal testing. Live streaming sales booming.',
    pricingInsights: 'Wide range pricing. Premium untuk imported brands.',
    generatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(signals);
}
