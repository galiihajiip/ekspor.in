import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const kb: Record<string, string> = {
  fda: 'Untuk ekspor makanan ke AS: 1. FDA Registration 2. Prior Notice 3. Nutrition Facts Label 4. Ingredient List',
  jepang: 'Untuk ekspor ke Jepang: 1. JAS Certification 2. Label Bahasa Jepang 3. Food Sanitation Law',
  halal: 'Sertifikasi Halal: 1. UAE/Saudi - Wajib 2. Malaysia - Direkomendasikan 3. Via BPJPH Indonesia',
  dokumen: 'Dokumen ekspor: 1. Commercial Invoice 2. Packing List 3. Bill of Lading 4. COO 5. Health Certificate',
  bpom: 'BPOM: 1. Registrasi Produk 2. Izin Edar MD/ML 3. CPKB/CPPOB 4. Proses 3-6 bulan',
  default:
    'Saya membantu dengan persyaratan ekspor, sertifikasi, dokumentasi. Tanyakan topik spesifik seperti: FDA, Jepang, Halal, Dokumen, BPOM.'
};

function getOfflineResponse(msg: string): string {
  const m = (msg || '').toLowerCase();
  if (m.includes('fda') || m.includes('amerika') || m.includes('usa')) return kb.fda;
  if (m.includes('jepang') || m.includes('japan')) return kb.jepang;
  if (m.includes('halal') || m.includes('arab') || m.includes('uae') || m.includes('saudi')) return kb.halal;
  if (m.includes('dokumen') || m.includes('invoice') || m.includes('packing')) return kb.dokumen;
  if (m.includes('bpom')) return kb.bpom;
  return kb.default;
}

function safeJsonParse<T = any>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function extractGeminiText(data: any): string | null {
  // Gemini can return multiple parts. Join them safely.
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  const text = parts
    .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
    .join('')
    .trim();

  return text.length > 0 ? text : null;
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const body = await request.json().catch(() => ({}));
    const message: string = body?.message ?? '';
    const history: Array<{ role: 'user' | 'model' | 'assistant'; content: string }> = body?.history ?? [];

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // If key missing, immediately fallback.
    if (!GEMINI_API_KEY) {
      console.warn('[chat] GEMINI_API_KEY is missing — using offline KB');
      return NextResponse.json({ reply: getOfflineResponse(message), source: 'offline' });
    }

    const systemPrompt =
      'Kamu adalah asisten Ekspor.in untuk UMKM Indonesia. Jawab dalam Bahasa Indonesia yang profesional dan ringkas.\n' +
      'Fokus pada: readiness ekspor per negara, dokumen ekspor, sertifikasi, label, dan langkah praktis.\n' +
      'Jika tidak yakin, nyatakan ketidakpastian dan sarankan verifikasi (misal cek situs regulator terkait).\n' +
      'Jangan mengklaim sebagai nasihat hukum final.';

    // Convert incoming history to Gemini format
    const contents: any[] = [];
    for (const h of history.slice(-8)) {
      const role = h?.role === 'user' ? 'user' : 'model';
      const text = typeof h?.content === 'string' ? h.content : '';
      if (text.trim().length === 0) continue;

      contents.push({
        role,
        parts: [{ text }]
      });
    }

    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const apiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const res = await fetch(`${apiUrl}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    });

    const raw = await res.text();

    // IMPORTANT: Log errors so you can see in Vercel logs
    if (!res.ok) {
      console.error('[chat] Gemini failed:', res.status, raw);
      return NextResponse.json({ reply: getOfflineResponse(message), source: 'offline' });
    }

    const data = safeJsonParse(raw);
    if (!data) {
      console.error('[chat] Gemini returned non-JSON:', raw);
      return NextResponse.json({ reply: getOfflineResponse(message), source: 'offline' });
    }

    const reply = extractGeminiText(data);
    if (!reply) {
      console.warn('[chat] Gemini returned empty content:', JSON.stringify(data)?.slice(0, 1500));
      return NextResponse.json({ reply: getOfflineResponse(message), source: 'offline' });
    }

    return NextResponse.json({ reply, source: 'gemini' });
  } catch (err) {
    console.error('[chat] Route error:', err);
    return NextResponse.json({ reply: getOfflineResponse(''), source: 'offline' });
  }
}
