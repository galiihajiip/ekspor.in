import { NextResponse } from 'next/server';

const requirements = [
  {
    id: '1',
    countryCode: 'US',
    category: 'FOOD',
    requirementType: 'CERTIFICATION',
    title: 'FDA Registration',
    description: 'Semua fasilitas produksi makanan harus terdaftar di FDA sebelum ekspor ke AS.',
    severity: 'CRITICAL',
    source: 'FDA.gov',
  },
  {
    id: '2',
    countryCode: 'US',
    category: 'FOOD',
    requirementType: 'LABELING',
    title: 'Nutrition Facts Label',
    description: 'Label nutrisi wajib dalam format FDA dengan informasi kalori, lemak, protein, dll.',
    severity: 'HIGH',
    source: 'FDA.gov',
  },
  {
    id: '3',
    countryCode: 'JP',
    category: 'FOOD',
    requirementType: 'CERTIFICATION',
    title: 'JAS Certification',
    description: 'Sertifikasi Japanese Agricultural Standards untuk produk organik.',
    severity: 'HIGH',
    source: 'MAFF Japan',
  },
  {
    id: '4',
    countryCode: 'JP',
    category: 'FOOD',
    requirementType: 'LABELING',
    title: 'Japanese Language Label',
    description: 'Semua label produk harus dalam bahasa Jepang dengan informasi alergen.',
    severity: 'CRITICAL',
    source: 'MHLW Japan',
  },
  {
    id: '5',
    countryCode: 'SG',
    category: 'FOOD',
    requirementType: 'CERTIFICATION',
    title: 'SFA Import License',
    description: 'Lisensi impor dari Singapore Food Agency diperlukan.',
    severity: 'CRITICAL',
    source: 'SFA Singapore',
  },
  {
    id: '6',
    countryCode: 'US',
    category: 'COSMETICS',
    requirementType: 'LABELING',
    title: 'Ingredient Declaration',
    description: 'Daftar bahan harus menggunakan INCI names dalam urutan konsentrasi.',
    severity: 'HIGH',
    source: 'FDA.gov',
  },
];

export async function GET() {
  return NextResponse.json(requirements);
}
