import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, AttachmentType } from './attachment.entity';
import * as fs from 'fs';
import * as path from 'path';
import sizeOf from 'image-size';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async create(data: Partial<Attachment>): Promise<Attachment> {
    // 判断文件类型
    const mimeType = data.mime_type;
    let type = AttachmentType.OTHER;
    let width = null;
    let height = null;

    if (mimeType.startsWith('image/')) {
      type = AttachmentType.IMAGE;
      // 获取图片尺寸
      try {
        const filePath = path.join(process.cwd(), 'uploads', data.filename);
        const buffer = fs.readFileSync(filePath);
        const dimensions = sizeOf(buffer);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        console.error('Failed to get image dimensions:', error);
      }
    } else if (mimeType.startsWith('video/')) {
      type = AttachmentType.VIDEO;
    } else if (mimeType.startsWith('audio/')) {
      type = AttachmentType.AUDIO;
    } else if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      mimeType.includes('powerpoint')
    ) {
      type = AttachmentType.DOCUMENT;
    }

    const attachment = this.attachmentRepository.create({
      ...data,
      type,
      width,
      height,
    });

    return this.attachmentRepository.save(attachment);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    type?: string,
  ): Promise<{ data: Attachment[]; total: number; page: number; limit: number }> {
    const query = this.attachmentRepository.createQueryBuilder('attachment');

    if (type) {
      query.where('attachment.type = :type', { type });
    }

    query.orderBy('attachment.created_at', 'DESC');
    query.skip((page - 1) * limit);
    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({ where: { id } });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    return attachment;
  }

  async remove(id: number): Promise<void> {
    const attachment = await this.findOne(id);

    // 删除文件
    try {
      const filePath = path.join(process.cwd(), 'uploads', attachment.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }

    await this.attachmentRepository.remove(attachment);
  }
}
