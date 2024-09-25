import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { PasswordComparisonPipe } from 'src/common/pipes/password-comparison.pipe';
import { UpdatePasswordDto } from 'src/common/dtos/update-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PayloadToken } from 'src/common/interfaces/auth/payload-token.interface';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { PermissionsGuard } from 'src/permissions/permissions.guard';

@ApiTags('collaborators')
@UseGuards(JwtAuthGuard)
@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Patch('password/:id')
  async updateCollaboratorPassword(
    @Param('id') id: string,
    @Body(new PasswordComparisonPipe())
    updatePasswordCollaboratorDto: UpdatePasswordDto,
  ) {
    console.log(updatePasswordCollaboratorDto);
    return await this.collaboratorsService.updateCollaboratorPassword(
      id,
      updatePasswordCollaboratorDto,
      'collaborator',
    );
  }

  @Rbac(['collaborator'], 'canGet', 3)
  @UseGuards(PermissionsGuard)
  @Get('projects')
  async getCollaboratorProjects(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return await this.collaboratorsService.findAllProjectsByCollaborator(
      user.sub,
    );
  }

  @Rbac(['leader'], 'canGet', 3)
  @UseGuards(PermissionsGuard)
  @Get(':companyId/leader/projects')
  async getLeaderProjects(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    return await this.collaboratorsService.finAllProjectsByLeader(
      user.sub,
      companyId,
    );
  }
}
