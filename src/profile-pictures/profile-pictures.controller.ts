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
    @Body() body: { collaboratorId: string; companyId?: string },
  ) {
    try {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image files are allowed!');
      }

      // Subir la imagen a S3 con el ID del usuario
      const imageUrl = await this.s3Service.uploadImage(
        file,
        body.collaboratorId,
      );

      if (!imageUrl) {
        throw new GatewayTimeoutException('Error uploading image to S3');
      }

      // Generar una URL firmada con una fecha de expiración

      // Guardar el URL de la imagen y la fecha de expiración en la base de datos
      const savedPicture =
        await this.profilePictureService.uploadProfilePicture({
          imageUrl,
          collaboratorId: body.collaboratorId,
          companyId: body.companyId,
        });

      return {
        message: 'Image uploaded successfully!',
        data: savedPicture,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // ProfilePictureController.ts
  @Delete()
  async deleteProfilePicture(@Body('collaboratorId') collaboratorId: string) {
    try {
      const key = `${collaboratorId}-Profile-picture`; // Forma la clave usando el ID del usuario
      const resultDelete = await this.s3Service.deleteImage(key);

      if (!resultDelete) {
        throw new GatewayTimeoutException();
      }

      const resultDatabaseDelete =
        await this.profilePictureService.deleteProfilePicture(collaboratorId);
      if (!resultDatabaseDelete) {
        throw new GatewayTimeoutException();
      }

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
      const response = await this.s3Service.generatePresignedUrlFromBaseUrl(baseUrl, 432000); // Expiración de 5 días
      return {
        imageUrl: response,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error getting the image.');
    }
  }
}
