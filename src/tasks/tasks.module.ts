import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { UsersModule } from '../users/users.module';
import { EventsModule } from 'src/task-events/task-events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, EventsModule],
  controllers: [TasksController],
  providers: [TasksService, EventsModule],
  exports: [TasksService],
})
export class TasksModule {}
