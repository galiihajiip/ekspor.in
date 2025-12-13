import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { SignalsService } from './signals.service';
import { ProductCategory } from '@prisma/client';

@ApiTags('signals')
@Controller('api/signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar market signals tersedia' })
  @ApiQuery({ name: 'countryCode', required: false })
  @ApiQuery({ name: 'category', required: false, enum: ProductCategory })
  getSignals(
    @Query('countryCode') countryCode?: string,
    @Query('category') category?: ProductCategory,
  ) {
    return this.signalsService.getSignals(countryCode, category);
  }

  @Post('generate')
  @ApiOperation({
    summary: 'Generate market signal dengan AI',
    description: 'Menggunakan Gemini untuk menghasilkan insight pasar',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['FOOD', 'COSMETICS', 'APPAREL', 'HANDICRAFT'] },
        countryCode: { type: 'string', example: 'US' },
        productDescription: { type: 'string' },
      },
      required: ['category', 'countryCode'],
    },
  })
  generateSignal(
    @Body()
    body: {
      category: ProductCategory;
      countryCode: string;
      productDescription?: string;
    },
  ) {
    return this.signalsService.generateSignal(
      body.category,
      body.countryCode,
      body.productDescription,
    );
  }
}
