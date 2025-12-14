import { NextResponse } from 'next/server';

const requirements = [
  // US
  { id: '1', countryCode: 'US', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'FDA Registration', description: 'Semua fasilitas produksi makanan harus terdaftar di FDA.', severity: 'CRITICAL', source: 'FDA.gov' },
  { id: '2', countryCode: 'US', category: 'FOOD', requirementType: 'LABELING', title: 'Nutrition Facts Label', description: 'Label nutrisi wajib dalam format FDA.', severity: 'HIGH', source: 'FDA.gov' },
  { id: '3', countryCode: 'US', category: 'COSMETICS', requirementType: 'LABELING', title: 'Ingredient Declaration', description: 'Daftar bahan menggunakan INCI names.', severity: 'HIGH', source: 'FDA.gov' },
  // JP
  { id: '4', countryCode: 'JP', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'JAS Certification', description: 'Sertifikasi Japanese Agricultural Standards untuk produk organik.', severity: 'HIGH', source: 'MAFF Japan' },
  { id: '5', countryCode: 'JP', category: 'FOOD', requirementType: 'LABELING', title: 'Japanese Language Label', description: 'Semua label harus dalam bahasa Jepang.', severity: 'CRITICAL', source: 'MHLW Japan' },
  // SG
  { id: '6', countryCode: 'SG', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'SFA Import License', description: 'Lisensi impor dari Singapore Food Agency.', severity: 'CRITICAL', source: 'SFA Singapore' },
  // CN
  { id: '7', countryCode: 'CN', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'CFDA Registration', description: 'Registrasi di China Food and Drug Administration.', severity: 'CRITICAL', source: 'CFDA' },
  { id: '8', countryCode: 'CN', category: 'COSMETICS', requirementType: 'TESTING', title: 'Animal Testing', description: 'Pengujian pada hewan mungkin diperlukan untuk kosmetik.', severity: 'HIGH', source: 'NMPA' },
  // KR
  { id: '9', countryCode: 'KR', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'MFDS Approval', description: 'Persetujuan Ministry of Food and Drug Safety.', severity: 'CRITICAL', source: 'MFDS Korea' },
  { id: '10', countryCode: 'KR', category: 'COSMETICS', requirementType: 'CERTIFICATION', title: 'CPNP Registration', description: 'Registrasi produk kosmetik di Korea.', severity: 'HIGH', source: 'MFDS Korea' },
  // AU
  { id: '11', countryCode: 'AU', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'FSANZ Compliance', description: 'Kepatuhan terhadap Food Standards Australia New Zealand.', severity: 'CRITICAL', source: 'FSANZ' },
  { id: '12', countryCode: 'AU', category: 'FOOD', requirementType: 'DOCUMENTATION', title: 'Biosecurity Import Permit', description: 'Izin impor biosecurity untuk produk pertanian.', severity: 'HIGH', source: 'DAWE' },
  // DE/EU
  { id: '13', countryCode: 'DE', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'EU Food Safety', description: 'Kepatuhan regulasi keamanan pangan EU.', severity: 'CRITICAL', source: 'EU Commission' },
  { id: '14', countryCode: 'DE', category: 'COSMETICS', requirementType: 'CERTIFICATION', title: 'EU Cosmetics Regulation', description: 'Kepatuhan EC 1223/2009 untuk kosmetik.', severity: 'CRITICAL', source: 'EU Commission' },
  // GB
  { id: '15', countryCode: 'GB', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'UK Food Standards', description: 'Kepatuhan Food Standards Agency UK.', severity: 'CRITICAL', source: 'FSA UK' },
  // AE
  { id: '16', countryCode: 'AE', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'Halal Certification', description: 'Sertifikasi halal wajib untuk produk makanan.', severity: 'CRITICAL', source: 'ESMA UAE' },
  { id: '17', countryCode: 'AE', category: 'FOOD', requirementType: 'LABELING', title: 'Arabic Label', description: 'Label dalam bahasa Arab wajib.', severity: 'HIGH', source: 'ESMA UAE' },
  // SA
  { id: '18', countryCode: 'SA', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'SFDA Registration', description: 'Registrasi di Saudi Food and Drug Authority.', severity: 'CRITICAL', source: 'SFDA' },
  { id: '19', countryCode: 'SA', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'Halal Certificate', description: 'Sertifikat halal dari lembaga terakreditasi.', severity: 'CRITICAL', source: 'SFDA' },
  // MY
  { id: '20', countryCode: 'MY', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'JAKIM Halal', description: 'Sertifikasi halal JAKIM Malaysia.', severity: 'HIGH', source: 'JAKIM' },
  // TH
  { id: '21', countryCode: 'TH', category: 'FOOD', requirementType: 'CERTIFICATION', title: 'Thai FDA Registration', description: 'Registrasi di Thai Food and Drug Administration.', severity: 'CRITICAL', source: 'Thai FDA' },
];

export async function GET() {
  return NextResponse.json(requirements);
}
