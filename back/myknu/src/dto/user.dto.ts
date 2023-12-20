import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserType } from '../types';
import { GetGroupVm } from './group.dto';

export class UserVm {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  type: UserType;

  @Expose()
  @IsOptional()
  @Type(() => GetGroupVm)
  group?: GetGroupVm;
}

export class UpdateUserDto {
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Expose()
  @IsOptional()
  type?: UserType;

  @Expose()
  @IsOptional()
  groupId?: number;
}
