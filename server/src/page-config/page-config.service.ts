import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageConfig } from './page-config.entity';
import { ThemeService } from '../theme/theme.service';

@Injectable()
export class PageConfigService implements OnModuleInit {
  constructor(
    @InjectRepository(PageConfig)
    private pageConfigRepository: Repository<PageConfig>,
    private themeService: ThemeService,
  ) {}

  async onModuleInit() {
    await this.initDefaultConfigs();
  }

  private async initDefaultConfigs() {
    const blogTheme = await this.themeService.findByName('blog');
    const enterpriseTheme = await this.themeService.findByName('enterprise');

    if (!blogTheme || !enterpriseTheme) return;

    // 博客主题首页配置
    const blogHomeExists = await this.pageConfigRepository.findOne({
      where: { theme_id: blogTheme.id, page_type: 'home' },
    });
    if (!blogHomeExists) {
      await this.pageConfigRepository.save({
        theme_id: blogTheme.id,
        page_type: 'home',
        config: {
          profile: {
            avatar: '',
            nickname: '博主昵称',
            bio: '一句话介绍',
          },
          articles: [],
        },
      });
    }

    // 博客主题文章详情页配置
    const blogArticleExists = await this.pageConfigRepository.findOne({
      where: { theme_id: blogTheme.id, page_type: 'article' },
    });
    if (!blogArticleExists) {
      await this.pageConfigRepository.save({
        theme_id: blogTheme.id,
        page_type: 'article',
        config: {
          showAuthor: true,
          showDate: true,
          showTags: true,
          showToc: true,
        },
      });
    }

    // 企业主题首页配置
    const enterpriseHomeExists = await this.pageConfigRepository.findOne({
      where: { theme_id: enterpriseTheme.id, page_type: 'home' },
    });
    if (!enterpriseHomeExists) {
      await this.pageConfigRepository.save({
        theme_id: enterpriseTheme.id,
        page_type: 'home',
        config: {
          banner: {
            backgroundImage: '',
            title: '企业标语',
            subtitle: '副标题描述',
            buttonText: '了解更多',
            buttonLink: '/about',
          },
          products: [],
          advantages: [],
        },
      });
    }
  }

  async findByThemeAndType(themeId: number, pageType: string): Promise<PageConfig | null> {
    return this.pageConfigRepository.findOne({
      where: { theme_id: themeId, page_type: pageType },
    });
  }

  async findByTheme(themeId: number): Promise<PageConfig[]> {
    return this.pageConfigRepository.find({
      where: { theme_id: themeId },
    });
  }

  async updateConfig(themeId: number, pageType: string, config: Record<string, any>): Promise<PageConfig> {
    let pageConfig = await this.findByThemeAndType(themeId, pageType);

    if (pageConfig) {
      pageConfig.config = config;
      return this.pageConfigRepository.save(pageConfig);
    } else {
      return this.pageConfigRepository.save({
        theme_id: themeId,
        page_type: pageType,
        config,
      });
    }
  }
}
