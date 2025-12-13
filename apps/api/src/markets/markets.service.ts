import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCategory } from '@prisma/client';

export const SUPPORTED_COUNTRIES = [
  { code: 'US', name: 'Amerika Serikat', flag: '🇺🇸' },
  { code: 'JP', name: 'Jepang', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapura', flag: '🇸🇬' },
];

@Injectable()
export class MarketsService {
  constructor(private prisma: PrismaService) {}

  getSupportedCountries() {
    return SUPPORTED_COUNTRIES;
  }

  async getRequirements(countryCode?: string, category?: ProductCategory) {
    return this.prisma.requirement.findMany({
      where: {
        ...(countryCode && { countryCode }),
        ...(category && { category }),
      },
      orderBy: [{ severity: 'desc' }, { title: 'asc' }],
    });
  }

  async getRequirementsByCountryAndCategory(
    countryCode: string,
    category: ProductCategory,
  ) {
    return this.prisma.requirement.findMany({
      where: { countryCode, category },
      orderBy: { severity: 'desc' },
    });
  }

  async getRequirementStats() {
    const stats = await this.prisma.requirement.groupBy({
      by: ['countryCode', 'category'],
      _count: { id: true },
    });

    return stats.map((s) => ({
      countryCode: s.countryCode,
      category: s.category,
      count: s._count.id,
    }));
  }
}
