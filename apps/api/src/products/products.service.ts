import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
      include: {
        user: { select: { id: true, name: true, company: true } },
        targetMarkets: true,
      },
    });
  }

  async findAll(userId?: string) {
    return this.prisma.product.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: { select: { id: true, name: true, company: true } },
        targetMarkets: true,
        _count: {
          select: { gaps: true, checklistItems: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, company: true } },
        targetMarkets: {
          include: {
            requirements: true,
          },
        },
        gaps: {
          include: {
            requirement: true,
            targetMarket: true,
          },
        },
        checklistItems: {
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, name: true, company: true } },
        targetMarkets: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async addTargetMarket(productId: string, countryCode: string, countryName: string) {
    await this.findOne(productId);

    return this.prisma.targetMarket.upsert({
      where: {
        productId_countryCode: { productId, countryCode },
      },
      update: {},
      create: {
        productId,
        countryCode,
        countryName,
      },
      include: {
        requirements: true,
      },
    });
  }

  async removeTargetMarket(productId: string, countryCode: string) {
    return this.prisma.targetMarket.delete({
      where: {
        productId_countryCode: { productId, countryCode },
      },
    });
  }
}
