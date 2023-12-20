import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto';
import { LoginDto } from '../dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.userService.validateUserRegistration(registerDto);

    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    if (!email || !password) {
      console.log(email, password);
      throw new BadRequestException('VALIDATION_ERROR');
    }

    return await this.authService.login(email, password);
  }
}
