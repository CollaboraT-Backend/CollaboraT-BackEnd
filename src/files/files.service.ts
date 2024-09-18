import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { verifyFileExistsAndHasContent } from 'src/common/helpers/verify-file-exist-and-has-content.helper';
import { validateKeysCsv } from 'src/common/helpers/validate-keys-csv.helper';
import { verifyAllRowsHasNecessaryData } from 'src/common/helpers/verify-all-rows-has-necessary-data.helper';

@Injectable()
export class FilesService {
  async parserCsv(buffer: Buffer): Promise<ICollaboratorRow[]> {
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

  verifyFile(file: Express.Multer.File) {
    verifyFileExistsAndHasContent(file);
  }

  validateKeys(row: any, expectedKeys: string[]) {
    validateKeysCsv(row, expectedKeys);
  }

  verifyNecessaryDataInRows(rowsWithData: ICollaboratorRow[]) {
    verifyAllRowsHasNecessaryData(rowsWithData);
  }
}
