import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC46TG_T5PdmCTBgRKR2OCIAR1WLqgDeqs';

const kb: Record<string, string> = {
  fda: 'Untuk ekspor makanan ke AS: FDA Registration, Prior Notice, Nutrition Facts Label',
  jepang: 'Untuk ekspor ke Jepang: JAS Certification, Label Bahasa Jepang, Food Sanitation Law',
  halal: 'Sertifikasi Halal: UAE/Saudi Wajib, Malaysia Direkomendasikan, Via BPJPH',
  dokumen: 'Dokumen ekspor: Commercial Invoice, Packing List, Bill of Lading, COO',
  bpom: 'BPOM: Registrasi Produk, Izin Edar MD/ML, CPKB/CPPOB',
  default: 'Saya membantu dengan persyaratan ekspor dan sertifikasi. Tanyakan topik spesifik!'
};

function getOffline(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('fda') || m.includes('amerika')) return kb.fda;
  if (m.includes('jepang')) return kb.jepang;
  if (m.includes('halal')) return kb.halal;
  if (m.includes('dokumen')) return kb.dokumen;
  if (m.includes('bpom')) return kb.bpom;
  return kb.default;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const contents = [
      { role: 'user', parts: [{ text: 'Kamu asisten AI Ekspor.in. Jawab dalam Bahasa Indonesia.' }] },
      { role: 'model', parts: [{ text: 'Halo! Saya asisten Ekspor.in.' }] },
    ];
    
    if (history) {
      for (const h of history.slice(-6)) {
        contents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return NextResponse.json({ reply });
    }

    return NextResponse.json({ reply: getOffline(message) });
  } catch (e) {
    return NextResponse.json({ reply: getOffline('') });
  }
}
