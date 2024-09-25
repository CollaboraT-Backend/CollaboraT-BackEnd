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
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { Request } from 'express';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { UpdateStatusDto } from './dto/update-status.dto';

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

  @Get('by-occupations')
  async getTasksByOccupation(
    @Query('occupation') occupationId: number,
    @Query('projectId') projectId: string,
  ) {
    return this.tasksService.getAvailableTaskByOccupationId(
      occupationId,
      projectId,
    );
  }

  //buscar todas las tareas por proyecto
  @Get('projects')
  async getTasksByProjects(@Query('projectId') projectId: string) {
    return this.tasksService.findAllByProjects(projectId);
  }

  //buscar todas las tareas por proyecto y collaboratorAssigned:null
  @Get('collaborator')
  async getTasksByCollaborator(@Query('projectId') projectId: string) {
    return this.tasksService.findAllCollaboratorUnassigned(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('Fetching tasks for one');
    return await this.tasksService.findOne(id);
  }

  @Patch('take-task')
  async assignFreetask(@Body() id: any, @Req() request: Request) {
    const user = request.user;
    return await this.tasksService.assignFreetask(id, user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Patch('status/:id')
  async updateState(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    console.log(user);
    return await this.tasksService.updateState(id, updateStatusDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}
