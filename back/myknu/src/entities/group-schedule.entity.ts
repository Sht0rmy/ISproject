import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { GroupScheduleTypeEnum, WeekDayEnum } from '../types';
import { Group } from './group.entity';
import { Discipline } from './discipline.entity';

@Entity('group_schedule')
export class GroupSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Discipline, (discipline) => discipline.groupSchedules)
  discipline: Discipline;

  @Column({ type: 'enum', enum: WeekDayEnum })
  weekDay: WeekDayEnum;

  @Column({ type: 'int' })
  lessonNumber: number;

  @ManyToOne(() => Group, (group) => group.groupSchedules)
  group: Group;

  @ManyToOne(() => User, (user) => user.groupSchedules)
  professor: User;

  @Column({ type: 'enum', enum: GroupScheduleTypeEnum })
  type: GroupScheduleTypeEnum;

  @Column({ type: 'varchar' })
  classroom: string;
}
