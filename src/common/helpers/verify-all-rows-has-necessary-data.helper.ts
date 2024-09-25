import { ErrorManager } from '../filters/error-manager.filter';

export function verifyAllRowsHasNecessaryData(
  rowsWithData: ICollaboratorRow[],
) {
  try {
    if (
      !rowsWithData.every(
        (row) =>
          row.name.trim() !== '' &&
          row.email.trim() !== '' &&
          row.occupation.trim() !== '',
      )
    ) {
      throw new ErrorManager({
        type: 'CONFLICT',
        message: 'The neccesary data for registration records are missing',
      });
    }
    return;
  } catch (error) {
    if (error instanceof Error) {
      throw ErrorManager.createSignatureError(error.message);
    }
    throw ErrorManager.createSignatureError('An unexpected error ocurred');
  }
}
