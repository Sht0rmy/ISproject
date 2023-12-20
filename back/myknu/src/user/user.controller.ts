import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { RegisterDto, UpdateUserDto } from '../dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list/:type')
  async getUsersByType(
    @Param('type') type: string,
    @Query() query: { q?: string },
  ) {
    if (type !== 'STUDENT' && type !== 'PROFESSOR') {
      throw new BadRequestException('INVALID_USER_TYPE');
    }

    return await this.userService.getUsersByType(type, query.q);
  }

  @Get('all/users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getOneUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getOneUser(id);
  }

  @Post('create')
  async createUser(@Body() registerUserDto: RegisterDto) {
    console.log(registerUserDto);
    await this.userService.validateUserRegistration(registerUserDto);

    return this.userService.createNewUser(registerUserDto);
  }

  @Put('update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
