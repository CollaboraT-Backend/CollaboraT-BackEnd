import { Injectable } from '@nestjs/common';
import { CreateTeamCollaboratorDto } from './dto/create-team-collaborator.dto';
import { UpdateTeamCollaboratorDto } from './dto/update-team-collaborator.dto';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { PrismaClient } from '@prisma/client';

//crear un endpoint y metodo para que la empresa pueda consultar el equipo de trabajo de sus proyectos, y que este traiga
//los colaboradores miembros del equipo

//crear un endpoint y metodo para que el lider solo pueda consultar el equipo de trabajo en los proyectos en que el es lider
//y que este traiga los colaboradores miembros del equipo(integrar con el servicio de teamcollaborator)

//Solo los lideres pueden actualizar sus equipos de trabajo agregando miembros(se agregan a teamcollaborator)

//Solo los lideres pueden actualizar sus equipos de trabajo eliminando miembros(se eliminan de teamcollaborator)

@Injectable()
export class TeamCollaboratorsService {
  constructor(private readonly prisma: PrismaClient) {}
  async create(createTeamCollaboratorDto: CreateTeamCollaboratorDto) {
    try {
      return await this.prisma.teamCollaborator.create({
        data: createTeamCollaboratorDto,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  findAll() {
    return `This action returns all teamCollaborators`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamCollaborator`;
  }

  update(id: number, updateTeamCollaboratorDto: UpdateTeamCollaboratorDto) {
    return `This action updates a #${id} teamCollaborator`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamCollaborator`;
  }
}
