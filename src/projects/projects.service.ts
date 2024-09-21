import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { Project, ProjectStatus } from '@prisma/client';
import { ErrorManager } from 'src/common/filters/error-manager.filter';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  //Al crear un proyecto automaticamente despues de crear un proyecto con el id de este, se debe crear un equipo de trabajo para este proyecto creado(registrar un project teams)
  //Al crear el equipo de proyecto(project team) automaticamente despues con el id de este nuevo registro y el leader id que proporcionan para
  //proyectos(project) se debe crear/agregar el primer miembro de equipo(agregar en team collaborator)
  async create(createProjectDto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({ data: createProjectDto });
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(
          `INTERNAL_SERVER_ERROR :: ${error.message}`,
        );
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  //Crear metodo para empresa, puede ver todos sus proyectos
  //Crear metodo para leader(collaborator), puede ver todos los proyectos solo en los que es lider
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

  //Crear metodo para empresa, puede ver cualquiera de sus proyectos
  //Crear metodo para leader(collaborator), puede ver cualquiera de los proyectos en los que es lider
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

  //Solo las empresas pueden actualizar sus proyectos(permisologia)
  //Si actualizan el lider
  // - eliminar(softdelete) de team collaborator al usuario que era el lider hasta ese momento
  // - actualizar proyecto
  // - agregar el nuevo lider a la tabla team collaborator para el equipo de trabajo de ese proyecto correspondiente
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

      return updatedProject;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  //Solo las empresas pueden eliminar sus proyectos(permisologia)
  async remove(id: string) {
    try {
      const projectDeleted = await this.prisma.project.update({
        where: { id, deletedAt: null },
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
