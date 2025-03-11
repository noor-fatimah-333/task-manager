import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { UsersModule } from '../users/users.module';
import { EventsModule } from 'src/task-events/task-events.module';
import { EmailService } from 'src/notifications/email.service';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    EventsModule,
    NotificationModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  //, EventsModule, NotificationModule],
  exports: [TasksService],
})
export class TasksModule {}
