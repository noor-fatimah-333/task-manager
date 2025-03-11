import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { Notification } from './notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEventsGateway } from 'src/task-events/task-events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService, EmailService, TaskEventsGateway],
  exports: [NotificationService, EmailService],
})
export class NotificationModule {}
