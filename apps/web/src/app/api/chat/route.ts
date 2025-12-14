import { NextRequest, NextResponse } from 'next/server';

// Use environment variable, fallback to hardcoded for demo
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
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      // Return helpful fallback response
      return NextResponse.json({
        reply: 'Maaf, AI sedang tidak tersedia. Berikut beberapa informasi umum:\n\n• Untuk ekspor makanan ke AS, diperlukan FDA Registration\n• Ekspor ke Jepang memerlukan label bahasa Jepang\n• Produk halal wajib untuk ekspor ke UAE/Saudi\n\nSilakan coba lagi nanti atau hubungi tim support.',
      });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak dapat memproses permintaan Anda.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return fallback response instead of error
    return NextResponse.json({
      reply: 'Maaf, AI sedang mengalami gangguan. Berikut beberapa tips ekspor:\n\n• Pastikan produk memiliki sertifikasi yang diperlukan (BPOM, Halal, dll)\n• Siapkan dokumen ekspor: Invoice, Packing List, COO\n• Pelajari regulasi negara tujuan\n\nSilakan coba lagi dalam beberapa saat.',
    });
  }
}
