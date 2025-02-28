import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'Not Started' })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  due_date?: Date | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  assignee?: User | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  assigned_at?: Date | null;
}
