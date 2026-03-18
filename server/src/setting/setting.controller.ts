import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('setting')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  findAll(@Query('group') group?: string) {
    if (group) {
      return this.settingService.findByGroup(group);
    }
    return this.settingService.findAll();
  }

  @Public()
  @Get('public')
  async getPublicSettings() {
    // 只返回公开的设置
    const settings = await this.settingService.findByGroup('basic');
    const publicSettings = settings.filter(s =>
      ['site_name', 'site_description', 'site_keywords', 'site_logo', 'site_favicon', 'icp_number'].includes(s.key)
    );

    return publicSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.settingService.findOne(key);
  }

  @Put(':key')
  update(@Param('key') key: string, @Body('value') value: any) {
    return this.settingService.update(key, value);
  }

  @Put()
  batchUpdate(@Body() settings: { key: string; value: any }[]) {
    return this.settingService.batchUpdate(settings);
  }

  @Get('init/defaults')
  initDefaults() {
    return this.settingService.initDefaultSettings();
  }
}
