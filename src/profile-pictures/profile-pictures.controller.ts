import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  GatewayTimeoutException,
  Delete,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service'; // Importa tu servicio de S3
import { ProfilePictureService } from './profile-pictures.service'; // Servicio para manejar la lógica de base de datos
import { ErrorManager } from 'src/common/filters/error-manager.filter';

@Controller('profile-pictures')
export class ProfilePictureController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly profilePictureService: ProfilePictureService,
  ) {}

  // ProfilePictureController.ts
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { collaboratorId?: string; companyId?: string },
  ) {
    try {
   const savedPictureUrl = await this.profilePictureService.createProfilePicture(file, body)
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
      throw new InternalServerErrorException('Error getting the image.');
    }
  }
}
