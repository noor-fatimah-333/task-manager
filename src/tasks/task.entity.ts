import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;
    
  @Column({default : 'Not Started'})
  status: string;

  @ManyToOne(() => User, user => user.tasks) // Define the many-to-one relationship
  user: User; // Reference to the user assigned to the task
  
}
