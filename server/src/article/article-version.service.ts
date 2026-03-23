import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleVersion } from './article-version.entity';
import { Article } from './article.entity';

@Injectable()
export class ArticleVersionService {
  constructor(
    @InjectRepository(ArticleVersion)
    private articleVersionRepository: Repository<ArticleVersion>,
  ) {}

  // 创建新版本
  async createVersion(article: Article, authorId: number, description?: string): Promise<ArticleVersion> {
    // 获取文章的最新版本
    const latestVersion = await this.getLatestVersion(article.id);
    const versionNumber = latestVersion ? latestVersion.version + 1 : 1;

    const version = this.articleVersionRepository.create({
      articleId: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      summary: article.summary,
      cover_image: article.cover_image,
      category_id: article.category_id,
      tags: article.tags,
      seo_title: article.seo_title,
      seo_description: article.seo_description,
      seo_keywords: article.seo_keywords,
      version: versionNumber,
      authorId,
      description: description || `版本 ${versionNumber}`,
    });

    return this.articleVersionRepository.save(version);
  }

  // 获取文章的所有版本
  async getVersionsByArticleId(articleId: number): Promise<ArticleVersion[]> {
    return this.articleVersionRepository.find({
      where: { articleId },
      order: { version: 'DESC' },
      relations: ['author'],
    });
  }

  // 获取文章的最新版本
  async getLatestVersion(articleId: number): Promise<ArticleVersion | null> {
    const versions = await this.articleVersionRepository.find({
      where: { articleId },
      order: { version: 'DESC' },
      take: 1,
    });

    return versions.length > 0 ? versions[0] : null;
  }

  // 根据版本号获取版本
  async getVersionByNumber(articleId: number, version: number): Promise<ArticleVersion | null> {
    return this.articleVersionRepository.findOne({
      where: { articleId, version },
      relations: ['author'],
    });
  }

  // 获取文章的历史版本数量
  async getVersionCount(articleId: number): Promise<number> {
    return this.articleVersionRepository.count({ where: { articleId } });
  }

  // 恢复到指定版本
  async restoreVersion(article: Article, versionNumber: number): Promise<Article> {
    const version = await this.getVersionByNumber(article.id, versionNumber);
    if (!version) {
      throw new Error(`版本 ${versionNumber} 不存在`);
    }

    // 更新文章信息
    article.title = version.title;
    article.slug = version.slug;
    article.content = version.content;
    article.summary = version.summary;
    article.cover_image = version.cover_image;
    article.category_id = version.category_id;
    article.tags = version.tags;
    article.seo_title = version.seo_title;
    article.seo_description = version.seo_description;
    article.seo_keywords = version.seo_keywords;

    return article;
  }

  // 删除文章的所有版本
  async deleteVersionsByArticleId(articleId: number): Promise<void> {
    await this.articleVersionRepository.delete({ articleId });
  }

  // 获取所有版本（用于管理）
  async findAll(params: {
    page?: number;
    pageSize?: number;
  }): Promise<{ list: ArticleVersion[]; total: number }> {
    const { page = 1, pageSize = 10 } = params;

    const [list, total] = await this.articleVersionRepository
      .createQueryBuilder('version')
      .leftJoinAndSelect('version.article', 'article')
      .leftJoinAndSelect('version.author', 'author')
      .orderBy('version.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }
}
