import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';  // Prisma Service para interactuar con la DB
import { Prisma, ProfilePicture } from '@prisma/client';

@Injectable()
export class ProfilePictureService {
  constructor(private prisma: PrismaService) {}

  // Subir una imagen de perfil
  async uploadProfilePicture(data: { imageUrl: string, expirationDate:Date, collaboratorId?: string, companyId?: string }) {
    const { imageUrl, collaboratorId, companyId } = data;

    // Validar que se haya proporcionado un collaboratorId o un companyId
    if (!collaboratorId && !companyId) {
      throw new Error('You must provide either collaboratorId or companyId.');
    }

    // Crear una nueva entrada en la tabla profile_pictures
    const profilePicture = await this.prisma.profilePicture.create({
      data: {
        imageUrl,
        collaboratorId,
        companyId,
      },
    });

    return profilePicture;
  }

  async getProfilePicture(id: string): Promise<ProfilePicture | null> {
    return this.prisma.profilePicture.findUnique({
      where: { id },
    });
  }
  
  async updateProfilePictureUrl(id: string, imageUrl: string, expirationDate: Date): Promise<ProfilePicture> {
    return this.prisma.profilePicture.update({
      where: { id },
      data: {
        imageUrl,
        expirationDate,
      },
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
  async deleteProfilePicture(collaboratorid: string) {
    return await this.prisma.profilePicture.deleteMany({
      where: { collaboratorId:collaboratorid },
    });
  }
}