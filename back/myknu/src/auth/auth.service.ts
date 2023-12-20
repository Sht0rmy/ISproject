import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto, UserVm } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { secret } from './auth.constants';
import { plainToInstance } from 'class-transformer';

interface Payload {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const passwordDigest = await this.userService.hashUserPassword(password);

    const user = await this.userService.createUser(registerDto, passwordDigest);

    const { id, name } = user;

    const payload: Payload = {
      id,
      name,
      email,
    };

    const jwtToken = await this.jwtService.signAsync(payload, {
      secret,
    });

    return {
      token: 'Bearer ' + jwtToken,
      user,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('USER_NOT_FOUND');
    }

    const isPasswordValid = await this.userService.compareUserPassword(
      password,
      user.passwordDigest,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('INVALID_PASSWORD');
    }

    const { id, name } = user;

    const payload: Payload = {
      id,
      name,
      email,
    };

    const jwtToken = await this.jwtService.signAsync(payload, {
      secret,
    });

    return {
      token: 'Bearer ' + jwtToken,
      user: plainToInstance(UserVm, user, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
