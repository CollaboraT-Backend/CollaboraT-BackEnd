import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { PermissionsGuard } from 'src/permissions/permissions.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Rbac(['company', 'collaborator', 'leader'], 'canGetOne', 3)
  @UseGuards(PermissionsGuard)
  @Get(':id')
  async findOneo(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  @Rbac(['company'], 'canUpdate', 3)
  @UseGuards(PermissionsGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.update(id, updateProjectDto);
  }
}
