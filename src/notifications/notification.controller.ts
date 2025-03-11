import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  // Mark a notification as read
  @Patch(':notificationId/read')
  async markAsRead(@Param('notificationId') notificationId: number) {
    return this.notificationService.markAsRead(notificationId);
  }

  @Patch('read/:userId')
  async markAllAsRead(@Param('userId') userId : number) {
    return this.notificationService.markAllAsRead(userId);
  }
}
