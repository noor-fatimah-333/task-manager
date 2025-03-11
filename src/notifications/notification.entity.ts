import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  message: string;

  @Column()
  type: string; // e.g., 'task_assigned', 'task_updated'

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
