import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserVm } from './user.dto';

export class SpecialCourseDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  classroom: string;

  @Expose()
  @IsNumber()
  professorId: number;


  @Expose()
  @IsNumber()
  hours: number;

  @Expose()
  @IsNumber()
  creditsAmount: number;
}

export class CreateSpecialCourseDto extends SpecialCourseDto {}

export type UpdateSpecialCourseDto = Partial<SpecialCourseDto>;

export class GetCoursesDto {
  @Expose()
  @IsString()
  @IsOptional()
  q?: string;
}

export class SpecialCourseVm extends SpecialCourseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @Type(() => UserVm)
  professor: UserVm;

  @Expose()
  @Type(() => UserVm)
  listeners: UserVm[];
}

export class AddListenerDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}

export type RemoveListenerDto = AddListenerDto;

export class StudentsWithSpecialCoursesDto extends UserVm {
  @Expose()
  @Type(() => SpecialCourseVm)
  specialCourses: SpecialCourseVm[];
}
