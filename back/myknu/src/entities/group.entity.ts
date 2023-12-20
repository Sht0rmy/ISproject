import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { GroupSchedule } from './group-schedule.entity';
import { JoinTable } from 'typeorm';
import { Discipline } from './discipline.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.group)
  users: User[];

  @ManyToMany(() => Discipline, (discipline) => discipline.groups, {
    nullable: true,
    eager: true,
  })
  @JoinTable({ name: 'disciplines_groups' })
  disciplines: Discipline[];

  @OneToMany(() => GroupSchedule, (groupSchedule) => groupSchedule.group)
  groupSchedules: GroupSchedule[];
}
