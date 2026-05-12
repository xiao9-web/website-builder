import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './tag.entity';
import { ArticleTag } from '../article/article-tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(ArticleTag)
    private articleTagRepository: Repository<ArticleTag>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, slug } = createTagDto;
    const finalSlug = slug || this.generateSlug(name);

    const existingName = await this.tagRepository.findOne({ where: { name } });
    if (existingName) throw new BadRequestException('标签名称已存在');

    const existingSlug = await this.tagRepository.findOne({ where: { slug: finalSlug } });
    if (existingSlug) throw new BadRequestException('标签标识已存在');

    const tag = this.tagRepository.create({ ...createTagDto, slug: finalSlug });
    return this.tagRepository.save(tag);
  }

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

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('标签不存在');
    return tag;
  }

  async findBySlug(slug: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { slug } });
    if (!tag) throw new NotFoundException('标签不存在');
    return tag;
  }

  async findOrCreate(name: string): Promise<Tag> {
    const existing = await this.tagRepository.findOne({ where: { name } });
    if (existing) return existing;
    return this.create({ name });
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const exists = await this.tagRepository.findOne({ where: { name: updateTagDto.name } });
      if (exists) throw new BadRequestException('标签名称已存在');
    }

    if (updateTagDto.slug && updateTagDto.slug !== tag.slug) {
      const exists = await this.tagRepository.findOne({ where: { slug: updateTagDto.slug } });
      if (exists) throw new BadRequestException('标签标识已存在');
    }

    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.articleTagRepository.delete({ tag_id: id });
    await this.tagRepository.remove(tag);
  }

  async removeMany(ids: number[]): Promise<void> {
    await this.articleTagRepository.delete({ tag_id: In(ids) });
    await this.tagRepository.delete(ids);
  }

  async merge(sourceIds: number[], targetId: number): Promise<Tag> {
    const targetTag = await this.findOne(targetId);
    const sourceTags = await this.tagRepository.find({ where: { id: In(sourceIds) } });

    if (sourceTags.length === 0) throw new NotFoundException('源标签不存在');

    // Move article associations from source tags to target tag
    for (const sourceTag of sourceTags) {
      const sourceRelations = await this.articleTagRepository.find({ where: { tag_id: sourceTag.id } });

      for (const relation of sourceRelations) {
        // Only add if the article doesn't already have the target tag
        const alreadyLinked = await this.articleTagRepository.findOne({
          where: { article_id: relation.article_id, tag_id: targetId },
        });
        if (!alreadyLinked) {
          await this.articleTagRepository.save(
            this.articleTagRepository.create({ article_id: relation.article_id, tag_id: targetId }),
          );
        }
      }

      // Remove source tag relations
      await this.articleTagRepository.delete({ tag_id: sourceTag.id });
    }

    // Recalculate usage count for target tag
    const count = await this.articleTagRepository.count({ where: { tag_id: targetId } });
    targetTag.usage_count = count;
    await this.tagRepository.save(targetTag);

    // Delete source tags
    await this.tagRepository.remove(sourceTags);

    return targetTag;
  }

  async getHotTags(limit = 10): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { usage_count: 'DESC' },
      take: limit,
    });
  }

  async incrementUsage(id: number): Promise<void> {
    await this.tagRepository.increment({ id }, 'usage_count', 1);
  }

  async decrementUsage(id: number): Promise<void> {
    await this.tagRepository.decrement({ id }, 'usage_count', 1);
  }
}
