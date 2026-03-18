import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  // 获取所有设置
  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.find({
      order: { group: 'ASC', id: 'ASC' },
    });
  }

  // 按分组获取设置
  async findByGroup(group: string): Promise<Setting[]> {
    return await this.settingRepository.find({
      where: { group },
      order: { id: 'ASC' },
    });
  }

  // 获取单个设置
  async findOne(key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`设置项 ${key} 不存在`);
    }

    return setting;
  }

  // 获取设置值
  async getValue(key: string): Promise<any> {
    const setting = await this.findOne(key);
    return this.parseValue(setting.value, setting.type);
  }

  // 更新设置
  async update(key: string, value: any): Promise<Setting> {
    const setting = await this.findOne(key);
    setting.value = this.stringifyValue(value, setting.type);
    return await this.settingRepository.save(setting);
  }

  // 批量更新设置
  async batchUpdate(settings: { key: string; value: any }[]): Promise<void> {
    for (const item of settings) {
      await this.update(item.key, item.value);
    }
  }

  // 创建设置
  async create(data: Partial<Setting>): Promise<Setting> {
    const setting = this.settingRepository.create(data);
    return await this.settingRepository.save(setting);
  }

  // 删除设置
  async remove(key: string): Promise<void> {
    const setting = await this.findOne(key);
    await this.settingRepository.remove(setting);
  }

  // 初始化默认设置
  async initDefaultSettings(): Promise<void> {
    const defaults = [
      // 基础设置
      { key: 'site_name', value: '我的网站', description: '网站名称', type: 'string', group: 'basic' },
      { key: 'site_description', value: '这是一个基于 NestJS 和 Vue 3 的 CMS 系统', description: '网站描述', type: 'string', group: 'basic' },
      { key: 'site_keywords', value: 'CMS,博客,NestJS,Vue', description: '网站关键词', type: 'string', group: 'basic' },
      { key: 'site_logo', value: '', description: '网站 Logo', type: 'string', group: 'basic' },
      { key: 'site_favicon', value: '', description: '网站图标', type: 'string', group: 'basic' },
      { key: 'icp_number', value: '', description: 'ICP 备案号', type: 'string', group: 'basic' },
      { key: 'contact_email', value: '', description: '联系邮箱', type: 'string', group: 'basic' },
      { key: 'contact_phone', value: '', description: '联系电话', type: 'string', group: 'basic' },
      { key: 'contact_address', value: '', description: '联系地址', type: 'string', group: 'basic' },

      // 主题设置
      { key: 'theme_name', value: 'default', description: '主题名称', type: 'string', group: 'theme' },
      { key: 'theme_color', value: '#409EFF', description: '主题色', type: 'string', group: 'theme' },
      { key: 'theme_font', value: 'system', description: '字体', type: 'string', group: 'theme' },

      // SEO 设置
      { key: 'seo_enabled', value: 'true', description: '启用 SEO', type: 'boolean', group: 'seo' },
      { key: 'sitemap_enabled', value: 'true', description: '启用 Sitemap', type: 'boolean', group: 'seo' },
      { key: 'robots_txt', value: 'User-agent: *\nAllow: /', description: 'Robots.txt 内容', type: 'string', group: 'seo' },
      { key: 'analytics_code', value: '', description: '统计代码', type: 'string', group: 'seo' },

      // 评论设置
      { key: 'comment_enabled', value: 'false', description: '启用评论', type: 'boolean', group: 'comment' },
      { key: 'comment_provider', value: 'none', description: '评论服务商', type: 'string', group: 'comment' },
      { key: 'comment_config', value: '{}', description: '评论配置', type: 'json', group: 'comment' },
    ];

    for (const item of defaults) {
      const existing = await this.settingRepository.findOne({
        where: { key: item.key },
      });

      if (!existing) {
        await this.create(item);
      }
    }
  }

  // 解析值
  private parseValue(value: string, type: string): any {
    if (!value) return null;

    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
      case 'json':
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      default:
        return value;
    }
  }

  // 转换值为字符串
  private stringifyValue(value: any, type: string): string {
    if (value === null || value === undefined) return '';

    switch (type) {
      case 'json':
        return JSON.stringify(value);
      case 'boolean':
        return value ? 'true' : 'false';
      default:
        return String(value);
    }
  }
}
