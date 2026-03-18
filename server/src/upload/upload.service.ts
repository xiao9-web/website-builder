import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './upload.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async saveFile(file: Express.Multer.File, userId: number): Promise<File> {
    const fileRecord = this.fileRepository.create({
      filename: file.filename,
      original_name: file.originalname,
      path: file.path,
      url: `/uploads/${file.filename}`,
      mime_type: file.mimetype,
      size: file.size,
      created_by: userId,
    });

    return await this.fileRepository.save(fileRecord);
  }

  async getFileList(page: number = 1, limit: number = 20) {
    const [files, total] = await this.fileRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { files, total, page, limit };
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new Error('文件不存在');
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await this.fileRepository.delete(id);
  }
}
