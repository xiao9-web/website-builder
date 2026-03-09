import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { ConfigGroup } from './site-config.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  findAll(@Query('group') group: string) {
    return this.siteConfigService.findAll(group as ConfigGroup);
  }

  @Public()
  @Get('public')
  findPublic() {
    return this.siteConfigService.findPublic();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.siteConfigService.findByKey(key);
  }

  @Post()
  setValue(@Body() body: { key: string; value: any; description?: string }) {
    return this.siteConfigService.setValue(body.key, body.value, body.description);
  }

  @Post('batch')
  batchUpdate(@Body() body: Record<string, any>) {
    return this.siteConfigService.batchUpdate(body);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.siteConfigService.remove(key);
  }
}
