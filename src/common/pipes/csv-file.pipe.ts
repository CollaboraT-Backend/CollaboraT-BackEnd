import { Injectable, PipeTransform } from '@nestjs/common';
import { ErrorManager } from '../filters/error-manager.filter';

@Injectable()
export class CsvFilePipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    try {
      const isCsv =
        file.mimetype === 'text/csv' || file.originalname.endsWith('.csv');
      if (!isCsv) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Only allowed CSV files',
        });
      }
      return file;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }
}
