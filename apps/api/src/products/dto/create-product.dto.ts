import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Sambal Matah Premium' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ProductCategory, example: 'FOOD' })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiPropertyOptional({ example: 'Sambal tradisional Bali dengan bahan segar' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Bawang merah, cabai, serai, minyak kelapa' })
  @IsString()
  @IsOptional()
  composition?: string;

  @ApiPropertyOptional({ example: 'Glass Jar 200ml' })
  @IsString()
  @IsOptional()
  packagingType?: string;

  @ApiPropertyOptional({ example: ['BPOM', 'Halal MUI'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingCertifications?: string[];

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  userId: string;
}
