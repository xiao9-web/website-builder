import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttachmentService } from './attachment.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('attachment')
@UseGuards(JwtAuthGuard)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.attachmentService.create({
      filename: file.filename,
      original_name: file.originalname,
      url: `/uploads/${file.filename}`,
      mime_type: file.mimetype,
      size: file.size,
      uploader_id: req.user.id,
    });
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
  ) {
    return this.attachmentService.findAll(page, limit, type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.attachmentService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.attachmentService.remove(+id);
  }
}
