import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MarketsService } from './markets.service';
import { ProductCategory } from '@prisma/client';

@ApiTags('markets')
@Controller('api/markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Daftar negara tujuan yang didukung' })
  getCountries() {
    return this.marketsService.getSupportedCountries();
  }

  @Get('requirements')
  @ApiOperation({ summary: 'Daftar persyaratan ekspor' })
  @ApiQuery({ name: 'countryCode', required: false, example: 'US' })
  @ApiQuery({ name: 'category', required: false, enum: ProductCategory })
  getRequirements(
    @Query('countryCode') countryCode?: string,
    @Query('category') category?: ProductCategory,
  ) {
    return this.marketsService.getRequirements(countryCode, category);
  }

  @Get('requirements/stats')
  @ApiOperation({ summary: 'Statistik persyaratan per negara dan kategori' })
  getRequirementStats() {
    return this.marketsService.getRequirementStats();
  }
}
