import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectTeamDto } from './dto/create-project-tem.dto';
import { UpdateProjectTeamDto } from './dto/update-project-tem.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class ProjectTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProjectTeamDto) {
    try {
      return await this.prisma.projectTeam.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating ProjectTeam');
    }
  }

  async findAll() {
    try {
      return await this.prisma.projectTeam.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving ProjectTeams');
    }
  }

  async findOne(id: string) {
    try {
      const projectTeam = await this.prisma.projectTeam.findUnique({
        where: { id },
      });
      if (!projectTeam) {
        throw new NotFoundException(`ProjectTeam with ID ${id} not found`);
      }
      return projectTeam;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving ProjectTeam');
    }
  }

  async update(id: string, data: UpdateProjectTeamDto) {
    try {
      const projectTeam = await this.prisma.projectTeam.findUnique({
        where: { id },
      });
      if (!projectTeam) {
        throw new NotFoundException(`ProjectTeam with ID ${id} not found`);
      }

      return await this.prisma.projectTeam.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating ProjectTeam');
    }
  }

  async remove(id: string) {
    try {
      const projectTeam = await this.prisma.projectTeam.findUnique({
        where: { id },
      });
      if (!projectTeam) {
        throw new NotFoundException(`ProjectTeam with ID ${id} not found`);
      }

      return await this.prisma.projectTeam.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting ProjectTeam');
    }
  }
}
