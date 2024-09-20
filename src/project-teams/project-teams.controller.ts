import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectTeamsService } from './project-teams.service';
import { CreateProjectTeamDto } from './dto/create-project-tem.dto';
import { UpdateProjectTeamDto } from './dto/update-project-tem.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('project-teams')
@Controller('project-teams')
export class ProjectTeamsController {
  constructor(private readonly projectTeamService: ProjectTeamsService) {}

  @Post()
  async create(@Body() createProjectTeamDto: CreateProjectTeamDto) {
    return this.projectTeamService.create(createProjectTeamDto);
  }

  //crear un endpoint y metodo para que la empresa pueda consultar el equipo de trabajo de sus proyectos, y que este traiga
  //los colaboradores miembros del equipo, incluyendo al leader(integrar con el servicio de teamcollaborator)
  //crear un endpoint y metodo para que el lider solo pueda consultar el equipo de trabajo en los proyectos en que el es lider
  //y que este traiga los colaboradores miembros del equipo(integrar con el servicio de teamcollaborator)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectTeamService.findOne(id);
  }

  //Solo los lideres pueden actualizar sus equipos de trabajo agregando miembros(se agregan a teamcollaborator)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectTeamDto: UpdateProjectTeamDto,
  ) {
    return this.projectTeamService.update(id, updateProjectTeamDto);
  }

  //Solo los lideres pueden actualizar sus equipos de trabajo eliminando miembros(se eliminan de teamcollaborator)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectTeamService.remove(id);
  }
}

//** PIENSA / VERIFICA QUE DATOS NECESITAS QUE TE PASEN Y QUE PERMITIRAS MODIFICAR*/
