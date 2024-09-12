import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { Project, ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({ data: createProjectDto });
    } catch (error) {
      throw new HttpException('Failed to create project', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      return await this.prisma.project.findMany();
    } catch (error) {
      throw new HttpException('Failed to retrieve projects', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      return project;
    } catch (error) {
      throw new HttpException('Failed to retrieve project', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });

      if (!updatedProject) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      return updatedProject;
    } catch (error) {
      throw new HttpException('Failed to update project', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      const projectDeleted = await this.prisma.project.update({
        where: { id },
        data: { status: ProjectStatus.archived, deletedAt: new Date() },
      });

      if (!projectDeleted) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: HttpStatus.OK,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      throw new HttpException('Failed to delete project', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

