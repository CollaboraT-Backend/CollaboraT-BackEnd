import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdatePasswordDto } from '../common/dtos/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PasswordComparisonPipe } from 'src/common/pipes/password-comparison.pipe';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { UserResponseFormatDto } from 'src/common/dtos/user-response-format.dto';
import { Request } from 'express';
import { PayloadToken } from 'src/common/interfaces/auth/payload-token.interface';
import { CollaboratorRole } from '@prisma/client';

@ApiTags('companies')
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Rbac(['company'], 'canGet', 2)
  @UseGuards(PermissionsGuard)
  @Get('/collaborators')
  async findAllCollaborators(
    @Req() req: Request,
  ): Promise<UserResponseFormatDto[]> {
    const user = req.user as PayloadToken;
    return await this.companyService.findAllCollaborator(user);
  }

  @Rbac(['company'], 'canUpdate', 1)
  @UseGuards(PermissionsGuard)
  @Patch('password/:id')
  async updateCompanyPassword(
    @Param('id') id: string,
    @Body(new PasswordComparisonPipe())
    updatePasswordCompanyDto: UpdatePasswordDto,
  ) {
    return await this.companyService.updateCompanyPassword(
      id,
      updatePasswordCompanyDto,
      'company',
    );
  }

  @Rbac(['company'], 'canUpdate', 2)
  @UseGuards(PermissionsGuard)
  @Patch('collaborator/:collaboratorId/role')
  async updateCollaboratorRole(
    @Param('collaboratorId', new ParseUUIDPipe()) collaboratorId: string,
    @Body() newRole: CollaboratorRole,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    return await this.companyService.updateCollaboratorRole(
      collaboratorId,
      user.sub,
      newRole,
    );
  }

  @Rbac(['company'], 'canDelete', 2)
  @UseGuards(PermissionsGuard)
  @Delete('collaborator/:collaboratorId')
  async removeCollaborator(
    @Param('collaboratorId', new ParseUUIDPipe()) collaboratorId: string,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    return await this.companyService.deleteCollaborator(user, collaboratorId);
  }

  @Rbac(['company'], 'canDelete', 1)
  @UseGuards(PermissionsGuard)
  @Delete()
  async remove(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return await this.companyService.remove(user.sub);
  }
}
