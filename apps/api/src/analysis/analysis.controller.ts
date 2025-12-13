import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';

@ApiTags('analysis')
@Controller('api/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('products/:productId/analyze')
  @ApiOperation({
    summary: 'Analisis kesiapan produk untuk pasar tertentu',
    description: 'Menghitung readiness score, mengidentifikasi gap, dan membuat checklist',
  })
  @ApiParam({ name: 'productId', description: 'ID Produk' })
  @ApiQuery({ name: 'countryCode', description: 'Kode negara tujuan', example: 'US' })
  analyzeProduct(
    @Param('productId') productId: string,
    @Query('countryCode') countryCode: string,
  ) {
    return this.analysisService.analyzeProduct(productId, countryCode);
  }

  @Get('products/:productId/summary')
  @ApiOperation({
    summary: 'Ringkasan kesiapan produk untuk semua target pasar',
  })
  @ApiParam({ name: 'productId', description: 'ID Produk' })
  getProductSummary(@Param('productId') productId: string) {
    return this.analysisService.getProductReadinessSummary(productId);
  }
}
