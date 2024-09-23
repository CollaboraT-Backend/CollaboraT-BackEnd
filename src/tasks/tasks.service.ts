import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { Collaborator, TaskStatus } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({ 
        data: {
          title : createTaskDto.title,
          description:createTaskDto.description,
          dueDate: createTaskDto.dueDate,
          startDate: createTaskDto.startDate,
          priority : createTaskDto.priority,
          projectId: createTaskDto.projectId,
          collaboratorAssignedId: createTaskDto.collaboratorAssignedId,
          createdById: createTaskDto.createdById,
          occupationId: createTaskDto.occupationId
        } });

     return newTask
     
      //cuando se crea una tarea, debes hacer un registro/create/insercion en occupationtask, uasando el id de esa tarea y el ocupationid que te deben pasar
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(
          `INTERNAL_SERVER_ERROR :: ${error.message}`,
        );
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async findAll() {
    try {
      const allTask = await this.prisma.task.findMany({
        where: {
          deletedAt: null, // filtra las tareas que no estan eliminadas
        },
      });

      if (!allTask.length) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Tasks not found',
        });
      }

      return allTask;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(
          `INTERNAL_SERVER_ERROR :: ${error.message}`,
        );
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id, deletedAt: null },
      });

      if (!task) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id, deletedAt: null },
        data: updateTaskDto,
      });

      if (!updatedTask) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
  //update state completed
  async updateState(id: string, status: UpdateStatusDto, user: any) {
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id, collaboratorAssignedId: user.sub, deletedAt: null },
        data: status,
      });

      if (!updatedTask) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task not found or user not asssigned to this task',
        });
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const taskDeleted = await this.prisma.task.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      if (!taskDeleted) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
}
