import { NextRequest, NextResponse } from 'next/server';

// Sample analysis data based on product category and target markets
const analysisTemplates: Record<string, any> = {
  FOOD: {
    readinessScore: 72,
    categories: [
      { name: 'Sertifikasi', score: 65, status: 'warning', items: ['BPOM RI', 'Halal MUI', 'FDA Registration'] },
      { name: 'Labeling', score: 80, status: 'good', items: ['Nutrition Facts', 'Ingredient List', 'Allergen Warning'] },
      { name: 'Packaging', score: 75, status: 'good', items: ['Food Grade Material', 'Shelf Life Info', 'Storage Instructions'] },
      { name: 'Dokumentasi', score: 70, status: 'warning', items: ['Certificate of Origin', 'Health Certificate', 'Phytosanitary Certificate'] },
    ],
    recommendations: [
      'Segera daftarkan fasilitas produksi ke FDA untuk akses pasar AS',
      'Lengkapi sertifikasi Halal untuk pasar Timur Tengah dan Asia Tenggara',
      'Update label nutrisi sesuai format negara tujuan',
      'Siapkan dokumen Certificate of Origin dari Kemendag',
    ],
    gaps: [
      { title: 'FDA Registration', severity: 'HIGH', description: 'Wajib untuk ekspor makanan ke Amerika Serikat' },
      { title: 'JAS Certification', severity: 'MEDIUM', description: 'Diperlukan untuk klaim organik di Jepang' },
    ],
  },
  COSMETICS: {
    readinessScore: 68,
    categories: [
      { name: 'Sertifikasi', score: 60, status: 'warning', items: ['BPOM', 'CPKB', 'Halal'] },
      { name: 'Labeling', score: 75, status: 'good', items: ['Ingredient List (INCI)', 'Usage Instructions', 'Warnings'] },
      { name: 'Testing', score: 65, status: 'warning', items: ['Safety Assessment', 'Stability Test', 'Microbial Test'] },
      { name: 'Dokumentasi', score: 72, status: 'good', items: ['Product Information File', 'GMP Certificate', 'Free Sale Certificate'] },
    ],
    recommendations: [
      'Lengkapi Product Information File (PIF) untuk pasar EU',
      'Lakukan safety assessment oleh qualified assessor',
      'Pastikan semua ingredient terdaftar di INCI database',
      'Siapkan GMP certificate dari BPOM',
    ],
    gaps: [
      { title: 'EU CPNP Notification', severity: 'HIGH', description: 'Wajib untuk penjualan di Uni Eropa' },
      { title: 'KFDA Registration', severity: 'MEDIUM', description: 'Diperlukan untuk pasar Korea Selatan' },
    ],
  },
  APPAREL: {
    readinessScore: 82,
    categories: [
      { name: 'Labeling', score: 85, status: 'good', items: ['Care Label', 'Fiber Content', 'Country of Origin'] },
      { name: 'Testing', score: 80, status: 'good', items: ['Flammability Test', 'Colorfastness', 'Tensile Strength'] },
      { name: 'Compliance', score: 78, status: 'good', items: ['REACH Compliance', 'Azo Dyes Free', 'Lead Free'] },
      { name: 'Dokumentasi', score: 85, status: 'good', items: ['Commercial Invoice', 'Packing List', 'Certificate of Origin'] },
    ],
    recommendations: [
      'Pastikan pewarna bebas Azo untuk pasar EU',
      'Lengkapi care label dalam bahasa negara tujuan',
      'Siapkan test report dari lab terakreditasi',
    ],
    gaps: [
      { title: 'OEKO-TEX Certification', severity: 'LOW', description: 'Nilai tambah untuk pasar premium' },
    ],
  },
  HANDICRAFT: {
    readinessScore: 78,
    categories: [
      { name: 'Kualitas', score: 80, status: 'good', items: ['Material Quality', 'Craftsmanship', 'Finishing'] },
      { name: 'Packaging', score: 75, status: 'good', items: ['Protective Packaging', 'Eco-friendly Material', 'Branding'] },
      { name: 'Dokumentasi', score: 80, status: 'good', items: ['Commercial Invoice', 'Packing List', 'Certificate of Origin'] },
      { name: 'Compliance', score: 78, status: 'good', items: ['CITES (if applicable)', 'Wood Declaration', 'Safety Standards'] },
    ],
    recommendations: [
      'Pastikan tidak menggunakan material yang dilindungi CITES',
      'Siapkan deklarasi kayu untuk produk berbahan kayu',
      'Tingkatkan packaging untuk mengurangi kerusakan saat pengiriman',
    ],
    gaps: [
      { title: 'FSC Certification', severity: 'LOW', description: 'Nilai tambah untuk produk kayu berkelanjutan' },
    ],
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { category = 'FOOD' } = body;

    // Get analysis template based on category
    const template = analysisTemplates[category] || analysisTemplates.FOOD;

    // Add some randomization to make it feel dynamic
    const analysis = {
      productId: params.id,
      analyzedAt: new Date().toISOString(),
      ...template,
      readinessScore: template.readinessScore + Math.floor(Math.random() * 10) - 5,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze product' }, { status: 500 });
  }
}
