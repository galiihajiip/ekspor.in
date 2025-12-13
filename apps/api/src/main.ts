import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Ekspor.in API')
    .setDescription(
      'Export Readiness & Market Entry Intelligence Platform API\n\n' +
      '⚠️ **Disclaimer**: Demo hackathon. Dataset contoh. Bukan nasihat hukum.',
    )
    .setVersion('1.0')
    .addTag('products', 'Manajemen produk UMKM')
    .addTag('markets', 'Target pasar dan requirements')
    .addTag('compliance', 'Pengecekan kepatuhan dokumen')
    .addTag('signals', 'Market intelligence signals')
    .addTag('analysis', 'Gap analysis dan readiness scoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Ekspor.in API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
