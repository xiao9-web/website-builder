import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get('tree')
  findTree() {
    return this.menuService.findTree();
  }

  @Public()
  @Get('published')
  findPublished() {
    return this.menuService.findPublished();
  }

  @Public()
  @Get(':id/articles')
  async getMenuArticles(@Param('id') id: string) {
    return this.menuService.getMenuArticles(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Put('sort')
  updateSort(@Body() body: { ids: number[] }) {
    return this.menuService.updateSort(body.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
