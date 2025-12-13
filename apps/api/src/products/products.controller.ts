import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Buat produk baru' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Daftar semua produk' })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.productsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail produk' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update produk' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus produk' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/markets')
  @ApiOperation({ summary: 'Tambah target pasar ke produk' })
  addTargetMarket(
    @Param('id') id: string,
    @Body() body: { countryCode: string; countryName: string },
  ) {
    return this.productsService.addTargetMarket(id, body.countryCode, body.countryName);
  }

  @Delete(':id/markets/:countryCode')
  @ApiOperation({ summary: 'Hapus target pasar dari produk' })
  removeTargetMarket(
    @Param('id') id: string,
    @Param('countryCode') countryCode: string,
  ) {
    return this.productsService.removeTargetMarket(id, countryCode);
  }
}
