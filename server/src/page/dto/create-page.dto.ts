import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

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
