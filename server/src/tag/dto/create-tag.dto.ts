import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  slug?: string;
}
