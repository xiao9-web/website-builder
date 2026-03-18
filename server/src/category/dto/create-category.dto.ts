import { IsString, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  parent_id?: number;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
