import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Rbac(['leader'], 'canCreate', 4)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request): Promise<CreateTaskDto> {
    const user = req.user;
    return await this.tasksService.create(createTaskDto, user);
  }

  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto ) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}
