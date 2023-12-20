import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Not } from 'typeorm';
import {
  DisciplineDto,
  GetDisciplineDto,
  GetDisciplineVm,
  UpdateDisciplineDto,
} from '../dto';
import { Discipline } from '../entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DisciplineService {
  private readonly entityManager: EntityManager;

  constructor(private readonly dataSource: DataSource) {
    this.entityManager = dataSource.createEntityManager();
  }

  async getDisciplines({ q }: GetDisciplineDto) {
    const query = this.entityManager.createQueryBuilder(
      Discipline,
      'discipline',
    );

    if (q) {
      query.where('discipline.name ILIKE :name', {
        name: `%${q}%`,
      });
    }

    const disciplines = await query.getMany();

    return plainToInstance(GetDisciplineVm, disciplines);
  }

  async getDisciplineById(id: number): Promise<GetDisciplineVm> {
    const discipline = await this.entityManager.findOneBy(Discipline, { id });

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    return plainToInstance(GetDisciplineVm, discipline);
  }

  async createDiscipline(createDisciplineDto: DisciplineDto) {
    const discipline = await this.entityManager.findOneBy(Discipline, {
      name: createDisciplineDto.name,
    });

    if (discipline) {
      throw new ConflictException('DISCIPLINE_WITH_THIS_NAME_ALREADY_EXISTS');
    }

    await this.entityManager.save(
      this.entityManager.create(Discipline, createDisciplineDto),
    );
    return  this.entityManager.findOneBy(Discipline, {
      name: createDisciplineDto.name,
    });

  }

  async updateDiscipline(
    id: number,
    updateDisciplineDto: UpdateDisciplineDto,
  ): Promise<Discipline> {
    const discipline = await this.entityManager.findOneBy(Discipline, { id });

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    const disciplineWithSameName = await this.entityManager.findOneBy(
      Discipline,
      {
        name: updateDisciplineDto.name,
        id: Not(id),
      },
    );

    if (disciplineWithSameName) {
      throw new ConflictException('DISCIPLINE_WITH_THIS_NAME_ALREADY_EXISTS');
    }

    await this.entityManager.update(Discipline, { id }, updateDisciplineDto);
    return await this.entityManager.findOneBy(Discipline, { id });

  }

  async deleteDiscipline(id: number): Promise<void> {
    const discipline = await this.entityManager.findOne(Discipline, {
      where: { id },
      relations: ['groupSchedules', 'groups'],
    });

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    if (discipline.groupSchedules.length) {
      throw new ConflictException('DISCIPLINE_HAS_GROUP_SCHEDULES');
    }

    await this.entityManager.delete(Discipline, { id });
  }
}
