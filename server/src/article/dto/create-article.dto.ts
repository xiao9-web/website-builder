import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ArticleStatus } from '../article.entity';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsInt()
  @IsOptional()
  category_id?: number;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  seo_title?: string;

  @IsString()
  @IsOptional()
  seo_description?: string;

  @IsString()
  @IsOptional()
  seo_keywords?: string;

  @IsOptional()
  published_at?: Date;

  @IsOptional()
  scheduled_at?: Date;
}
