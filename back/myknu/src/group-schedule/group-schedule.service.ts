import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateGroupScheduleDto,
  GetGroupScheduleDto,
  GetGroupScheduleVm,
  UpdateGroupScheduleDto,
} from '../dto';
import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { Discipline, Group, GroupSchedule, User } from '../entities';
import { plainToInstance } from 'class-transformer';
import { ScheduleListType } from '../types';

@Injectable()
export class GroupScheduleService {
  private readonly entityManager: EntityManager;
  constructor(private readonly dataSource: DataSource) {
    this.entityManager = dataSource.createEntityManager();
  }

  getGroupScheduleQuery(): SelectQueryBuilder<GroupSchedule> {
    return this.entityManager
      .createQueryBuilder(GroupSchedule, 'group-schedule')
      .leftJoinAndSelect('group-schedule.professor', 'professor')
      .leftJoinAndSelect('group-schedule.discipline', 'discipline')
      .leftJoinAndSelect('group-schedule.group', 'group');
  }

  async getGroupSchedule(
    getGroupScheduleDto: GetGroupScheduleDto,
  ): Promise<GetGroupScheduleVm[]> {
    const { id, type, name } = getGroupScheduleDto;
    const query = this.getGroupScheduleQuery();

    if (type === ScheduleListType.Group) {
      query.where('group.id = :id', { id });
    } else if (type === ScheduleListType.Professor) {
      query.where('professor.id = :id', { id });
    }

    if (name) {
      query.andWhere('discipline.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    const disciplines = await query.getMany();

    return plainToInstance(GetGroupScheduleVm, disciplines);
  }

  async getGroupScheduleById(id: number): Promise<GetGroupScheduleVm> {
    const query = this.getGroupScheduleQuery();

    const discipline = await query
      .where('group-schedule.id = :id', { id })
      .getOne();

    return plainToInstance(GetGroupScheduleVm, discipline);
  }

  async createGroupSchedule(
    createGroupScheduleDto: CreateGroupScheduleDto,
  ): Promise<any> {
    const { disciplineId, groupId, professorId } = createGroupScheduleDto;

    const [discipline, group, professor] = await Promise.all([
      this.entityManager.findOneBy(Discipline, { id: disciplineId }),
      this.entityManager.findOneBy(Group, { id: groupId }),
      this.findProfessor(professorId),
    ]);

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    if (!group) {
      throw new NotFoundException('GROUP_NOT_FOUND');
    }

    if (!professor) {
      throw new NotFoundException('PROFESSOR_NOT_FOUND');
    }

    const newGroupSchedule = this.entityManager.create(GroupSchedule, {
      ...createGroupScheduleDto,
      discipline,
      group,
      professor,
    });

    let returnData  =await this.entityManager.save(newGroupSchedule);

    return returnData
  }

  /*async updateGroupSchedule(
    id: number,
    updateGroupScheduleDto: UpdateGroupScheduleDto,
  ): Promise<void> {
    const { professorId, ...disciplineDto } = updateGroupScheduleDto;

    const { id: _id, disciplineId } = disciplineDto;

    const [disciplineByParamId, disciplineByDtoId, professor] =
      await Promise.all([
        this.findGroupSchedule(id),
        this.findGroupSchedule(_id, disciplineId),
        this.findProfessor(professorId),
      ]);

    if (!disciplineByParamId) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    if (disciplineByDtoId && (_id !== id || disciplineByDtoId.id !== id)) {
      throw new ConflictException('DISCIPLINE_WITH_SUCH_ID_ALREADY_EXISTS');
    }

    if (!professor) {
      throw new NotFoundException('PROFESSOR_NOT_FOUND');
    }

    await this.entityManager.update(
      GroupSchedule,
      { id },
      { ...disciplineDto, professor },
    );
  }*/

  async updateGroupSchedule(
    id: number,
    updateGroupScheduleDto: UpdateGroupScheduleDto,
  ): Promise<void> {
    const { disciplineId, groupId, professorId, ...dto } =
      updateGroupScheduleDto;

    const groupSchedule = await this.entityManager.findOne(GroupSchedule, {
      where: { id },
      relations: ['discipline', 'group', 'professor'],
    });

    if (!groupSchedule) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }
    const [discipline, group, professor] = await Promise.all([
      disciplineId
        ? this.entityManager.findOneBy(Discipline, { id: disciplineId })
        : groupSchedule.discipline,
      groupId
        ? this.entityManager.findOneBy(Group, { id: groupId })
        : groupSchedule.group,
      professorId ? this.findProfessor(professorId) : groupSchedule.professor,
    ]);

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    if (!group) {
      throw new NotFoundException('GROUP_NOT_FOUND');
    }

    if (!professor) {
      throw new NotFoundException('PROFESSOR_NOT_FOUND');
    }

    await this.entityManager.update(
      GroupSchedule,
      { id },
      {
        ...dto,
        discipline,
        group,
        professor,
      },
    );
  }

  async deleteGroupSchedule(id: number): Promise<void> {
    const discipline = await this.entityManager.findOneBy(GroupSchedule, {
      id,
    });

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    await this.entityManager.delete(GroupSchedule, { id });
  }

  async findGroupSchedule(
    id: number,
    disciplineId?: string,
  ): Promise<GroupSchedule | null> {
    const query = this.entityManager
      .createQueryBuilder(GroupSchedule, 'group-schedule')
      .where('group-schedule.id = :id', { id });

    if (disciplineId) {
      query.orWhere('group-schedule.disciplineId = :disciplineId', {
        disciplineId,
      });
    }

    return await query.getOne();
  }

  async findProfessor(id: number): Promise<User | null> {
    return await this.entityManager.findOneBy(User, { id, type: 'PROFESSOR' });
  }
}
