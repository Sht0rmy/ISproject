import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupSchedule } from './group-schedule.entity';
import { Group } from './group.entity';

@Entity('disciplines')
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'float' })
  amountOfHours: number;

  @Column({ type: 'float' })
  amountOfCredits: number;

  @OneToMany(() => GroupSchedule, (groupSchedule) => groupSchedule.discipline)
  groupSchedules: GroupSchedule[];

  @ManyToMany(() => Group, (group) => group.disciplines)
  @JoinTable({ name: 'disciplines_groups' })
  groups: Group[];
}
