import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Post()
  deploy(@Body() body: { description?: string }, @Request() req) {
    return this.deployService.deploy(req.user.id, body.description);
  }

  // 发布快照（简化版）
  @Post('publish')
  publishSnapshot(@Body() body: { description?: string }, @Request() req) {
    return this.deployService.publishSnapshot(req.user.id, body.description);
  }

  // 获取当前活跃的快照（公开接口，供前台使用）
  @Public()
  @Get('snapshot/active')
  getActiveSnapshot() {
    return this.deployService.getActiveSnapshot();
  }

  @Get('versions')
  findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.deployService.findAll({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
    });
  }

  @Get('versions/:id')
  findOne(@Param('id') id: string) {
    return this.deployService.findOne(+id);
  }

  @Get('versions/:id/log')
  getLog(@Param('id') id: string) {
    return this.deployService.getLog(+id);
  }

  @Post('versions/:id/rollback')
  rollback(@Param('id') id: string, @Request() req) {
    return this.deployService.rollback(+id, req.user.id);
  }
}
