import { Module } from '@nestjs/common';
import { GroupScheduleController } from './group-schedule/group-schedule.controller';
import { GroupScheduleService } from './group-schedule/group-schedule.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import getTypeOrmModule from './get-typeorm-config';
import { JwtService } from '@nestjs/jwt';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { UserController } from './user/user.controller';

import { DisciplineController } from './discipline/discipline.controller';
import { DisciplineService } from './discipline/discipline.service';
import { InitService } from './init/init.service';
import { SpecialCourseController } from './special-course/special-course.controller';
import { SpecialCourseService } from './special-course/special-course.service';

@Module({
  imports: [getTypeOrmModule()],
  controllers: [
    GroupScheduleController,
    AuthController,
    GroupController,
    UserController,
    DisciplineController,
    SpecialCourseController,
  ],
  providers: [
    GroupScheduleService,
    AuthService,
    UserService,
    JwtService,
    GroupService,
    DisciplineService,
    InitService,
    SpecialCourseService,
  ],
})
export class AppModule {}
