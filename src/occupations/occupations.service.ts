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
  async getAvailableTaskByOccupationId(occupationId: number) {
    // -> cambiar el parametro por user (fijarse en el controlador de task en ele metodo updateState) y 
    // projectId(lo necesitas para traer solo tareas por proyecto y no todaaaaaaasssssssssss las tareas que existen)
    // -> con el occupationid que trae el user, consultar en occupationstask las tareas que tienen esa ocupacionId
    // -> luego de esas tareas filtra con map o algun array method para sacar solo los taskId
    // -> Return -> consultar en task con un in de los taskId que obtuviste en los id de las tareas y collaboratorAssignedId:null(que no esten tomadas) y el projectId
    return this.prisma.taskOccupation.findMany({
      where: { occupationId },
    });
  }
 
  async getTasksByOccupation(occupationName: string) {
    
    return this.prisma.task.findMany({
      where: {
        status: TaskStatus.pending,
        collaboratorAssignedId:null
      },
      include: { occupations: true },
    });
  }
}
