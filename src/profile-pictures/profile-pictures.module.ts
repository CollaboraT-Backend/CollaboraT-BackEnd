import { Module } from '@nestjs/common';
import { ProfilePictureService } from './profile-pictures.service';
import { ProfilePictureController } from './profile-pictures.controller';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [ProfilePictureService, PrismaService, S3Service],
  controllers: [ProfilePictureController]
})
export class ProfilePicturesModule {
    
}
