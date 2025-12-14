import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const kb: Record<string, string> = {
  fda: 'Untuk ekspor makanan ke AS: 1. FDA Registration 2. Prior Notice 3. Nutrition Facts Label 4. Ingredient List',
  jepang: 'Untuk ekspor ke Jepang: 1. JAS Certification 2. Label Bahasa Jepang 3. Food Sanitation Law',
  halal: 'Sertifikasi Halal: 1. UAE/Saudi - Wajib 2. Malaysia - Direkomendasikan 3. Via BPJPH Indonesia',
  dokumen: 'Dokumen ekspor: 1. Commercial Invoice 2. Packing List 3. Bill of Lading 4. COO 5. Health Certificate',
  bpom: 'BPOM: 1. Registrasi Produk 2. Izin Edar MD/ML 3. CPKB/CPPOB 4. Proses 3-6 bulan',
  default: 'Saya membantu dengan persyaratan ekspor, sertifikasi, dokumentasi. Tanyakan topik spesifik!'
};

function getOfflineResponse(msg: string): string {
  const m = (msg || '').toLowerCase();
  if (m.includes('fda') || m.includes('amerika')) return kb.fda;
  if (m.includes('jepang')) return kb.jepang;
  if (m.includes('halal') || m.includes('arab')) return kb.halal;
  if (m.includes('dokumen')) return kb.dokumen;
  if (m.includes('bpom')) return kb.bpom;
  return kb.default;
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const body = await request.json();
    const message: string = body.message;
    const history = body.history || [];

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    console.log('GEMINI key set?', Boolean(GEMINI_API_KEY));

    const systemPrompt =
      'Kamu adalah asisten Ekspor.in untuk UMKM Indonesia. Jawab dalam Bahasa Indonesia. ' +
      'Jika tidak yakin, jelaskan asumsi dan sarankan langkah verifikasi.';

    const contents: any[] = [];

    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(h.content || '') }]
      });
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ reply: getOfflineResponse(message) });
    }

    const apiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error('Gemini status:', response.status);
      console.error('Gemini error body:', raw);
      return NextResponse.json({ reply: getOfflineResponse(message) });
    }

    const data = JSON.parse(raw);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return NextResponse.json({ reply: reply || getOfflineResponse(message) });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ reply: getOfflineResponse('') });
  }
}
