import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { MailerService } from 'src/mailer/mailer.service';
import { Subject } from 'rxjs';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  async create(createTaskDto: CreateTaskDto, user: any): Promise<CreateTaskDto> {

    // Verificamos que el proyecto exista
    const projectExists = await this.prisma.project.findUnique({
      where: { id: createTaskDto.projectId },
    });
    if (!projectExists) {
      throw ErrorManager.createSignatureError('Project not found');
    }

    const userToAssign = await this.prisma.collaborator.findUnique({where: { id: createTaskDto.collaboratorAssignedId}})
    if (userToAssign.occupationId !== createTaskDto.occupationId) {
      throw ErrorManager.createSignatureError('The user to assign is not able to make this task!');
    }

    // Verificamos que el usuario exista
    const userExists = await this.prisma.collaborator.findUnique({
      where: { id: user.sub },
    });
    if (!userExists) {
      throw ErrorManager.createSignatureError('User not found');
    }

    try {
      const response = await this.prisma.collaborator.findUnique({
        where: { id: createTaskDto.collaboratorAssignedId },
      });
      console.log(response);
      const objectToprepare = {
        to: response.email,
        subject:`Task Assignment`,
        message:`<p>Hola ${response.name}, te han asignado una tarea!</p>
        <p>Tarea: <strong>${createTaskDto.title}</strong></p>
        `
        
      };
      const result = await this.prisma.task.create({ data: createTaskDto });

      const mailOptions = this.mailerService.prepareMail(objectToprepare);
      await this.mailerService.sendMail(
        mailOptions.to,
        mailOptions.subject,
        mailOptions.html,
      );
      return result;
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
    //Corregir -> collaborardor normal puede -> actualizar el estado
    //Corregir -> leader puede -> name, descriptions, fechas de inicio - fin,
    //prioridad, estado y colaborador asignado

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

  async assignFreetask(taskId: {id:string}, user: any): Promise<CreateTaskDto> {
    try {
      
      const taskToEdit = await this.prisma.task.findUnique({where: {id: taskId.id}});
      if (!taskToEdit) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task not found',
        });
    }
  
    const collaborator = await this.prisma.collaborator.findUnique({where: {id: user.sub}})
    console.log(collaborator)
  
    if (taskToEdit.occupationId !== collaborator.occupationId) {
      throw new ErrorManager({
        type: 'FORBIDDEN',
        message: 'You are not authorized to assign yourself this kind of tasks!',
      });
    }
  
  const newTask = {
    title: taskToEdit.title,
    description: taskToEdit.description,
    dueDate: taskToEdit.dueDate,
    startDate: taskToEdit.startDate,
    priority: taskToEdit.priority,
    projectId: taskToEdit.projectId,
    occupationId: taskToEdit.occupationId,
    collaboratorAssignedId: user.sub,
    createdById: taskToEdit.createdById,
  }
  
  return await this.prisma.task.update({where: { id:taskId.id }, data: newTask});
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }

};

//another task or whatever
}
