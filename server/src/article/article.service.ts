import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number): Promise<Article> {
    // 如果没有提供 slug，从标题生成
    let slug = createArticleDto.slug;
    if (!slug) {
      slug = this.generateSlug(createArticleDto.title);
      // 确保 slug 唯一
      let counter = 1;
      let uniqueSlug = slug;
      while (await this.articleRepository.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      slug,
      author_id: userId,
    });

    // 如果是发布状态，设置发布时间
    if (article.status === ArticleStatus.PUBLISHED && !article.published_at) {
      article.published_at = new Date();
    }

    return this.articleRepository.save(article);
  }

  private generateSlug(title: string): string {
    // 简单的 slug 生成：转小写，替换空格和特殊字符
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s\u4e00-\u9fa5]+/g, '-') // 替换空格和中文字符为连字符
      .replace(/[^\w\-]+/g, '') // 移除非字母数字和连字符的字符
      .replace(/\-\-+/g, '-') // 替换多个连字符为单个
      .replace(/^-+/, '') // 移除开头的连字符
      .replace(/-+$/, '') // 移除结尾的连字符
      || `article-${Date.now()}`; // 如果结果为空，使用时间戳
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: ArticleStatus;
    category_id?: number;
    keyword?: string;
    sortBy?: string;
  }): Promise<{ list: Article[]; total: number }> {
    const { page = 1, pageSize = 10, status, category_id, keyword, sortBy = 'created_at_desc' } = params;
    
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .select([
        'article.id',
        'article.title',
        'article.slug',
        'article.summary',
        'article.cover_image',
        'article.category_id',
        'article.tags',
        'article.status',
        'article.view_count',
        'article.is_public',
        'article.published_at',
        'article.created_at',
        'article.updated_at',
        'author.id',
        'author.username',
        'author.nickname',
        'author.avatar',
      ]);

    // 动态排序
    const [sortField, sortOrder] = sortBy.split('_');
    const validSortFields = ['created_at', 'published_at', 'view_count'];
    const validSortOrders = ['asc', 'desc'];

    if (validSortFields.includes(sortField) && validSortOrders.includes(sortOrder)) {
      queryBuilder.orderBy(`article.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('article.created_at', 'DESC');
    }

    if (status !== undefined) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    if (category_id !== undefined) {
      queryBuilder.andWhere('article.category_id = :category_id', { category_id });
    }

    if (keyword) {
      queryBuilder.andWhere('(article.title LIKE :keyword OR article.content LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    // 排除已软删除的文章
    queryBuilder.andWhere('article.deleted_at IS NULL');

    const [list, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: number): Promise<Article | undefined> {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findBySlug(slug: string): Promise<Article | undefined> {
    return this.articleRepository.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED, deleted_at: null },
      relations: ['author'],
    });
  }

  async findByTag(
    tagSlug: string,
    options: { page: number; limit: number },
  ): Promise<{ items: Article[]; total: number }> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoin('article.tags', 'tag')
      .where('tag.slug = :tagSlug', { tagSlug })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .orderBy('article.published_at', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async search(
    keyword: string,
    options: { page: number; limit: number },
  ): Promise<{ items: Article[]; total: number }> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .andWhere(
        '(article.title LIKE :keyword OR article.content LIKE :keyword OR article.summary LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
      .orderBy('article.published_at', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) return null;

    // 如果状态变为发布，设置发布时间
    if (
      updateArticleDto.status === ArticleStatus.PUBLISHED &&
      article.status !== ArticleStatus.PUBLISHED &&
      !updateArticleDto.published_at
    ) {
      updateArticleDto.published_at = new Date();
    }

    await this.articleRepository.update(id, updateArticleDto);
    return this.findOne(id);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.articleRepository.increment({ id }, 'view_count', 1);
  }

  // 软删除
  async remove(id: number): Promise<void> {
    await this.articleRepository.update(id, { deleted_at: new Date() });
  }

  // 批量软删除
  async batchRemove(ids: number[]): Promise<void> {
    await this.articleRepository.update(ids, { deleted_at: new Date() });
  }

  // 恢复已删除的文章
  async restore(id: number): Promise<void> {
    await this.articleRepository.update(id, { deleted_at: null });
  }

  // 批量恢复
  async batchRestore(ids: number[]): Promise<void> {
    await this.articleRepository.update(ids, { deleted_at: null });
  }

  // 永久删除
  async permanentRemove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }

  // 批量永久删除
  async batchPermanentRemove(ids: number[]): Promise<void> {
    await this.articleRepository.delete(ids);
  }

  // 获取已删除的文章列表
  async findDeleted(params: {
    page?: number;
    pageSize?: number;
  }): Promise<{ list: Article[]; total: number }> {
    const { page = 1, pageSize = 10 } = params;

    const [list, total] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.deleted_at IS NOT NULL')
      .orderBy('article.deleted_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }
}
