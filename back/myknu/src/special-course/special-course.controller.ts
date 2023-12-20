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
import { SpecialCourseService } from './special-course.service';
import {
  AddListenerDto,
  CreateSpecialCourseDto,
  GetCoursesDto,
  RemoveListenerDto,
  SpecialCourseVm,
  UpdateSpecialCourseDto,
} from '../dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('special-course')
export class SpecialCourseController {
  constructor(private readonly specialCourseService: SpecialCourseService) {}

  @Get('list')
  async getCourses(
    @Query() getManyDto: GetCoursesDto,
  ): Promise<SpecialCourseVm[]> {
    return this.specialCourseService.getCourses(getManyDto);
  }

  @Get(':id')
  async getCourse(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SpecialCourseVm> {
    return this.specialCourseService.getCourse(id);
  }

  @Post('create')
  async create(
    @Body() createDto: CreateSpecialCourseDto,
  ): Promise<SpecialCourseVm> {
    return this.specialCourseService.createSpecialCourse(createDto);
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSpecialCourseDto,
  ): Promise<SpecialCourseVm> {
    return await this.specialCourseService.updateSpecialCourse(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.specialCourseService.deleteSpecialCourse(id);
  }

  @Get('list/listeners')
  async getListeners(@Query() dto: GetCoursesDto) {
    return await this.specialCourseService.getListeners(dto);
  }

  @Post('add-listener')
  async addListener(
    @Body() addListenerDto: AddListenerDto,
  ): Promise<SpecialCourseVm> {
    return await this.specialCourseService.addListenerToCourse(addListenerDto);
  }

  @Post('remove-listener')
  async removeListener(
    @Body() removeListenerDto: RemoveListenerDto,
  ): Promise<SpecialCourseVm> {
    return await this.specialCourseService.removeListenerFromCourse(
      removeListenerDto,
    );
  }
}
