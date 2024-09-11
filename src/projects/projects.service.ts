import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { Project, ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({ data: createProjectDto });
  }

  async findAll() {
    return await this.prisma.project.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.project.findMany({
      where: {
        id: id,
        status: 'active',
      },
    });
  }
  async findOneo(id: string) {
    return await this.prisma.project.findMany({
      where: {
        id: id,
        status: {
          not: 'archived',
        },
      },
    });
  }
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string) {
    const projectDeleted = await this.prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.archived, deletedAt: new Date() },
    });

    if (!projectDeleted) {
      throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
    }

    return {
      status: HttpStatus.OK,
      message: 'Project deleted successfully',
    };
  }
}
