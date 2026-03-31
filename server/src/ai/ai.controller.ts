import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AiService, GenerateSeoDto, GenerateSummaryDto, GeneratePageConfigDto } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * 生成 SEO 元信息
   * POST /ai/seo
   */
  @Post('seo')
  @HttpCode(HttpStatus.OK)
  async generateSeo(@Body() dto: GenerateSeoDto) {
    const result = await this.aiService.generateSeo(dto);
    return { code: 200, data: result, message: 'success' };
  }

  /**
   * 生成文章摘要
   * POST /ai/summary
   */
  @Post('summary')
  @HttpCode(HttpStatus.OK)
  async generateSummary(@Body() dto: GenerateSummaryDto) {
    const summary = await this.aiService.generateSummary(dto);
    return { code: 200, data: { summary }, message: 'success' };
  }

  /**
   * 流式生成页面组件配置（SSE）
   * POST /ai/page-config/stream
   */
  @Post('page-config/stream')
  async streamPageConfig(
    @Body() dto: GeneratePageConfigDto,
    @Res() res: Response,
  ) {
    await this.aiService.streamPageConfig(dto, res);
  }
}
