import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : value)
  @Type(() => Number)
  category_id?: number | null;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : value)
  @Type(() => Number)
  article_id?: number | null;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : value)
  @Type(() => Number)
  parent_id?: number | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sort?: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsBoolean()
  @IsOptional()
  is_visible?: boolean;
}
