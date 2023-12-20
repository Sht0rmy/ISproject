import { ScheduleListType, GroupScheduleTypeEnum, WeekDayEnum } from '../types';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserVm } from './user.dto';
import { GetGroupVm } from './group.dto';
import { GetDisciplineVm } from './discipline.dto';

export class GroupScheduleDto {
  @Expose()
  id: number;

  @Expose()
  weekDay: WeekDayEnum;

  @Expose()
  lessonNumber: number;

  @Expose()
  type: GroupScheduleTypeEnum;

  @Expose()
  classroom: string;
}

export class CreateGroupScheduleDto extends GroupScheduleDto {
  @Expose()
  @IsNumber()
  disciplineId: number;

  @Expose()
  @IsNumber()
  groupId: number;

  @Expose()
  @IsNumber()
  professorId: number;
}

export type UpdateGroupScheduleDto = Partial<CreateGroupScheduleDto>;

export class GetGroupScheduleDto {
  @Expose()
  @IsOptional()
  name?: string;

  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsOptional()
  @IsEnum(ScheduleListType)
  type?: ScheduleListType;
}

export class GetGroupScheduleVm extends GroupScheduleDto {
  @Expose()
  @Type(() => UserVm)
  professor: UserVm;

  @Expose()
  @Type(() => GetGroupVm)
  group: GetGroupVm;

  @Expose()
  @Type(() => GetDisciplineVm)
  discipline: GetDisciplineVm;
}
