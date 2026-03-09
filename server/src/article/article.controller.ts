import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleStatus } from './article.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articleService.create(createArticleDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('status') status: string,
    @Query('category_id') category_id: string,
    @Query('keyword') keyword: string,
  ) {
    return this.articleService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      status: status !== undefined ? parseInt(status) as ArticleStatus : undefined,
      category_id: category_id ? parseInt(category_id) : undefined,
      keyword,
    });
  }

  @Public()
  @Get('published')
  findPublished(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('category_id') category_id: string,
    @Query('keyword') keyword: string,
  ) {
    return this.articleService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      status: ArticleStatus.PUBLISHED,
      category_id: category_id ? parseInt(category_id) : undefined,
      keyword,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Public()
  @Patch(':id/view')
  incrementViewCount(@Param('id') id: string) {
    return this.articleService.incrementViewCount(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }

  @Delete('batch')
  batchRemove(@Body() body: { ids: number[] }) {
    return this.articleService.batchRemove(body.ids);
  }
}
