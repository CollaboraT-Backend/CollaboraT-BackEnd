import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { TaskStatus } from '@prisma/client';
import { CreateOccupationDto } from './dto/create-occupation.dto';

@Injectable()
export class OccupationsService {
  constructor(private readonly prisma: PrismaService) {}

  //crear ocupaciones
  async create(createOccupationDto: CreateOccupationDto) {
    try {
      return await this.prisma.occupation.create({ data: createOccupationDto });
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(
          `INTERNAL_SERVER_ERROR :: ${error.message}`,
        );
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  //buscar todas las ocupaciones
  async findAll() {
    try {
      return await this.prisma.occupation.findMany();
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(
          `INTERNAL_SERVER_ERROR :: ${error.message}`,
        );
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
  //buscar todas las tareas deacuerdo a la ocupacion
  async getAvailableTaskByOccupationId(occupationId: number, projectId: string) {
    return this.prisma.task.findMany({
      where: {occupationId,projectId,
        status: TaskStatus.pending,
        collaboratorAssignedId:null },
    });
  }

}
