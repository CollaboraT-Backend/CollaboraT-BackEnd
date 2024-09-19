import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectTemService } from './project-tem.service';
import { CreateProjectTemDto } from './dto/create-project-tem.dto';
import { UpdateProjectTemDto } from './dto/update-project-tem.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('project-tem')
@Controller('project-tem')
export class ProjectTemController {
  constructor(private readonly projectTeamService: ProjectTemService) {}

  @Post()
  async create(@Body() createProjectTeamDto: CreateProjectTemDto) {
    return this.projectTeamService.create(createProjectTeamDto);
  }

  @Get()
  async findAll() {
    return this.projectTeamService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectTeamService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectTeamDto: UpdateProjectTemDto,
  ) {
    return this.projectTeamService.update(id, updateProjectTeamDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectTeamService.remove(id);
  }
  
 
}
