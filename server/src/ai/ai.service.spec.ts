import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk');

describe('AiService', () => {
  let service: AiService;
  let mockAnthropicClient: any;
  let mockCreate: jest.Mock;
  let mockStream: jest.Mock;

  beforeEach(async () => {
    mockCreate = jest.fn();
    mockStream = jest.fn();

    // 创建 mock client
    mockAnthropicClient = {
      messages: {
        create: mockCreate,
        stream: mockStream,
      },
    } as any;

    // Mock Anthropic 构造函数
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => mockAnthropicClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ANTHROPIC_API_KEY') return 'test-api-key';
              if (key === 'ANTHROPIC_BASE_URL') return 'https://api.anthropic.com';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSeo', () => {
    it('should call anthropic and parse json', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              metaTitle: 't',
              metaDescription: 'd',
              keywords: ['k1'],
              ogTitle: 'ot',
              ogDescription: 'od',
            }),
          },
        ],
      } as any);

      const result = await service.generateSeo({ title: 'hello', content: 'world' });
      expect(mockAnthropicClient.messages.create).toHaveBeenCalled();
      expect(result.metaTitle).toBe('t');
    });
  });

  describe('generateSummary', () => {
    it('should return text content', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'summary' }],
      } as any);

      const result = await service.generateSummary({ title: 't', content: 'c' });
      expect(result).toBe('summary');
    });
  });

  describe('streamPageConfig', () => {
    it('should set sse headers', async () => {
      const res = {
        setHeader: jest.fn(),
        flushHeaders: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
      } as any as Response;

      // minimal mock stream
      mockStream.mockReturnValue({
        [Symbol.asyncIterator]: async function* () {},
        finalMessage: jest.fn().mockResolvedValue({ content: [{ type: 'text', text: '{}' }] }),
      } as any);

      await service.streamPageConfig(
        {
          siteName: 's',
          siteDescription: 'd',
          pageType: 'home',
        },
        res,
      );

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    });
  });
});
