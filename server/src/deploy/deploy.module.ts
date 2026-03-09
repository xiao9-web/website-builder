import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeployVersion } from './deploy.entity';
import { DeployService } from './deploy.service';
import { DeployController } from './deploy.controller';
import { SiteConfigModule } from '../site-config/site-config.module';
import { MenuModule } from '../menu/menu.module';
import { ArticleModule } from '../article/article.module';
import { PageModule } from '../page/page.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeployVersion]),
    SiteConfigModule,
    MenuModule,
    ArticleModule,
    PageModule,
  ],
  controllers: [DeployController],
  providers: [DeployService],
  exports: [DeployService],
})
export class DeployModule {}
