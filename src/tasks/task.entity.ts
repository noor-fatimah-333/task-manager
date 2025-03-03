import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

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

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  due_date?: Date | null;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  assigned_at?: Date | null;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  assignee?: User | null;
}
