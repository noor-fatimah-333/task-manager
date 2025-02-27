import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.tasks, { eager: true }) // Ensuring relation fetches user details
  user?: User;
}
