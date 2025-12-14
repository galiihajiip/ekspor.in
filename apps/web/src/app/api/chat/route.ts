import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDbwp46LiXwl6KgymKWjGEC2k1vSpDSJzI';

const systemPrompt = `Kamu adalah asisten AI untuk platform Ekspor.in - platform evaluasi kesiapan ekspor untuk UMKM Indonesia.

Keahlianmu meliputi:
- Persyaratan ekspor ke berbagai negara (US, Jepang, Singapura, China, Korea, Australia, Jerman, UK, UAE, Saudi, Malaysia, Thailand)
- Sertifikasi yang diperlukan (FDA, BPOM, Halal, JAS, dll)
- Regulasi labeling dan packaging
- Dokumentasi ekspor (Invoice, Packing List, COO, dll)
- Market intelligence dan peluang pasar
- Kategori produk: Makanan, Kosmetik, Pakaian, Kerajinan

Jawab dalam Bahasa Indonesia yang ramah dan informatif. Berikan saran praktis dan actionable.
Jika tidak yakin, sarankan untuk konsultasi dengan ahli ekspor atau otoritas terkait.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build conversation context
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'Halo! Saya asisten Ekspor.in, siap membantu Anda dengan pertanyaan seputar ekspor produk Indonesia. Ada yang bisa saya bantu?' }],
      },
    ];

    // Add history if exists
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Failed to get AI response', reply: 'Maaf, terjadi kesalahan. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak dapat memproses permintaan Anda.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', reply: 'Maaf, terjadi kesalahan sistem. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
