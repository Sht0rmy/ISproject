import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupSchedule } from './group-schedule.entity';
import { Group } from './group.entity';
import { UserType } from '../types';
import { SpecialCourse } from './special-course.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar' })
  name: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Index()
  @Column({ type: 'varchar', select: false })
  passwordDigest: string;

  @Column({ type: 'varchar' })
  type: UserType;

  @ManyToOne(() => Group, (group) => group.users, { nullable: true })
  group?: Group;

  @OneToMany(() => GroupSchedule, (discipline) => discipline.professor)
  groupSchedules: GroupSchedule[];

  @ManyToMany(() => SpecialCourse, (specialCourse) => specialCourse.listeners, {
    nullable: true,
  })
  specialCourses: SpecialCourse[];
}
