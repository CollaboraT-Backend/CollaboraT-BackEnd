import { Injectable } from '@nestjs/common';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  verifyFleExist(file: Express.Multer.File) {
    try {
      console.log('Buffer Length:', file.buffer.length); // Verifica el tamaño del buffer
      console.log('Buffer Content:', file.buffer.toString());
      if (!file || !file.buffer || !file.buffer.length) {
        throw new ErrorManager({
          type: 'NO_CONTENT',
          message: 'No file was sent or the file is empty',
        });
      }
      const fileContent = file.buffer.toString().trim();
      console.log('File Content:', fileContent);

      const rows = fileContent.split('\n');

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async parserCsv(buffer: Buffer) {
    return new Promise((resolve, reject) => {
      const results = [];

      // Convert buffer to readable stream
      const stream = Readable.from(buffer);

      // Parse csv data from stream and resolve with results array
      stream
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
