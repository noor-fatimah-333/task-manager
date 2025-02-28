import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private userService: UsersService,
  ) {}

  getAllTasks() {
    return this.tasksRepository.find();
  }

  createTask(title: string, description?: string, status?: string) {
    const task = this.tasksRepository.create({ title, description, status });
    return this.tasksRepository.save(task);
  }

  getTaskByTitle(title: string) {
    return this.tasksRepository.findOne({ where: { title } });
  }

  getTaskById(id: number) {
    return this.tasksRepository.findOne({ where: { id } });
  }

  deleteTaskById(id: number) {
    return this.tasksRepository.delete(id);
  }

  updateTask(id: number, title: string, description?: string, status?: string) {
    return this.tasksRepository.update(id, {
      title,
      description,
      status,
      updated_at: new Date(),
    });
  }
  async assignTaskToUser(taskId: number, assignee: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const user = await this.userService.findByEmail(assignee);
    if (!user) throw new Error('User not found');

    console.log('task found : ', task);
    task.assignee = user;
    console.log('task assigned : ', task);
    await this.tasksRepository.save(task);
  }

  async unassignTask(taskId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['user'],
    });
    if (!task) throw new Error('Task not found');

    task.assignee = null;
    return this.tasksRepository.save(task);
  }
}
