import { NextRequest, NextResponse } from 'next/server';

// Simulated compliance check for demo
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { documentText } = body;

  // Simple keyword-based analysis for demo
  const text = documentText.toLowerCase();
  const issues: any[] = [];

  // Check for common compliance issues
  if (!text.includes('halal') && !text.includes('sertifikat')) {
    issues.push({
      type: 'CERTIFICATION',
      severity: 'HIGH',
      description: 'Tidak ditemukan informasi sertifikasi halal',
      recommendation: 'Tambahkan nomor sertifikat halal MUI jika produk halal certified',
    });
  }

  if (!text.includes('bpom') && !text.includes('md') && !text.includes('ml')) {
    issues.push({
      type: 'REGISTRATION',
      severity: 'CRITICAL',
      description: 'Tidak ditemukan nomor registrasi BPOM',
      recommendation: 'Pastikan produk terdaftar di BPOM dengan nomor MD/ML',
    });
  }

  if (!text.includes('ingredient') && !text.includes('komposisi') && !text.includes('bahan')) {
    issues.push({
      type: 'LABELING',
      severity: 'MEDIUM',
      description: 'Daftar komposisi/bahan tidak ditemukan',
      recommendation: 'Sertakan daftar bahan lengkap sesuai standar INCI',
    });
  }

  if (!text.includes('expire') && !text.includes('kadaluarsa') && !text.includes('exp')) {
    issues.push({
      type: 'LABELING',
      severity: 'HIGH',
      description: 'Informasi tanggal kadaluarsa tidak ditemukan',
      recommendation: 'Tambahkan format tanggal kadaluarsa yang jelas',
    });
  }

  if (!text.includes('net') && !text.includes('berat') && !text.includes('volume')) {
    issues.push({
      type: 'LABELING',
      severity: 'MEDIUM',
      description: 'Informasi berat/volume bersih tidak ditemukan',
      recommendation: 'Cantumkan net weight dalam gram/ml',
    });
  }

  // Calculate score
  const severityScores: Record<string, number> = {
    CRITICAL: 25,
    HIGH: 15,
    MEDIUM: 10,
    LOW: 5,
  };

  const totalDeduction = issues.reduce(
    (sum, issue) => sum + (severityScores[issue.severity] || 0),
    0
  );
  const overallScore = Math.max(0, 100 - totalDeduction);

  const result = {
    id: Date.now().toString(),
    overallScore,
    summary:
      overallScore >= 80
        ? 'Dokumen memenuhi sebagian besar persyaratan kepatuhan.'
        : overallScore >= 60
        ? 'Dokumen memerlukan beberapa perbaikan untuk memenuhi standar ekspor.'
        : 'Dokumen memerlukan perbaikan signifikan sebelum dapat digunakan untuk ekspor.',
    issues,
    checkedAt: new Date().toISOString(),
  };

  return NextResponse.json(result);
}
