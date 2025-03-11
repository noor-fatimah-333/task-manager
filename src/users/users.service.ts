import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findUsersByEmails(emails: string[]): Promise<User[]> {
    return this.usersRepository.find({ where: { email: In(emails) } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const newUser = this.usersRepository.create({
      email,
      password,
    });
    return this.usersRepository.save(newUser);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  getAllUsers() {
    return this.usersRepository.find();
  }

  updateUser(id: number, email?: string, tasks?: Task[]) {
    return this.usersRepository.update(id, { email, tasks });
  }

  getAssignedTasks(userId: number) {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['tasks'],
    });
  }
}
