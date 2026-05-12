import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleVersion } from './article-version.entity';
import { ArticleVersionService } from './article-version.service';
import { ArticleMenu } from './article-menu.entity';
import { ArticleTag } from './article-tag.entity';
import { Tag } from '../tag/tag.entity';
import { ArticleSchedulerService } from './article-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleVersion, ArticleMenu, ArticleTag, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleVersionService, ArticleSchedulerService],
  exports: [ArticleService, ArticleVersionService],
})
export class ArticleModule {}
