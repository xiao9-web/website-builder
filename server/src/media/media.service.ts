import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const media = this.mediaRepository.create(createMediaDto);
    return this.mediaRepository.save(media);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    type?: MediaType;
    keyword?: string;
  }): Promise<{ list: Media[]; total: number }> {
    const { page = 1, pageSize = 20, type, keyword } = params;

    const queryBuilder = this.mediaRepository.createQueryBuilder('media');

    if (type) {
      queryBuilder.where('media.type = :type', { type });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(media.filename LIKE :keyword OR media.original_name LIKE :keyword OR media.description LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    queryBuilder
      .orderBy('media.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await queryBuilder.getManyAndCount();

    return { list, total };
  }

  async findOne(id: number): Promise<Media> {
    return this.mediaRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    await this.mediaRepository.update(id, updateMediaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);
    if (media) {
      // 删除物理文件
      const filePath = path.join(process.cwd(), 'uploads', media.filename);
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
      await this.mediaRepository.delete(id);
    }
  }

  async getStats(): Promise<{
    total: number;
    images: number;
    videos: number;
    files: number;
    totalSize: number;
  }> {
    const [total, images, videos, files] = await Promise.all([
      this.mediaRepository.count(),
      this.mediaRepository.count({ where: { type: MediaType.IMAGE } }),
      this.mediaRepository.count({ where: { type: MediaType.VIDEO } }),
      this.mediaRepository.count({ where: { type: MediaType.FILE } }),
    ]);

    const result = await this.mediaRepository
      .createQueryBuilder('media')
      .select('SUM(media.size)', 'totalSize')
      .getRawOne();

    return {
      total,
      images,
      videos,
      files,
      totalSize: parseInt(result.totalSize) || 0,
    };
  }
}
