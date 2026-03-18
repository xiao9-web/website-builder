import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  // 生成slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // 创建标签
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, slug } = createTagDto;

    // 如果没有提供slug，自动生成
    const finalSlug = slug || this.generateSlug(name);

    // 检查名称是否已存在
    const existingTag = await this.tagRepository.findOne({
      where: { name },
    });
    if (existingTag) {
      throw new BadRequestException('标签名称已存在');
    }

    // 检查slug是否已存在
    const existingSlug = await this.tagRepository.findOne({
      where: { slug: finalSlug },
    });
    if (existingSlug) {
      throw new BadRequestException('标签标识已存在');
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      slug: finalSlug,
    });

    return await this.tagRepository.save(tag);
  }

  // 获取所有标签
  async findAll(page?: number, limit?: number, search?: string): Promise<{ data: Tag[]; total: number }> {
    const query = this.tagRepository.createQueryBuilder('tag');

    if (search) {
      query.where('tag.name LIKE :search', { search: `%${search}%` });
    }

    query.orderBy('tag.usage_count', 'DESC').addOrderBy('tag.created_at', 'DESC');

    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }
  // 获取单个标签
  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return tag;
  }

  // 根据名称查找或创建标签
  async findOrCreate(name: string): Promise<Tag> {
    let tag = await this.tagRepository.findOne({
      where: { name },
    });

    if (!tag) {
      tag = await this.create({ name });
    }

    return tag;
  }

  // 更新标签
  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    // 如果更新了名称，检查是否重复
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const existingTag = await this.tagRepository.findOne({
        where: { name: updateTagDto.name },
      });
      if (existingTag) {
        throw new BadRequestException('标签名称已存在');
      }
    }

    // 如果更新了slug，检查是否重复
    if (updateTagDto.slug && updateTagDto.slug !== tag.slug) {
      const existingSlug = await this.tagRepository.findOne({
        where: { slug: updateTagDto.slug },
      });
      if (existingSlug) {
        throw new BadRequestException('标签标识已存在');
      }
    }

    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  // 删除标签
  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    // TODO: 解除文章关联
    await this.tagRepository.remove(tag);
  }

  // 批量删除标签
  async removeMany(ids: number[]): Promise<void> {
    await this.tagRepository.delete(ids);
  }

  // 合并标签
  async merge(sourceIds: number[], targetId: number): Promise<Tag> {
    const targetTag = await this.findOne(targetId);
    const sourceTags = await this.tagRepository.find({
      where: { id: In(sourceIds) },
    });

    if (sourceTags.length === 0) {
      throw new NotFoundException('源标签不存在');
    }

    // TODO: 更新文章关联，将所有使用源标签的文章改为使用目标标签
    // 这里需要注入ArticleService或直接查询article表

    // 更新使用次数
    targetTag.usage_count += sourceTags.reduce((sum, tag) => sum + tag.usage_count, 0);
    await this.tagRepository.save(targetTag);

    // 删除源标签
    await this.tagRepository.remove(sourceTags);

    return targetTag;
  }

  // 获取热门标签
  async getHotTags(limit: number = 10): Promise<Tag[]> {
    return await this.tagRepository.find({
      order: { usage_count: 'DESC' },
      take: limit,
    });
  }

  // 增加使用次数
  async incrementUsage(id: number): Promise<void> {
    await this.tagRepository.increment({ id }, 'usage_count', 1);
  }

  // 减少使用次数
  async decrementUsage(id: number): Promise<void> {
    await this.tagRepository.decrement({ id }, 'usage_count', 1);
  }
}
