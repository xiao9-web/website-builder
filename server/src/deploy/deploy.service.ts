import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as OSS from 'ali-oss';
import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DeployVersion, DeployStatus } from './deploy.entity';
import { SiteConfigService } from '../site-config/site-config.service';
import { MenuService } from '../menu/menu.service';
import { ArticleService } from '../article/article.service';
import { PageService } from '../page/page.service';

const execAsync = promisify(exec);

@Injectable()
export class DeployService {
  private ossClient: OSS;

  constructor(
    @InjectRepository(DeployVersion)
    private deployVersionRepository: Repository<DeployVersion>,
    private siteConfigService: SiteConfigService,
    private menuService: MenuService,
    private articleService: ArticleService,
    private pageService: PageService,
  ) {}

  private async getOssClient() {
    if (!this.ossClient) {
      const accessKeyId = process.env.ALIYUN_OSS_ACCESS_KEY_ID;
      const accessKeySecret = process.env.ALIYUN_OSS_ACCESS_KEY_SECRET;
      const region = process.env.ALIYUN_OSS_REGION;
      const bucket = process.env.ALIYUN_OSS_BUCKET;

      if (!accessKeyId || !accessKeySecret || !region || !bucket) {
        throw new Error('阿里云OSS配置不完整');
      }

      this.ossClient = new OSS({
        accessKeyId,
        accessKeySecret,
        region,
        bucket,
      });
    }
    return this.ossClient;
  }

  // 生成版本号
  private generateVersion(): string {
    const now = new Date();
    return `v${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  }

  // 导出所有数据为JSON
  private async exportSiteData() {
    const [menus, articles, pages, siteConfig] = await Promise.all([
      this.menuService.findTree(),
      this.articleService.findAll({ status: 1, pageSize: 1000 }),
      this.pageService.findAll({ status: 1, pageSize: 1000 }),
      this.siteConfigService.findPublic(),
    ]);

    return {
      site: siteConfig,
      menus,
      articles: articles.list,
      pages: pages.list,
      generatedAt: new Date().toISOString(),
      version: this.generateVersion(),
    };
  }

  // 构建静态页面
  private async buildStaticSite(data: any): Promise<string> {
    const buildDir = path.join(process.cwd(), 'temp', 'build', data.version);
    await fs.ensureDir(buildDir);

    // 1. 写入数据文件
    await fs.writeJson(path.join(buildDir, 'data.json'), data);

    // 2. 复制前端模板
    const templateDir = path.join(process.cwd(), '../frontend/dist');
    if (await fs.pathExists(templateDir)) {
      await fs.copy(templateDir, buildDir);
    } else {
      // 如果模板还没构建，创建一个简单的index.html
      const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.site.site_name || '我的官网'}</title>
  <meta name="description" content="${data.site.site_description || ''}">
  <meta name="keywords" content="${data.site.site_keywords || ''}">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
  <div id="app"></div>
  <script>window.SITE_DATA = ${JSON.stringify(data)};</script>
  <script src="/assets/app.js"></script>
</body>
</html>`;
      await fs.writeFile(path.join(buildDir, 'index.html'), html);
    }

    return buildDir;
  }

  // 上传到OSS
  private async uploadToOSS(buildDir: string, version: string): Promise<string> {
    const client = await this.getOssClient();
    const files = await fs.readdir(buildDir, { withFileTypes: true });
    const ossDomain = process.env.ALIYUN_OSS_DOMAIN;

    const uploadFile = async (filePath: string, ossPath: string) => {
      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          const subFiles = await fs.readdir(filePath);
          for (const subFile of subFiles) {
            await uploadFile(path.join(filePath, subFile), path.join(ossPath, subFile));
          }
        } else {
          const content = await fs.readFile(filePath);
          await client.put(ossPath, content, {
            headers: {
              'Cache-Control': ossPath.includes('assets/') ? 'max-age=31536000' : 'max-age=60',
            },
          });
        }
      } catch (error) {
        console.error('上传失败:', ossPath, error);
        throw error;
      }
    };

    for (const file of files) {
      const filePath = path.join(buildDir, file.name);
      await uploadFile(filePath, file.name);
    }

    // 上传版本文件
    await client.put('version.txt', Buffer.from(version));

    return ossDomain || `https://${client.options.bucket}.${client.options.region}.aliyuncs.com`;
  }

  // 刷新CDN缓存
  private async refreshCDN() {
    const cdnDomain = process.env.ALIYUN_CDN_DOMAIN;
    if (!cdnDomain) return;

    // TODO: 实现CDN刷新逻辑
    console.log('CDN刷新:', cdnDomain);
  }

  // 触发部署
  async deploy(userId: number, description?: string): Promise<DeployVersion> {
    const version = this.generateVersion();
    const deployVersion = this.deployVersionRepository.create({
      version,
      description,
      status: DeployStatus.RUNNING,
      created_by: userId,
    });
    await this.deployVersionRepository.save(deployVersion);

    const startTime = Date.now();

    try {
      // 1. 导出数据
      deployVersion.deploy_log = '🔄 1/4 正在导出网站数据...\n';
      await this.deployVersionRepository.save(deployVersion);
      const siteData = await this.exportSiteData();

      // 2. 构建静态页面
      deployVersion.deploy_log += '🔄 2/4 正在构建静态页面...\n';
      await this.deployVersionRepository.save(deployVersion);
      const buildDir = await this.buildStaticSite(siteData);

      // 3. 上传到OSS
      deployVersion.deploy_log += '🔄 3/4 正在上传到阿里云OSS...\n';
      await this.deployVersionRepository.save(deployVersion);
      const previewUrl = await this.uploadToOSS(buildDir, version);
      deployVersion.preview_url = previewUrl;

      // 4. 刷新CDN
      deployVersion.deploy_log += '🔄 4/4 正在刷新CDN缓存...\n';
      await this.deployVersionRepository.save(deployVersion);
      await this.refreshCDN();

      // 部署成功
      deployVersion.status = DeployStatus.SUCCESS;
      deployVersion.duration = Math.round((Date.now() - startTime) / 1000);
      deployVersion.deploy_log += `✅ 部署完成！耗时 ${deployVersion.duration} 秒\n访问地址: ${previewUrl}`;
      await this.deployVersionRepository.save(deployVersion);

      // 清理临时文件
      await fs.remove(path.join(process.cwd(), 'temp', 'build', version));

      return deployVersion;
    } catch (error) {
      deployVersion.status = DeployStatus.FAILED;
      deployVersion.duration = Math.round((Date.now() - startTime) / 1000);
      deployVersion.deploy_log += `❌ 部署失败: ${error.message}\n${error.stack}`;
      await this.deployVersionRepository.save(deployVersion);
      throw error;
    }
  }

  async findAll(params: { page?: number; pageSize?: number }): Promise<{ list: DeployVersion[]; total: number }> {
    const { page = 1, pageSize = 10 } = params;
    const [list, total] = await this.deployVersionRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['creator'],
      select: [
        'id',
        'version',
        'description',
        'status',
        'preview_url',
        'duration',
        'created_at',
        'created_by',
      ],
    });
    return { list, total };
  }

  async findOne(id: number): Promise<DeployVersion | undefined> {
    return this.deployVersionRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
  }

  async getLog(id: number): Promise<string> {
    const deploy = await this.deployVersionRepository.findOne({ where: { id } });
    return deploy?.deploy_log || '';
  }

  async rollback(id: number, userId: number): Promise<DeployVersion> {
    // TODO: 实现版本回滚逻辑
    throw new Error('版本回滚功能开发中');
  }
}
