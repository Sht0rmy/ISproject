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
import { GroupService } from './group.service';
import { GroupDto, GetGroupsDto, GetGroupVm } from '../dto/group.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('list')
  async getGroups(@Query() getGroupsDto: GetGroupsDto): Promise<GetGroupVm[]> {
    return await this.groupService.getGroups(getGroupsDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getGroup(@Param('id', ParseIntPipe) id: number): Promise<GetGroupVm> {
    return await this.groupService.getOneGroup(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() createGroupDto: GroupDto): Promise<void> {
    return await this.groupService.createGroup(createGroupDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createGroupDto: GroupDto,
  ): Promise<void> {
    return await this.groupService.updateGroup(id, createGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.groupService.deleteGroup(id);
  }
}
