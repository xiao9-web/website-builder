import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleStatus } from './article.entity';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

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
    @Query('sortBy') sortBy: string,
  ) {
    return this.articleService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      status: status as ArticleStatus,
      category_id: category_id ? parseInt(category_id) : undefined,
      keyword,
      sortBy,
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

  // 预览文章（支持草稿状态）
  @Public()
  @Get('preview/:id')
  preview(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Public()
  @Get('tag/:tagSlug')
  async findByTag(
    @Param('tagSlug') tagSlug: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.articleService.findByTag(tagSlug, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
  }

  @Public()
  @Get('search')
  async search(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.articleService.search(keyword, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
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

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }

  @Roles(UserRole.ADMIN)
  @Delete('batch')
  batchRemove(@Body() body: { ids: number[] }) {
    return this.articleService.batchRemove(body.ids);
  }

  // 获取已删除的文章
  @Get('deleted/list')
  findDeleted(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.articleService.findDeleted({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
    });
  }

  // 恢复文章
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.articleService.restore(+id);
  }

  // 批量恢复
  @Put('batch/restore')
  batchRestore(@Body() body: { ids: number[] }) {
    return this.articleService.batchRestore(body.ids);
  }

  // 永久删除
  @Roles(UserRole.ADMIN)
  @Delete(':id/permanent')
  permanentRemove(@Param('id') id: string) {
    return this.articleService.permanentRemove(+id);
  }

  // 批量永久删除
  @Roles(UserRole.ADMIN)
  @Delete('batch/permanent')
  batchPermanentRemove(@Body() body: { ids: number[] }) {
    return this.articleService.batchPermanentRemove(body.ids);
  }

  // 更新文章的菜单关联
  @Put(':id/menus')
  updateArticleMenus(@Param('id') id: string, @Body() body: { menuIds: number[] }) {
    return this.articleService.updateArticleMenus(+id, body.menuIds);
  }

  // 获取文章关联的菜单
  @Get(':id/menus')
  getArticleMenus(@Param('id') id: string) {
    return this.articleService.getArticleMenus(+id);
  }
}
