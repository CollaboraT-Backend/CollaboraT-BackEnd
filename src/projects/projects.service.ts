import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { Project, ProjectStatus } from '@prisma/client';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { TeamCollaboratorsService } from 'src/team-collaborators/team-collaborators.service';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamCollaboratorService: TeamCollaboratorsService,
    @Inject(forwardRef(() => CollaboratorsService))
    private readonly collaboratorService: CollaboratorsService,
    private readonly mailerService: MailerService,
  ) {}

  //Al crear proyecto automaticamente despues con el id de este nuevo registro y el leader id que proporcionan para el
  //proyecto(project) se debe crear/agregar el primer miembro de equipo(agregar en team collaborator)
  async create(createProjectDto: CreateProjectDto) {
    try {
      //verificar si el usuario indicado si es lider
      const usersOfCompany =
        await this.collaboratorService.findAllCollaboratorsByCompany(
          createProjectDto.companyId,
        );

      if (!usersOfCompany.length) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User to assign as leader not found',
        });
      }

      const foundLeader = usersOfCompany.find(
        (user) =>
          user.id === createProjectDto.leaderId && user.role === 'leader',
      );

      if (!foundLeader) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'User to assign is not a leader',
        });
      }

      //create project
      const result = await this.prisma.project.create({
        data: createProjectDto,
      });

      //create leader as a team member
      await this.teamCollaboratorService.create({
        projectId: result.id,
        collaboratorId: result.leaderId,
      });

      //To send a notification to the assigned leader
      const objectToprepare = {
        to: foundLeader.email,
        subject: `Task Assignment`,
        message: `<p>Hola ${foundLeader.name}, te han asignado una tarea!</p>
        <p>Felicidades te han asignado com lider al proyecto: <strong>${result.name}</strong></p>
        <p><strong>Muchos exitos en este nuevo reto!</strong></p>
        `,
      };

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
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  //Crear metodo para collaborator, donde puede ver/obtener todos los proyectos en los que es parte del equipo de trabajo
  async findAll(companyId: string): Promise<Project[] | null> {
    try {
      return await this.prisma.project.findMany({
        where: { companyId, deletedAt: null },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(
          `INTERNAL_SERVER_ERROR :: ${error.message}`,
        );
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  async findAllByLeaderId(leaderId: string) {
    return await this.prisma.project.findMany({
      where: { leaderId, deletedAt: null },
    });
  }

  async findAllProjectsForCollaborators(userId: string) {
    // Obtener las tareas del usuario
    const tasks = await this.prisma.task.findMany({
      where: { collaboratorAssignedId: userId },
      include: {
        project: true, // Incluir la relación con el proyecto
      },
    });

    // Extraer los proyectos únicos de las tareas
    const uniqueProjectIds = [...new Set(tasks.map((task) => task.project.id))];

    // Obtener los proyectos basados en los IDs únicos
    const projects = await this.prisma.project.findMany({
      where: {
        id: { in: uniqueProjectIds },
      },
    });

    return projects;
  }

  async findOne(id: string) {
    try {
      const project = await this.prisma.project.findFirst({
        where: {
          id: id,
          status: {
            not: 'archived',
          },
        },
      });

      if (!project) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });

      if (!updatedProject) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return { success: true, message: 'Project updated successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  //Solo las empresas pueden eliminar sus proyectos(permisologia)
  async remove(id: string, companyId: string) {
    try {
      const projectDeleted = await this.prisma.project.update({
        where: { id, companyId, deletedAt: null },
        data: { status: ProjectStatus.archived, deletedAt: new Date() },
      });

      if (!projectDeleted) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }
}

//** PIENSA / VERIFICA QUE DATOS NECESITAS QUE TE PASEN Y QUE PERMITIRAS MODIFICAR O Devolver, REALIZAR LAS BUSQUEDAS INCLUYENDO EN EL WHERE deletedAt: null*/
