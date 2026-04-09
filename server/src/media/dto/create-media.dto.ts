import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MediaType } from '../media.entity';

export class CreateMediaDto {
  @IsString()
  filename: string;

  @IsString()
  original_name: string;

  @IsString()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  @IsString()
  mime_type?: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  width?: number;

  @IsOptional()
  height?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
