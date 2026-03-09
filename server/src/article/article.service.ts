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
    const article = this.articleRepository.create({
      ...createArticleDto,
      author_id: userId,
    });
    
    // 如果是发布状态，设置发布时间
    if (article.status === ArticleStatus.PUBLISHED && !article.published_at) {
      article.published_at = new Date();
    }
    
    return this.articleRepository.save(article);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: ArticleStatus;
    category_id?: number;
    keyword?: string;
  }): Promise<{ list: Article[]; total: number }> {
    const { page = 1, pageSize = 10, status, category_id, keyword } = params;
    
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
      ])
      .orderBy('article.created_at', 'DESC');

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
      where: { slug, status: ArticleStatus.PUBLISHED },
      relations: ['author'],
    });
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

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }

  async batchRemove(ids: number[]): Promise<void> {
    await this.articleRepository.delete(ids);
  }
}
