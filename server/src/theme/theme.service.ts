import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';

@Injectable()
export class ThemeService implements OnModuleInit {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async onModuleInit() {
    await this.initDefaultThemes();
  }

  private async initDefaultThemes() {
    const themes = [
      {
        name: 'blog',
        display_name: '博客主题',
        description: '适合个人博客、技术文档的简洁主题',
        is_active: true,
        config: {
          primaryColor: '#2c3e50',
          accentColor: '#3498db',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          fontFamily: {
            title: 'Source Sans Pro, 思源黑体',
            body: 'Georgia, 思源宋体',
          },
        },
      },
      {
        name: 'enterprise',
        display_name: '企业主题',
        description: '适合公司官网、产品展示的专业主题',
        is_active: false,
        config: {
          primaryColor: '#1a73e8',
          accentColor: '#34a853',
          backgroundColor: '#ffffff',
          textColor: '#202124',
          fontFamily: {
            title: 'Roboto, 微软雅黑',
            body: 'Roboto, 微软雅黑',
          },
        },
      },
    ];

    for (const themeData of themes) {
      const exists = await this.themeRepository.findOne({
        where: { name: themeData.name },
      });
      if (!exists) {
        await this.themeRepository.save(themeData);
      }
    }
  }

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.find({
      order: { created_at: 'ASC' },
    });
  }

  async findActive(): Promise<Theme | null> {
    return this.themeRepository.findOne({
      where: { is_active: true },
    });
  }

  async findByName(name: string): Promise<Theme | null> {
    return this.themeRepository.findOne({
      where: { name },
    });
  }

  async activate(id: number): Promise<Theme> {
    // 先将所有主题设为非激活
    await this.themeRepository.update({}, { is_active: false });

    // 激活指定主题
    await this.themeRepository.update(id, { is_active: true });

    return this.themeRepository.findOne({ where: { id } });
  }

  async updateConfig(id: number, config: Record<string, any>): Promise<Theme> {
    await this.themeRepository.update(id, { config });
    return this.themeRepository.findOne({ where: { id } });
  }
}
