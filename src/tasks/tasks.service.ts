import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { TaskEventsGateway } from '../task-events/task-events.gateway';
import { NotificationService } from 'src/notifications/notification.service';
import { EmailService } from 'src/notifications/email.service';
import { Cron } from '@nestjs/schedule';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private userService: UsersService,
    private emailService: EmailService,
    private taskEventsGateway: TaskEventsGateway,
    private notificationService: NotificationService,
  ) {}

  getAllTasks() {
    return this.tasksRepository.find({ relations: ['assignee'] });
  }

  async createTask(
    title: string,
    description?: string,
    status?: string,
    due_date?: Date,
    assigneeEmail?: string,
  ) {
    const task = this.tasksRepository.create({
      title,
      description,
      status,
      due_date,
    });
    const savedTask = await this.tasksRepository.save(task);

    if (assigneeEmail) {
      await this.assignTaskToUser(savedTask.id, assigneeEmail);
    }

    return savedTask;
  }

  getTaskByTitle(title: string) {
    return this.tasksRepository.findOne({
      where: { title },
      relations: ['assignee'],
    });
  }

  getTaskById(id: number) {
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['assignee'],
    });
  }

  deleteTaskById(id: number) {
    return this.tasksRepository.delete(id);
  }

  async updateTask(
    id: number,
    title: string,
    description?: string,
    status?: string,
    due_date?: Date,
    assigneeEmail?: string,
  ) {
    let assignee: User | null = null;
    if (assigneeEmail) {
      assignee = await this.userService.findByEmail(assigneeEmail);
    }

    await this.tasksRepository.update(id, {
      title,
      description,
      status,
      due_date,
      assignee,
    });
    const updatedTask = await this.getTaskById(id);

    if (updatedTask) {
      const assignedUserId = updatedTask?.assignee?.id;
      if (assignedUserId) {
        // Send Notification
        await this.notificationService.createNotification(
          assignedUserId,
          `Task "${updatedTask.title}" has been updated.`,
          'task_updated',
        );
      }
    }
    return updatedTask;
  }
  async assignTaskToUser(taskId: number, assignee: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const user = await this.userService.findByEmail(assignee);
    if (!user) throw new Error('User not found');

    task.assignee = user;
    task.assigned_at = new Date();
    await this.tasksRepository.save(task);

    await this.notificationService.createNotification(
      user.id,
      `Task "${task.title}" has been assigned to you.`,
      'task_assigned',
    );
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

  async sendDueDateReminders() {
    const upcomingTasks = await this.tasksRepository.find({
      where: {
        due_date: Between(
          new Date(),
          new Date(Date.now() + 24 * 60 * 60 * 1000),
        ),
      }, // Tasks due in 24 hours
      relations: ['assignee'],
    });

    for (const task of upcomingTasks) {
      if (task?.assignee?.id) {
        const user = await this.userService.findById(task?.assignee?.id);

        if (user) {
          await this.emailService.sendTaskReminder(
            user.email,
            task.title,
            task.due_date ?? new Date(),
          );

          await this.notificationService.createNotification(
            user.id,
            `Reminder: Your task "${task.title}" is due soon.`,
            'task_due',
          );
        }
      }
    }
  }

  // Run every day at 9 AM
  @Cron('0 * * * *')
  async runDailyTaskReminder() {
    console.log('🔔 Running daily task reminder job...');
    await this.sendDueDateReminders();
  }
}
