import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, MailerService],
})
export class TasksModule {}
