import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Group, User } from '../entities';
import { RegisterDto, UpdateUserDto, UserVm } from '../dto';
import { UserType } from '../types';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  private readonly entityManager: EntityManager;

  constructor(private readonly dataSource: DataSource) {
    this.entityManager = this.dataSource.createEntityManager();
  }

  async isEmailAlreadyExists(email: string) {
    const user = await this.entityManager.findOneBy(User, { email });

    return !!user;
  }

  async getUserByEmail(email: string) {
    return await this.entityManager
      .createQueryBuilder(User, 'user')
      .select(['user', 'user.passwordDigest'])
      .where('user.email = :email', { email })
      .getOne();
  }

  async createUser(registerDto: RegisterDto, passwordDigest: string) {
    const { groupId, ...dto } = registerDto;

    let group;
    if (dto.type === 'STUDENT' && groupId) {
      group = await this.entityManager.findOneBy(Group, { id: groupId });

      if (!group) {
        throw new NotFoundException('GROUP_NOT_FOUND');
      }
    } else {
      group = null;
    }

    const user = this.entityManager.create(User, {
      ...dto,
      passwordDigest,
      group,
    });

    await this.entityManager.save(user);

    return plainToInstance(UserVm, user, { excludeExtraneousValues: true });
  }

  async createNewUser(registerUserDto: RegisterDto) {
    const isEmailExists = await this.isEmailAlreadyExists(
      registerUserDto.email,
    );

    if (isEmailExists) {
      throw new ConflictException('EMAIL_ALREADY_EXISTS');
    }

    const passwordDigest = await this.hashUserPassword(
      registerUserDto.password,
    );

    return this.createUser(registerUserDto, passwordDigest);
  }

  async getUsersByType(type: UserType, q?: string) {
    const query = this.entityManager.createQueryBuilder(User, 'user');

    if (type === 'STUDENT') {
      query.leftJoinAndSelect('user.group', 'group');
    }
    if (q) {
      query.where('user.name ilike :q', { q: `%${q}%` });
    }
    return await query.andWhere('user.type = :type', { type }).getMany();
  }

  async getOneUser(id: number) {
    return await this.entityManager.findOneBy(User, { id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { groupId, ...dto } = updateUserDto;

    const user = await this.entityManager.findOneBy(User, { id });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if (user.email !== dto.email) {
      const isEmailExists = await this.isEmailAlreadyExists(dto.email);

      if (isEmailExists) {
        throw new ConflictException('EMAIL_ALREADY_EXISTS');
      }
    }
    const group = await this.entityManager.findOneBy(Group, { id: groupId });
    if (!group) {
      throw new NotFoundException('GROUP_NOT_FOUND');
    }

    await this.entityManager.update(User, { id }, { ...dto, group });
    return this.entityManager.findOne(User, {
      where: { id: id },
      relations: ['group'],
    });
  }

  async deleteUser(id: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id },
      relations: ['groupSchedules', 'specialCourses'],
    });

    if (!user) {
      throw new NotFoundException('PROFESSOR_NOT_FOUND');
    }

    if (user.type === 'PROFESSOR' && user.groupSchedules.length) {
      throw new ConflictException('PROFESSOR_HAS_DISCIPLINES');
    }

    if (user.type === 'STUDENT' && user.specialCourses.length) {
      throw new ConflictException('STUDENT_HAS_SPECIAL_COURSES');
    }

    await this.entityManager.delete(User, { id });
  }

  async getAllUsers() {
    return await this.entityManager.find(User);
  }

  async hashUserPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compareUserPassword(
    password: string,
    passwordDigest: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordDigest);
  }

  async validateUserRegistration(registerUserDto: RegisterDto): Promise<void> {
    const { name, email, password, type, groupId } = registerUserDto;

    if (!name || !email || !password || !type) {
      console.log(registerUserDto);
      throw new BadRequestException('VALIDATION_ERROR');
    }

    if (type !== 'STUDENT' && type !== 'PROFESSOR' && type !== 'ADMIN') {
      throw new BadRequestException('INVALID_USER_TYPE');
    }

    if (type === 'STUDENT' && !groupId) {
      throw new BadRequestException('GROUP_ID_IS_REQUIRED');
    }

    if ((type === 'PROFESSOR' || type === 'ADMIN') && groupId) {
      throw new BadRequestException('GROUP_FOR_THIS_USER_TYPE_IS_FORBIDDEN');
    }

    const isEmailExists = await this.isEmailAlreadyExists(email);

    if (isEmailExists) {
      throw new BadRequestException('USER_WITH_THIS_EMAIL_ALREADY_EXISTS');
    }
  }
}
