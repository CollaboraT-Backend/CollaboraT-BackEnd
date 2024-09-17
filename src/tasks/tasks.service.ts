import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ErrorManager } from 'src/common/filters/error-manager.filter';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      return await this.prisma.task.create({ data: createTaskDto });
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
      return await this.prisma.task.findMany({
        where: {
          deletedAt: null, // filtra las tareas que no estan eliminadas
        },
      });
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
        where: { id },
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

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const taskDeleted = await this.prisma.task.update({
        where: { id },
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
