import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // Necesario para crear URL firmadas
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  async uploadImage(file: Express.Multer.File, collaboratorId: string): Promise<string> {
    const key = `${collaboratorId}-Profile-picture`;
    console.log('Uploading file with key:', key); // Verificar la clave generada
  
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    try {
      // Subir el archivo a S3
      await this.s3.send(new PutObjectCommand(params));
      console.log('File uploaded successfully to S3');
      
      // Construir la URL base de la imagen (sin firmar)
      const baseUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
      console.log(baseUrl)
      return baseUrl; // Retorna la URL base
    } catch (error) {
      console.error('Error uploading file to S3:', error); // Loguear el error
      throw new RequestTimeoutException('Error uploading file to S3');
    }
  }

  // Método para generar una URL firmada con una duración específica
  // S3Service.ts
  async generatePresignedUrlFromBaseUrl(baseUrl: string, expiresIn: number): Promise<string> {
    // Extraer el key de la URL base
    const key = baseUrl.split('.com/')[1]; // Esto te dará solo la clave después del dominio
  
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
  
    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new RequestTimeoutException('Error generating presigned URL');
    }
  }

  async deleteImage(key: string) {
    try {
      console.log('Deleting file with key:', key); // Verificar la clave generada
      await this.s3.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }))
      return {message: 'Deleted successfully'}
    } catch (error) {
      throw new BadRequestException('Error deleting the file', error);
    }
  }
}