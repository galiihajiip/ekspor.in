import { NextRequest, NextResponse } from 'next/server';

// Sample products data
const products = [
  { id: '1', name: 'Kopi Arabika Gayo', category: 'FOOD', targetMarkets: ['US', 'JP'] },
  { id: '2', name: 'Batik Tulis Solo', category: 'APPAREL', targetMarkets: ['SG', 'JP'] },
  { id: '3', name: 'Minyak Kelapa VCO', category: 'FOOD', targetMarkets: ['AU', 'DE'] },
  { id: '4', name: 'Skincare Bali Alus', category: 'COSMETICS', targetMarkets: ['KR', 'CN'] },
];

const countryNames: Record<string, string> = {
  US: 'Amerika Serikat', JP: 'Jepang', SG: 'Singapura', AU: 'Australia',
  DE: 'Jerman', KR: 'Korea Selatan', CN: 'Tiongkok', GB: 'Inggris',
  AE: 'Uni Emirat Arab', SA: 'Arab Saudi', MY: 'Malaysia', TH: 'Thailand',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = products.find(p => p.id === params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const report = {
      generatedAt: new Date().toISOString(),
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
      },
      summary: {
        readinessScore: 72 + Math.floor(Math.random() * 15),
        totalRequirements: 12,
        completedRequirements: 8,
        pendingRequirements: 4,
      },
      targetMarkets: product.targetMarkets.map(code => ({
        code,
        name: countryNames[code] || code,
        readinessScore: 65 + Math.floor(Math.random() * 25),
        keyRequirements: getRequirements(product.category, code),
      })),
      recommendations: getRecommendations(product.category),
      nextSteps: [
        'Lengkapi dokumen yang masih pending',
        'Konsultasi dengan freight forwarder untuk estimasi biaya pengiriman',
        'Hubungi buyer potensial di negara tujuan',
        'Siapkan sampel produk untuk pengujian',
      ],
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

function getRequirements(category: string, country: string): string[] {
  const base: Record<string, string[]> = {
    FOOD: ['Food Safety Certificate', 'Nutrition Label', 'Ingredient List', 'Shelf Life Declaration'],
    COSMETICS: ['Product Safety Assessment', 'Ingredient List (INCI)', 'GMP Certificate', 'Free Sale Certificate'],
    APPAREL: ['Care Label', 'Fiber Content Label', 'Country of Origin', 'Safety Test Report'],
    HANDICRAFT: ['Material Declaration', 'Quality Certificate', 'Packing List', 'Commercial Invoice'],
  };

  const countrySpecific: Record<string, string[]> = {
    US: ['FDA Registration', 'Prior Notice'],
    JP: ['JAS Certification', 'Japanese Label'],
    SG: ['SFA Import Permit', 'Health Certificate'],
    AU: ['FSANZ Compliance', 'Quarantine Clearance'],
    DE: ['EU CE Marking', 'REACH Compliance'],
    KR: ['KFDA Registration', 'Korean Label'],
    CN: ['CIQ Inspection', 'Chinese Label'],
  };

  return [...(base[category] || base.FOOD), ...(countrySpecific[country] || [])];
}

function getRecommendations(category: string): string[] {
  const recs: Record<string, string[]> = {
    FOOD: [
      'Pastikan semua sertifikasi keamanan pangan up-to-date',
      'Siapkan label dalam bahasa negara tujuan',
      'Lakukan uji laboratorium untuk memastikan kepatuhan standar',
      'Konsultasi dengan ahli regulasi ekspor makanan',
    ],
    COSMETICS: [
      'Lengkapi Product Information File (PIF)',
      'Pastikan semua ingredient terdaftar dan aman',
      'Siapkan safety assessment dari qualified assessor',
      'Update formula jika ada ingredient yang dilarang di negara tujuan',
    ],
    APPAREL: [
      'Pastikan care label sesuai standar internasional',
      'Lakukan uji flammability dan colorfastness',
      'Siapkan dokumentasi fiber content yang akurat',
      'Pertimbangkan sertifikasi sustainability untuk nilai tambah',
    ],
    HANDICRAFT: [
      'Dokumentasikan material dan proses produksi',
      'Pastikan tidak menggunakan material yang dilindungi',
      'Tingkatkan packaging untuk keamanan pengiriman',
      'Siapkan story behind the product untuk marketing',
    ],
  };

  return recs[category] || recs.FOOD;
}
