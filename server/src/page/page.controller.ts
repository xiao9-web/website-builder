import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageStatus } from './page.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto, @Request() req) {
    return this.pageService.create(createPageDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('status') status: string,
    @Query('keyword') keyword: string,
  ) {
    return this.pageService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      status: status !== undefined ? parseInt(status) as PageStatus : undefined,
      keyword,
    });
  }

  @Public()
  @Get('published')
  findPublished(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('keyword') keyword: string,
  ) {
    return this.pageService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      status: PageStatus.PUBLISHED,
      keyword,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(+id);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pageService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(+id, updatePageDto);
  }

  @Public()
  @Patch(':id/view')
  incrementViewCount(@Param('id') id: string) {
    return this.pageService.incrementViewCount(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(+id);
  }
}
