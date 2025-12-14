import { NextRequest, NextResponse } from 'next/server';

const countryNames: Record<string, string> = {
  US: 'Amerika Serikat',
  JP: 'Jepang',
  SG: 'Singapura',
};

const categoryLabels: Record<string, string> = {
  FOOD: 'Makanan',
  COSMETICS: 'Kosmetik',
  APPAREL: 'Pakaian',
  HANDICRAFT: 'Kerajinan',
};

// Simulated AI response for demo
const generateMockSignal = (category: string, countryCode: string) => {
  const templates: Record<string, Record<string, any>> = {
    FOOD: {
      US: {
        demandOverview: 'Pasar makanan Indonesia di AS tumbuh 15% per tahun, terutama untuk produk halal dan organik.',
        competitorLandscape: 'Kompetisi dengan produk Thailand, Vietnam, dan Filipina.',
        entryBarriers: 'FDA registration wajib, label nutrisi format AS.',
        opportunities: 'Segmen Asian grocery berkembang pesat di kota-kota besar.',
        pricingInsights: 'Markup 100-150% dari harga FOB untuk retail.',
      },
      JP: {
        demandOverview: 'Jepang mengimpor $2B makanan dari ASEAN, Indonesia peringkat 3.',
        competitorLandscape: 'Thailand dan Vietnam dominan untuk seafood dan buah.',
        entryBarriers: 'Standar JAS ketat, inspeksi sanitasi wajib.',
        opportunities: 'Halal food demand meningkat untuk turis Muslim.',
        pricingInsights: 'Premium 50-80% untuk produk certified organic.',
      },
      SG: {
        demandOverview: 'Singapura hub distribusi ASEAN, re-export tinggi.',
        competitorLandscape: 'Akses mudah, kompetisi harga ketat.',
        entryBarriers: 'SFA license required, halal certification valued.',
        opportunities: 'Gateway ke pasar regional, food expo rutin.',
        pricingInsights: 'Margin tipis 20-30%, volume-based.',
      },
    },
    COSMETICS: {
      US: {
        demandOverview: 'K-beauty dan J-beauty populer, peluang untuk I-beauty.',
        competitorLandscape: 'Korea dan Jepang dominan di Asian beauty segment.',
        entryBarriers: 'FDA cosmetic registration, ingredient restrictions.',
        opportunities: 'Natural dan sustainable beauty trending.',
        pricingInsights: 'Mid-range $15-40 per product.',
      },
      JP: {
        demandOverview: 'Pasar kosmetik Jepang $40B, terbesar ke-3 dunia.',
        competitorLandscape: 'Brand lokal sangat kuat (Shiseido, Kao).',
        entryBarriers: 'PMDA approval, Japanese labeling mandatory.',
        opportunities: 'Natural ingredients dari Indonesia diminati.',
        pricingInsights: 'Premium pricing accepted untuk quality.',
      },
      SG: {
        demandOverview: 'Hub kosmetik ASEAN, testing ground untuk regional.',
        competitorLandscape: 'Multi-brand retailers dominan.',
        entryBarriers: 'HSA notification required.',
        opportunities: 'E-commerce growth 30% YoY.',
        pricingInsights: 'Competitive pricing needed.',
      },
    },
  };

  const defaultSignal = {
    demandOverview: `Permintaan ${categoryLabels[category]} Indonesia di ${countryNames[countryCode]} menunjukkan tren positif.`,
    competitorLandscape: 'Kompetisi dengan produk regional ASEAN.',
    entryBarriers: 'Regulasi standar dan sertifikasi diperlukan.',
    opportunities: 'Potensi pertumbuhan di segmen premium dan specialty.',
    pricingInsights: 'Pricing kompetitif dengan margin 30-50%.',
  };

  return templates[category]?.[countryCode] || defaultSignal;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category, countryCode } = body;

  const mockData = generateMockSignal(category, countryCode);

  const newSignal = {
    id: Date.now().toString(),
    countryCode,
    countryName: countryNames[countryCode] || countryCode,
    category,
    ...mockData,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(newSignal, { status: 201 });
}
