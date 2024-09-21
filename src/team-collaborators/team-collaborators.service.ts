import { Injectable } from '@nestjs/common';
import { CreateTeamCollaboratorDto } from './dto/create-team-collaborator.dto';
import { UpdateTeamCollaboratorDto } from './dto/update-team-collaborator.dto';

//crear un endpoint y metodo para que la empresa pueda consultar el equipo de trabajo de sus proyectos, y que este traiga
//los colaboradores miembros del equipo

//crear un endpoint y metodo para que el lider solo pueda consultar el equipo de trabajo en los proyectos en que el es lider
//y que este traiga los colaboradores miembros del equipo(integrar con el servicio de teamcollaborator)

//Solo los lideres pueden actualizar sus equipos de trabajo agregando miembros(se agregan a teamcollaborator)

//Solo los lideres pueden actualizar sus equipos de trabajo eliminando miembros(se eliminan de teamcollaborator)

@Injectable()
export class TeamCollaboratorsService {
  create(createTeamCollaboratorDto: CreateTeamCollaboratorDto) {
    return 'This action adds a new teamCollaborator';
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
