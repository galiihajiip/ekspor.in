import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    } else {
      this.logger.warn('GEMINI_API_KEY not configured. AI features will be disabled.');
    }
  }

  async generateMarketSignal(
    category: string,
    countryCode: string,
    countryName: string,
    productDescription?: string,
  ): Promise<{
    demandOverview: string;
    buyerChannels: string[];
    positioningNotes: string;
    keywords: string[];
  }> {
    if (!this.model) {
      return this.getFallbackMarketSignal(category, countryName);
    }

    try {
      const prompt = `Anda adalah analis pasar ekspor untuk produk UMKM Indonesia.

Berikan analisis singkat untuk:
- Kategori produk: ${category}
- Negara tujuan: ${countryName} (${countryCode})
${productDescription ? `- Deskripsi produk: ${productDescription}` : ''}

Berikan respons dalam format JSON dengan struktur:
{
  "demandOverview": "Ringkasan permintaan pasar dalam 2-3 kalimat",
  "buyerChannels": ["channel1", "channel2", "channel3"],
  "positioningNotes": "Saran positioning produk dalam 2-3 kalimat",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Gunakan bahasa Indonesia yang formal dan profesional. Fokus pada informasi praktis untuk UMKM.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackMarketSignal(category, countryName);
    } catch (error) {
      this.logger.error('Gemini API error:', error);
      return this.getFallbackMarketSignal(category, countryName);
    }
  }

  async summarizeComplianceFindings(
    documentText: string,
    requirements: string[],
  ): Promise<{
    summary: string;
    missingFields: string[];
    suggestedActions: string[];
  }> {
    if (!this.model) {
      return this.getFallbackComplianceSummary(requirements);
    }

    try {
      const prompt = `Anda adalah konsultan kepatuhan ekspor untuk UMKM Indonesia.

Analisis dokumen berikut terhadap persyaratan ekspor:

DOKUMEN:
${documentText.substring(0, 3000)}

PERSYARATAN YANG HARUS DIPENUHI:
${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Berikan respons dalam format JSON:
{
  "summary": "Ringkasan temuan dalam 2-3 kalimat",
  "missingFields": ["field yang tidak ditemukan atau tidak lengkap"],
  "suggestedActions": ["tindakan yang disarankan untuk memenuhi persyaratan"]
}

Gunakan bahasa Indonesia yang formal. Fokus pada gap yang teridentifikasi.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackComplianceSummary(requirements);
    } catch (error) {
      this.logger.error('Gemini API error:', error);
      return this.getFallbackComplianceSummary(requirements);
    }
  }

  private getFallbackMarketSignal(category: string, countryName: string) {
    return {
      demandOverview: `Pasar ${category.toLowerCase()} di ${countryName} menunjukkan potensi yang baik untuk produk Indonesia berkualitas.`,
      buyerChannels: ['Distributor lokal', 'E-commerce', 'Retail chains'],
      positioningNotes: `Fokus pada kualitas dan keunikan produk Indonesia. Pastikan memenuhi standar lokal ${countryName}.`,
      keywords: ['quality', 'authentic', 'Indonesian', 'premium'],
    };
  }

  private getFallbackComplianceSummary(requirements: string[]) {
    return {
      summary: 'Analisis dokumen memerlukan verifikasi manual untuk memastikan kepatuhan penuh.',
      missingFields: requirements.slice(0, 3),
      suggestedActions: [
        'Verifikasi kelengkapan dokumen dengan otoritas terkait',
        'Konsultasikan dengan ahli kepatuhan ekspor',
        'Pastikan semua sertifikasi masih berlaku',
      ],
    };
  }
}
