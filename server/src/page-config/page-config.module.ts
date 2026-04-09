import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageConfig } from './page-config.entity';
import { PageConfigService } from './page-config.service';
import { PageConfigController } from './page-config.controller';
import { ThemeModule } from '../theme/theme.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageConfig]),
    ThemeModule,
  ],
  controllers: [PageConfigController],
  providers: [PageConfigService],
  exports: [PageConfigService],
})
export class PageConfigModule {}
