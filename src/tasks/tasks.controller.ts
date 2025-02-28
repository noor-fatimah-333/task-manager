import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.entity';
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, assigneeEmail, due_date } =
      createTaskDto;

    return this.tasksService.createTask(
      title,
      description,
      status,
      due_date,
      assigneeEmail,
    );
  }

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('titled')
  getTaskByTitle(@Query('title') title: string) {
    return this.tasksService.getTaskByTitle(title);
  }

  @Get(':id')
  getTaskById(@Param('id') id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: number) {
    return this.tasksService.deleteTaskById(id);
  }
  @Patch(':id')
  updateTask(@Param('id') id: number, @Body() updateTaskDto: CreateTaskDto) {
    const { title, description, status, due_date } = updateTaskDto;
    return this.tasksService.updateTask(
      id,
      title,
      description,
      status,
      due_date,
    );
  }

  @Patch(':id/assign')
  async assignTaskToUsers(
    @Param('id') id: number,
    @Body('assignee') assignee: string,
  ): Promise<void> {
    return this.tasksService.assignTaskToUser(id, assignee);
  }

  @Patch(':taskId/unassign')
  async unassignTask(@Param('taskId') taskId: number) {
    return this.tasksService.unassignTask(taskId);
  }
}
