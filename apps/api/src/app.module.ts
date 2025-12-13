import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { MarketsModule } from './markets/markets.module';
import { ComplianceModule } from './compliance/compliance.module';
import { SignalsModule } from './signals/signals.module';
import { AnalysisModule } from './analysis/analysis.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    GeminiModule,
    ProductsModule,
    MarketsModule,
    ComplianceModule,
    SignalsModule,
    AnalysisModule,
  ],
})
export class AppModule {}
