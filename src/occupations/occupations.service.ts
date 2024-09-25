import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';

@Injectable()
export class OccupationsService {
  constructor(private readonly prisma: PrismaService) {}

  //bucar todas las ocupaciones
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
  async getOccupationIdByName(name: string) {
    const occupation = await this.prisma.occupation.findFirst({
      where: { name },
    });
    return occupation ? occupation.id : null;
  }

  async getTaskByOccupationId(occupationId: number) {
    return this.prisma.task.findMany({
      where: { occupationId },
    });
  }
}
