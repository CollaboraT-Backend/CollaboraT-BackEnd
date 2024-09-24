import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { PasswordComparisonPipe } from 'src/common/pipes/password-comparison.pipe';
import { UpdatePasswordDto } from 'src/common/dtos/update-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';

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
}
