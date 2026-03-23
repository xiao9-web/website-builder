import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleVersion } from './article-version.entity';
import { ArticleVersionService } from './article-version.service';
import { ArticleMenu } from './article-menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleVersion, ArticleMenu])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleVersionService],
  exports: [ArticleService, ArticleVersionService],
})
export class ArticleModule {}
