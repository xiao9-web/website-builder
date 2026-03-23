import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleVersionService } from './article-version.service';
import { ArticleMenu } from './article-menu.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleMenu)
    private articleMenuRepository: Repository<ArticleMenu>,
    private articleVersionService: ArticleVersionService,
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

    // 处理定时发布
    if (createArticleDto.status === ArticleStatus.SCHEDULED && createArticleDto.scheduled_at) {
      const scheduledDate = new Date(createArticleDto.scheduled_at);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('定时发布时间必须大于当前时间');
      }
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

    const savedArticle = await this.articleRepository.save(article);

    // 创建初始版本
    await this.articleVersionService.createVersion(savedArticle, userId, '初始版本');

    return savedArticle;
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

    // 为每篇文章加载关联的菜单（从中间表）
    for (const article of list) {
      const articleMenus = await this.articleMenuRepository.find({
        where: { article_id: article.id },
        relations: ['menu'],
      });
      (article as any).menus = articleMenus.map(am => ({
        id: am.menu.id,
        name: am.menu.name,
      }));
    }

    return { list, total };
  }

  async findOne(id: number): Promise<Article | undefined> {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'menus'],
    });
  }

  async findBySlug(slug: string): Promise<Article | undefined> {
    return this.articleRepository.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED, deleted_at: null },
      relations: ['author'],
    });
  }

  async findByMenuId(
    menuId: number,
    options: { page: number; limit: number },
  ): Promise<{ list: Article[]; total: number }> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoin('article.menus', 'menus')
      .where('menus.id = :menuId', { menuId })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .orderBy('article.published_at', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    const [items, total] = await query.getManyAndCount();

    return { list: items, total };
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

  async update(id: number, updateArticleDto: UpdateArticleDto, userId?: number, versionDescription?: string): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) return null;

    // 处理定时发布
    if (updateArticleDto.status === ArticleStatus.SCHEDULED && updateArticleDto.scheduled_at) {
      const scheduledDate = new Date(updateArticleDto.scheduled_at);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('定时发布时间必须大于当前时间');
      }
    }

    // 如果状态变为发布，设置发布时间
    if (
      updateArticleDto.status === ArticleStatus.PUBLISHED &&
      article.status !== ArticleStatus.PUBLISHED &&
      !updateArticleDto.published_at
    ) {
      updateArticleDto.published_at = new Date();
    }

    // 检查是否有重要变化，需要创建版本
    const hasSignificantChanges = this.hasSignificantChanges(article, updateArticleDto);
    const updatedArticle = await this.articleRepository.save({
      ...article,
      ...updateArticleDto,
    });

    // 如果有重要变化且提供了用户ID，创建新版本
    if (hasSignificantChanges && userId) {
      await this.articleVersionService.createVersion(updatedArticle, userId, versionDescription);
    }

    return this.findOne(id);
  }

  private hasSignificantChanges(article: Article, updateArticleDto: UpdateArticleDto): boolean {
    const significantFields = ['title', 'content', 'summary', 'cover_image', 'seo_title', 'seo_description'];
    return significantFields.some(field => {
      return updateArticleDto[field] !== undefined && updateArticleDto[field] !== article[field];
    });
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

  // 文章-菜单多对多关系管理
  async updateArticleMenus(articleId: number, menuIds: number[]): Promise<void> {
    // 删除该文章的所有现有菜单关联
    await this.articleMenuRepository.delete({ article_id: articleId });

    // 创建新的关联
    if (menuIds && menuIds.length > 0) {
      const articleMenus = menuIds.map(menuId =>
        this.articleMenuRepository.create({
          article_id: articleId,
          menu_id: menuId,
        })
      );
      await this.articleMenuRepository.save(articleMenus);
    }
  }

  // 获取文章关联的所有菜单
  async getArticleMenus(articleId: number): Promise<number[]> {
    const articleMenus = await this.articleMenuRepository.find({
      where: { article_id: articleId },
    });
    return articleMenus.map(am => am.menu_id);
  }

  // 获取菜单关联的所有文章
  async getMenuArticles(menuId: number): Promise<number[]> {
    const articleMenus = await this.articleMenuRepository.find({
      where: { menu_id: menuId },
    });
    return articleMenus.map(am => am.article_id);
  }
}
