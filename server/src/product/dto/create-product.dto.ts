import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
