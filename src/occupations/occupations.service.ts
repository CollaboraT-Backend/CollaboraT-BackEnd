import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { TaskStatus } from '@prisma/client';

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
  //Una vez que tienes el ID de la ocupación, encontrar todos los colaboradores que tienen esa ocupación.
  async getCollaboratorsByOccupationId(occupationId: number) {
    return this.prisma.collaborator.findMany({
      where: { occupationId },
    });
  }
 
  async getTasksByOccupation(occupationName: string) {
    // Paso 1: Obtener el ID de la ocupación
    const occupationId = await this.prisma.occupation.findFirst({
      where: { name: occupationName },
    });

    if (!occupationId) {
      throw new Error('Ocupación no encontrada');
    }

    // Paso 2: Obtener los colaboradores con esa ocupación
    const collaborators = await this.prisma.collaborator.findMany({
      where: { occupationId: occupationId.id },
    });

    // Obtener los IDs de los colaboradores
    const collaboratorIds = collaborators.map((c) => c.id);

    // Paso 3: Obtener las tareas asignadas a esos colaboradores
    return this.prisma.task.findMany({
      where: {
        collaboratorAssignedId: { in: collaboratorIds },
        status: TaskStatus.pending,
      },
    });
  }
}
