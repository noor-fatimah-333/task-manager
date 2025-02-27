import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
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
    return this.tasksRepository.update(id, { title, description, status });
  }
}
