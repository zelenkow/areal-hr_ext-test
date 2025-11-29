import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsNumber()
  @IsNotEmpty()
  organization_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
