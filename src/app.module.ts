import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './task-events/task-events.module';
import { NotificationController } from './notifications/notification.controller';
import { EmailService } from './notifications/email.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notifications/notification.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventsModule,
    UsersModule,
    AuthModule,
    TasksModule,
    NotificationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tasks_manager',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, EmailService],
})
export class AppModule {}
