import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteConfig, ConfigGroup } from './site-config.entity';

@Injectable()
export class SiteConfigService implements OnModuleInit {
  constructor(
    @InjectRepository(SiteConfig)
    private siteConfigRepository: Repository<SiteConfig>,
  ) {}

  async onModuleInit() {
    // 初始化默认配置
    await this.initDefaultConfigs();
  }

  private async initDefaultConfigs() {
    const defaultConfigs = [
      // 网站基本信息
      {
        config_key: 'site_name',
        config_value: '我的官网',
        group: ConfigGroup.SITE,
        description: '网站名称',
        is_public: true,
      },
      {
        config_key: 'site_logo',
        config_value: '',
        group: ConfigGroup.SITE,
        description: '网站Logo',
        is_public: true,
      },
      {
        config_key: 'site_favicon',
        config_value: '',
        group: ConfigGroup.SITE,
        description: '网站favicon',
        is_public: true,
      },
      {
        config_key: 'site_description',
        config_value: '这是我的个人官网',
        group: ConfigGroup.SITE,
        description: '网站描述',
        is_public: true,
      },
      {
        config_key: 'site_keywords',
        config_value: '个人官网,博客,技术',
        group: ConfigGroup.SITE,
        description: '网站关键词',
        is_public: true,
      },
      {
        config_key: 'site_copyright',
        config_value: 'Copyright © 2024 My Site',
        group: ConfigGroup.SITE,
        description: '版权信息',
        is_public: true,
      },
      {
        config_key: 'site_icp',
        config_value: '',
        group: ConfigGroup.SITE,
        description: 'ICP备案号',
        is_public: true,
      },

      // SEO配置
      {
        config_key: 'seo_title',
        config_value: '',
        group: ConfigGroup.SEO,
        description: 'SEO默认标题',
        is_public: true,
      },
      {
        config_key: 'seo_description',
        config_value: '',
        group: ConfigGroup.SEO,
        description: 'SEO默认描述',
        is_public: true,
      },
      {
        config_key: 'seo_keywords',
        config_value: '',
        group: ConfigGroup.SEO,
        description: 'SEO默认关键词',
        is_public: true,
      },

      // 模板配置
      {
        config_key: 'template_name',
        config_value: 'default',
        group: ConfigGroup.TEMPLATE,
        description: '当前使用的模板名称',
        is_public: true,
      },
      {
        config_key: 'template_background',
        config_value: {
          type: 'particle',
          options: {
            color: '#667eea',
            density: 80,
            interactive: true,
          },
        },
        group: ConfigGroup.TEMPLATE,
        description: '网站背景配置',
        is_public: true,
      },
      {
        config_key: 'template_theme_color',
        config_value: '#667eea',
        group: ConfigGroup.TEMPLATE,
        description: '主题色',
        is_public: true,
      },

      // 部署配置
      {
        config_key: 'deploy_auto',
        config_value: false,
        group: ConfigGroup.DEPLOY,
        description: '是否自动部署',
        is_public: false,
      },
      {
        config_key: 'deploy_oss_domain',
        config_value: '',
        group: ConfigGroup.DEPLOY,
        description: 'OSS域名',
        is_public: false,
      },
      {
        config_key: 'deploy_cdn_domain',
        config_value: '',
        group: ConfigGroup.DEPLOY,
        description: 'CDN域名',
        is_public: false,
      },
    ];

    for (const config of defaultConfigs) {
      const exists = await this.siteConfigRepository.findOne({
        where: { config_key: config.config_key },
      });
      if (!exists) {
        await this.siteConfigRepository.save(config);
      }
    }
  }

  async findAll(group?: ConfigGroup): Promise<SiteConfig[]> {
    const where = group ? { group } : {};
    return this.siteConfigRepository.find({ where });
  }

  async findPublic(): Promise<Record<string, any>> {
    const configs = await this.siteConfigRepository.find({
      where: { is_public: true },
    });
    return configs.reduce((acc, config) => {
      acc[config.config_key] = config.config_value;
      return acc;
    }, {});
  }

  async findByKey(key: string): Promise<SiteConfig | undefined> {
    return this.siteConfigRepository.findOne({ where: { config_key: key } });
  }

  async getValue<T = any>(key: string, defaultValue?: T): Promise<T | undefined> {
    const config = await this.findByKey(key);
    return config ? (config.config_value as T) : defaultValue;
  }

  async setValue(key: string, value: any, description?: string): Promise<SiteConfig> {
    let config = await this.findByKey(key);
    if (config) {
      config.config_value = value;
      if (description !== undefined) {
        config.description = description;
      }
    } else {
      config = this.siteConfigRepository.create({
        config_key: key,
        config_value: value,
        description,
        group: ConfigGroup.CUSTOM,
        is_public: false,
      });
    }
    return this.siteConfigRepository.save(config);
  }

  async batchUpdate(configs: Record<string, any>): Promise<SiteConfig[]> {
    const result: SiteConfig[] = [];
    for (const [key, value] of Object.entries(configs)) {
      const config = await this.setValue(key, value);
      result.push(config);
    }
    return result;
  }

  async remove(key: string): Promise<void> {
    await this.siteConfigRepository.delete({ config_key: key });
  }
}
