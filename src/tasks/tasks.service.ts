import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  createTask(title: string, description : string) {
    const task = this.tasksRepository.create({title, description});
    return this.tasksRepository.save(task);
  }
}
