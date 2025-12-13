import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { Severity } from '@prisma/client';

// Rule-based validation patterns
const COMPLIANCE_RULES = {
  FDA_REGISTRATION: {
    patterns: [/FDA\s*registration/i, /facility\s*registration/i, /FFR/i],
    field: 'FDA Registration Number',
    severity: Severity.CRITICAL,
  },
  NUTRITION_LABEL: {
    patterns: [/nutrition\s*facts/i, /kalori/i, /calories/i, /protein/i, /carbohydrate/i],
    field: 'Nutrition Facts',
    severity: Severity.HIGH,
  },
  HALAL_CERT: {
    patterns: [/halal/i, /MUI/i, /LPPOM/i],
    field: 'Halal Certification',
    severity: Severity.MEDIUM,
  },
  BPOM: {
    patterns: [/BPOM/i, /MD\s*\d+/i, /ML\s*\d+/i],
    field: 'BPOM Registration',
    severity: Severity.HIGH,
  },
  EXPIRY_DATE: {
    patterns: [/expir/i, /kadaluarsa/i, /best\s*before/i, /use\s*by/i],
    field: 'Expiry Date',
    severity: Severity.HIGH,
  },
  INGREDIENTS: {
    patterns: [/ingredient/i, /komposisi/i, /bahan/i, /contains/i],
    field: 'Ingredients List',
    severity: Severity.HIGH,
  },
  ALLERGEN: {
    patterns: [/allergen/i, /alergen/i, /contains.*milk/i, /contains.*nuts/i, /contains.*soy/i],
    field: 'Allergen Declaration',
    severity: Severity.HIGH,
  },
  COUNTRY_ORIGIN: {
    patterns: [/made\s*in/i, /product\s*of/i, /origin/i, /diproduksi/i],
    field: 'Country of Origin',
    severity: Severity.MEDIUM,
  },
  NET_WEIGHT: {
    patterns: [/net\s*weight/i, /net\s*wt/i, /berat\s*bersih/i, /\d+\s*(g|kg|ml|l|oz)/i],
    field: 'Net Weight/Volume',
    severity: Severity.MEDIUM,
  },
  MANUFACTURER: {
    patterns: [/manufacturer/i, /produced\s*by/i, /diproduksi\s*oleh/i, /PT\./i],
    field: 'Manufacturer Information',
    severity: Severity.MEDIUM,
  },
};

@Injectable()
export class ComplianceService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async checkCompliance(
    userId: string,
    documentText: string,
    productId?: string,
    documentType?: string,
  ) {
    // Rule-based validation
    const findings: Array<{
      field: string;
      found: boolean;
      severity: Severity;
      matches: string[];
    }> = [];

    const missingFields: string[] = [];
    const suggestedActions: string[] = [];

    for (const [ruleName, rule] of Object.entries(COMPLIANCE_RULES)) {
      const matches: string[] = [];
      let found = false;

      for (const pattern of rule.patterns) {
        const match = documentText.match(pattern);
        if (match) {
          found = true;
          matches.push(match[0]);
        }
      }

      findings.push({
        field: rule.field,
        found,
        severity: rule.severity,
        matches,
      });

      if (!found) {
        missingFields.push(rule.field);

        // Generate suggested action based on severity
        if (rule.severity === Severity.CRITICAL) {
          suggestedActions.push(
            `KRITIS: Segera tambahkan ${rule.field} pada dokumen`,
          );
        } else if (rule.severity === Severity.HIGH) {
          suggestedActions.push(
            `PENTING: Pastikan ${rule.field} tercantum dengan jelas`,
          );
        } else {
          suggestedActions.push(
            `Disarankan: Tambahkan ${rule.field} untuk kelengkapan`,
          );
        }
      }
    }

    // Get AI summary if available
    let aiSummary: string | undefined;
    const requirementTitles = Object.values(COMPLIANCE_RULES).map((r) => r.field);

    try {
      const aiResult = await this.geminiService.summarizeComplianceFindings(
        documentText,
        requirementTitles,
      );
      aiSummary = aiResult.summary;

      // Merge AI suggestions with rule-based ones
      for (const action of aiResult.suggestedActions) {
        if (!suggestedActions.includes(action)) {
          suggestedActions.push(action);
        }
      }
    } catch (error) {
      // AI summary is optional, continue without it
    }

    // Calculate compliance score
    const totalFields = findings.length;
    const foundFields = findings.filter((f) => f.found).length;
    const complianceScore = Math.round((foundFields / totalFields) * 100);

    // Severity breakdown
    const severityBreakdown = {
      critical: findings.filter((f) => !f.found && f.severity === Severity.CRITICAL).length,
      high: findings.filter((f) => !f.found && f.severity === Severity.HIGH).length,
      medium: findings.filter((f) => !f.found && f.severity === Severity.MEDIUM).length,
      low: findings.filter((f) => !f.found && f.severity === Severity.LOW).length,
    };

    // Save report to database
    const report = await this.prisma.complianceReport.create({
      data: {
        userId,
        productId,
        title: documentType || 'Compliance Check',
        documentType,
        originalText: documentText.substring(0, 5000), // Limit stored text
        findings: findings as any,
        missingFields,
        suggestedActions,
        aiSummary,
      },
    });

    return {
      reportId: report.id,
      complianceScore,
      totalFields,
      foundFields,
      missingFields,
      severityBreakdown,
      findings,
      suggestedActions,
      aiSummary,
      disclaimer: 'Ringkasan berbasis data contoh dan AI. Bukan prediksi pasar resmi.',
    };
  }

  async getReports(userId: string) {
    return this.prisma.complianceReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true } },
      },
    });
  }

  async getReport(id: string) {
    return this.prisma.complianceReport.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, category: true } },
      },
    });
  }
}
