import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { PageConfigService } from './page-config.service';
import { PageConfig } from './page-config.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('page-configs')
export class PageConfigController {
  constructor(private readonly pageConfigService: PageConfigService) {}

  @Public()
  @Get()
  async findByTheme(@Query('themeId') themeId: number): Promise<PageConfig[]> {
    return this.pageConfigService.findByTheme(themeId);
  }

  @Public()
  @Get(':pageType')
  async findByThemeAndType(
    @Query('themeId') themeId: number,
    @Param('pageType') pageType: string,
  ): Promise<PageConfig> {
    return this.pageConfigService.findByThemeAndType(themeId, pageType);
  }

  @Put(':pageType')
  async updateConfig(
    @Query('themeId') themeId: number,
    @Param('pageType') pageType: string,
    @Body() config: Record<string, any>,
  ): Promise<PageConfig> {
    return this.pageConfigService.updateConfig(themeId, pageType, config);
  }
}
