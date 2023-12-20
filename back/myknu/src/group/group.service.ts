import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Group, Discipline } from '../entities';
import { GroupDto, GetGroupsDto, GetGroupVm } from '../dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GroupService {
  private readonly groupRepository: Repository<Group>;
  private readonly entityManager: EntityManager;

  constructor(private readonly dataSource: DataSource) {
    this.groupRepository = this.dataSource.getRepository(Group);
    this.entityManager = this.dataSource.createEntityManager();
  }

  async getGroups(getGroupsDto: GetGroupsDto): Promise<GetGroupVm[]> {
    const query = this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.groupSchedules', 'group-schedule');

    if (getGroupsDto.name) {
      query.where('group.name ILIKE :name', { name: `%${getGroupsDto.name}%` });
    }

    const groups = await query.getMany();

    return plainToInstance(GetGroupVm, groups);
  }

  async getOneGroup(id: number): Promise<GetGroupVm> {
    const group = await this.groupRepository.findOneBy({ id });

    return plainToInstance(GetGroupVm, group);
  }

  async createGroup(createGroupDto: GroupDto): Promise<void> {
    const group = await this.groupRepository.findOneBy({
      name: createGroupDto.name,
    });

    if (group) {
      throw new ConflictException('GROUP_WITH_THIS_NAME_ALREADY_EXISTS');
    }

    const disciplines = await this.entityManager.find(Discipline, {
      where: {
        id: In(createGroupDto.disciplinesIds),
      },
    });

    if (disciplines.length !== createGroupDto.disciplinesIds.length) {
      throw new ConflictException('DISCIPLINES_NOT_FOUND');
    }

    await this.entityManager.transaction(async (transactionalManager) => {
      const newGroup = await transactionalManager.save(
        transactionalManager.create(Group, createGroupDto),
      );

      await transactionalManager
        .createQueryBuilder()
        .relation(Group, 'disciplines')
        .of(newGroup)
        .add(disciplines);
    });
  }

  async updateGroup(id: number, createGroupDto: GroupDto): Promise<void> {
    const [groupById, groupByName] = await Promise.all([
      this.groupRepository.findOneBy({ id }),
      this.groupRepository
        .createQueryBuilder('group')
        .where('group.name = :name', { name: createGroupDto.name })
        .andWhere('group.id != :id', { id })
        .getOne(),
    ]);

    if (!groupById) {
      throw new NotFoundException('GROUP_NOT_FOUND');
    }

    if (groupByName) {
      throw new ConflictException('GROUP_WITH_THIS_NAME_ALREADY_EXISTS');
    }

    await this.groupRepository.update(id, createGroupDto);
  }

  async deleteGroup(id: number): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('GROUP_NOT_FOUND');
    }

    if (group.users.length) {
      throw new ConflictException('GROUP_HAS_STUDENTS');
    }

    await this.groupRepository.delete(id);
  }
}
