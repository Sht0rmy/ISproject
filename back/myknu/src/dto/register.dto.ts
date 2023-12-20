import { Expose } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import { UserType } from '../types';

export class RegisterDto {
  @Expose()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  password: string;

  @Expose()
  type: UserType;

  @Expose()
  @IsOptional()
  groupId?: number;
}
