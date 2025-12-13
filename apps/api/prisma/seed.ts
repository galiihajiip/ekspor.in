import { PrismaClient, ProductCategory, Severity } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@ekspor.in' },
    update: {},
    create: {
      email: 'demo@ekspor.in',
      name: 'Demo User',
      company: 'UMKM Demo Indonesia',
      phone: '+62812345678',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Seed Requirements for each country and category
  const requirements = [
    // US - FOOD
    {
      title: 'FDA Registration',
      description: 'Fasilitas produksi makanan harus terdaftar di FDA sebelum mengekspor ke Amerika Serikat.',
      category: ProductCategory.FOOD,
      countryCode: 'US',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.fda.gov/food/registration-food-facilities',
    },
    {
      title: 'Nutrition Facts Label',
      description: 'Label nutrisi harus mengikuti format FDA Nutrition Facts dengan informasi lengkap.',
      category: ProductCategory.FOOD,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.fda.gov/food/food-labeling-nutrition',
    },
    {
      title: 'FSVP Compliance',
      description: 'Foreign Supplier Verification Program - importir AS harus memverifikasi keamanan pangan.',
      category: ProductCategory.FOOD,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-foreign-supplier-verification-programs',
    },
    {
      title: 'Prior Notice',
      description: 'Pemberitahuan sebelum pengiriman makanan ke AS harus diajukan ke FDA.',
      category: ProductCategory.FOOD,
      countryCode: 'US',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.fda.gov/food/importing-food-products-united-states/prior-notice-imported-foods',
    },
    {
      title: 'Allergen Labeling',
      description: 'Deklarasi alergen wajib untuk 9 alergen utama sesuai FALCPA.',
      category: ProductCategory.FOOD,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.fda.gov/food/food-allergies/food-allergen-labeling-and-consumer-protection-act-2004-falcpa',
    },

    // JP - FOOD
    {
      title: 'JAS Certification',
      description: 'Japanese Agricultural Standards certification untuk produk pertanian dan makanan.',
      category: ProductCategory.FOOD,
      countryCode: 'JP',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.maff.go.jp/e/policies/standard/jas/',
    },
    {
      title: 'Food Sanitation Law Compliance',
      description: 'Kepatuhan terhadap Undang-Undang Sanitasi Makanan Jepang.',
      category: ProductCategory.FOOD,
      countryCode: 'JP',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.mhlw.go.jp/english/topics/foodsafety/',
    },
    {
      title: 'Japanese Labeling Requirements',
      description: 'Label dalam bahasa Jepang dengan informasi nutrisi dan alergen.',
      category: ProductCategory.FOOD,
      countryCode: 'JP',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.caa.go.jp/en/policy/food_labeling/',
    },
    {
      title: 'Import Notification',
      description: 'Notifikasi impor ke MHLW sebelum produk masuk Jepang.',
      category: ProductCategory.FOOD,
      countryCode: 'JP',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.mhlw.go.jp/english/topics/importedfoods/',
    },
    {
      title: 'Additive Compliance',
      description: 'Bahan tambahan makanan harus sesuai dengan daftar positif Jepang.',
      category: ProductCategory.FOOD,
      countryCode: 'JP',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.mhlw.go.jp/english/topics/foodsafety/foodadditives/',
    },

    // SG - FOOD
    {
      title: 'SFA License',
      description: 'Lisensi dari Singapore Food Agency untuk impor makanan.',
      category: ProductCategory.FOOD,
      countryCode: 'SG',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.sfa.gov.sg/food-import-export',
    },
    {
      title: 'Health Certificate',
      description: 'Sertifikat kesehatan dari otoritas negara asal.',
      category: ProductCategory.FOOD,
      countryCode: 'SG',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.sfa.gov.sg/food-import-export/commercial-food-imports',
    },
    {
      title: 'Food Regulations Compliance',
      description: 'Kepatuhan terhadap Sale of Food Act dan Food Regulations.',
      category: ProductCategory.FOOD,
      countryCode: 'SG',
      severity: Severity.HIGH,
      sourceUrl: 'https://sso.agc.gov.sg/Act/SFA1973',
    },
    {
      title: 'Halal Certification',
      description: 'Sertifikasi Halal dari MUIS untuk produk yang diklaim halal.',
      category: ProductCategory.FOOD,
      countryCode: 'SG',
      severity: Severity.MEDIUM,
      sourceUrl: 'https://www.muis.gov.sg/Halal/Halal-Certification',
    },

    // US - COSMETICS
    {
      title: 'FDA Cosmetic Registration',
      description: 'Registrasi sukarela namun sangat direkomendasikan di VCRP FDA.',
      category: ProductCategory.COSMETICS,
      countryCode: 'US',
      severity: Severity.MEDIUM,
      sourceUrl: 'https://www.fda.gov/cosmetics/cosmetic-registration-program',
    },
    {
      title: 'Ingredient Listing (INCI)',
      description: 'Daftar bahan menggunakan nomenklatur INCI pada label.',
      category: ProductCategory.COSMETICS,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.fda.gov/cosmetics/cosmetics-labeling/cosmetics-labeling-guide',
    },
    {
      title: 'Safety Substantiation',
      description: 'Dokumentasi keamanan produk kosmetik.',
      category: ProductCategory.COSMETICS,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.fda.gov/cosmetics/cosmetics-guidance-regulation',
    },
    {
      title: 'MoCRA Compliance',
      description: 'Modernization of Cosmetics Regulation Act 2022 compliance.',
      category: ProductCategory.COSMETICS,
      countryCode: 'US',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra',
    },

    // JP - COSMETICS
    {
      title: 'PMDA Notification',
      description: 'Notifikasi ke Pharmaceuticals and Medical Devices Agency.',
      category: ProductCategory.COSMETICS,
      countryCode: 'JP',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.pmda.go.jp/english/',
    },
    {
      title: 'Japanese Cosmetic Standards',
      description: 'Kepatuhan terhadap standar kosmetik Jepang.',
      category: ProductCategory.COSMETICS,
      countryCode: 'JP',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.mhlw.go.jp/english/topics/cosmetics/',
    },
    {
      title: 'Marketing Authorization Holder',
      description: 'Penunjukan MAH di Jepang untuk distribusi.',
      category: ProductCategory.COSMETICS,
      countryCode: 'JP',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.pmda.go.jp/english/review-services/outline/0002.html',
    },

    // SG - COSMETICS
    {
      title: 'HSA Notification',
      description: 'Notifikasi ke Health Sciences Authority untuk kosmetik.',
      category: ProductCategory.COSMETICS,
      countryCode: 'SG',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.hsa.gov.sg/cosmetic-products',
    },
    {
      title: 'ASEAN Cosmetic Directive',
      description: 'Kepatuhan terhadap ASEAN Cosmetic Directive.',
      category: ProductCategory.COSMETICS,
      countryCode: 'SG',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.hsa.gov.sg/cosmetic-products/overview',
    },

    // US - APPAREL
    {
      title: 'Textile Fiber Labeling',
      description: 'Label komposisi serat sesuai Textile Fiber Products Identification Act.',
      category: ProductCategory.APPAREL,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts',
    },
    {
      title: 'Care Labeling Rule',
      description: 'Instruksi perawatan wajib pada produk tekstil.',
      category: ProductCategory.APPAREL,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule',
    },
    {
      title: 'Country of Origin',
      description: 'Label negara asal yang jelas dan permanen.',
      category: ProductCategory.APPAREL,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.cbp.gov/trade/rulings/country-origin',
    },
    {
      title: 'Flammability Standards',
      description: 'Standar ketahanan api untuk tekstil tertentu.',
      category: ProductCategory.APPAREL,
      countryCode: 'US',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.cpsc.gov/Business--Manufacturing/Business-Education/Business-Guidance/Flammability',
    },

    // JP - APPAREL
    {
      title: 'Household Goods Quality Labeling',
      description: 'Label kualitas sesuai Household Goods Quality Labeling Act.',
      category: ProductCategory.APPAREL,
      countryCode: 'JP',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.caa.go.jp/en/policy/representation/household_goods/',
    },
    {
      title: 'JIS Standards',
      description: 'Kepatuhan terhadap Japanese Industrial Standards untuk tekstil.',
      category: ProductCategory.APPAREL,
      countryCode: 'JP',
      severity: Severity.MEDIUM,
      sourceUrl: 'https://www.jisc.go.jp/eng/',
    },

    // SG - APPAREL
    {
      title: 'Consumer Protection Standards',
      description: 'Kepatuhan terhadap Consumer Protection (Safety Requirements) Regulations.',
      category: ProductCategory.APPAREL,
      countryCode: 'SG',
      severity: Severity.MEDIUM,
      sourceUrl: 'https://www.enterprisesg.gov.sg/quality-standards/consumer-protection',
    },

    // US - HANDICRAFT
    {
      title: 'CPSC Compliance',
      description: 'Kepatuhan Consumer Product Safety Commission untuk kerajinan.',
      category: ProductCategory.HANDICRAFT,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.cpsc.gov/',
    },
    {
      title: 'Lead Content Limits',
      description: 'Batas kandungan timbal untuk produk yang dapat diakses anak.',
      category: ProductCategory.HANDICRAFT,
      countryCode: 'US',
      severity: Severity.CRITICAL,
      sourceUrl: 'https://www.cpsc.gov/Business--Manufacturing/Business-Education/Lead',
    },
    {
      title: 'Lacey Act Compliance',
      description: 'Kepatuhan Lacey Act untuk produk kayu.',
      category: ProductCategory.HANDICRAFT,
      countryCode: 'US',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.aphis.usda.gov/aphis/ourfocus/planthealth/import-information/lacey-act',
    },

    // JP - HANDICRAFT
    {
      title: 'PSC Mark',
      description: 'Product Safety Consumer mark untuk produk tertentu.',
      category: ProductCategory.HANDICRAFT,
      countryCode: 'JP',
      severity: Severity.HIGH,
      sourceUrl: 'https://www.meti.go.jp/english/policy/economy/consumer/psc/',
    },

    // SG - HANDICRAFT
    {
      title: 'Safety Mark',
      description: 'SAFETY Mark untuk produk konsumen terkontrol.',
      category: ProductCategory.HANDICRAFT,
      countryCode: 'SG',
      severity: Severity.MEDIUM,
      sourceUrl: 'https://www.enterprisesg.gov.sg/quality-standards/consumer-protection/safety-mark',
    },
  ];

  for (const req of requirements) {
    await prisma.requirement.upsert({
      where: {
        id: `${req.countryCode}-${req.category}-${req.title.replace(/\s+/g, '-').toLowerCase()}`,
      },
      update: req,
      create: {
        id: `${req.countryCode}-${req.category}-${req.title.replace(/\s+/g, '-').toLowerCase()}`,
        ...req,
      },
    });
  }

  console.log(`✅ Seeded ${requirements.length} requirements`);

  // Seed Market Signals
  const marketSignals = [
    {
      countryCode: 'US',
      countryName: 'Amerika Serikat',
      category: ProductCategory.FOOD,
      demandOverview: 'Pasar makanan AS bernilai $1.5 triliun dengan pertumbuhan stabil. Produk organik, plant-based, dan makanan etnik Asia Tenggara mengalami peningkatan permintaan signifikan.',
      buyerChannels: ['Amazon', 'Whole Foods', 'Costco', 'Specialty Food Distributors', 'Asian Grocery Chains'],
      positioningNotes: 'Fokus pada cerita asal-usul produk, sertifikasi organik, dan kemasan premium. Konsumen AS menghargai transparansi dan sustainability.',
      keywords: ['organic', 'authentic', 'sustainable', 'artisanal', 'exotic flavors'],
    },
    {
      countryCode: 'JP',
      countryName: 'Jepang',
      category: ProductCategory.FOOD,
      demandOverview: 'Jepang adalah importir makanan terbesar ke-4 dunia. Permintaan tinggi untuk makanan halal, produk kesehatan, dan makanan convenience.',
      buyerChannels: ['AEON', 'Seven & I Holdings', 'Lawson', 'Trading Companies (Sogo Shosha)', 'Online Marketplaces'],
      positioningNotes: 'Kualitas dan keamanan adalah prioritas utama. Kemasan harus rapi dan informatif. Porsi lebih kecil lebih disukai.',
      keywords: ['quality', 'safety', 'halal', 'health', 'convenience'],
    },
    {
      countryCode: 'SG',
      countryName: 'Singapura',
      category: ProductCategory.FOOD,
      demandOverview: 'Hub makanan regional dengan populasi multikultural. Permintaan tinggi untuk produk halal, makanan sehat, dan produk premium.',
      buyerChannels: ['FairPrice', 'Cold Storage', 'RedMart', 'Sheng Siong', 'HoReCa Distributors'],
      positioningNotes: 'Sertifikasi halal sangat penting. Kemasan bilingual (English/Mandarin) direkomendasikan.',
      keywords: ['halal', 'premium', 'healthy', 'convenient', 'multicultural'],
    },
    {
      countryCode: 'US',
      countryName: 'Amerika Serikat',
      category: ProductCategory.COSMETICS,
      demandOverview: 'Pasar kosmetik AS bernilai $90+ miliar. Tren kuat pada clean beauty, vegan, dan produk dengan bahan alami.',
      buyerChannels: ['Sephora', 'Ulta Beauty', 'Target', 'Amazon Beauty', 'Indie Beauty Retailers'],
      positioningNotes: 'Transparansi bahan sangat penting. Klaim sustainability dan cruelty-free menjadi diferensiator kuat.',
      keywords: ['clean beauty', 'vegan', 'natural', 'cruelty-free', 'sustainable'],
    },
    {
      countryCode: 'JP',
      countryName: 'Jepang',
      category: ProductCategory.COSMETICS,
      demandOverview: 'Pasar kosmetik Jepang sangat sophisticated dengan standar kualitas tinggi. Tren pada skincare dan produk anti-aging.',
      buyerChannels: ['Matsumoto Kiyoshi', 'Isetan', 'Rakuten', 'Amazon Japan', 'Specialty Beauty Stores'],
      positioningNotes: 'Formulasi ringan dan packaging elegan sangat dihargai. Bukti klinis meningkatkan kredibilitas.',
      keywords: ['skincare', 'anti-aging', 'gentle', 'premium', 'innovative'],
    },
    {
      countryCode: 'US',
      countryName: 'Amerika Serikat',
      category: ProductCategory.HANDICRAFT,
      demandOverview: 'Permintaan tinggi untuk produk handmade dan artisanal. Konsumen menghargai cerita di balik produk dan fair trade.',
      buyerChannels: ['Etsy', 'Amazon Handmade', 'West Elm', 'Anthropologie', 'Specialty Gift Stores'],
      positioningNotes: 'Cerita pengrajin dan komunitas sangat penting. Sertifikasi fair trade menambah nilai.',
      keywords: ['handmade', 'artisanal', 'fair trade', 'sustainable', 'unique'],
    },
    {
      countryCode: 'JP',
      countryName: 'Jepang',
      category: ProductCategory.HANDICRAFT,
      demandOverview: 'Apresiasi tinggi terhadap kerajinan tangan berkualitas. Pasar niche tapi premium.',
      buyerChannels: ['Department Stores', 'Craft Fairs', 'Online Marketplaces', 'Interior Shops'],
      positioningNotes: 'Kualitas finishing harus sempurna. Packaging adalah bagian dari produk.',
      keywords: ['craftsmanship', 'quality', 'traditional', 'unique', 'premium'],
    },
    {
      countryCode: 'US',
      countryName: 'Amerika Serikat',
      category: ProductCategory.APPAREL,
      demandOverview: 'Pasar fashion AS sangat besar dengan tren sustainability yang kuat. Fast fashion mulai ditinggalkan.',
      buyerChannels: ['Nordstrom', 'Macy\'s', 'Amazon Fashion', 'Boutiques', 'Online DTC'],
      positioningNotes: 'Sustainability dan ethical production menjadi selling point utama.',
      keywords: ['sustainable', 'ethical', 'quality', 'unique design', 'comfortable'],
    },
  ];

  for (const signal of marketSignals) {
    await prisma.marketSignal.upsert({
      where: {
        countryCode_category: {
          countryCode: signal.countryCode,
          category: signal.category,
        },
      },
      update: signal,
      create: signal,
    });
  }

  console.log(`✅ Seeded ${marketSignals.length} market signals`);

  // Create sample product
  const product = await prisma.product.upsert({
    where: { id: 'sample-product-1' },
    update: {},
    create: {
      id: 'sample-product-1',
      name: 'Sambal Matah Premium',
      category: ProductCategory.FOOD,
      description: 'Sambal tradisional Bali dengan bahan-bahan segar pilihan',
      composition: 'Bawang merah, bawang putih, cabai rawit, serai, daun jeruk, minyak kelapa, garam',
      packagingType: 'Glass Jar 200ml',
      existingCertifications: ['BPOM', 'Halal MUI', 'PIRT'],
      userId: user.id,
    },
  });

  console.log('✅ Created sample product:', product.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
