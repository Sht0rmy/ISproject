import { IsEmail, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  @IsEmail()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  password: string;
}
