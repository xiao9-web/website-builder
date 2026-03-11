import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @IsNumber()
  @IsOptional()
  sort_order?: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  target?: string;
}
