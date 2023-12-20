import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import {
  DisciplineDto,
  GetDisciplineDto,
  GetDisciplineVm,
  UpdateDisciplineDto,
} from '../dto';
import { AuthGuard } from '../auth/auth.guard';
import {Discipline} from "../entities";

@UseGuards(AuthGuard)
@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Get('list')
  async getDisciplines(
    @Query() getDisciplineDto: GetDisciplineDto,
  ): Promise<GetDisciplineVm[]> {
    return await this.disciplineService.getDisciplines(getDisciplineDto);
  }

  @Get(':id')
  async getDisciplineById(id: number): Promise<GetDisciplineVm> {
    return await this.disciplineService.getDisciplineById(id);
  }

  @Post('create')
  async create(@Body() createDisciplineDto: DisciplineDto): Promise<Discipline> {
    return this.disciplineService.createDiscipline(createDisciplineDto);
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDisciplineDto: UpdateDisciplineDto,
  ): Promise<Discipline> {
    return  this.disciplineService.updateDiscipline(id, updateDisciplineDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.disciplineService.deleteDiscipline(id);
  }
}
