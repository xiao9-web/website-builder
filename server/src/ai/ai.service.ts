import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Response } from 'express';

/** Claude 模型 ID */
const MODEL = 'claude-opus-4-6';

/** SEO 生成请求参数 */
export interface GenerateSeoDto {
  /** 页面标题或文章标题 */
  title: string;
  /** 内容摘要或正文（前 1000 字符即可） */
  content?: string;
  /** 关键词提示（可选） */
  keywords?: string;
}

/** SEO 生成结果 */
export interface SeoResult {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}

/** 文章摘要生成请求参数 */
export interface GenerateSummaryDto {
  title: string;
  content: string;
  /** 摘要最大字符数，默认 200 */
  maxLength?: number;
}

/** 页面配置生成请求参数 */
export interface GeneratePageConfigDto {
  /** 网站名称 */
  siteName: string;
  /** 网站描述 */
  siteDescription: string;
  /** 目标页面类型：home | article */
  pageType: 'home' | 'article';
  /** 用户的补充说明 */
  extra?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: Anthropic;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    const baseURL = this.configService.get<string>('ANTHROPIC_BASE_URL');
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY 未配置，AI 功能将不可用');
    }
    this.client = new Anthropic({
      apiKey: apiKey ?? 'not-configured',
      ...(baseURL ? { baseURL } : {}),
    });
  }

  /**
   * 生成 SEO 元信息
   */
  async generateSeo(dto: GenerateSeoDto): Promise<SeoResult> {
    const prompt = `你是一位专业的 SEO 专家。请根据以下信息生成高质量的 SEO 元数据，以 JSON 格式返回。

标题：${dto.title}
${dto.content ? `内容摘要：${dto.content.substring(0, 800)}` : ''}
${dto.keywords ? `关键词提示：${dto.keywords}` : ''}

请返回以下 JSON 格式（不要包含任何其他文字）：
{
  "metaTitle": "页面标题（60字符以内）",
  "metaDescription": "页面描述（150字符以内，吸引用户点击）",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "ogTitle": "社交分享标题",
  "ogDescription": "社交分享描述（100字符以内）"
}`;

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    // 提取 JSON（Claude 可能会在 ``` 代码块中返回）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI 返回格式异常');
    }
    return JSON.parse(jsonMatch[0]) as SeoResult;
  }

  /**
   * 生成文章摘要
   */
  async generateSummary(dto: GenerateSummaryDto): Promise<string> {
    const maxLength = dto.maxLength ?? 200;
    const prompt = `请为以下文章生成一段简洁的摘要，要求：
1. 字数不超过 ${maxLength} 个汉字
2. 保留核心观点和关键信息
3. 语言流畅自然，适合作为文章简介

文章标题：${dto.title}

文章内容：
${dto.content.substring(0, 3000)}

请直接输出摘要文字，不要有任何前缀或说明。`;

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content.find((b) => b.type === 'text')?.text?.trim() ?? '';
  }

  /**
   * 流式生成页面组件配置（SSE）
   * 将 JSON 配置片段实时推送到客户端
   */
  async streamPageConfig(dto: GeneratePageConfigDto, res: Response): Promise<void> {
    const pageDesc =
      dto.pageType === 'home'
        ? `首页（包含 hero_banner、section_title、article_list 等组件）`
        : `文章详情页（包含 article_nav、table_of_contents、article_list 等组件）`;

    const prompt = `你是一位网站设计专家，擅长为企业官网生成页面布局配置。

网站名称：${dto.siteName}
网站描述：${dto.siteDescription}
页面类型：${pageDesc}
${dto.extra ? `用户要求：${dto.extra}` : ''}

请生成一个合适的页面组件配置 JSON，格式如下：
{
  "version": "1.0",
  "settings": {
    "title": "页面标题",
    "description": "页面描述",
    "backgroundColor": "#ffffff",
    "maxWidth": "1200px"
  },
  "components": [
    // 组件数组，每个组件包含 id、type、name、visible 及对应属性
  ]
}

可用组件类型及示例：
- hero_banner: 首页大图轮播，包含 slides(数组)、height、autoPlay、indicator
- section_title: 分区标题，包含 title、subtitle、align、divider、titleSize
- article_list: 文章列表，包含 layout(card/list/magazine)、columns、pageSize、sortBy
- article_nav: 文章导航，包含 navStyle(tabs/sidebar)、showCount、sticky
- table_of_contents: 目录，包含 title、maxDepth(2/3)、position(top/right-sticky)
- video_block: 视频，包含 videoType(local/embed)、embedUrl、aspectRatio
- text: 文本，包含 content、fontSize、fontWeight、color、textAlign
- image: 图片，包含 src、alt、width、height

请确保组件配置合理、完整，每个组件必须有唯一的 id（使用简短的随机字符串）。
直接输出 JSON，不要有任何其他说明。`;

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream = this.client.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    try {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const data = JSON.stringify({ type: 'delta', text: event.delta.text });
          res.write(`data: ${data}\n\n`);
        }
      }

      const finalMessage = await stream.finalMessage();
      const fullText =
        finalMessage.content.find((b) => b.type === 'text')?.text ?? '';

      res.write(`data: ${JSON.stringify({ type: 'done', fullText })}\n\n`);
    } catch (err) {
      this.logger.error('AI 流式生成失败', err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: String(err) })}\n\n`);
    } finally {
      res.end();
    }
  }
}
