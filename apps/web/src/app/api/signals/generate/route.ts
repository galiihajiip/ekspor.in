import { NextRequest, NextResponse } from 'next/server';

const countryData: Record<string, { name: string; flag: string }> = {
  US: { name: 'Amerika Serikat', flag: '🇺🇸' },
  JP: { name: 'Jepang', flag: '🇯🇵' },
  SG: { name: 'Singapura', flag: '🇸🇬' },
  CN: { name: 'Tiongkok', flag: '🇨🇳' },
  KR: { name: 'Korea Selatan', flag: '🇰🇷' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  DE: { name: 'Jerman', flag: '🇩🇪' },
  GB: { name: 'Inggris', flag: '🇬🇧' },
  AE: { name: 'Uni Emirat Arab', flag: '🇦🇪' },
  SA: { name: 'Arab Saudi', flag: '🇸🇦' },
  MY: { name: 'Malaysia', flag: '🇲🇾' },
  TH: { name: 'Thailand', flag: '🇹🇭' },
};

const categoryLabels: Record<string, string> = {
  FOOD: 'Makanan & Minuman',
  COSMETICS: 'Kosmetik & Perawatan',
  APPAREL: 'Pakaian & Tekstil',
  HANDICRAFT: 'Kerajinan Tangan',
};

// Comprehensive market intelligence data
const marketData: Record<string, Record<string, any>> = {
  FOOD: {
    US: {
      demandOverview: 'Pasar makanan Asia di AS bernilai $50B dengan pertumbuhan 12% per tahun. Produk Indonesia seperti kopi, rempah, dan makanan ringan semakin populer.',
      competitorLandscape: 'Kompetisi dengan Thailand (makanan siap saji), Vietnam (kopi), dan Filipina (snack). Brand Indonesia masih underrepresented.',
      entryBarriers: 'FDA registration wajib. Prior Notice untuk setiap shipment. Facility registration setiap 2 tahun.',
      opportunities: 'Asian grocery chains berkembang (H Mart, 99 Ranch). E-commerce food growing 25% YoY. Halal segment $20B.',
      pricingInsights: 'Markup retail 150-200% dari FOB. Distributor margin 25-35%. Premium 30% untuk organic/specialty.',
    },
    JP: {
      demandOverview: 'Jepang impor $60B makanan per tahun. Indonesia pemasok ke-5 terbesar. Demand tinggi untuk seafood, kopi, dan cocoa.',
      competitorLandscape: 'Thailand dan Vietnam dominan untuk processed food. Australia untuk beef. Indonesia kuat di seafood dan kopi.',
      entryBarriers: 'JAS certification untuk organik. Strict pesticide residue limits. Japanese labeling mandatory.',
      opportunities: 'Halal tourism meningkat - 400K Muslim visitors/year. Convenience store channel massive. Private label opportunities.',
      pricingInsights: 'Premium market accepts 50-100% markup. Quality over price. Long-term relationship valued.',
    },
    CN: {
      demandOverview: 'Pasar makanan impor China $150B. Middle class 400 juta orang. Demand untuk premium imported food meningkat.',
      competitorLandscape: 'Australia, New Zealand untuk dairy. Thailand untuk fruits. Vietnam untuk seafood.',
      entryBarriers: 'CFDA registration complex. CIQ inspection. Chinese labeling. Long approval process 6-12 months.',
      opportunities: 'Cross-border e-commerce (Tmall Global, JD Worldwide) bypass some regulations. Live streaming sales booming.',
      pricingInsights: 'Willing to pay premium untuk imported. Markup 200-300% untuk premium products.',
    },
    SG: {
      demandOverview: 'Singapore hub re-export ke ASEAN. Impor $10B makanan. High purchasing power, quality conscious.',
      competitorLandscape: 'Open market, semua negara compete. Malaysia dan Thailand nearby competitors.',
      entryBarriers: 'SFA license straightforward. Halal certification valued. English labeling accepted.',
      opportunities: 'Gateway ke regional market. Food expos (FHA) major platform. HoReCa segment strong.',
      pricingInsights: 'Competitive pricing needed. Margin 20-30%. Volume-based business.',
    },
    KR: {
      demandOverview: 'Korea impor $30B makanan. Trend healthy food dan exotic ingredients. Indonesian spices gaining popularity.',
      competitorLandscape: 'US untuk beef, China untuk vegetables, Vietnam untuk seafood. Indonesia niche player.',
      entryBarriers: 'MFDS approval required. Korean labeling mandatory. Strict additive regulations.',
      opportunities: 'K-food trend creates interest in Asian ingredients. Convenience store channel huge.',
      pricingInsights: 'Premium pricing accepted untuk quality. Markup 100-150%.',
    },
    AU: {
      demandOverview: 'Australia impor $15B makanan. Large Indonesian diaspora. Demand untuk authentic Asian food.',
      competitorLandscape: 'Thailand, Vietnam, China dominate Asian food segment.',
      entryBarriers: 'Strict biosecurity. FSANZ compliance. Some products prohibited (fresh produce).',
      opportunities: 'Multicultural population. Asian grocery growing. Halal segment expanding.',
      pricingInsights: 'Mid-range pricing. Markup 80-120%.',
    },
    DE: {
      demandOverview: 'Germany largest EU market. €200B food market. Growing interest in Asian cuisine.',
      competitorLandscape: 'Thailand, Vietnam established. Indonesian food relatively unknown.',
      entryBarriers: 'EU food safety regulations. German labeling. Organic certification (EU Bio).',
      opportunities: 'Ethnic food segment growing 10% YoY. Fair trade products valued.',
      pricingInsights: 'Price sensitive but quality conscious. Markup 100-150%.',
    },
    GB: {
      demandOverview: 'UK £200B food market. Post-Brexit new regulations. Strong demand for world foods.',
      competitorLandscape: 'Indian, Chinese, Thai cuisines dominant. Indonesian cuisine emerging.',
      entryBarriers: 'UK food standards post-Brexit. English labeling. UKCA marking.',
      opportunities: 'World food aisle expanding. Online grocery booming. Halal segment £5B.',
      pricingInsights: 'Competitive market. Markup 80-120%.',
    },
    AE: {
      demandOverview: 'UAE hub untuk Middle East. $15B food imports. 90% food imported. Halal mandatory.',
      competitorLandscape: 'India, Pakistan untuk staples. Malaysia untuk halal processed food.',
      entryBarriers: 'Halal certification mandatory. Arabic labeling. ESMA standards.',
      opportunities: 'Re-export to GCC. Expo 2020 legacy. Tourism 15M visitors.',
      pricingInsights: 'Premium pricing accepted. Markup 50-80%.',
    },
    SA: {
      demandOverview: 'Saudi Arabia $25B food imports. Vision 2030 diversifying economy. Halal mandatory.',
      competitorLandscape: 'Brazil untuk meat. India untuk rice. Malaysia untuk processed food.',
      entryBarriers: 'SFDA registration. Halal from approved bodies. Arabic labeling.',
      opportunities: 'Largest GCC market. Growing retail sector. E-commerce emerging.',
      pricingInsights: 'Price sensitive untuk staples. Premium untuk specialty.',
    },
    MY: {
      demandOverview: 'Malaysia $15B food imports. Similar taste profile dengan Indonesia. Halal hub.',
      competitorLandscape: 'Thailand, China nearby. Indonesian products familiar.',
      entryBarriers: 'JAKIM halal recognized. Malay/English labeling. Straightforward process.',
      opportunities: 'Easy market entry. Similar consumer preferences. Halal hub untuk re-export.',
      pricingInsights: 'Competitive pricing. Low margins 15-25%.',
    },
    TH: {
      demandOverview: 'Thailand $15B food imports. Tourism 40M visitors. Growing middle class.',
      competitorLandscape: 'China, Japan untuk processed. Indonesia untuk some commodities.',
      entryBarriers: 'Thai FDA registration. Thai labeling. Import license.',
      opportunities: 'Tourism creates demand. Modern trade growing. ASEAN integration.',
      pricingInsights: 'Price competitive market. Markup 30-50%.',
    },
  },
  COSMETICS: {
    US: {
      demandOverview: 'US cosmetics market $90B. K-beauty dan J-beauty populer. Peluang untuk I-beauty (Indonesian beauty).',
      competitorLandscape: 'Korea dan Japan dominate Asian beauty. Indonesia virtually unknown.',
      entryBarriers: 'FDA cosmetic registration. Ingredient restrictions. Claims substantiation.',
      opportunities: 'Natural dan sustainable beauty trending. Clean beauty movement. Indie brands growing.',
      pricingInsights: 'Mid-range $15-40 per product. Premium untuk natural/organic.',
    },
    JP: {
      demandOverview: 'Japan cosmetics $40B, terbesar ke-3 dunia. High quality standards.',
      competitorLandscape: 'Local brands sangat kuat (Shiseido, Kao, Kose). Korean brands growing.',
      entryBarriers: 'PMDA approval. Japanese labeling. Strict ingredient regulations.',
      opportunities: 'Natural ingredients dari Indonesia diminati (coconut, essential oils).',
      pricingInsights: 'Premium pricing accepted. Quality over price.',
    },
    KR: {
      demandOverview: 'Korea cosmetics $13B. Trendsetter global. Highly competitive.',
      competitorLandscape: 'Local brands dominant. Very difficult market untuk foreign brands.',
      entryBarriers: 'MFDS registration. Korean labeling. Animal testing alternatives required.',
      opportunities: 'OEM/ODM opportunities. Ingredient supplier potential.',
      pricingInsights: 'Very competitive pricing. Innovation valued.',
    },
    CN: {
      demandOverview: 'China cosmetics $70B. Fastest growing market. Gen Z consumers.',
      competitorLandscape: 'Local C-beauty rising. Korean brands strong. Western brands premium.',
      entryBarriers: 'NMPA registration. Animal testing issues. Long approval 12-18 months.',
      opportunities: 'Cross-border e-commerce bypass animal testing. Live streaming sales.',
      pricingInsights: 'Wide range. Premium untuk imported brands.',
    },
  },
  APPAREL: {
    US: {
      demandOverview: 'US apparel market $350B. Fast fashion dan sustainable fashion both growing.',
      competitorLandscape: 'China, Vietnam, Bangladesh dominate manufacturing. Indonesia competitive.',
      entryBarriers: 'Labeling requirements. Flammability standards. Import duties.',
      opportunities: 'Sustainable fashion trend. Batik as luxury textile. Ethical manufacturing.',
      pricingInsights: 'Wide range. Premium untuk artisanal/sustainable.',
    },
    JP: {
      demandOverview: 'Japan apparel $90B. Quality conscious. Unique fashion culture.',
      competitorLandscape: 'China untuk mass market. Italy untuk luxury. Indonesia untuk some textiles.',
      entryBarriers: 'Quality standards high. Japanese sizing. Labeling requirements.',
      opportunities: 'Batik appreciated. Sustainable textiles valued.',
      pricingInsights: 'Premium untuk quality. Mid-range competitive.',
    },
  },
  HANDICRAFT: {
    US: {
      demandOverview: 'US home decor $180B. Handmade dan artisanal products trending.',
      competitorLandscape: 'China untuk mass market. India untuk textiles. Indonesia strong in furniture.',
      entryBarriers: 'Safety standards (lead, etc). Labeling. Wood certification (Lacey Act).',
      opportunities: 'Etsy dan artisan marketplaces. Fair trade valued. Sustainable materials.',
      pricingInsights: 'Premium untuk handmade. Markup 200-400%.',
    },
    JP: {
      demandOverview: 'Japan appreciates craftsmanship. Home goods market $30B.',
      competitorLandscape: 'Local artisans strong. Southeast Asian crafts popular.',
      entryBarriers: 'Quality expectations very high. Packaging important.',
      opportunities: 'Wabi-sabi aesthetic aligns dengan Indonesian crafts. Department stores.',
      pricingInsights: 'Premium pricing untuk quality craftsmanship.',
    },
    AE: {
      demandOverview: 'UAE luxury home market. High purchasing power. Interior design booming.',
      competitorLandscape: 'India, Morocco untuk crafts. Indonesia furniture known.',
      entryBarriers: 'Quality standards. Shipping logistics.',
      opportunities: 'Luxury hotels dan residences. Interior designers.',
      pricingInsights: 'Luxury pricing accepted.',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, countryCode } = body;

    if (!category || !countryCode) {
      return NextResponse.json({ error: 'Category and countryCode required' }, { status: 400 });
    }

    const country = countryData[countryCode];
    if (!country) {
      return NextResponse.json({ error: 'Invalid country code' }, { status: 400 });
    }

    // Get market data or generate default
    const data = marketData[category]?.[countryCode] || {
      demandOverview: `Pasar ${categoryLabels[category]} di ${country.name} menunjukkan potensi pertumbuhan. Produk Indonesia mulai dikenal.`,
      competitorLandscape: 'Kompetisi dengan produk regional dan global. Peluang untuk diferensiasi.',
      entryBarriers: 'Regulasi standar berlaku. Sertifikasi dan labeling sesuai ketentuan lokal diperlukan.',
      opportunities: 'Segmen premium dan specialty menawarkan margin lebih baik. E-commerce berkembang.',
      pricingInsights: 'Pricing kompetitif dengan markup 50-100% dari harga FOB.',
    };

    const newSignal = {
      id: Date.now().toString(),
      countryCode,
      countryName: country.name,
      category,
      ...data,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newSignal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate signal' }, { status: 500 });
  }
}
