import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { ProductCategory } from '@prisma/client';

const COUNTRY_NAMES: Record<string, string> = {
  US: 'Amerika Serikat',
  JP: 'Jepang',
  SG: 'Singapura',
};

@Injectable()
export class SignalsService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async getSignals(countryCode?: string, category?: ProductCategory) {
    const signals = await this.prisma.marketSignal.findMany({
      where: {
        ...(countryCode && { countryCode }),
        ...(category && { category }),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return signals.map((signal) => ({
      ...signal,
      disclaimer: 'Ringkasan berbasis data contoh dan AI. Bukan prediksi pasar resmi.',
    }));
  }

  async generateSignal(
    category: ProductCategory,
    countryCode: string,
    productDescription?: string,
  ) {
    const countryName = COUNTRY_NAMES[countryCode] || countryCode;

    // Check if we have cached signal
    const existingSignal = await this.prisma.marketSignal.findUnique({
      where: {
        countryCode_category: { countryCode, category },
      },
    });

    // Generate new signal with AI
    const aiSignal = await this.geminiService.generateMarketSignal(
      category,
      countryCode,
      countryName,
      productDescription,
    );

    // Upsert signal
    const signal = await this.prisma.marketSignal.upsert({
      where: {
        countryCode_category: { countryCode, category },
      },
      update: {
        ...aiSignal,
        aiGenerated: true,
        updatedAt: new Date(),
      },
      create: {
        countryCode,
        countryName,
        category,
        ...aiSignal,
        aiGenerated: true,
      },
    });

    return {
      ...signal,
      disclaimer: 'Ringkasan berbasis data contoh dan AI. Bukan prediksi pasar resmi.',
    };
  }
}
