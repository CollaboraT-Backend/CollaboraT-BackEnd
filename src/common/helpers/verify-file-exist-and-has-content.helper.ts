import { ErrorManager } from '../filters/error-manager.filter';

export function verifyFileExistsAndHasContent(file: Express.Multer.File) {
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

    // Check if the file has at least 2 rows and content (header and data)

    if (
      rows.length <= 1 ||
      rowsOfCollaborator.length === 0 ||
      rowsOfCollaborator.every(
        (rowCollaborator) => rowCollaborator.trim() === '',
      )
    ) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'The file contains only headers and no user data to process.',
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
