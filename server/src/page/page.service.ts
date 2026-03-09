import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageStatus } from './page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  async create(createPageDto: CreatePageDto, userId: number): Promise<Page> {
    const page = this.pageRepository.create({
      ...createPageDto,
      author_id: userId,
    });
    
    // 如果是发布状态，设置发布时间
    if (page.status === PageStatus.PUBLISHED && !page.published_at) {
      page.published_at = new Date();
    }
    
    return this.pageRepository.save(page);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: PageStatus;
    keyword?: string;
  }): Promise<{ list: Page[]; total: number }> {
    const { page = 1, pageSize = 10, status, keyword } = params;
    
    const queryBuilder = this.pageRepository
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.author', 'author')
      .select([
        'page.id',
        'page.title',
        'page.slug',
        'page.template',
        'page.status',
        'page.view_count',
        'page.is_public',
        'page.published_at',
        'page.created_at',
        'page.updated_at',
        'author.id',
        'author.username',
        'author.nickname',
        'author.avatar',
      ])
      .orderBy('page.created_at', 'DESC');

    if (status !== undefined) {
      queryBuilder.andWhere('page.status = :status', { status });
    }

    if (keyword) {
      queryBuilder.andWhere('(page.title LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    const [list, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: number): Promise<Page | undefined> {
    return this.pageRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findBySlug(slug: string): Promise<Page | undefined> {
    return this.pageRepository.findOne({
      where: { slug, status: PageStatus.PUBLISHED },
      relations: ['author'],
    });
  }

  async update(id: number, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.findOne(id);
    if (!page) return null;

    // 如果状态变为发布，设置发布时间
    if (
      updatePageDto.status === PageStatus.PUBLISHED &&
      page.status !== PageStatus.PUBLISHED &&
      !updatePageDto.published_at
    ) {
      updatePageDto.published_at = new Date();
    }

    await this.pageRepository.update(id, updatePageDto);
    return this.findOne(id);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.pageRepository.increment({ id }, 'view_count', 1);
  }

  async remove(id: number): Promise<void> {
    await this.pageRepository.delete(id);
  }
}
