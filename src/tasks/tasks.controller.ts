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
  Query
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { Request } from 'express';
import { PermissionsGuard } from 'src/permissions/permissions.guard';


@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Rbac(['leader'], 'canCreate', 4)
  @UseGuards(PermissionsGuard)
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<CreateTaskDto> {
    const user = req.user;
    return await this.tasksService.create(createTaskDto, user);
  }

  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  
  //buscar todas las tareas por proyecto
  @Get('projects')
  async getTasksByOccupation(
    @Query('projectId') projectId: string) {
    return this.tasksService.findAllProjects(projectId);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Patch()
  async assignFreetask(@Body() id: any, @Req() request: Request) {
    const user = request.user
    return await this.tasksService.assignFreetask(id, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}
