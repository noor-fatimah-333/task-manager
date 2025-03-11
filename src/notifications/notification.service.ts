import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { TaskEventsGateway } from 'src/task-events/task-events.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private taskEventsGateway: TaskEventsGateway,
  ) {}

  async createNotification(userId: number, message: string, type: string) {
    const notification = this.notificationRepo.create({
      user: { id: userId },
      message,
      type,
    });
    await this.notificationRepo.save(notification);

    // Send WebSocket Notification to the User
    this.taskEventsGateway.notifyUserTaskUpdated(userId, {
      message,
      type,
    });

    return notification;
  }

  async getUserNotifications(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
