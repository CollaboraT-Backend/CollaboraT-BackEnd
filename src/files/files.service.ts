import { Injectable } from '@nestjs/common';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  verifyFileExistsAndHasContent(file: Express.Multer.File) {
    try {
      if (!file || !file.buffer || !file.buffer.length) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No file was sent or the file is empty',
        });
      }
      const fileContent = file.buffer.toString().trim();

      const rows = fileContent.split('\n');

      const rowsOfCollaborator = rows.slice(1);

      // Check if the file has at least 2 rows (header and data)

      if (
        rows.length <= 1 ||
        rowsOfCollaborator.length === 0 ||
        rowsOfCollaborator.every(
          (rowCollaborator) => rowCollaborator.trim() === '',
        )
      ) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'The file contains only headers and no user data to process.',
        });
      }

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
