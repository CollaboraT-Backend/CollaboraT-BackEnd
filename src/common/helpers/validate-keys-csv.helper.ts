import { ErrorManager } from '../filters/error-manager.filter';

export function validateKeysCsv(row: any, expectedKeys: string[]) {
  try {
    const sortedCsvKeys = Object.keys(row).sort();
    const sortedExpectedKeys = expectedKeys.sort();
    console.log(sortedCsvKeys);
    console.log(sortedExpectedKeys);

    // verify keys as strings
    if (JSON.stringify(sortedCsvKeys) !== JSON.stringify(sortedExpectedKeys)) {
      throw new ErrorManager({
        type: 'CONFLICT',
        message: 'The header keys expected in the file are missing',
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
