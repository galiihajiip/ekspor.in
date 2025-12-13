import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketsService } from '../markets/markets.service';
import { Severity, GapStatus, ChecklistStatus, ProductCategory } from '@prisma/client';

// Severity weights for scoring
const SEVERITY_WEIGHTS: Record<Severity, number> = {
  CRITICAL: 40,
  HIGH: 30,
  MEDIUM: 20,
  LOW: 10,
};

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private marketsService: MarketsService,
  ) {}

  async analyzeProduct(productId: string, countryCode: string) {
    // Get product with existing certifications
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        targetMarkets: true,
        gaps: true,
        checklistItems: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${productId} tidak ditemukan`);
    }

    // Get requirements for this country and category
    const requirements = await this.marketsService.getRequirementsByCountryAndCategory(
      countryCode,
      product.category,
    );

    // Ensure target market exists
    let targetMarket = await this.prisma.targetMarket.findUnique({
      where: {
        productId_countryCode: { productId, countryCode },
      },
    });

    if (!targetMarket) {
      const country = this.marketsService.getSupportedCountries().find(
        (c) => c.code === countryCode,
      );
      targetMarket = await this.prisma.targetMarket.create({
        data: {
          productId,
          countryCode,
          countryName: country?.name || countryCode,
        },
      });
    }

    // Analyze gaps
    const existingCerts = product.existingCertifications.map((c) =>
      c.toLowerCase(),
    );

    const gaps: Array<{
      requirementId: string;
      title: string;
      description: string;
      severity: Severity;
      isMet: boolean;
    }> = [];

    let totalWeight = 0;
    let metWeight = 0;

    for (const req of requirements) {
      totalWeight += SEVERITY_WEIGHTS[req.severity];

      // Simple matching logic - check if any existing cert matches requirement
      const isMet = existingCerts.some(
        (cert) =>
          req.title.toLowerCase().includes(cert) ||
          cert.includes(req.title.toLowerCase().split(' ')[0]),
      );

      if (isMet) {
        metWeight += SEVERITY_WEIGHTS[req.severity];
      }

      gaps.push({
        requirementId: req.id,
        title: req.title,
        description: req.description,
        severity: req.severity,
        isMet,
      });
    }

    // Calculate readiness score
    const readinessScore = totalWeight > 0 ? Math.round((metWeight / totalWeight) * 100) : 0;

    // Create/update gaps in database
    const unmetGaps = gaps.filter((g) => !g.isMet);

    // Clear existing gaps for this market
    await this.prisma.gap.deleteMany({
      where: { productId, targetMarketId: targetMarket.id },
    });

    // Create new gaps
    for (const gap of unmetGaps) {
      await this.prisma.gap.create({
        data: {
          productId,
          targetMarketId: targetMarket.id,
          requirementId: gap.requirementId,
          title: gap.title,
          description: gap.description,
          severity: gap.severity,
          status: GapStatus.IDENTIFIED,
        },
      });
    }

    // Generate checklist items
    await this.prisma.checklistItem.deleteMany({
      where: { productId },
    });

    const checklistItems = unmetGaps
      .sort((a, b) => SEVERITY_WEIGHTS[b.severity] - SEVERITY_WEIGHTS[a.severity])
      .map((gap, index) => ({
        productId,
        requirementId: gap.requirementId,
        title: `Penuhi persyaratan: ${gap.title}`,
        description: gap.description,
        priority: unmetGaps.length - index,
        status: ChecklistStatus.PENDING,
      }));

    await this.prisma.checklistItem.createMany({
      data: checklistItems,
    });

    // Get severity breakdown
    const severityBreakdown = {
      critical: unmetGaps.filter((g) => g.severity === Severity.CRITICAL).length,
      high: unmetGaps.filter((g) => g.severity === Severity.HIGH).length,
      medium: unmetGaps.filter((g) => g.severity === Severity.MEDIUM).length,
      low: unmetGaps.filter((g) => g.severity === Severity.LOW).length,
    };

    return {
      productId,
      productName: product.name,
      category: product.category,
      countryCode,
      countryName: targetMarket.countryName,
      readinessScore,
      totalRequirements: requirements.length,
      metRequirements: gaps.filter((g) => g.isMet).length,
      unmetRequirements: unmetGaps.length,
      severityBreakdown,
      gaps: unmetGaps,
      checklist: checklistItems.map((item, index) => ({
        ...item,
        id: `checklist-${index}`,
      })),
      disclaimer: 'Demo hackathon. Dataset contoh. Bukan nasihat hukum.',
    };
  }

  async getProductReadinessSummary(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        targetMarkets: true,
        gaps: {
          include: { targetMarket: true },
        },
        checklistItems: {
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${productId} tidak ditemukan`);
    }

    const marketSummaries = await Promise.all(
      product.targetMarkets.map(async (market) => {
        const marketGaps = product.gaps.filter(
          (g) => g.targetMarketId === market.id,
        );

        const requirements = await this.marketsService.getRequirementsByCountryAndCategory(
          market.countryCode,
          product.category,
        );

        const totalWeight = requirements.reduce(
          (sum, r) => sum + SEVERITY_WEIGHTS[r.severity],
          0,
        );

        const gapWeight = marketGaps.reduce(
          (sum, g) => sum + SEVERITY_WEIGHTS[g.severity],
          0,
        );

        const readinessScore =
          totalWeight > 0 ? Math.round(((totalWeight - gapWeight) / totalWeight) * 100) : 100;

        return {
          countryCode: market.countryCode,
          countryName: market.countryName,
          readinessScore,
          gapCount: marketGaps.length,
          criticalGaps: marketGaps.filter((g) => g.severity === Severity.CRITICAL).length,
        };
      }),
    );

    return {
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        existingCertifications: product.existingCertifications,
      },
      marketSummaries,
      totalGaps: product.gaps.length,
      pendingChecklist: product.checklistItems.filter(
        (c) => c.status === ChecklistStatus.PENDING,
      ).length,
      completedChecklist: product.checklistItems.filter(
        (c) => c.status === ChecklistStatus.COMPLETED,
      ).length,
    };
  }
}
