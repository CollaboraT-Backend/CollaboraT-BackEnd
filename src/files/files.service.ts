import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { verifyFileExistsAndHasContent } from 'src/common/helpers/verify-file-exist-and-has-content.helper';
import { validateKeysCsv } from 'src/common/helpers/validate-keys-csv.helper';
import { verifyAllRowsHasNecessaryData } from 'src/common/helpers/verify-all-rows-has-necessary-data.helper';
import { CollaboratorFormatToExcel } from 'src/collaborators/dto/collaborator-format-to-excel.dto';
import * as ExcelJs from 'exceljs';

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

  generateExcel(usersToExcel: CollaboratorFormatToExcel[]) {
    const workbook = new ExcelJs.Workbook();

    workbook.creator = 'Collabora-T Inc';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('collaborators');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Password', key: 'password', width: 30 },
      { header: 'Role', key: 'role', width: 30 },
      { header: 'Created_at', key: 'createdAt', width: 30 },
    ];

    for (const collaborator of usersToExcel) {
      sheet.addRow({
        name: collaborator.name,
        email: collaborator.email,
        password: collaborator.password,
        role: collaborator.role,
        createdAt: collaborator.createdAt,
      });
    }

    return workbook;
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
