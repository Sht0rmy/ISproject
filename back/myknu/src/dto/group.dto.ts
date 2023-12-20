import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class GroupDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsArray()
  disciplinesIds: number[];
}

export class GetGroupsDto {
  @Expose()
  @IsOptional()
  name?: string;
}

export class GetGroupVm extends GroupDto {
  @Expose()
  id: number;
}
