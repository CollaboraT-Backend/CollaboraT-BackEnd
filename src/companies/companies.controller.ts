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

  @Get('/:id')
  findAll(@Param('id') id: string) {
    return this.companyService.findOne(id);
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

  @Rbac(['company'], 'canDelete', 2)
  @Delete('collaborator/:collaboratorId')
  removeCollaborator(
    @Param('collaboratorId', new ParseUUIDPipe()) collaboratorId: string,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    return this.companyService.deleteCollaborator(user, collaboratorId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
