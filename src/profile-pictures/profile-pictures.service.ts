import {
  BadRequestException,
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service'; // Prisma Service para interactuar con la DB
import { ProfilePicture } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';

@Injectable()
export class ProfilePictureService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  // Subir una imagen de perfil
  async uploadProfilePicture(data: {
    imageUrl: string;
    collaboratorId?: string;
    companyId?: string;
  }) {
    const { imageUrl, collaboratorId, companyId } = data;

    // Validar que se haya proporcionado un collaboratorId o un companyId
    if (!collaboratorId && !companyId) {
      throw new ForbiddenException(
        'You must provide either collaboratorId or companyId.',
      );
    }

  let profilePicture: ProfilePicture
  
    if (collaboratorId) {
      profilePicture = await this.prisma.profilePicture.create({
        data: {
          imageUrl,
          collaboratorId: collaboratorId,
          companyId: null,
        },
      });
    } else if (companyId) {
      profilePicture = await this.prisma.profilePicture.create({
        data: {
          imageUrl,
          collaboratorId: null,
          companyId: companyId,
        },
        // Crear una nueva entrada en la tabla profile_pictures
      });
    }
    return profilePicture;
  }
  async getProfilePicture(id: string): Promise<ProfilePicture | null> {
    return this.prisma.profilePicture.findUnique({
      where: { id },
    });
  }

  // Actualizar la imagen de perfil
  async updateProfilePicture(id: string, imageUrl: string) {
    return await this.prisma.profilePicture.update({
      where: { id },
      data: { imageUrl },
    });
  }

  // Eliminar la imagen de perfil
  async deleteProfilePicture(collaboratorid?: string, companyId?: string) {
    try {
      const key = `${collaboratorid || companyId}-Profile-picture`; // Forma la clave usando el ID del usuario
      const resultDelete = await this.s3Service.deleteImage(key);

      if (!resultDelete) {
        throw new GatewayTimeoutException();
      }
      const resultDatabaseDelete = await this.prisma.profilePicture.deleteMany({
        where: { collaboratorId: collaboratorid },
      });

      if (!resultDatabaseDelete) {
        throw new GatewayTimeoutException();
      }
      return;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw new InternalServerErrorException('Error deleting the image.');
    }
  }

  async createProfilePicture(
    file: Express.Multer.File,
    body: { collaboratorId?: string; companyId?: string },
  ) {
    try {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image files are allowed!');
      }

      // Subir la imagen a S3 con el ID del usuario
      const imageUrl = await this.s3Service.uploadImage(
        file,
        body.collaboratorId,
        body.companyId
      );

      if (!imageUrl) {
        throw new ErrorManager({
          type: 'GATEWAY_TIMEOUT',
          message: 'Error uploading image to S3',
        });
      }

      // Generar una URL firmada con una fecha de expiración

      // Guardar el URL de la imagen y la fecha de expiración en la base de datos
      const savedPictureUrl = await this.uploadProfilePicture({
        imageUrl,
        collaboratorId: body.collaboratorId, //solo debe ser uno de los 2 llenados
        companyId: body.companyId, //solo debe ser uno de los 2 llenados
      });
      return savedPictureUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }
}
