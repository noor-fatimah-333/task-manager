import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.entity';
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return { message: 'This is a protected route' };
  }

  @Post('create')
  createTask(@Body() newTaskDTO: CreateTaskDto): Promise<Task> {
    const { title, description } = newTaskDTO;
    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    return this.tasksService.createTask(title, description);
  }
}
