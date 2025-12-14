import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const kb: Record<string, string> = {
  fda: 'Untuk ekspor makanan ke AS: 1. FDA Registration 2. Prior Notice 3. Nutrition Facts Label 4. Ingredient List',
  jepang: 'Untuk ekspor ke Jepang: 1. JAS Certification 2. Label Bahasa Jepang 3. Food Sanitation Law',
  halal: 'Sertifikasi Halal: 1. UAE/Saudi - Wajib 2. Malaysia - Direkomendasikan 3. Via BPJPH Indonesia',
  dokumen: 'Dokumen ekspor: 1. Commercial Invoice 2. Packing List 3. Bill of Lading 4. COO 5. Health Certificate',
  bpom: 'BPOM: 1. Registrasi Produk 2. Izin Edar MD/ML 3. CPKB/CPPOB 4. Proses 3-6 bulan',
  default: 'Saya membantu dengan persyaratan ekspor, sertifikasi, dokumentasi. Tanyakan topik spesifik!'
};

function getOfflineResponse(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('fda') || m.includes('amerika')) return kb.fda;
  if (m.includes('jepang')) return kb.jepang;
  if (m.includes('halal') || m.includes('arab')) return kb.halal;
  if (m.includes('dokumen')) return kb.dokumen;
  if (m.includes('bpom')) return kb.bpom;
  return kb.default;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message;
    const history = body.history || [];
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const systemPrompt = 'Kamu adalah asisten AI Ekspor.in untuk UMKM Indonesia. Jawab dalam Bahasa Indonesia.';
    
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Halo! Saya asisten Ekspor.in.' }] },
    ];
    
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      });
    }
    
    contents.push({ role: 'user', parts: [{ text: message }] });


    try {
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return NextResponse.json({ reply: reply });
        }
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
    }

    return NextResponse.json({ reply: getOfflineResponse(message) });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ reply: getOfflineResponse('') });
  }
}
