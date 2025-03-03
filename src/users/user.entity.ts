import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';
import { IsEmail, IsOptional } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @IsOptional()
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];
}
