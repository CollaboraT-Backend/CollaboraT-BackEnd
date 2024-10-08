import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { MailerService } from 'src/mailer/mailer.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    user: any,
  ): Promise<CreateTaskDto> {
    try {
      // Verificamos que el proyecto exista
      const projectExists = await this.prisma.project.findUnique({
        where: { id: createTaskDto.projectId },
      });
      if (!projectExists) {
        throw ErrorManager.createSignatureError('Project not found');
      }

      //Verificar si quieren asignar usuario
      let userToAssign;
      if (createTaskDto.collaboratorAssignedId) {
        //buscar el usuaro a asignar
        userToAssign = await this.prisma.collaborator.findUnique({
          where: { id: createTaskDto.collaboratorAssignedId },
        });
        if (userToAssign.occupationId !== createTaskDto.occupationId) {
          throw ErrorManager.createSignatureError(
            'The user to assign is not able to make this task!',
          );
        }
      }

      //Verificamos si el usuario si es lider del proyecto y puede crear tareas
      if (user.sub !== projectExists.leaderId) {
        throw ErrorManager.createSignatureError(
          'The user does not create tasks for this project!',
        );
      }

      //Create task
      const result = await this.prisma.task.create({ data: createTaskDto });

      //send notification mail to assigned user
      if (createTaskDto.collaboratorAssignedId) {
        const objectToprepare = {
          to: userToAssign.email,
          subject: `Task Assignment`,
          message: `<p>Hola ${userToAssign.name}, te han asignado una tarea!</p>
          <p>Tarea: <strong>${createTaskDto.title}</strong></p>
          `,
        };

        const mailOptions = this.mailerService.prepareMail(objectToprepare);
        await this.mailerService.sendMail(
          mailOptions.to,
          mailOptions.subject,
          mailOptions.html,
        );
      }

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
  //buscar tareas por proyecto y traer collaboratorAssigned
  async findAllByProjects(projectId: string) {
    try {
      const allTask = await this.prisma.task.findMany({
        where: {
          projectId,
          deletedAt: null, // filtra las tareas que no estan eliminadas
        },
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          startDate: true,
          priority: true,
          status: true,
          projectId: true,
          collaboratorAssignedId: true,
          occupationId: true,
          createdById: true,
          collaboratorAssigned: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
  //buscar tareas por proyecto libres
  async findAllCollaboratorUnassigned(projectId: string) {
    try {
      const allTask = await this.prisma.task.findMany({
        where: {
          projectId,
          deletedAt: null,
          collaboratorAssigned: null, // filtra las tareas que no estan eliminadas
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

  async assignFreetask(
    taskId: { id: string },
    user: any,
  ): Promise<CreateTaskDto> {
    try {
      const taskToEdit = await this.prisma.task.findUnique({
        where: { id: taskId.id },
      });
      if (!taskToEdit) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      const collaborator = await this.prisma.collaborator.findUnique({
        where: { id: user.sub },
      });
      console.log(collaborator);

      if (taskToEdit.occupationId !== collaborator.occupationId) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message:
            'You are not authorized to assign yourself this kind of tasks!',
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
      };

      return await this.prisma.task.update({
        where: { id: taskId.id },
        data: newTask,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
  //update state completed
  async updateState(id: string, updateStatusDto: UpdateStatusDto, user: any) {
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id, collaboratorAssignedId: user.sub, deletedAt: null },
        data: updateStatusDto,
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
  //buscar todas las tareas deacuerdo a la ocupacion
  async getAvailableTaskByOccupationId(
    occupationId: number,
    projectId: string,
  ) {
    return this.prisma.task.findMany({
      where: {
        occupationId,
        projectId,
        status: TaskStatus.pending,
        collaboratorAssignedId: null,
      },
    });
  }
  //another task or whatever
}
