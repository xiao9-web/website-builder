import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import * as fs from 'fs';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const uploadPath = `uploads/${year}/${month}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('只支持图片格式'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const savedFile = await this.uploadService.saveFile(file, req.user?.userId || 0);
    return { data: savedFile };
  }

  @Get()
  async getFileList(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.uploadService.getFileList(page, limit);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.uploadService.deleteFile(+id);
    return { message: '删除成功' };
  }
}
