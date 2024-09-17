import { Injectable } from '@nestjs/common';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}
  async create(file: Express.Multer.File, passwordToExcel: string) {
    try {
      // verify if file exist or no it is empty
      this.filesService.verifyFileExistsAndHasContent(file);

      // parse csv file
      const parsedData = await this.filesService.parserCsv(file.buffer);
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }
}
