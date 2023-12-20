import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import {
  AddListenerDto,
  CreateSpecialCourseDto,
  GetCoursesDto,
  RemoveListenerDto,
  SpecialCourseVm,
  StudentsWithSpecialCoursesDto,
  UpdateSpecialCourseDto,
} from '../dto';
import { SpecialCourse, User } from '../entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SpecialCourseService {
  private readonly specialCourseRepository: Repository<SpecialCourse>;
  private readonly userRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.specialCourseRepository = this.dataSource.getRepository(SpecialCourse);
    this.userRepository = this.dataSource.getRepository(User);
  }

  async getCourses(getCoursesDto: GetCoursesDto): Promise<SpecialCourseVm[]> {
    const query = this.specialCourseRepository
      .createQueryBuilder('specialCourse')
      .leftJoinAndSelect('specialCourse.professor', 'professor')
      .leftJoinAndSelect('specialCourse.listeners', 'listeners');

    if (getCoursesDto.q) {
      const filter = `%${getCoursesDto.q}%`;

      query
        .where('specialCourse.name ILIKE :filter', { filter })
        .orWhere('professor.name ILIKE :filter', { filter });
    }

    const courses = await query.getMany();

    return plainToInstance(SpecialCourseVm, courses, {
      excludeExtraneousValues: true,
    });
  }

  async getCourse(id: number): Promise<SpecialCourseVm> {
    const course = await this.specialCourseRepository.findOne({
      where: { id },
      relations: ['professor', 'listeners'],
    });

    if (!course) {
      throw new NotFoundException('COURSE_NOT_FOUND');
    }

    return plainToInstance(SpecialCourseVm, course, {
      excludeExtraneousValues: true,
    });
  }

  async createSpecialCourse(
    createDto: CreateSpecialCourseDto,
  ): Promise<SpecialCourseVm> {
    const { professorId } = createDto;

    const professor = await this.userRepository.findOneBy({
      id: professorId,
      type: 'PROFESSOR',
    });

    if (!professor) {
      throw new NotFoundException('PROFESSOR_NOT_FOUND');
    }

    const newCourse = await this.specialCourseRepository.save(
      this.specialCourseRepository.create({
        ...createDto,
        professor,
      }),
    );

    const specialCourse = await this.specialCourseRepository.findOne({
      where: { id: newCourse.id },
      relations: ['professor', 'listeners'],
    });

    return plainToInstance(SpecialCourseVm, specialCourse, {
      excludeExtraneousValues: true,
    });
  }

  async updateSpecialCourse(
    id: number,
    updateDto: UpdateSpecialCourseDto,
  ): Promise<SpecialCourseVm> {
    const { professorId, ...dto } = updateDto;

    const specialCourse = await this.specialCourseRepository.findOneBy({ id });

    if (!specialCourse) {
      throw new NotFoundException('COURSE_NOT_FOUND');
    }

    const professor = await this.userRepository.findOneBy({
      id: professorId,
      type: 'PROFESSOR',
    });

    if (!professor) {
      throw new NotFoundException('PROFESSOR_NOT_FOUND');
    }

    await this.specialCourseRepository.update(id, {
      ...specialCourse,
      ...dto,
      professor,
    });

    const updatedCourse = await this.specialCourseRepository.findOne({
      where: { id },
      relations: ['professor', 'listeners'],
    });

    return plainToInstance(SpecialCourseVm, updatedCourse, {
      excludeExtraneousValues: true,
    });
  }

  async deleteSpecialCourse(id: number): Promise<void> {
    const specialCourse = await this.specialCourseRepository.findOneBy({ id });

    if (!specialCourse) {
      throw new NotFoundException('COURSE_NOT_FOUND');
    }

    await this.specialCourseRepository.remove(specialCourse);
  }

  async getListeners({
    q,
  }: GetCoursesDto): Promise<StudentsWithSpecialCoursesDto[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.specialCourses', 'specialCourses')
      .leftJoinAndSelect('user.group', 'group')
      .where('user.type = :type', { type: 'STUDENT' })
      .andWhere('specialCourses.id IS NOT NULL');

    if (q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('user.name ILIKE :filter', { filter: `%${q}%` })
            .orWhere('user.email ILIKE :filter', { filter: `%${q}%` })
            .orWhere('specialCourses.name ILIKE :filter', { filter: `%${q}%` })
            .orWhere('group.name ILIKE :filter', { filter: `%${q}%` });
        }),
      );
    }

    const users = await query.getMany();

    return plainToInstance(StudentsWithSpecialCoursesDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async addListenerToCourse(
    addListenerDto: AddListenerDto,
  ): Promise<SpecialCourseVm> {
    const [specialCourse, student] =
      await this.getSpecialCourseAndStudent(addListenerDto);

    if (!specialCourse) {
      throw new NotFoundException('COURSE_NOT_FOUND');
    }

    if (!student) {
      throw new NotFoundException('STUDENT_NOT_FOUND');
    }

    if (specialCourse.listeners.some((l) => l.id === student.id)) {
      throw new ConflictException('STUDENT_ALREADY_LISTENING_THIS_COURSE');
    }

    await this.specialCourseRepository
      .createQueryBuilder()
      .relation(SpecialCourse, 'listeners')
      .of(specialCourse)
      .add(student);

    const updatedCourse = await this.specialCourseRepository.findOne({
      where: {
        id: addListenerDto.courseId,
      },
      relations: ['professor', 'listeners'],
    });

    return plainToInstance(SpecialCourseVm, updatedCourse, {
      excludeExtraneousValues: true,
    });
  }

  async removeListenerFromCourse(
    removeListenerDto: RemoveListenerDto,
  ): Promise<SpecialCourseVm> {
    const [specialCourse, student] =
      await this.getSpecialCourseAndStudent(removeListenerDto);

    if (!specialCourse) {
      throw new NotFoundException('COURSE_NOT_FOUND');
    }

    if (!student) {
      throw new NotFoundException('STUDENT_NOT_FOUND');
    }

    if (!specialCourse.listeners.some((l) => l.id === student.id)) {
      throw new ConflictException('STUDENT_NOT_LISTENING_THIS_COURSE');
    }

    await this.specialCourseRepository
      .createQueryBuilder()
      .relation(SpecialCourse, 'listeners')
      .of(specialCourse)
      .remove(student);

    const updatedCourse = await this.specialCourseRepository.findOne({
      where: {
        id: removeListenerDto.courseId,
      },
      relations: ['professor', 'listeners'],
    });

    return plainToInstance(SpecialCourseVm, updatedCourse, {
      excludeExtraneousValues: true,
    });
  }

  async getSpecialCourseAndStudent(
    dto: AddListenerDto | RemoveListenerDto,
  ): Promise<[SpecialCourse | null, User | null]> {
    const { courseId, studentId } = dto;

    return await Promise.all([
      this.specialCourseRepository.findOne({
        where: { id: courseId },
        relations: ['listeners'],
      }),
      this.userRepository.findOneBy({
        id: studentId,
        type: 'STUDENT',
      }),
    ]);
  }
}
