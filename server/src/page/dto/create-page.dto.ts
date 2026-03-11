import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { PageStatus } from '../page.entity';

export class CreatePageDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsObject()
  @IsOptional()
  layout_config?: any;

  @IsEnum(PageStatus)
  @IsOptional()
  status?: PageStatus;

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
}
