import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('special_courses')
export class SpecialCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  classroom: string;

  @ManyToOne(() => User)
  professor: User;

  @Column({ type: 'float' })
  hours: number;

  @Column({ type: 'float' })
  creditsAmount: number;

  @ManyToMany(() => User, (user) => user.specialCourses, {
    nullable: true,
  })
  @JoinTable({ name: 'special_courses_listeners' })
  listeners: User[];
}
