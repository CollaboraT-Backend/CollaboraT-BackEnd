import { ErrorManager } from '../filters/error-manager.filter';
import * as bcrypt from 'bcrypt';

export async function validatePassword(
  passwordToValidate: string,
  originalUserPassword: string,
) {
  try {
    if (!(await bcrypt.compare(passwordToValidate, originalUserPassword))) {
      throw new ErrorManager({
        type: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }
    return;
  } catch (error) {
    if (error instanceof Error) {
      throw ErrorManager.createSignatureError(error.message);
    }
    throw ErrorManager.createSignatureError('An unexpected error occurred');
  }
}
