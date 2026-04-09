import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaType } from './media.entity';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as sharp from 'sharp';

// 文件过滤器
const fileFilter = (req, file, callback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new BadRequestException('不支持的文件类型'), false);
  }
};

// 文件存储配置
const storage = diskStorage({
  destination: async (req, file, callback) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'media');
    await fs.ensureDir(uploadDir);
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    let type: MediaType = MediaType.FILE;
    let width: number | undefined;
    let height: number | undefined;

    // 判断文件类型
    if (file.mimetype.startsWith('image/')) {
      type = MediaType.IMAGE;
      // 获取图片尺寸
      try {
        const metadata = await sharp(file.path).metadata();
        width = metadata.width;
        height = metadata.height;
      } catch (error) {
        console.error('获取图片尺寸失败:', error);
      }
    } else if (file.mimetype.startsWith('video/')) {
      type = MediaType.VIDEO;
    }

    const createMediaDto: CreateMediaDto = {
      filename: `media/${file.filename}`,
      original_name: file.originalname,
      url: `/uploads/media/${file.filename}`,
      type,
      mime_type: file.mimetype,
      size: file.size,
      width,
      height,
    };

    return this.mediaService.create(createMediaDto);
  }

  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
      fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    })
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('请选择文件');
    }

    const results = [];
    for (const file of files) {
      let type: MediaType = MediaType.FILE;
      let width: number | undefined;
      let height: number | undefined;

      if (file.mimetype.startsWith('image/')) {
        type = MediaType.IMAGE;
        try {
          const metadata = await sharp(file.path).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (error) {
          console.error('获取图片尺寸失败:', error);
        }
      } else if (file.mimetype.startsWith('video/')) {
        type = MediaType.VIDEO;
      }

      const createMediaDto: CreateMediaDto = {
        filename: `media/${file.filename}`,
        original_name: file.originalname,
        url: `/uploads/media/${file.filename}`,
        type,
        mime_type: file.mimetype,
        size: file.size,
        width,
        height,
      };

      const media = await this.mediaService.create(createMediaDto);
      results.push(media);
    }

    return results;
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('type') type: MediaType,
    @Query('keyword') keyword: string,
  ) {
    return this.mediaService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 20,
      type,
      keyword,
    });
  }

  @Get('stats')
  getStats() {
    return this.mediaService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
