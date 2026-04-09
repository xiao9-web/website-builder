import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { Theme } from './theme.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Public()
  @Get()
  async findAll(): Promise<Theme[]> {
    return this.themeService.findAll();
  }

  @Public()
  @Get('active')
  async findActive(): Promise<Theme> {
    return this.themeService.findActive();
  }

  @Public()
  @Get(':name')
  async findByName(@Param('name') name: string): Promise<Theme> {
    return this.themeService.findByName(name);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: number): Promise<Theme> {
    return this.themeService.activate(id);
  }

  @Put(':id/config')
  async updateConfig(
    @Param('id') id: number,
    @Body() config: Record<string, any>,
  ): Promise<Theme> {
    return this.themeService.updateConfig(id, config);
  }
}
