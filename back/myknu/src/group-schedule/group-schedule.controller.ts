import {
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
import { GroupScheduleService } from './group-schedule.service';
import {
  CreateGroupScheduleDto,
  GetGroupScheduleDto,
  GetGroupScheduleVm,
  UpdateGroupScheduleDto,
} from '../dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('group-schedule')
export class GroupScheduleController {
  constructor(private readonly groupScheduleService: GroupScheduleService) {}

  @Get('list')
  async getMany(
    @Query() getDisciplineDto: GetGroupScheduleDto,
  ): Promise<GetGroupScheduleVm[]> {
    return await this.groupScheduleService.getGroupSchedule(getDisciplineDto);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetGroupScheduleVm> {
    return await this.groupScheduleService.getGroupScheduleById(id);
  }

  @Post('create')
  async create(@Body() disciplineDto: CreateGroupScheduleDto): Promise<void> {
    return await this.groupScheduleService.createGroupSchedule(disciplineDto);
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() disciplineDto: UpdateGroupScheduleDto,
  ): Promise<void> {
    return await this.groupScheduleService.updateGroupSchedule(
      id,
      disciplineDto,
    );
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.groupScheduleService.deleteGroupSchedule(id);
  }
}
