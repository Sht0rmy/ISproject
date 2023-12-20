import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DisciplineDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  amountOfHours: number;

  @Expose()
  @IsNumber()
  amountOfCredits: number;
}

export class GetDisciplineDto {
  @Expose()
  @IsString()
  @IsOptional()
  q?: string;
}

export class GetDisciplineVm extends DisciplineDto {
  @Expose()
  @IsNumber()
  id: number;
}

export type UpdateDisciplineDto = Partial<DisciplineDto>;
