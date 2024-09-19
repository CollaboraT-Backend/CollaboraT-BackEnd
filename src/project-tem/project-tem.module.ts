import { Module } from '@nestjs/common';
import { ProjectTemService } from './project-tem.service';
import { ProjectTemController } from './project-tem.controller';

@Module({
  controllers: [ProjectTemController],
  providers: [ProjectTemService],
})
export class ProjectTemModule {}
