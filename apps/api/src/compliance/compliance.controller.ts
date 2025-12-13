import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';

@ApiTags('compliance')
@Controller('api/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('check')
  @ApiOperation({
    summary: 'Cek kepatuhan dokumen (text input)',
    description: 'Analisis teks dokumen terhadap persyaratan ekspor',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        documentText: { type: 'string' },
        productId: { type: 'string' },
        documentType: { type: 'string' },
      },
      required: ['userId', 'documentText'],
    },
  })
  checkCompliance(
    @Body()
    body: {
      userId: string;
      documentText: string;
      productId?: string;
      documentType?: string;
    },
  ) {
    return this.complianceService.checkCompliance(
      body.userId,
      body.documentText,
      body.productId,
      body.documentType,
    );
  }

  @Post('check/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Cek kepatuhan dokumen (file upload)',
    description: 'Upload PDF atau text file untuk analisis kepatuhan',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        userId: { type: 'string' },
        productId: { type: 'string' },
      },
    },
  })
  async checkComplianceUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: string; productId?: string },
  ) {
    let documentText = '';

    if (file.mimetype === 'application/pdf') {
      // For PDF, we'd use pdf-parse in production
      // For demo, we'll extract what we can
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(file.buffer);
        documentText = data.text;
      } catch {
        documentText = file.buffer.toString('utf-8');
      }
    } else {
      documentText = file.buffer.toString('utf-8');
    }

    return this.complianceService.checkCompliance(
      body.userId,
      documentText,
      body.productId,
      file.originalname,
    );
  }

  @Get('reports')
  @ApiOperation({ summary: 'Daftar laporan compliance' })
  @ApiQuery({ name: 'userId', required: true })
  getReports(@Query('userId') userId: string) {
    return this.complianceService.getReports(userId);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Detail laporan compliance' })
  getReport(@Param('id') id: string) {
    return this.complianceService.getReport(id);
  }
}
