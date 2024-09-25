import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  InternalServerErrorException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service'; // Importa tu servicio de S3
import { ProfilePictureService } from './profile-pictures.service'; // Servicio para manejar la lógica de base de datos
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { PermissionsGuard } from 'src/permissions/permissions.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('profile-pictures')
@Controller('profile-pictures')
export class ProfilePictureController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly profilePictureService: ProfilePictureService,
  ) {}

  // ProfilePictureController.ts
  @Rbac(['company', 'collaborator', 'leader'], 'canCreate', 6)
  @UseGuards(PermissionsGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { collaboratorId?: string; companyId?: string },
  ) {
    try {
      const savedPictureUrl =
        await this.profilePictureService.createProfilePicture(file, body);
      return {
        message: 'Image uploaded successfully!',
        data: savedPictureUrl,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  // ProfilePictureController.ts
  @Rbac(['company', 'collaborator', 'leader'], 'canDelete', 6)
  @UseGuards(PermissionsGuard)
  @Delete()
  async deleteProfilePicture(@Body('collaboratorId') collaboratorId: string) {
    try {
      await this.profilePictureService.deleteProfilePicture(collaboratorId);

      return {
        message: 'Image deleted successfully!',
      };
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw new InternalServerErrorException('Error deleting the image.');
    }
  }

  // ProfilePictureController.ts
  @Rbac(['company', 'collaborator', 'leader'], 'canGetOne', 6)
  @UseGuards(PermissionsGuard)
  @Get()
  async getCollaboratorPicture(@Body('url') baseUrl: string) {
    try {
      const response = await this.s3Service.generatePresignedUrlFromBaseUrl(
        baseUrl,
        432000,
      ); // Expiración de 5 días
      return {
        imageUrl: response,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
