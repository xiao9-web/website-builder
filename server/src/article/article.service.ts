import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleVersionService } from './article-version.service';
import { ArticleMenu } from './article-menu.entity';
import { ArticleTag } from './article-tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleMenu)
    private articleMenuRepository: Repository<ArticleMenu>,
    @InjectRepository(ArticleTag)
    private articleTagRepository: Repository<ArticleTag>,
    private articleVersionService: ArticleVersionService,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number): Promise<Article> {
    const { tag_ids, ...rest } = createArticleDto;

    let slug = rest.slug;
    if (!slug) {
      slug = this.generateSlug(rest.title);
      let counter = 1;
      let uniqueSlug = slug;
      while (await this.articleRepository.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    if (rest.status === ArticleStatus.SCHEDULED && rest.scheduled_at) {
      if (new Date(rest.scheduled_at) <= new Date()) {
        throw new Error('定时发布时间必须大于当前时间');
      }
    }

    const article = this.articleRepository.create({ ...rest, slug, author_id: userId });

    if (article.status === ArticleStatus.PUBLISHED && !article.published_at) {
      article.published_at = new Date();
    }

    const savedArticle = await this.articleRepository.save(article);

    if (tag_ids && tag_ids.length > 0) {
      await this.updateArticleTags(savedArticle.id, tag_ids);
    }

    await this.articleVersionService.createVersion(savedArticle, userId, '初始版本');

    return this.findOne(savedArticle.id);
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/[\s一-龥]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') || `article-${Date.now()}`
    );
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
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .leftJoinAndSelect('articleTags.tag', 'tag')
      .select([
        'article.id',
        'article.title',
        'article.slug',
        'article.summary',
        'article.cover_image',
        'article.category_id',
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
        'articleTags.id',
        'articleTags.tag_id',
        'tag.id',
        'tag.name',
        'tag.slug',
      ]);

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
      queryBuilder.andWhere(
        '(article.title LIKE :keyword OR article.content LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    queryBuilder.andWhere('article.deleted_at IS NULL');

    const [list, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    for (const article of list) {
      const articleMenus = await this.articleMenuRepository.find({
        where: { article_id: article.id },
        relations: ['menu'],
      });
      (article as any).menus = articleMenus.map(am => ({ id: am.menu.id, name: am.menu.name }));
    }

    return { list, total };
  }

  async findOne(id: number): Promise<Article | undefined> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .leftJoinAndSelect('articleTags.tag', 'tag')
      .where('article.id = :id', { id })
      .getOne();
  }

  async findBySlug(slug: string): Promise<Article | undefined> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .leftJoinAndSelect('articleTags.tag', 'tag')
      .where('article.slug = :slug', { slug })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .getOne();
  }

  async findByMenuId(
    menuId: number,
    options: { page: number; limit: number },
  ): Promise<{ list: Article[]; total: number }> {
    const [list, total] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .innerJoin('article_menu', 'am', 'am.article_id = article.id')
      .where('am.menu_id = :menuId', { menuId })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .orderBy('article.published_at', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit)
      .getManyAndCount();

    return { list, total };
  }

  async findByTag(
    tagSlug: string,
    options: { page: number; limit: number },
  ): Promise<{ items: Article[]; total: number }> {
    const [items, total] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .innerJoin('article.articleTags', 'at')
      .innerJoin('at.tag', 'tag')
      .where('tag.slug = :tagSlug', { tagSlug })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .orderBy('article.published_at', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit)
      .getManyAndCount();

    return { items, total };
  }

  async search(
    keyword: string,
    options: { page: number; limit: number },
  ): Promise<{ items: Article[]; total: number }> {
    const [items, total] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .andWhere(
        '(article.title LIKE :keyword OR article.content LIKE :keyword OR article.summary LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
      .orderBy('article.published_at', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit)
      .getManyAndCount();

    return { items, total };
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    userId?: number,
    versionDescription?: string,
  ): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) return null;

    const { tag_ids, ...rest } = updateArticleDto;

    if (rest.status === ArticleStatus.SCHEDULED && rest.scheduled_at) {
      if (new Date(rest.scheduled_at) <= new Date()) {
        throw new Error('定时发布时间必须大于当前时间');
      }
    }

    if (
      rest.status === ArticleStatus.PUBLISHED &&
      article.status !== ArticleStatus.PUBLISHED &&
      !rest.published_at
    ) {
      rest.published_at = new Date();
    }

    const hasSignificantChanges = this.hasSignificantChanges(article, rest);
    await this.articleRepository.save({ ...article, ...rest });

    if (tag_ids !== undefined) {
      await this.updateArticleTags(id, tag_ids);
    }

    if (hasSignificantChanges && userId) {
      const updated = await this.findOne(id);
      await this.articleVersionService.createVersion(updated, userId, versionDescription);
    }

    return this.findOne(id);
  }

  private hasSignificantChanges(article: Article, dto: Partial<CreateArticleDto>): boolean {
    const fields = ['title', 'content', 'summary', 'cover_image', 'seo_title', 'seo_description'];
    return fields.some(f => dto[f] !== undefined && dto[f] !== article[f]);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.articleRepository.increment({ id }, 'view_count', 1);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.update(id, { deleted_at: new Date() });
  }

  async batchRemove(ids: number[]): Promise<void> {
    await this.articleRepository.update(ids, { deleted_at: new Date() });
  }

  async restore(id: number): Promise<void> {
    await this.articleRepository.update(id, { deleted_at: null });
  }

  async batchRestore(ids: number[]): Promise<void> {
    await this.articleRepository.update(ids, { deleted_at: null });
  }

  async permanentRemove(id: number): Promise<void> {
    await this.articleTagRepository.delete({ article_id: id });
    await this.articleMenuRepository.delete({ article_id: id });
    await this.articleRepository.delete(id);
  }

  async batchPermanentRemove(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.permanentRemove(id);
    }
  }

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

  async updateArticleTags(articleId: number, tagIds: number[]): Promise<void> {
    await this.articleTagRepository.delete({ article_id: articleId });
    if (tagIds.length > 0) {
      const tags = tagIds.map(tag_id =>
        this.articleTagRepository.create({ article_id: articleId, tag_id }),
      );
      await this.articleTagRepository.save(tags);
    }
  }

  async updateArticleMenus(articleId: number, menuIds: number[]): Promise<void> {
    await this.articleMenuRepository.delete({ article_id: articleId });
    if (menuIds && menuIds.length > 0) {
      const articleMenus = menuIds.map(menuId =>
        this.articleMenuRepository.create({ article_id: articleId, menu_id: menuId }),
      );
      await this.articleMenuRepository.save(articleMenus);
    }
  }

  async getArticleMenus(articleId: number): Promise<number[]> {
    const articleMenus = await this.articleMenuRepository.find({ where: { article_id: articleId } });
    return articleMenus.map(am => am.menu_id);
  }

  async getMenuArticles(menuId: number): Promise<number[]> {
    const articleMenus = await this.articleMenuRepository.find({ where: { menu_id: menuId } });
    return articleMenus.map(am => am.article_id);
  }

  // Used by the scheduler to publish scheduled articles
  async publishScheduledArticles(): Promise<void> {
    const now = new Date();
    const scheduled = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.status = :status', { status: ArticleStatus.SCHEDULED })
      .andWhere('article.scheduled_at <= :now', { now })
      .andWhere('article.deleted_at IS NULL')
      .getMany();

    for (const article of scheduled) {
      await this.articleRepository.save({
        ...article,
        status: ArticleStatus.PUBLISHED,
        published_at: article.scheduled_at,
      });
    }
  }
}
