// create-perfume.dto.ts
import { IsString } from 'class-validator';

export class UpdatePerfumeDto {
  @IsString() name: string;
  @IsString() brand: string;
  @IsString() gender: string;
  @IsString() category: string;
  @IsString() mood: string;
  @IsString() topNote: string;
  @IsString() middleNote: string;
  @IsString() baseNote: string;
  @IsString() countryOfOrigin: string;
  @IsString() description: string;
}
